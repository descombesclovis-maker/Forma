import { test, expect } from "@playwright/test";
process.env.PW_TEST_SCREENSHOT_NO_FONTS_READY = "1";
const labels = ["Nos expertises", "Contact", "Espace client"];
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
  const headerActions = page.locator(".spec-header-right");
  await expect(headerActions.locator(".spec-account").first()).toBeVisible();
  await expect(headerActions.locator(".spec-menu-toggle").first()).toBeVisible();
  expect(await headerActions.locator(".spec-account").evaluate((el) => el.compareDocumentPosition(el.parentElement!.querySelector(".spec-menu-toggle")!) & Node.DOCUMENT_POSITION_FOLLOWING)).toBeTruthy();
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
  await page.locator(".spec-wordmark").click();
  await expect(page.locator(".spec-intro h1")).toHaveText(
    "Donnez forme à l’impossible",
  );
  await page.evaluate(() => scrollTo(0, 400));
  await page.locator(".spec-wordmark").click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  const footer = page.locator(".spec-footer");
  await expect(footer.locator("a")).toHaveCount(6);
  expect(await footer.innerText()).toBe(
    "Forma®\nPolitique de confidentialité\nNos expertises\nContact\nEspace client\nTermes légaux",
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
  await expect(page.locator(".spec-assurances li")).toHaveCount(3);
  await expect(page.locator(".spec-assurances li").nth(0)).toContainText("Livraison en 3 à 7 jours");
  await expect(page.locator(".spec-assurances li").nth(1)).toContainText("Créations sans IA");
  await expect(page.locator(".spec-assurances li").nth(2)).toContainText("Accompagnement client");
  await expect(page.locator(".spec-intro h1")).toHaveText(
    "Donnez forme à l’impossible",
  );
  await expect(page.locator("main>section")).toHaveCount(2);
  await expect(page.locator(".spec-build")).toHaveAttribute(
    "data-ready",
    "true",
    { timeout: 15000 },
  );
  await page.evaluate(() => scrollTo(0, 12));
  await expect.poll(() => page.locator(".spec-build").evaluate((el) => Number(getComputedStyle(el).getPropertyValue("--f-progress")))).toBeGreaterThan(0);
  await page.evaluate(() => scrollTo(0, 0));
  await expect.poll(() => page.locator(".spec-build").evaluate((el) => Number(getComputedStyle(el).getPropertyValue("--f-progress")))).toBe(0);
  await page.waitForTimeout(300);
  await shot(page, "accueil-desktop");
  const f = page.frameLocator(".spec-build-frame");
  await expect(f.locator(".build-section")).toBeAttached();
  await expect(page.locator(".spec-build-cta")).toBeHidden();
  await page.evaluate(() => scrollTo(0, innerHeight * 1.65));
  await page.waitForTimeout(800);

  await expect(f.locator(".build-scene-wrap")).toHaveCSS("opacity", "1");
  await expect(page.locator(".spec-build")).toHaveAttribute("data-cta-ready", "false");
  await expect(f.locator("canvas").first()).toBeVisible();
  await page.waitForTimeout(600);
  await shot(page, "grand-f-desktop");
  await page.evaluate(() => scrollTo(0, 0));
  await expect(f.locator(".build-scene-wrap")).toHaveCSS("opacity", "1");
  await expect(page.locator(".spec-build")).toHaveAttribute("data-cta-ready", "false");
  await page.evaluate(() => scrollTo(0, innerHeight * 1.8));
  await expect(page.locator(".spec-build")).toHaveAttribute("data-cta-ready", "true");
  await expect(page.getByRole("link", { name: "Démarrer mon projet" })).toBeVisible();
  const ctaBox = (await page.locator(".spec-build-cta").boundingBox())!;
  expect(ctaBox.x + ctaBox.width / 2).toBeGreaterThan(720);
  await page.getByRole("link", { name: "Démarrer mon projet" }).click();
  await expect(page.locator("main h1")).toHaveText(
    "Choisissez ce que nous allons créer.",
  );
  await expect(page.locator(".product-card")).toHaveCount(1);
  await expect(page.locator(".carousel-dots button")).toHaveCount(4);
  for (const [index, title] of [
    [0, "Sites web"],
    [1, "Applications"],
    [2, "Logos"],
    [3, "Publicité"],
  ] as const) {
    await expect(page.locator(".product-card h2")).toHaveText(title);
    if (index < 3)
      await page.getByRole("button", { name: "Produit suivant" }).click();
  }
  await page.getByRole("button", { name: "Produit précédent" }).click();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator(".product-card h2")).toHaveText("Publicité");
  await page.getByRole("button", { name: "Sélectionner ce produit" }).click();
  await expect(page.getByRole("button", { name: "Produit sélectionné" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await shot(page, "catalogue-desktop", true);
});
test("Publicité : carte, reflets au survol et captures desktop/mobile", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/#/catalogue");
  await page.getByRole("button", { name: "Afficher Publicité" }).click();
  await expect(page.locator(".product-card h2")).toHaveText("Publicité");
  await expect(page.locator(".product-process li")).toHaveCount(5);
  await expect(page.locator(".product-disclaimer")).toContainText("Ni réalisation FORMA ni affiliation");
  await page.locator(".product-card").hover({ position: { x: 250, y: 250 } });
  await page.waitForTimeout(450);
  expect(await page.locator(".product-card").evaluate((el) => getComputedStyle(el).transform)).not.toBe("none");
  await shot(page, "carousel-publicite-desktop", true);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/catalogue");
  await page.getByRole("button", { name: "Afficher Publicité" }).click();
  await expect(page.locator(".product-card h2")).toHaveText("Publicité");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await shot(page, "carousel-publicite-mobile", true);
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
    await expect.poll(() => image.evaluate((e) => (e as HTMLImageElement).naturalWidth)).toBeGreaterThan(1000);
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
test("espace client original restauré depuis le bundle vérifié", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/#/connexion");
  const client = page.frameLocator(".spec-original-login iframe");
  await expect(client.locator(".client-login__scene canvas")).toBeVisible({
    timeout: 20000,
  });
  await expect(client.locator(".access-form input[type=email]")).toBeAttached();
  await expect(client.locator(".access-form input[type=password]")).toBeAttached();
  await expect(client.locator(".client-login__copy h1")).toBeVisible();
  await expect(client.locator(".forma-oauth__button")).toHaveCount(3);
  expect(await client.locator(".forma-oauth__button").evaluateAll((buttons) => buttons.every((button) => (button as HTMLButtonElement).disabled))).toBe(true);
  await expect(client.locator(".forma-oauth__status")).toHaveText("Connexion rapide non configurée.");
  await expect(client.locator(".client-login__gravity-label")).toContainText(
    "DRAG / RELEASE",
  );
  const box = (await client.locator(".client-login__scene canvas").boundingBox())!;
  const root = client.locator("html");
  let grabbed: { x: number; y: number } | null = null;
  for (const fx of [0.2, 0.35, 0.5, 0.65, 0.8]) {
    for (const fy of [0.25, 0.4, 0.55, 0.7]) {
      const point = { x: box.x + box.width * fx, y: box.y + box.height * fy };
      await page.mouse.move(point.x, point.y);
      if (await root.evaluate((el) => (el as HTMLElement).style.cursor) === "grab") {
        grabbed = point;
        break;
      }
    }
    if (grabbed) break;
  }
  expect(grabbed).not.toBeNull();
  await page.mouse.down();
  await page.mouse.move(grabbed!.x + 28, grabbed!.y + 18, { steps: 4 });
  await expect(root).toHaveClass(/dragging-forma-piece/);
  await page.mouse.up();
  await expect(root).not.toHaveClass(/dragging-forma-piece/);
  await shot(page, "connexion-desktop");
  await expect(client.locator(".client-login__meta")).toBeHidden();
  await expect(client.locator(".topbar")).toBeHidden();
  await expect(client.locator(".access-form")).toBeVisible();
  await expect(page.locator(".spec-header")).toHaveCount(1);
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
      "publicite",
      "choix-site",
      "contact",
      "connexion",
      "confidentialite",
      "legal",
    ]) {
      await page.goto("/#/" + route);
      if (route === "connexion") {
        await expect(page.locator(".spec-original-login iframe")).toBeVisible();
      } else {
        await expect(page.locator("main h1")).toBeVisible();
      }
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
test("mobile tactile, carrousel et réduction des animations", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:5174/#/connexion");
  const client = page.frameLocator(".spec-original-login iframe");
  const canvas = client.locator(".client-login__scene canvas");
  await expect(canvas).toBeVisible({ timeout: 20000 });
  await expect(client.locator(".access-form input[type=email]")).toBeAttached();
  await expect(client.locator(".forma-oauth__button")).toHaveCount(3);
  const mobileEmail = await client.locator(".access-form input[type=email]").boundingBox();
  expect(mobileEmail).not.toBeNull();
  expect(mobileEmail!.y).toBeLessThan(844);
  await shot(page, "connexion-mobile", true);

  await page.goto("http://127.0.0.1:5174/#/catalogue");
  const touch = await context.newCDPSession(page);
  const box = (await page.locator(".product-card").boundingBox())!;
  const x = box.x + box.width * 0.75,
    y = box.y + box.height * 0.55;
  await touch.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x, y, id: 1 }],
  });
  await touch.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: x - 110, y: y + 4, id: 1 }],
  });
  await touch.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect(page.locator(".product-card h2")).toHaveText("Applications");
  await page.getByRole("button", { name: "Sélectionner ce produit" }).click();
  await expect(page.getByRole("button", { name: "Produit sélectionné" })).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("http://127.0.0.1:5174/#/options");
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
  await expect(page.locator(".spec-footer a")).toHaveCount(6);
  for (const route of ["client", "realisations", "tarifs", "faq", "reseaux"]) {
    await page.goto("/#/" + route);
    await expect(page.locator(".spec-intro")).toBeVisible();
    await expect(page.locator("main h1")).toHaveText(
      "Donnez forme à l’impossible",
    );
  }
});
