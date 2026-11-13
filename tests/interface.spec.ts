import { test, expect } from "@playwright/test";
test("configuration, modification, sauvegarde et devis sans transmission", async ({
  page,
}) => {
  await page.goto("/#/sites");
  await expect(
    page.getByRole("heading", { name: "Une présence. Une différence." }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Configurer cette offre" })
    .nth(3)
    .click();
  await expect(page.locator(".estimate")).toContainText("1 990");
  await page.getByRole("button", { name: "Valider et continuer" }).click();
  await page.getByRole("button", { name: "Valider et continuer" }).click();
  await expect(page.getByRole("alert")).toContainText("Indiquez");
  await page.getByLabel("Nom du projet").fill("Atelier Test");
  await page.getByRole("button", { name: "Valider et continuer" }).click();
  await page.getByRole("button", { name: "Valider et continuer" }).click();
  await page.getByLabel("Version multilingue").check();
  await expect(page.locator(".estimate")).toContainText(
    "Total final sur devis",
  );
  await page.getByRole("button", { name: "Valider et continuer" }).click();
  await page
    .getByRole("button", { name: "Conserver ma configuration" })
    .click();
  await expect(page.getByRole("status")).toContainText("enregistrée");
  await page.getByRole("button", { name: /01.*Premium.*Modifier/ }).click();
  await page.getByRole("button", { name: /One Page/ }).click();
  await expect(page.locator(".estimate")).toContainText("590");
  await page.getByRole("button", { name: "Valider et continuer" }).click();
  await expect(page.getByLabel("Nom du projet")).toHaveValue("Atelier Test");
  await page.goto("/#/contact");
  await page.getByLabel("Votre nom").fill("Test");
  await page.getByLabel("Votre adresse email").fill("test@example.org");
  await page
    .getByLabel("Votre projet", { exact: true })
    .fill("Un site vitrine pour notre atelier.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Relire ma demande" }).click();
  await expect(
    page.getByText("DEMANDE PRÉPARÉE / NON ENVOYÉE", { exact: false }),
  ).toBeVisible();
  const dl = page.waitForEvent("download");
  await page.getByRole("button", { name: "Télécharger ma demande" }).click();
  expect((await dl).suggestedFilename()).toBe("demande-forma.txt");
});
test("galerie, clavier, client et toutes les routes", async ({ page }) => {
  await page.goto("/#/realisations");
  await page.getByRole("button", { name: "Identités", exact: true }).click();
  await expect(page.locator(".demo-card")).toHaveCount(1);
  await page.locator(".demo-card").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Téléphone", exact: true }).click();
  await expect(page.locator(".device-preview")).toHaveClass(/Téléphone/);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  for (const route of [
    "univers",
    "sites",
    "tarifs",
    "logiciels",
    "identites",
    "reseaux",
    "contact",
    "client",
    "apropos",
    "methode",
    "faq",
    "legal",
    "confidentialite",
    "conditions",
  ]) {
    await page.goto("/#/" + route);
    await expect(page.locator("main h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.goto("/#/client");
  await page.getByLabel("Email", { exact: true }).fill("test@example.org");
  await page.getByRole("button", { name: "Vérifier la disponibilité" }).click();
  await expect(page.getByRole("status")).toContainText("Service non connecté");
  await page.getByRole("button", { name: "Documents", exact: true }).click();
  await expect(page.locator(".empty-state")).toContainText("devis et factures");
});
test("mobile : navigation et absence de débordement", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [
    "univers",
    "sites",
    "configurer",
    "logiciels",
    "identites",
    "reseaux",
    "realisations",
    "contact",
    "client",
    "tarifs",
  ]) {
    await page.goto("/#/" + route);
    await expect(page.locator("main h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      route,
    ).toBe(true);
  }
  await page.getByRole("button", { name: "Ouvrir le menu" }).click();
  await page
    .getByRole("navigation", { name: "Toutes les rubriques" })
    .getByRole("link", { name: /Contact/ })
    .click();
  await expect(page.locator("main h1")).toContainText("Tout commence");
  await page.waitForTimeout(700);
  await page.screenshot({
    path: "artifacts/contact-mobile.png",
    fullPage: true,
  });
});
test("archive et accueil : F WebGL, scroll réversible et logo conservés", async ({
  page,
}) => {
  test.setTimeout(120000);
  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    for (const url of ["/?reference=original", "/"]) {
      await page.goto(url, { waitUntil: "domcontentloaded" });
      const f = page.frameLocator("iframe");
      await expect(f.locator(".build-scene-wrap")).toBeAttached();
      await page.waitForTimeout(5000);
      const scene = f.locator(".build-scene-wrap");
      await scene.evaluate((e) => {
        const section = e.closest("section")!;
        window.scrollTo(
          0,
          section.getBoundingClientRect().top +
            window.scrollY +
            (section.offsetHeight - window.innerHeight) * 0.65,
        );
      });
      await page.waitForTimeout(1200);
      await expect(f.locator("canvas").first()).toBeVisible();
      await expect(scene).toHaveCSS("opacity", "1");
      await page.screenshot({
        path: `artifacts/${url === "/" ? "catalogue" : "reference"}-f-${viewport.width}.png`,
      });
      const logo = f
        .locator(".forma-logo--mini.forma-logo--interactive")
        .first();
      await expect(logo).toBeAttached();
      await logo.hover({ force: true });
      await f.locator("body").evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);
      await expect(scene).toHaveCSS("opacity", "0");
    }
  }
});
test("continuité catalogue vers devis et navigation depuis le véritable accueil", async ({
  page,
}) => {
  await page.goto("/#/sites");
  await page.getByRole("link", { name: "Demander un devis" }).nth(3).click();
  await expect(page.locator(".request-summary")).toContainText("Premium");
  await page.goto("/#/logiciels");
  await page
    .getByRole("link", { name: "Parler de mon besoin" })
    .first()
    .click();
  await expect(page.getByLabel("Votre prestation")).toHaveValue(
    "Logiciels & applications",
  );
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page
    .frameLocator("iframe")
    .getByRole("button", { name: "Sites web", exact: true })
    .first()
    .click();
  await expect(page.locator("main h1")).toContainText("Une présence");
});
