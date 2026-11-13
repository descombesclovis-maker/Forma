import { test, expect, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const capture = async (page: Page, name: string, fullPage = false) => {
  await mkdir("test-results/captures", { recursive: true });
  await page.screenshot({ path: `test-results/captures/${name}.png`, fullPage });
};

const scrollToFEnd = async (page: Page) => {
  const range = await page.evaluate(() => {
    const intro = document.querySelector<HTMLElement>(".spec-intro")!;
    const build = document.querySelector<HTMLElement>(".spec-build")!;
    return intro.offsetHeight + build.offsetHeight - innerHeight;
  });
  await page.evaluate((y) => scrollTo({ top: y * .985, behavior: "instant" }), range);
  await page.waitForTimeout(120);
};

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Donnez forme à l’impossible" })).toBeVisible();
});

test("home, engagements, scroll controlled original F and four navigation buttons", async ({ page }) => {
  await expect(page.getByRole("list", { name: "Nos engagements" }).getByRole("listitem")).toHaveCount(3);
  await expect(page.getByText("Scrollez pour voir la suite")).toBeVisible();
  await expect(page.locator(".f-orbit-link")).toHaveCount(4);
  await expect(page.locator(".spec-build")).toHaveAttribute("data-ready", "true", { timeout: 25000 });
  await capture(page, "evolution-accueil-desktop");
  await page.evaluate(() => scrollTo({ top: 15, behavior: "instant" }));
  await expect.poll(() => page.locator(".spec-build").evaluate(el => parseFloat(getComputedStyle(el).getPropertyValue("--f-progress")))).toBeGreaterThan(0);
  await scrollToFEnd(page);
  await page.waitForTimeout(350);
  const assembled = await page.locator(".spec-build").evaluate(el => parseFloat(getComputedStyle(el).getPropertyValue("--f-progress")));
  expect(assembled).toBeGreaterThan(.95);
  await page.evaluate(() => scrollTo({ top: 20, behavior: "instant" }));
  await page.waitForTimeout(80);
  const reversed = await page.locator(".spec-build").evaluate(el => parseFloat(getComputedStyle(el).getPropertyValue("--f-progress")));
  expect(reversed).toBeLessThan(.1);
  await scrollToFEnd(page);
  await page.waitForTimeout(350);
  await expect(page.locator(".f-orbit-link--contact")).toBeVisible();
  for (const selector of [".f-orbit-link--price", ".f-orbit-link--services", ".f-orbit-link--process"]) await expect(page.locator(selector)).toBeVisible();
  await expect(page.frameLocator(".spec-build-frame").locator("canvas").first()).toBeVisible();
  await expect(page.locator(".f-orbit-link--contact")).toHaveAttribute("href", "/#contact");
  await capture(page, "evolution-grand-f-assemble-desktop");
});

test("header account access and seven destinations work", async ({ page }) => {
  await expect(page.getByRole("link", { name: "Accéder à l’espace client" })).toBeVisible();
  await page.getByRole("button", { name: "Ouvrir le menu" }).click();
  const menu = page.getByRole("navigation", { name: "Navigation principale" });
  await expect(menu.getByRole("link")).toHaveText(["Accueil", "Nos réalisations", "Nos services", "Comment ça marche ?", "Tarification", "Contact", "Espace client"]);
  await menu.getByRole("link", { name: "Nos services" }).click();
  await expect(page).toHaveURL(/\/nos-services$/);
  await expect(page.getByRole("heading", { name: "Vos idées. Notre savoir-faire." })).toBeVisible();
});

test("process, pricing and services pages contain requested content and contact CTAs", async ({ page }) => {
  await page.goto("/comment-ca-marche");
  await expect(page.getByRole("heading", { name: "De votre idée à sa réalisation." })).toBeVisible();
  await expect(page.getByRole("button", { name: "Échange" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Livraison" })).toBeVisible();
  await expect(page.locator(".info-process .info-cta")).toHaveAttribute("href", "/#contact");
  await capture(page, "evolution-process-desktop", true);
  await page.goto("/tarification");
  await expect(page.getByRole("heading", { name: "Chaque projet mérite sa juste mesure." })).toBeVisible();
  await expect(page.getByText("Sur devis")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Un prix adapté à votre ambition." })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Estimer le coût de votre site web" })).toBeVisible();
  await capture(page, "evolution-tarification-desktop", true);
  await page.goto("/nos-services");
  for (const name of ["Création de sites web", "Développement d’applications", "Création graphique", "Publicité numérique", "Production audiovisuelle", "Solutions numériques professionnelles"]) await expect(page.getByRole("heading", { name })).toBeVisible();
  await capture(page, "evolution-services-desktop", true);
  await page.getByRole("link", { name: /Discuter de ce service/ }).first().click();
  await expect(page).toHaveURL(/service=Sites%20vitrines/);
  await expect(page.locator("#contact-subject")).toHaveValue("Sites vitrines");
  await capture(page, "evolution-services-desktop");
});

test("original client bundle is restored and cannot fake authentication", async ({ page }) => {
  await page.goto("/espace-client");
  await expect(page.getByRole("link", { name: "Accéder à l’espace client" })).toBeVisible();
  const portal = page.frameLocator("iframe[title^='Espace client original']");
  await expect(portal.locator("canvas").first()).toBeVisible({ timeout: 25000 });
  await expect(portal.locator(".client-login__copy h1")).toContainText("Votre projet.");
  await expect(portal.locator(".access-form input[type=email]")).toBeVisible();
  await expect(portal.locator(".access-form input[type=email]")).toBeInViewport();
  await expect(portal.locator(".access-form button[type=submit]")).toBeDisabled();
  await expect(page.getByText(/authentification réelle n’est pas configurée/)).toBeVisible();
  for (const provider of ["Google", "Microsoft", "GitHub", "X"]) await expect(page.getByRole("button", { name: new RegExp(`Continuer avec ${provider}`) })).toBeDisabled();
  await capture(page, "evolution-espace-client-desktop", true);
});

test("portfolio remains empty and truthful", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Nos réalisations" })).toBeVisible();
  await expect(page.locator(".portfolio-empty")).toBeVisible();
  await expect(page.getByText(/Tesla|Nike|McDonald|ChatGPT/)).toHaveCount(0);
});

test("process accordions auto-open on scroll and respect manual toggles", async ({ page }) => {
  await page.goto("/comment-ca-marche");
  const exchange = page.getByRole("button", { name: "Échange" });
  await exchange.scrollIntoViewIfNeeded();
  await expect(exchange).toHaveAttribute("aria-expanded", "true");
  await exchange.click();
  await expect(exchange).toHaveAttribute("aria-expanded", "false");
  await exchange.click();
  await expect(exchange).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#step-detail-echange")).toContainText("Texte explicatif à personnaliser.");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(exchange).toBeVisible();
  await capture(page, "evolution-accordions-mobile", true);
});

test("pricing estimator calculates live, shows detail and passes summary to contact", async ({ page }) => {
  await page.goto("/tarification");
  await page.getByRole("button", { name: "Estimer le coût de votre site web" }).click();
  const dialog = page.locator(".estimator-dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("Quel produit vous intéresse ?").selectOption("vitrine-simple");
  await dialog.getByRole("checkbox", { name: "Inclure Formulaire de contact" }).check();
  await expect(dialog.locator(".estimator-live-total strong")).toHaveText("550 €");
  await dialog.getByRole("button", { name: "Ajouter Pages supplémentaires" }).click();
  await expect(dialog.locator(".estimator-live-total strong")).toHaveText("605 €");
  await dialog.getByLabel("Quel produit vous intéresse ?").selectOption("landing");
  await dialog.getByLabel("Quel produit vous intéresse ?").selectOption("vitrine-simple");
  await expect(dialog.locator(".estimator-live-total strong")).toHaveText("605 €");
  await capture(page, "evolution-estimate-configure-desktop");
  await page.setViewportSize({ width: 390, height: 844 });
  await capture(page, "evolution-estimate-configure-mobile");
  await dialog.getByRole("button", { name: "Voir le détail de l’estimation" }).click();
  await expect(page.getByRole("heading", { name: "Votre estimation." })).toBeVisible();
  await expect(dialog.locator(".estimator-result")).toContainText("605 €");
  await expect(dialog.locator(".estimator-result")).toContainText("Pages supplémentaires × 1 page");
  await page.getByRole("link", { name: "Discuter de ce projet" }).click();
  await expect(page).toHaveURL(/estimate=/);
  await expect(page.locator("#contact-subject")).toHaveValue("Estimation — Site vitrine simple");
  await expect(page.locator("#contact-message")).toContainText("Formulaire de contact : + 60 €");
  await expect(page.locator("#contact-message")).toContainText("605 €");
});

test("catalog examples open and close labelled conceptual previews", async ({ page }) => {
  await page.goto("/nos-services");
  await expect(page.locator(".service-catalog-row")).toHaveCount(30);
  const open = page.getByRole("button", { name: "Agrandir l’illustration : Sites vitrines" });
  await open.click();
  const dialog = page.getByRole("dialog", { name: "Sites vitrines" });
  await expect(dialog).toContainText("Illustration conceptuelle originale");
  await page.getByRole("button", { name: "Fermer l’aperçu" }).click();
  await expect(dialog).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".service-catalog-row").first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await capture(page, "evolution-service-catalog-mobile", true);
});

test("contact validation remains real; no false success without backend", async ({ page }) => {
  await page.locator("#contact-name").fill("Test FORMA");
  await page.locator("#contact-email").fill("contact@example.com");
  await page.locator("#contact-subject").fill("Projet de test");
  await page.locator("#contact-message").fill("Un message de test.");
  await page.getByRole("button", { name: "Envoyer mon message" }).click();
  await expect(page.locator(".contact-feedback")).toContainText("Votre message n’a pas été envoyé");
});

test("responsive F controls and all new pages on mobile without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(page.getByRole("heading", { name: "Donnez forme à l’impossible" })).toBeVisible();
  await capture(page, "evolution-accueil-mobile");
  await scrollToFEnd(page);
  await page.waitForTimeout(350);
  await expect(page.locator(".f-orbit-link--contact")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await capture(page, "evolution-grand-f-mobile");
  for (const route of ["/comment-ca-marche", "/tarification", "/nos-services", "/espace-client"]) {
    await page.goto(route);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true);
    await expect(page.getByRole("button", { name: "Ouvrir le menu" })).toBeVisible();
    if (route === "/comment-ca-marche") await capture(page, "evolution-process-mobile", true);
    if (route === "/tarification") await capture(page, "evolution-tarification-mobile", true);
    if (route === "/nos-services") await capture(page, "evolution-services-mobile", true);
    if (route === "/espace-client") {
      const portal = page.frameLocator("iframe[title^='Espace client original']");
      await expect(portal.locator(".client-login__copy h1")).toBeVisible();
      await expect(portal.locator(".access-form input[type=email]")).toBeVisible();
      await expect(portal.locator(".access-form input[type=email]")).toBeInViewport();
      await capture(page, "evolution-espace-client-mobile", true);
    }
  }
});

test("retired commercial routes redirect home; legacy client URLs reach the restored portal", async ({ page }) => {
  await page.goto("/catalogue");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { name: "Donnez forme à l’impossible" })).toBeVisible();
  await page.goto("/#/connexion");
  await expect(page).toHaveURL(/\/espace-client$/);
  await expect(page.getByText(/authentification réelle n’est pas configurée/)).toBeVisible();
  await page.goto("/connexion");
  await expect(page).toHaveURL(/\/espace-client$/);
});
