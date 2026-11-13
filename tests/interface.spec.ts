import { test, expect } from "@playwright/test";
process.env.PW_TEST_SCREENSHOT_NO_FONTS_READY = "1";
const labels = [
  "Vous connecter",
  "Sites web",
  "Logiciels",
  "Logos",
  "Identité Visuelle",
  "Contact",
];
async function shot(
  page: import("@playwright/test").Page,
  name: string,
  fullPage = false,
) {
  await page.waitForTimeout(350);
  await page.screenshot({
    path: `test-results/captures/${name}.png`,
    fullPage,
    animations: "disabled",
  });
}
async function openGroup(page: import("@playwright/test").Page, id: string) {
  await page.locator(`#group-${id}`).evaluate((el) => {
    const section = el.closest<HTMLElement>(".spec-option-sequence")!;
    scrollTo(
      0,
      section.getBoundingClientRect().top +
        scrollY +
        (section.offsetHeight - innerHeight) * 0.48,
    );
  });
  await expect(page.locator(`#options-${id}`)).not.toHaveAttribute("inert", "");
  await page.waitForTimeout(150);
}
test("header exact, petit F, centrage, menu et footer", async ({ page }) => {
  await page.goto("/#/catalogue");
  const logo = page.locator(".spec-logo .forma-logo__top");
  const before = await logo.evaluate((e) => getComputedStyle(e).transform);
  await page.locator(".spec-brand").hover();
  await page.waitForTimeout(750);
  expect(await logo.evaluate((e) => getComputedStyle(e).transform)).not.toBe(
    before,
  );
  await page.mouse.move(700, 200);
  const center = await page
    .locator(".spec-wordmark")
    .evaluate(
      (e) => e.getBoundingClientRect().x + e.getBoundingClientRect().width / 2,
    );
  expect(Math.abs(center - 640)).toBeLessThan(1);
  await page
    .getByRole("button", { name: "Ouvrir le menu", exact: true })
    .click();
  await expect(page.locator(".spec-menu a")).toHaveText(labels);
  await shot(page, "menu-desktop");
  await page.keyboard.press("Escape");
  await expect(page.locator(".spec-menu")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Ouvrir le menu", exact: true }),
  ).toBeFocused();
  const footer = page.locator(".spec-footer");
  await expect(footer.locator("a")).toHaveCount(8);
  expect(await footer.innerText()).toBe(
    "Forma®\nPolitique de confidentialité\nSites web\nLogiciels\nLogos\nIdentité Visuelle\nContact\nVous connecter\nTermes légaux",
  );
  await footer.scrollIntoViewIfNeeded();
  await shot(page, "footer-desktop");
});
test("accueil original intégré, intro, F au scroll et CTA unique", async ({
  page,
}) => {
  test.setTimeout(60000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".spec-orbit .spec-prism")).toHaveCount(3);
  await expect(page.locator("main>section")).toHaveCount(2);
  await expect(page.locator(".spec-build")).toHaveAttribute(
    "data-ready",
    "true",
    { timeout: 15000 },
  );
  await page.waitForTimeout(300);
  await shot(page, "accueil-desktop");
  const f = page.frameLocator(".spec-build-frame");
  await expect(f.locator(".build-section")).toBeAttached();
  await page.evaluate(() => scrollTo(0, innerHeight * 1.65));
  await page.waitForTimeout(1000);

  await expect(f.locator(".build-scene-wrap")).toHaveCSS("opacity", "1");
  await expect(f.locator("canvas").first()).toBeVisible();
  await page.waitForTimeout(600);
  await shot(page, "grand-f-desktop");
  await page.evaluate(() => scrollTo(0, 0));
  await expect(f.locator(".build-scene-wrap")).toHaveCSS("opacity", "0");
  await page.evaluate(() => scrollTo(0, innerHeight * 1.8));
  await page.getByRole("link", { name: "Donner forme à mes idées" }).click();
  await expect(page.locator("main h1")).toHaveText("Produits digitaux");
  await expect(page.locator(".spec-product")).toHaveCount(4);
  await shot(page, "catalogue-desktop", true);
});
test("trois types authentiques et formulaire F exact avec photos et conservation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/#/sites");
  await page.getByRole("link", { name: "Donner forme à mon projet" }).click();
  await expect(page.locator(".spec-type-select")).toHaveCount(3);
  for (const image of await page.locator(".spec-type img").all()) {
    await expect(image).toBeVisible();
    expect(
      await image.evaluate((e) => (e as HTMLImageElement).naturalWidth),
    ).toBeGreaterThan(1000);
  }
  await expect(page.locator(".spec-type .spec-example-source")).toHaveCount(3);
  await shot(page, "choix-site-desktop", true);
  await page.getByRole("button", { name: /Site vitrine/ }).click();
  await expect(
    page.getByLabel("Nom du site web", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Valider le nom du site web" })
    .click();
  await expect(page.getByRole("alert")).toContainText("obligatoire");
  await page
    .getByLabel("Nom du site web", { exact: true })
    .fill("Maison Atelier");
  await shot(page, "formulaire-nom-desktop");
  await page
    .getByRole("button", { name: "Valider le nom du site web" })
    .click();
  await page
    .getByLabel("Photos de la boutique / des bâtiments", { exact: true })
    .setInputFiles({
      name: "boutique.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aDP8AAAAASUVORK5CYII=",
        "base64",
      ),
    });
  await expect(page.locator(".spec-photo-previews img")).toHaveCount(1);
  await shot(page, "formulaire-photos-desktop");
  await page.getByRole("button", { name: "Valider", exact: true }).click();
  await page
    .getByLabel("Informations complémentaires", { exact: true })
    .fill("Un site pour présenter notre boutique.");
  await shot(page, "formulaire-informations-desktop");
  await page
    .getByRole("button", { name: /Nom du site web.*Maison Atelier.*Modifier/ })
    .click();
  await expect(page.getByLabel("Nom du site web", { exact: true })).toHaveValue(
    "Maison Atelier",
  );
  await page
    .getByRole("button", { name: "Valider le nom du site web" })
    .click();
  await expect(page.locator(".spec-photo-previews img")).toHaveCount(1);
  await page.getByRole("button", { name: "Valider", exact: true }).click();
  await expect(
    page.getByLabel("Informations complémentaires", { exact: true }),
  ).toHaveValue("Un site pour présenter notre boutique.");
  await page.getByRole("button", { name: "Valider", exact: true }).click();
  await expect(page.locator("main h1")).toHaveText(
    "Choisissez la ou les fonctionnalité(s) et option(s) de votre site.",
  );
  await page.goto("/#/sites");
  await page.getByRole("link", { name: "Donner forme à mon projet" }).click();
  await page.getByRole("button", { name: /Site vitrine/ }).click();
  await expect(
    page.getByLabel("Informations complémentaires", { exact: true }),
  ).toHaveValue("Un site pour présenter notre boutique.");
});
test("barres : ouverture, fermeture, catégorie suivante et sélections persistantes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/#/options");
  await page
    .locator(".spec-option-sequence")
    .first()
    .evaluate((el) => scrollTo(0, el.getBoundingClientRect().top + scrollY));
  await expect(page.locator("#options-contenu")).toHaveAttribute("inert", "");
  await shot(page, "options-fermees-desktop");
  await openGroup(page, "contenu");
  const gap = await page
    .locator(".spec-option-sequence")
    .first()
    .evaluate((e) => {
      const a = e.querySelector(".bar-top")!.getBoundingClientRect(),
        b = e.querySelector(".bar-bottom")!.getBoundingClientRect();
      return b.top - a.bottom;
    });
  expect(gap).toBeGreaterThan(250);
  await page.getByLabel("Blog et actualités").check();
  await shot(page, "options-ouvertes-desktop");
  await openGroup(page, "contact");
  await expect(page.locator("#options-contenu")).toHaveAttribute("inert", "");
  await expect(page.locator("#options-contact")).not.toHaveAttribute(
    "inert",
    "",
  );
  await page.getByLabel("Carte et itinéraire").check();
  await shot(page, "options-categorie-suivante-desktop");
  await openGroup(page, "contenu");
  await expect(page.getByLabel("Blog et actualités")).toBeChecked();
  await page.getByLabel("Blog et actualités").uncheck();
  await expect(page.getByLabel("Blog et actualités")).not.toBeChecked();
});
test("connexion : drag souris et clavier, retour à la lévitation, aucun accès simulé", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/#/connexion");
  const shape = page.locator(".drag-shape-1");
  const box = (await shape.boundingBox())!;
  await page.mouse.move(box.x + 60, box.y + 40);
  await page.mouse.down();
  await page.mouse.move(box.x + 145, box.y + 95, { steps: 8 });
  expect(await shape.evaluate((e) => getComputedStyle(e).transform)).not.toBe(
    "none",
  );
  await expect(shape).toHaveAttribute("data-dragging", "true");
  await shot(page, "connexion-manipulation-desktop");
  await page.mouse.up();
  await expect(shape).toHaveAttribute("data-dragging", "false");
  await shape.focus();
  await page.keyboard.press("ArrowRight");
  expect(await shape.evaluate((e) => e.style.transform)).toContain("20px");
  await page.keyboard.press("Escape");
  await page
    .getByLabel("Adresse email", { exact: true })
    .fill("test@example.org");
  await page.getByLabel("Mot de passe").fill("test-not-a-real-password");
  await page
    .getByRole("button", { name: "Vous connecter", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText(
    "Aucune donnée n’a été transmise",
  );
  await shot(page, "connexion-desktop");
  await expect(page.locator("body")).not.toContainText("Dashboard");
});
test("toutes les interfaces, footer identique et captures desktop/mobile", async ({
  page,
}) => {
  test.setTimeout(90000);
  let footer = "";
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    for (const route of [
      "catalogue",
      "sites",
      "logiciels",
      "logos",
      "identite",
      "choix-site",
      "contact",
      "connexion",
      "confidentialite",
      "legal",
    ]) {
      await page.goto("/#/" + route);
      await expect(page.locator("main h1")).toBeVisible();
      const text = await page.locator(".spec-footer").innerText();
      if (!footer) footer = text;
      expect(text).toBe(footer);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        route,
      ).toBe(true);
      await shot(
        page,
        `${route}-${width === 390 ? "mobile" : "desktop"}`,
        true,
      );
    }
    if (width === 390) {
      await page.goto("/");
      await expect(page.locator(".spec-build")).toHaveAttribute(
        "data-ready",
        "true",
        { timeout: 15000 },
      );
      await page.waitForTimeout(300);
      await shot(page, "accueil-mobile");
      await page.evaluate(() => scrollTo(0, innerHeight * 1.7));
      await page.waitForTimeout(900);
      await shot(page, "grand-f-mobile");
      await page.goto("/#/choix-site");
      await page.getByRole("button", { name: /One Page/ }).click();
      await page
        .getByLabel("Nom du site web", { exact: true })
        .fill("Projet mobile");
      await shot(page, "formulaire-nom-mobile", true);
      await page
        .getByRole("button", { name: "Valider le nom du site web" })
        .click();
      await shot(page, "formulaire-photos-mobile", true);
      await page.getByRole("button", { name: "Passer", exact: true }).click();
      await shot(page, "formulaire-informations-mobile", true);
      await page.getByRole("button", { name: "Passer", exact: true }).click();
      await openGroup(page, "contenu");
      await page.getByLabel("Galerie de photos").check();
      await shot(page, "options-mobile");
      await page
        .getByRole("button", { name: "Ouvrir le menu", exact: true })
        .click();
      await expect(page.locator(".spec-menu a")).toHaveText(labels);
      await shot(page, "menu-mobile");
    }
  }
});
test("mobile tactile et réduction des animations", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:5173/#/connexion");
  const shape = page.locator(".drag-shape-1");
  const touch = await context.newCDPSession(page);
  const box = (await shape.boundingBox())!;
  const x = box.x + 90,
    y = box.y + 45;
  await touch.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x, y, id: 1 }],
  });
  await touch.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: x + 50, y: y + 35, id: 1 }],
  });
  await expect(shape).toHaveAttribute("data-dragging", "true");
  expect(await shape.evaluate((e) => e.style.transform)).toContain("50px");
  await shot(page, "connexion-manipulation-mobile");
  await touch.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect(shape).toHaveAttribute("data-dragging", "false");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("http://127.0.0.1:5173/#/options");
  await expect(page.locator(".is-reduced")).toHaveCount(5);
  await expect(page.getByLabel("Blog et actualités")).toBeEnabled();
  await page.getByLabel("Blog et actualités").check();
  await page.locator(".spec-footer").scrollIntoViewIfNeeded();
  await shot(page, "footer-mobile");
  await context.close();
});

test("contact sans faux envoi et liens publics limités", async ({ page }) => {
  await page.goto("/#/contact");
  await page.getByLabel("Nom", { exact: true }).fill("Client test");
  await page
    .getByLabel("Adresse email", { exact: true })
    .fill("test@example.org");
  await page
    .getByLabel("Message", { exact: true })
    .fill("Un projet de site web.");
  await page.getByRole("button", { name: "Envoyer", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Votre message n’a pas été envoyé",
  );
  await expect(page.locator(".spec-footer a")).toHaveCount(8);
  for (const route of ["client", "realisations", "tarifs", "faq", "reseaux"]) {
    await page.goto("/#/" + route);
    await expect(page.locator(".spec-intro")).toBeVisible();
    await expect(page.locator("main h1")).toHaveCount(0);
  }
});
