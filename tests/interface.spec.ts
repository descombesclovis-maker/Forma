import { test, expect, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const capture = async (page: Page, name: string, fullPage = false) => {
  await mkdir("test-results/captures", { recursive: true });
  await page.screenshot({ path: `test-results/captures/${name}.png`, fullPage });
};

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Donnez forme à l’impossible" })).toBeVisible();
});

test("vitrine, engagements, scène 3D originale et CTA", async ({ page }) => {
  await expect(page.getByRole("list", { name: "Nos engagements" }).getByRole("listitem")).toHaveCount(3);
  await expect(page.getByText("Scrollez pour voir la suite")).toBeVisible();
  await page.locator(".spec-build").scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator(".spec-build").getAttribute("data-ready")).toBe("true");
  const range = await page.evaluate(() => {
    const i = document.querySelector<HTMLElement>(".spec-intro")!;
    const b = document.querySelector<HTMLElement>(".spec-build")!;
    return (i.offsetHeight + b.offsetHeight - innerHeight) * .985;
  });
  await page.evaluate(y => scrollTo(0, y), range);
  await expect(page.locator(".spec-build-cta")).toBeVisible();
  await expect(page.frameLocator(".spec-build-frame").locator("canvas").first()).toBeVisible();
  await expect(page.locator(".spec-build-cta")).toHaveAttribute("href", "#contact");
  await capture(page, "vitrine-accueil-desktop");
  await capture(page, "vitrine-grand-f-contact-desktop");
});

test("menu trois destinations, sans connexion client, navigation interne", async ({ page }) => {
  await expect(page.getByRole("button", { name: /connexion|espace client/i })).toHaveCount(0);
  await page.getByRole("button", { name: "Ouvrir le menu" }).click();
  const menu = page.getByRole("navigation", { name: "Navigation principale" });
  await expect(menu.getByRole("link")).toHaveText(["Accueil", "Nos réalisations", "Contact"]);
  await menu.getByRole("link", { name: "Nos réalisations" }).click();
  await expect(page).toHaveURL(/#realisations$/);
  await expect(page.locator("#realisations")).toBeInViewport();
});

test("portfolio vide sincère, aucune offre ou marque fictive", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Nos réalisations" })).toBeVisible();
  await expect(page.locator(".portfolio-empty")).toBeVisible();
  await expect(page.getByText(/Tesla|Nike|McDonald|ChatGPT/)).toHaveCount(0);
  await expect(page.getByText(/Commander|Prix|Paiement|Catalogue/i)).toHaveCount(0);
  await capture(page, "vitrine-realisations-desktop");
});

test("contact: validation réelle et aucun faux envoi sans backend", async ({ page }) => {
  const form = page.locator(".contact-form");
  await page.locator("#contact-name").fill("Test FORMA");
  await page.locator("#contact-email").fill("contact@example.com");
  await page.locator("#contact-subject").fill("Projet de test");
  await page.locator("#contact-message").fill("Un message de test.");
  await page.getByRole("button", { name: "Envoyer mon message" }).click();
  await expect(page.locator(".contact-feedback")).toContainText("Votre message n’a pas été envoyé");
  await expect(page.locator(".contact-setup-note")).toContainText("ne transmet pas les données");
  await expect(page.locator("#contact-name")).toHaveValue("Test FORMA");
  await capture(page, "vitrine-contact-mobile", true);
});

test("grille continue, mode tactile, F et CTA mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(page.getByRole("heading", { name: "Donnez forme à l’impossible" })).toBeVisible();
  const range = await page.evaluate(() => {
    const i = document.querySelector<HTMLElement>(".spec-intro")!;
    const b = document.querySelector<HTMLElement>(".spec-build")!;
    return (i.offsetHeight + b.offsetHeight - innerHeight) * .985;
  });
  await page.evaluate(y => scrollTo(0, y), range);
  await expect(page.locator(".spec-build-cta")).toBeVisible();
  await expect(page.frameLocator(".spec-build-frame").locator("canvas").first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await capture(page, "vitrine-grand-f-mobile");
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(page.locator("#contact-name")).toBeVisible();
});

test("anciennes routes et anciens hash reviennent proprement à la vitrine", async ({ page }) => {
  await page.goto("/catalogue");
  await expect(page.getByRole("heading", { name: "Donnez forme à l’impossible" })).toBeVisible();
  await page.goto("/#/connexion");
  await expect(page.getByRole("heading", { name: "Donnez forme à l’impossible" })).toBeVisible();
  await expect(page).toHaveURL(/#accueil$/);
});
