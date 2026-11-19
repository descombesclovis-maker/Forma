import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import pg from "pg";
import { handleContact } from "./contact.mjs";
import { contactMiddleware } from "./contact-dev.mjs";

test("contact/devis : persistance, autorisations, concurrence, notifications et quotas", async () => {
  assert.ok(process.env.CONTACT_TEST_DATABASE_URL, "Fournir une base de test vide");
  const pool = new pg.Pool({connectionString:process.env.CONTACT_TEST_DATABASE_URL});
  const sql = await readFile(new URL("contact.sql", import.meta.url), "utf8");
  await pool.query(sql); // Refuse an existing schema; never remove existing records.
  process.env.CONTACT_RATE_SECRET = randomUUID();
  const listen = async server => { await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve)); return 'http://127.0.0.1:'+server.address().port; };
  const id = randomUUID();
  const auth = http.createServer((req,res)=>{
    res.setHeader("content-type","application/json");
    const token = req.headers.authorization;
    res.statusCode = ["Bearer founder","Bearer client"].includes(token) ? 200 : 401;
    res.end(JSON.stringify({id:token==="Bearer founder" ? id : randomUUID()}));
  });
  process.env.VITE_FORMA_SUPABASE_URL=await listen(auth);
  process.env.VITE_FORMA_SUPABASE_ANON_KEY="public-test";
  process.env.FORMA_FOUNDER_USER_ID=id;
  const failures=new Set(["telegram","email"]), attempts=[];
  const handler=handleContact({getPool:()=>pool,send:async (channel,item)=>{
    assert.equal((await pool.query("select reference from forma_contact.requests where reference=$1",[item.reference])).rowCount,1);
    attempts.push(channel); if(failures.has(channel))throw new Error("test");
  }});
  const server=http.createServer(contactMiddleware(handler));
  const url=(await listen(server))+"/api/contact";
  const post=(body,token)=>fetch(url,{method:"POST",headers:{"content-type":"application/json",...(token?{Authorization:"Bearer "+token}:{})},body:JSON.stringify(body)});
  const list=token=>fetch(url,{headers:token?{Authorization:"Bearer "+token}:{}});
  const payload={submission:randomUUID(),kind:"quote",name:"Test",email:"pilot@example.test",subject:"Site",message:"Demande de devis",consent:true};
  try {
    for(const patch of [{email:"wrong"},{name:" "},{subject:""},{message:""},{website:"spam"},{consent:false},{kind:"other"}])
      assert.equal((await post({...payload,...patch})).status,400);
    const rateSecret = process.env.CONTACT_RATE_SECRET;
    delete process.env.CONTACT_RATE_SECRET;
    assert.equal((await post(payload)).status,503);
    process.env.CONTACT_RATE_SECRET = rateSecret;
    const responses=await Promise.all([post(payload),post(payload)]);
    assert.deepEqual(responses.map(r=>r.status).sort(),[200,201]);
    const [a,b]=await Promise.all(responses.map(r=>r.json()));
    assert.equal(a.recorded,true);assert.equal(a.reference,b.reference);assert.deepEqual(attempts.sort(),["email","telegram"]);
    assert.equal((await (await post({...payload,submission:randomUUID()})).json()).reference,a.reference);
    assert.equal((await post({...payload,message:"Modifié"})).status,409);
    for(const [token,status] of [[undefined,401],["client",403],["invalid",401]]){
      assert.equal((await list(token)).status,status);
      assert.equal((await post({action:"retry",reference:a.reference,channel:"email"},token)).status,status);
    }
    const getRow=async()=> (await (await list("founder")).json()).items[0];
    assert.deepEqual((await getRow()).notifications,{email:"failed",telegram:"failed"});
    assert.equal((await getRow()).message,payload.message);
    failures.clear();
    for(const channel of ["email","telegram"]) {
      assert.equal((await post({action:"retry",reference:a.reference,channel},"founder")).status,200);
      await post({action:"retry",reference:a.reference,channel},"founder");
    }
    assert.deepEqual((await getRow()).notifications,{email:"accepted",telegram:"accepted"});
    assert.equal(attempts.length,4);
    const second=new pg.Client({connectionString:process.env.CONTACT_TEST_DATABASE_URL});
    await second.connect();assert.equal((await second.query("select count(*) from forma_contact.requests")).rows[0].count,"1");await second.end();
    for(const broken of ["telegram","email"]) {
      failures.add(broken);
      const independent = await post({...payload,kind:"contact",email:broken+"@example.test",submission:randomUUID()});
      assert.equal(independent.status,201);
      const row = await getRow();
      assert.equal(row.notifications[broken],"failed");
      assert.equal(row.notifications[broken === "email" ? "telegram" : "email"],"accepted");
      failures.delete(broken);
    }
    for(let n=0;n<3;n++)assert.equal((await post({...payload,submission:randomUUID(),subject:"Suivi "+n})).status,n===2?429:201);
    const limited = new pg.Pool({connectionString:process.env.CONTACT_TEST_DATABASE_URL, options:"-c role=pg_read_all_data"});
    const disconnected = new pg.Pool({host:"127.0.0.1",port:1,connectionTimeoutMillis:300});
    for (const unavailable of [limited, disconnected]) {
      const failing = http.createServer(contactMiddleware(handleContact({getPool:()=>unavailable})));
      const base = await listen(failing);
      try {
        const result = await fetch(base+"/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},
          body:JSON.stringify({...payload,email:"failed@example.test",submission:randomUUID()})});
        assert.equal(result.status,503);
        assert.deepEqual(await result.json(),{recorded:false});
        assert.equal((await pool.query("select reference from forma_contact.requests where email='failed@example.test'")).rowCount,0);
      } finally { failing.close(); await unavailable.end(); }
    }
    // Reproduce the hosted schema: correct table grants, RLS enabled, no policies.
    // The runtime role is cluster-wide. This fixture requires an isolated PostgreSQL cluster.
    await pool.query(`create role forma_contact_app;
      grant usage on schema forma_contact to forma_contact_app;
      grant select,insert on forma_contact.requests to forma_contact_app;
      grant select,insert,update on forma_contact.notifications to forma_contact_app;
      alter table forma_contact.requests enable row level security;
      alter table forma_contact.notifications enable row level security`);
    const runtime = new pg.Pool({connectionString:process.env.CONTACT_TEST_DATABASE_URL, options:"-c role=forma_contact_app"});
    const app = http.createServer(contactMiddleware(handleContact({getPool:()=>runtime,send:async()=>{}})));
    const origin = await listen(app);
    const attempt = {...payload, email:"rls@example.test", submission:randomUUID()};
    const submit = () => fetch(origin+"/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(attempt)});
    try {
      assert.equal((await submit()).status,503);
      await pool.query(await readFile(new URL("contact-runtime-policies.sql",import.meta.url),"utf8"));
      const saved = await submit();
      assert.equal(saved.status,201);
      const receipt = await saved.json();
      assert.equal(receipt.recorded,true);
      const persisted = await pool.query("select reference from forma_contact.requests where submission=$1",[attempt.submission]);
      assert.deepEqual(persisted.rows,[{reference:receipt.reference}]);
      const notifications = await pool.query("select state from forma_contact.notifications where reference=$1",[receipt.reference]);
      assert.deepEqual(notifications.rows,[{state:"accepted"},{state:"accepted"}]);
      assert.equal((await (await submit()).json()).reference,receipt.reference);
    } finally { app.close(); await runtime.end(); }
    const offline=http.createServer(contactMiddleware(handleContact({getPool(){throw new Error("offline")}})));
    const offlineUrl=await listen(offline);
    try {
      const res=await fetch(offlineUrl+"/api/contact",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(payload)});
      assert.equal(res.status,503);assert.deepEqual(await res.json(),{recorded:false});
    }finally{offline.close();}
  }finally{server.close();auth.close();await pool.end();}
});
