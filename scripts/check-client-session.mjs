// Isolated browser contract tests. No Supabase account, mailbox, or hosted data is used.
import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
import { createServer } from "vite";

const identity = "https://auth.example.test";
process.env.VITE_FORMA_SUPABASE_URL = identity;
process.env.VITE_FORMA_SUPABASE_ANON_KEY = "public-test";
const server = await createServer({server:{host:"127.0.0.1", port:0},logLevel:"error"});
await server.listen();
const origin = server.resolvedUrls.local[0];
const browser = await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH});
try {
  for (const width of [390,1366]) {
    const page = await browser.newPage({viewport:{width,height:844},hasTouch:width===390});
    const email = "fixture@example.test";
    const id = "ff410a51-0036-456e-a6d6-94f1d99258e4";
    let logout = 0, refresh = 0, reads = 0, denied = 0, updated = false;
    let allowed = false;
    const tokens = {access_token:"fixture-access",refresh_token:"fixture-refresh",expires_in:3600};
    await page.route(identity+"/**",async route => {
      const req = route.request();
      const url = new URL(req.url());
      const send = (json, status=200) => route.fulfill({status,json});
      const data = req.postData() ? req.postDataJSON() : {};
      if (url.pathname === "/auth/v1/otp") {
        assert.deepEqual(data,{email,create_user:false});
        return send({});
      }
      if (url.pathname === "/auth/v1/verify") {
        if (data.token !== "123456") return send({msg:"Code invalide"},403);
        assert.deepEqual(data,{email,token:"123456",type:"email"});
        allowed=true; return send(tokens);
      }
      if (url.pathname === "/auth/v1/token") {
        if (url.searchParams.get("grant_type")==="refresh_token") {
          assert.equal(data.refresh_token,tokens.refresh_token); refresh++;
        } else { assert.deepEqual(data,{email,password:"fixture-password"}); }
        allowed=true; return send(tokens);
      }
      if (url.pathname === "/auth/v1/recover") {
        assert.equal(url.searchParams.get("redirect_to"),origin+"espace-client");
        assert.equal(data.email,email); return send({});
      }
      assert.equal(req.headers().authorization,"Bearer "+tokens.access_token);
      if (!allowed) return send({},401);
      if (url.pathname === "/auth/v1/user") {
        if(req.method()==="PUT"){assert.equal(data.password,"new-fixture-password");updated=true;}
        return send({id,email});
      }
      if (url.pathname === "/auth/v1/logout") {
        assert.equal(url.searchParams.get("scope"),"local");
        allowed=false; logout++; return route.fulfill({status:204});
      }
      assert.ok(url.pathname.startsWith("/rest/v1/forma_client_"));
      assert.equal(url.searchParams.get("client_id"),"eq."+id);
      reads++; return send([]);
    });
    await page.route("**/api/contact",async route => {
      assert.equal(route.request().headers().authorization,"Bearer "+tokens.access_token);
      denied++; await route.fulfill({status:403,json:{recorded:false}});
    });

    const heading = name => page.getByRole("heading",{name,exact:true}).waitFor({timeout:10000});
    const click = name => page.getByRole("button",{name,exact:true}).click();
    await page.goto(origin+"espace-client");
    await click("Se connecter par code e-mail");
    await page.getByLabel("Adresse e-mail").fill(email);
    await click("Recevoir mon code");
    await page.locator("input[name=otp]").fill("000000");
    await click("Valider les 6 chiffres");
    await page.getByRole("alert").filter({hasText:"Code invalide"}).waitFor();
    await page.locator("input[name=otp]").fill("123456");
    await click("Valider les 6 chiffres");
    await heading("Votre espace.");
    await page.getByText("Bonjour, fixture.").waitFor();
    await page.evaluate(()=>{
      const key="forma-client-session-v1";
      const stored=JSON.parse(sessionStorage.getItem(key));
      sessionStorage.setItem(key,JSON.stringify({...stored,expires_at:1}));
    });
    await page.reload(); await heading("Votre espace.");
    await page.getByRole("button",{name:/Mes projets/}).click();
    await heading("Mes projets");
    assert.ok(reads>=8); assert.equal(refresh,1);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await page.goto(origin+"admin/demandes");
    await page.getByRole("alert").filter({hasText:"Accès réservé au fondateur"}).waitFor();
    assert.ok(denied>0);
    await page.goto(origin+"espace-client");
    await click("Se déconnecter ↗"); await heading("Bienvenue.");
    await page.reload(); await heading("Bienvenue.");
    assert.equal(logout,1);
    await page.getByLabel("Adresse e-mail").fill(email);
    await page.getByLabel("Mot de passe",{exact:true}).fill("fixture-password");
    await click("Se connecter"); await heading("Votre espace.");
    await click("Se déconnecter ↗");
    await click("Mot de passe oublié ?");
    await page.getByLabel("Adresse e-mail").fill(email);
    await click("Envoyer le lien");
    await page.getByRole("status").filter({hasText:"courriel"}).waitFor();
    allowed=true;
    await page.goto("about:blank");
    await page.goto(origin+"espace-client#type=recovery&access_token=fixture-access&refresh_token=fixture-refresh");
    await page.reload(); await heading("Nouveau mot de passe.");
    await page.getByLabel("Mot de passe",{exact:true}).fill("new-fixture-password");
    await click("Enregistrer le mot de passe"); await heading("Bienvenue.");
    assert.ok(updated);assert.equal(logout,3);
    await page.close(); console.log(width+" px: connexion, OTP, renouvellement, données, refus admin, récupération et déconnexion vérifiés.");
  }
} finally { await browser.close(); await server.close(); }
