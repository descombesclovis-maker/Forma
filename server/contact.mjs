import { createHash, createHmac, randomUUID } from "node:crypto";
import pg from "pg";
import { contactDatabaseUrl } from "./contact-database.mjs";
import nodemailer from "nodemailer";

class Rejection extends Error {
  constructor(status, reason) { super(); this.status = status; this.reason = reason; }
}
const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
function field(value, max, multiline = false) {
  if (typeof value !== "string" || !value.trim() || value.length > max || value.includes("\0") ||
      (!multiline && /[\r\n]/.test(value))) throw new Rejection(400);
  return value.trim();
}
function validate(body) {
  if (!body || typeof body.submission !== "string" || !uuid.test(body.submission) || !["contact", "quote", "quick"].includes(body.kind) ||
      body.website || body.consent !== true) throw new Rejection(400);
  const email = field(body.email, 254).toLowerCase();
  if (!/^[^\s@<>,;:"]+@[^\s@<>,;:"]+\.[^\s@<>,;:"]+$/.test(email)) throw new Rejection(400);
  return { kind: body.kind, name: body.kind === "quick" ? "" : field(body.name, 120),
    email, subject: field(body.subject, 180), message: field(body.message, 6000, true) };
}

async function record(pool, body, address, secret) {
  const item = validate(body);
  if (!secret) throw new Rejection(503, "rate_secret_missing");
  if (!address) throw new Rejection(503, "client_address_missing");
  const source = createHmac("sha256", secret).update(address).digest("hex");
  const fingerprint = createHash("sha256").update(JSON.stringify(item)).digest("hex");
  const db = await pool.connect();
  try {
    await db.query("begin");
    // Consistent lock order serialises concurrent requests sharing an address, email or retry key.
    for (const key of [source, item.email, body.submission].sort()) {
      await db.query("select pg_advisory_xact_lock(hashtextextended($1, 0))", [key]);
    }
    const previous = await db.query(`select reference, fingerprint from forma_contact.requests
      where submission=$1 or (fingerprint=$2 and created_at > now()-interval '10 minutes')
      order by (submission=$1) desc limit 1`, [body.submission, fingerprint]);
    if (previous.rowCount) {
      if (previous.rows[0].fingerprint !== fingerprint) throw new Rejection(409);
      await db.query("commit");
      return { reference: previous.rows[0].reference, fresh: false };
    }
    const quota = await db.query(`select count(*) filter (where source_hash=$1) as ip,
      count(*) filter (where email=$2) as email from forma_contact.requests
      where created_at > now()-interval '1 hour' and (source_hash=$1 or email=$2)`, [source, item.email]);
    if (+quota.rows[0].ip >= 10 || +quota.rows[0].email >= 3) throw new Rejection(429);
    const saved = await db.query(`insert into forma_contact.requests
      (submission,fingerprint,source_hash,kind,name,email,subject,message)
      values ($1,$2,$3,$4,$5,$6,$7,$8) returning reference`, [body.submission, fingerprint, source,
      item.kind, item.name, item.email, item.subject, item.message]);
    const reference = saved.rows[0].reference;
    await db.query("insert into forma_contact.notifications(reference,channel) values ($1,'email'),($1,'telegram')", [reference]);
    await db.query("commit");
    return { reference, fresh: true };
  } catch (error) { await db.query("rollback"); throw error; }
  finally { db.release(); }
}

export async function sendNotification(channel, item) {
  if (channel === "telegram") {
    const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) throw new Error();
    const result = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST", headers: {"Content-Type":"application/json"}, signal: AbortSignal.timeout(5000),
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: `Forma · ${item.kind === "quote" ? "Devis gratuit" : "Contact"} reçu. Référence ${item.reference}. Consultez l’administration privée.` }),
    });
    if (!result.ok || !(await result.json()).ok) throw new Error();
  } else {
    const { CONTACT_SMTP_URL, CONTACT_MAIL_FROM } = process.env;
    if (!CONTACT_SMTP_URL || !CONTACT_MAIL_FROM) throw new Error();
    const transport = nodemailer.createTransport({url: CONTACT_SMTP_URL, requireTLS: true, connectionTimeout: 4500, greetingTimeout: 4500, socketTimeout: 5500});
    const result = await transport.sendMail({ from: CONTACT_MAIL_FROM, to: {name:"", address:item.email},
      subject: "Forma — demande reçue", text: `Votre demande a été enregistrée par Forma.\nRéférence : ${item.reference}\nConservez cette référence pour votre suivi.` });
    if (!result.accepted?.length) throw new Error();
  }
}

async function dispatch(pool, reference, channel, send) {
  const claim = randomUUID();
  const locked = await pool.query(`update forma_contact.notifications set state='sending', claimed_at=now(), claim=$3
    where reference=$1 and channel=$2 and (state in ('pending','failed') or
    (state='sending' and claimed_at < now()-interval '5 minutes')) returning reference`, [reference, channel, claim]);
  if (!locked.rowCount) return;
  const { rows } = await pool.query("select reference, kind, email from forma_contact.requests where reference=$1", [reference]);
  let state = "accepted";
  try { await send(channel, rows[0]); } catch { state = "failed"; }
  await pool.query("update forma_contact.notifications set state=$4 where reference=$1 and channel=$2 and claim=$3",
    [reference, channel, claim, state]);
}

export async function founder(token) {
  const { FORMA_FOUNDER_USER_ID, VITE_FORMA_SUPABASE_URL, VITE_FORMA_SUPABASE_ANON_KEY } = process.env;
  if (!token?.startsWith("Bearer ")) throw new Rejection(401);
  if (!FORMA_FOUNDER_USER_ID || !VITE_FORMA_SUPABASE_URL || !VITE_FORMA_SUPABASE_ANON_KEY) throw new Rejection(503);
  const response = await fetch(new URL("/auth/v1/user", VITE_FORMA_SUPABASE_URL), {headers:{
    Authorization: token, apikey: VITE_FORMA_SUPABASE_ANON_KEY }, signal: AbortSignal.timeout(5000)});
  if (!response.ok) throw new Rejection(response.status >= 500 ? 503 : 401);
  if ((await response.json()).id !== FORMA_FOUNDER_USER_ID) throw new Rejection(403);
}

let sharedPool;
export function handleContact({ getPool = () => {
  if (!process.env.CONTACT_DATABASE_URL) throw new Rejection(503, "database_url_missing");
  if (!sharedPool) {
    sharedPool = new pg.Pool({ connectionString: contactDatabaseUrl(process.env.CONTACT_DATABASE_URL), max: 2, connectionTimeoutMillis: 4000 });
    sharedPool.on("error", () => console.error("Forma contact: connexion inactive interrompue."));
  }
  return sharedPool;
}, send = sendNotification, authorize = founder } = {}) {
  return async (req, res) => {
    res.setHeader("Cache-Control","no-store");
    const reply = (status, data) => res.status(status).json(data);
    try {
      if (req.method === "GET") {
        await authorize(req.headers.authorization);
        const before = req.query.before || null;
        if (before && !uuid.test(before)) throw new Rejection(400);
        const { rows } = await getPool().query(`select r.reference,r.created_at,r.kind,r.name,r.email,r.subject,r.message,
          (select jsonb_object_agg(channel,state) from forma_contact.notifications n where n.reference=r.reference) notifications
          from forma_contact.requests r where $1::uuid is null or (r.created_at,r.reference) <
          (select created_at,reference from forma_contact.requests where reference=$1)
          order by created_at desc,reference desc limit 31`, [before]);
        return reply(200, { items: rows.slice(0,30), more: rows.length > 30 });
      }
      if (req.method !== "POST") throw new Rejection(405);
      if (!req.headers["content-type"]?.startsWith("application/json")) throw new Rejection(415);
      if (Buffer.byteLength(JSON.stringify(req.body ?? null)) > 32000) throw new Rejection(413);
      const body = req.body;
      if (body?.action === "retry") {
        await authorize(req.headers.authorization);
        if (!uuid.test(body.reference) || !["email","telegram"].includes(body.channel)) throw new Rejection(400);
        await dispatch(getPool(), body.reference, body.channel, send);
        return reply(200, { processed: true });
      }
      const pool = getPool();
      const address = process.env.VERCEL ? req.headers["x-vercel-forwarded-for"]?.split(",")[0]?.trim() : req.socket.remoteAddress;
      const { reference, fresh } = await record(pool, body, address, process.env.CONTACT_RATE_SECRET);
      if (fresh) await Promise.allSettled(["email","telegram"].map(channel => dispatch(pool, reference, channel, send)));
      return reply(fresh ? 201 : 200, { recorded: true, reference });
    } catch (error) {
      const status = error instanceof Rejection ? error.status : 503;
      if (status >= 500) {
        const reasons = { "42501": "database_permissions", "28P01": "database_credentials",
          "42P01": "database_schema", ECONNREFUSED: "database_connection", ENOTFOUND: "database_dns",
          SELF_SIGNED_CERT_IN_CHAIN: "database_tls", UNABLE_TO_VERIFY_LEAF_SIGNATURE: "database_tls" };
        console.error("Forma contact:", (error instanceof Rejection && error.reason) || reasons[error.code] || "service_unavailable");
      }
      return reply(status, { recorded: false });
    }
  };
}
