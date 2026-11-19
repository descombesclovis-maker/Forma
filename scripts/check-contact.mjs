// Against a configured LOCAL recipe server and a disposable PostgreSQL database only.
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { chromium } from "@playwright/test";
const origin = new URL(process.env.CONTACT_TEST_ORIGIN);
assert.ok(["127.0.0.1", "localhost"].includes(origin.hostname));
const browser = await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH});
try {
  for (const width of [390, 820, 1366]) {
    const page = await browser.newPage({viewport:{width,height:850},hasTouch:width<1000});
    await page.context().addCookies([{name:"preview_test",value:"ok",url:origin.origin,httpOnly:true}]);
    await page.goto(new URL("/tarification",origin).href);
    await page.getByRole("link",{name:"Demander mon devis gratuit"}).click();
    assert.equal(await page.locator("#request-kind").inputValue(),"quote");
    assert.ok((await page.locator("#contact-message").inputValue()).length>30);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await page.getByLabel("Prénom *",{exact:true}).fill("Recette");
    await page.locator("#contact-email").fill(randomUUID()+"@example.test");
    await page.locator(".contact-form--full [type=checkbox]").check();
    const button=page.getByRole("button",{name:"Envoyer ma demande"});
    // Check the access error before retrying the same payload and submission ID.
    let firstBody;
    await page.route("**/api/contact", async route => {
      firstBody = route.request().postDataJSON();
      await route.fulfill({status:401,contentType:"application/json",body:"{}"});
    },{times:1});
    await button.click();
    await page.getByRole("alert").filter({hasText:"Vérifiez votre accès"}).waitFor();
    // Simulate a catch-all HTML 200 before the real local POST.
    await page.route("**/api/contact",r=>r.fulfill({status:200,contentType:"text/html",body:"<html></html>"}),{times:1});
    await button.click();
    await page.getByRole("alert").filter({hasText:"Enregistrement non confirmé"}).waitFor();
    const posted = page.waitForRequest(request => request.method() === "POST" && request.url() === new URL("/api/contact",origin).href);
    await button.click();
    const request = await posted;
    assert.deepEqual(request.postDataJSON(),firstBody);
    const headers = await request.allHeaders();
    assert.match(headers.cookie ?? "", /preview_test=ok/);
    await page.getByRole("status").filter({hasText:/Référence : [0-9a-f-]{36}/}).waitFor();
    await page.goto(new URL("/admin/demandes",origin).href);
    await page.getByRole("alert").filter({hasText:"Connectez-vous"}).waitFor();
    console.log(width+" px : devis enregistré, faux succès rejeté, administration fermée.");
    await page.close();
  }
} finally { await browser.close(); }
