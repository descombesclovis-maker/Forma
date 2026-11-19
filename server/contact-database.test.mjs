import assert from "node:assert/strict";
import { X509Certificate } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import pg from "pg";
import { contactDatabaseUrl } from "./contact-database.mjs";

test("the deployed contact function includes the Supabase root loaded by pg in verify-full mode", () => {
  const host = "aws-1-eu-west-1.pooler.supabase.com";
  const config = JSON.parse(readFileSync("vercel.json", "utf8"));
  const asset = readFileSync(config.functions["api/contact.js"].includeFiles, "utf8");
  const fingerprint = "80:70:25:AD:50:D4:ED:21:9D:2C:9C:7D:29:9C:00:4F:82:4E:B0:0C:F7:F6:5A:FE:F6:07:D0:7B:72:E6:CA:FA";
  for (const query of ["", "sslmode=require", "sslmode=verify-full", "sslmode=disable&uselibpqcompat=true"]) {
    const url = contactDatabaseUrl(`postgres://app.ref:p%40ss@${host}:5432/postgres?${query}`);
    assert.equal(new URL(url).searchParams.get("sslmode"), "verify-full");
    const client = new pg.Client({connectionString: url});
    assert.equal(client.host, host);
    assert.equal(client.password, "p@ss");
    assert.equal(client.ssl.ca, asset);
    assert.equal(new X509Certificate(client.ssl.ca).fingerprint256, fingerprint);
    assert.notEqual(client.ssl.rejectUnauthorized, false);
    assert.equal(client.ssl.checkServerIdentity, undefined); // Node's default hostname check.
  }
});

test("other PostgreSQL connections keep their own settings", () => {
  const local = "postgres://localhost:5432/test";
  assert.equal(contactDatabaseUrl(local), local);
});
