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
    const offline=http.createServer(contactMiddleware(handleContact({getPool(){throw new Error("offline")}})));
    const offlineUrl=await listen(offline);
    try {
      const res=await fetch(offlineUrl+"/api/contact",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(payload)});
      assert.equal(res.status,503);assert.deepEqual(await res.json(),{recorded:false});
    }finally{offline.close();}
  }finally{server.close();auth.close();await pool.end();}
});
