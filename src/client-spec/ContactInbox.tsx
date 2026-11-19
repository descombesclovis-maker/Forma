import { useEffect, useState } from "react";
import { currentSession } from "./forma-auth";

type Channel = "email" | "telegram";
type Row = { reference: string; created_at: string; kind: string; subject: string; name: string; email: string; message: string; notifications: Record<Channel,string> };
const labels: Record<string,string> = {pending:"En attente", sending:"En cours", accepted:"Accepté par le prestataire", failed:"Échec"};
async function admin(path: string, options: RequestInit = {}) {
  const session = await currentSession();
  if (!session) throw new Error("Connectez-vous avec le compte du fondateur.");
  const response = await fetch("/api/contact" + path, { ...options, cache: "no-store", headers: {
    Authorization: "Bearer " + session.session.access_token, "Content-Type":"application/json",
  } });
  if (!response.ok) throw new Error(response.status === 403 ? "Accès réservé au fondateur." : "Administration indisponible.");
  return response.json();
}
export function ContactInbox() {
  const [rows,setRows] = useState<Row[]>([]);
  const [before,setBefore] = useState("");
  const [more,setMore] = useState(false);
  const [refresh,setRefresh] = useState(0);
  const [busy,setBusy] = useState(true);
  const [error,setError] = useState("");
  useEffect(() => {
    let active = true;
    setBusy(true); setRows([]); setError(""); setMore(false);
    admin(before ? "?before="+encodeURIComponent(before) : "").then(data => {
      if (active) { setRows(data.items); setMore(data.more); }
    }).catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, [before,refresh]);
  async function retry(reference: string, channel: Channel) {
    setBusy(true);
    try { await admin("", {method:"POST",body:JSON.stringify({action:"retry",reference,channel})}); setRefresh(v=>v+1); }
    catch { setError("Relance non confirmée. Actualisez la liste."); setBusy(false); }
  }
  return <section className="legal-page contact-inbox"><header className="legal-hero"><h1>Demandes reçues</h1></header>
    <div className="legal-content">
      {error && <p role="alert">{error} <a href="/espace-client">Espace client</a></p>}
      {busy && <p role="status">Chargement…</p>}
      {!busy && !error && !rows.length && <p>Aucune demande.</p>}
      {rows.map(row=><details key={row.reference}><summary>{row.kind === "quote" ? "Devis gratuit" : "Contact"} · {row.subject} — {new Date(row.created_at).toLocaleString("fr-FR")}</summary>
        <p>Réf. {row.reference}</p><p>{row.name} · {row.email}</p><p className="contact-request-message">{row.message}</p>
        {(["email","telegram"] as const).map(channel=><p key={channel}>{channel === "email" ? "Accusé e-mail" : "Telegram"} · {labels[row.notifications[channel]]}
          {row.notifications[channel] !== "accepted" && <button disabled={busy} onClick={()=>retry(row.reference,channel)}>Relancer</button>}</p>)}
      </details>)}
      {more && <button disabled={busy} onClick={()=>setBefore(rows[rows.length-1].reference)}>Demandes précédentes</button>}
      <button disabled={busy} onClick={()=>{setBefore("");setRefresh(v=>v+1);}}>Actualiser les dernières demandes</button>
    </div></section>;
}
