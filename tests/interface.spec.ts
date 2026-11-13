import { test, expect, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";

async function capture(page: Page, name: string, fullPage = false) {
  await mkdir("test-results/captures", { recursive: true });
  await page.screenshot({ path: `test-results/captures/${name}.png`, fullPage });
}
async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
}
test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Donnez forme à l’impossible" })).toBeVisible();
});

test("header keeps the F icon on the far left and centers FORMA, navigation minimal", async ({ page }) => {
  const icon = await page.getByRole("link", { name: "Icône F — revenir à l’accueil" }).boundingBox();
  const word = await page.getByRole("link", { name: "FORMA — revenir à l’accueil" }).boundingBox();
  expect(icon).not.toBeNull();expect(word).not.toBeNull();
  expect(icon!.x).toBeLessThan(120);
  expect(Math.abs(word!.x + word!.width / 2 - 720)).toBeLessThan(3);
  await expect(page.getByRole("link", { name: "Accéder à l’espace client" })).toBeVisible();
  await page.getByRole("button", { name: "Ouvrir le menu" }).click();
  await expect(page.getByRole("navigation", { name: "Navigation principale" }).getByRole("link"))
    .toHaveText(["Accueil", "Nos réalisations", "Nos services", "Nous contacter"]);
  await capture(page, "finition-menu-desktop");
});

test("homepage preserves original scroll-controlled F, four CTAs and eight conceptual case studies", async ({ page }) => {
  await expect(page.locator(".f-orbit-link")).toHaveCount(4);
  await expect(page.locator(".spec-build")).toHaveAttribute("data-ready", "true", { timeout: 30000 });
  const range = await page.evaluate(() => {
    const intro = document.querySelector<HTMLElement>(".spec-intro")!;
    const build = document.querySelector<HTMLElement>(".spec-build")!;
    return intro.offsetHeight + build.offsetHeight - innerHeight;
  });
  await page.evaluate(() => scrollTo({ top: 20, behavior: "instant" }));
  await expect.poll(() => page.locator(".spec-build").evaluate(el => parseFloat(getComputedStyle(el).getPropertyValue("--f-progress")))).toBeGreaterThan(0);
  await page.evaluate((y) => scrollTo({ top:y*.99, behavior: "instant" }), range);
  await expect(page.locator(".f-orbit-link--contact")).toBeVisible();
  await expect(page.locator(".f-orbit-link--contact")).toHaveAttribute("href","/nous-contacter");
  await expect(page.frameLocator(".spec-build-frame").locator("canvas").first()).toBeVisible();
  await page.evaluate(() => scrollTo({ top:0, behavior:"instant" }));
  await expect.poll(() => page.locator(".spec-build").evaluate(el => parseFloat(getComputedStyle(el).getPropertyValue("--f-progress")))).toBeLessThan(.05);
  await expect(page.locator(".portfolio-project")).toHaveCount(8);
  await expect(page.locator(".portfolio-demo-label")).toHaveCount(8);
  await expect(page.locator("#contact-name")).toHaveCount(0);
  await capture(page,"finition-accueil-desktop");
});

test("four process steps open only at screen midpoint and close on further scrolling", async ({ page }) => {
  await page.goto("/comment-ca-marche");
  const steps=page.locator(".process-step");
  await expect(steps).toHaveCount(4);
  await expect(page.locator(".process-step-title")).toHaveText(["Maquette","Échange","Création","Livraison"]);
  await expect(page.locator(".process-step-symbol svg")).toHaveCount(4);
  await expect(page.locator(".process-step-mark")).toHaveCount(0);
  await expect(page.locator(".process-step-toggle")).toHaveCount(0);
  const visit=async (index: number) => {
    await page.evaluate(i => {
      const step=document.querySelectorAll<HTMLElement>(".process-step")[i];
      const rect=step.getBoundingClientRect();
      const y=scrollY+rect.top+Math.min(rect.height/2,70)-innerHeight*.53;
      scrollTo({top:Math.max(0,y),behavior:"instant"});
    },index);
    await expect(steps.nth(index)).toHaveAttribute("data-open","true");
  };
  await visit(0);
  await expect(steps.nth(1)).toHaveAttribute("data-open","false");
  await visit(1);
  await expect(steps.nth(0)).toHaveAttribute("data-open","false");
  await visit(2);
  await visit(3);
  await visit(0);
  await capture(page,"finition-process-desktop",true);
});

test("pricing studio bundles included features and calculates only extras", async ({ page }) => {
  await page.goto("/tarification");
  await expect(page.getByRole("heading", { name:"Imaginez le projet. Explorez son prix." })).toBeVisible();
  await page.getByRole("button",{name:/Site vitrine simple/}).click();
  await expect(page.getByText("Formulaire de contact standard")).toBeVisible();
  await expect(page.getByRole("checkbox",{name:"Inclure Formulaire de contact"})).toHaveCount(0);
  await expect(page.locator(".pricing-summary-total strong")).toHaveText("490 €");
  await page.getByRole("checkbox",{name:"Inclure Animations avancées"}).check();
  await expect(page.locator(".pricing-summary-total strong")).toHaveText("630 €");
  await page.getByRole("button",{name:"Sites web"}).count();
  await page.getByRole("button",{name:/Site de réservation/}).click();
  await expect(page.getByText("Calendrier et créneaux de réservation standards")).toBeVisible();
  await expect(page.getByRole("checkbox",{name:"Inclure Calendrier et disponibilités"})).toHaveCount(0);
  await page.getByRole("button",{name:/Logos/}).click();
  await page.getByRole("button",{name:/Pack logo avec déclinaisons/}).click();
  await expect(page.getByText("Fichiers sources SVG")).toBeVisible();
  await expect(page.getByRole("checkbox",{name:"Inclure Fichiers sources vectoriels"})).toHaveCount(0);
  await capture(page,"finition-tarification-desktop",true);
});

test("portfolio links open genuine interactive demos, without pretending client work", async ({ page }) => {
  await page.getByRole("link",{name:/Explorer la démonstration interactive de AUBE/}).click();
  await expect(page).toHaveURL(/\/demo\/aube$/);
  await expect(page.getByRole("heading",{name:/L'espace est une émotion/})).toBeVisible();
  await page.getByRole("button",{name:/Maison Patio/}).click();
  await expect(page.getByRole("heading",{name:"Maison Patio"})).toBeVisible();
  await page.goto("/demo/halo");
  await page.getByRole("button",{name:/Ajouter Huile botanique/}).click();
  await page.getByRole("button",{name:/Panier \(1\)/}).click();
  await expect(page.getByText("Total fictif : 24 €")).toBeVisible();
  await page.goto("/demo/atlas");
  await page.getByRole("button",{name:"90 jours"}).click();
  await expect(page.getByText("139 570")).toBeVisible();
  await page.goto("/demo/orbit");
  await expect(page.getByRole("button",{name:/Écouter la démo sonore/})).toBeVisible();
  await page.goto("/demo/mono");
  await expect(page.getByText(/Symbole original/)).toBeVisible();
  await page.goto("/demo/lyra");
  await expect(page.getByText(/campagne de lancement/i)).toBeVisible();
});

test("all 30 service items have their own previews and official external reference links", async ({ page }) => {
  await page.goto("/nos-services");
  await expect(page.locator(".service-catalog-row")).toHaveCount(30);
  const imgs=page.locator(".service-example-button img");
  await expect(imgs).toHaveCount(30);
  await page.getByRole("button",{name:"Agrandir l’illustration : Sites vitrines"}).click();
  const modal=page.getByRole("dialog",{name:"Sites vitrines"});
  await expect(modal).toBeVisible();
  await expect(modal.getByRole("link",{name:/Voir une référence réelle/})).toHaveAttribute("href","https://www.tesla.com/fr_FR");
  await page.getByRole("button",{name:"Fermer l’aperçu"}).click();
  await expect(modal).toHaveCount(0);
});

test("contact is a dedicated form and FAQ/quick message never simulates sending", async ({ page }) => {
  await page.goto("/nous-contacter");
  await expect(page.getByRole("heading",{name:/Parlons de votre projet/})).toBeVisible();
  await page.locator("#contact-name").fill("Test FORMA");
  await page.locator("#contact-email").fill("test@example.com");
  await page.locator("#contact-subject").fill("Projet");
  await page.locator("#contact-message").fill("Demande de test");
  await page.locator(".contact-form--full .contact-consent input").check();
  await page.getByRole("button",{name:"Envoyer ma demande"}).click();
  await expect(page.locator(".contact-form--full .contact-feedback")).toContainText("Aucun message n'a été transmis");
  await page.getByRole("button",{name:"Quels services proposez-vous ?"}).click();
  await expect(page.getByText("Sites web, applications")).toBeVisible();
  await page.locator("#quick-email").fill("test@example.com");
  await page.locator("#quick-question").fill("Une question rapide");
  await page.locator(".contact-consent--small input").check();
  await page.getByRole("button",{name:"Envoyer ma question"}).click();
  await expect(page.locator(".quick-chat .contact-feedback")).toContainText("n'a pas été envoyée");
});

test("client portal has just one page scrollbar and auth stays safely disabled", async ({ page }) => {
  await page.goto("/espace-client");
  await expect(page.getByRole("link",{name:"Accéder à l’espace client"})).toBeVisible();
  const original=page.frameLocator("iframe[title^='Espace client original']");
  await expect(original.locator(".client-login__copy h1")).toBeVisible({timeout:30000});
  await expect(original.locator(".access-form input[type=email]")).toBeVisible();
  await expect(original.locator(".access-form button[type=submit]")).toBeDisabled();
  await expect.poll(async () => page.frameLocator("iframe[title^='Espace client original']").locator("html").evaluate(el=>getComputedStyle(el).overflowY)).toBe("hidden");
  await capture(page,"finition-client-desktop",true);
});

test("mobile layouts, portfolio, pricing and form avoid horizontal overflow", async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  for(const path of ["/","/comment-ca-marche","/tarification","/nos-services","/espace-client","/nous-contacter","/demo/aube","/demo/halo","/demo/atlas","/demo/orbit","/demo/mono","/demo/lyra","/demo/viva","/politique-confidentialite","/mentions-legales"]){
    await page.goto(path);
    await noOverflow(page);
    await expect(page.getByRole("button",{name:"Ouvrir le menu"})).toBeVisible();
    if(path==="/tarification")await capture(page,"finition-tarification-mobile");
    if(path==="/nous-contacter")await capture(page,"finition-contact-mobile");
    if(path==="/nos-services")await capture(page,"finition-services-mobile");
  }
});

test("small phones, tablets and widescreen desktop keep one document width and usable primary actions", async ({ page }) => {
  for(const width of [320,360,393,768,1024,1920]){
    await page.setViewportSize({width,height:width<=393?844:960});
    for(const route of ["/","/tarification","/comment-ca-marche","/nos-services","/nous-contacter","/espace-client"]){
      await page.goto(route);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `overflow on ${route} at ${width}px`).toBe(true);
      await expect(page.getByRole("button",{name:"Ouvrir le menu"})).toBeVisible();
      if(route==="/espace-client"){
        const portal=page.frameLocator("iframe[title^='Espace client original']");
        await expect(portal.locator(".access-form input[type=email]")).toBeVisible();
      }
    }
  }
});
