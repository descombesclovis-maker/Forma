import { chromium } from "@playwright/test";
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const examples = [
  ["onepage", "https://todomvc.com/"],
  ["vitrine", "https://getbootstrap.com/"],
  ["ecommerce", "https://next.medusajs.com/"],
  ["logiciel", "https://excalidraw.com/"],
];
for (const [id, url] of examples) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 25000 });
    await page.waitForTimeout(4500);
    const title = await page.title();
    if (/404|not found/i.test(title))
      throw Error("Source indisponible : " + title);
    console.log(id, title, page.url());
    if (id === "ecommerce") {
      await page.evaluate(() => scrollTo(0, 850));
      await page.waitForTimeout(1000);
    }
    if (id === "logiciel") {
      for (const [x1, y1, x2, y2] of [
        [550, 250, 630, 740],
        [610, 250, 920, 330],
        [610, 450, 850, 530],
      ]) {
        await page.keyboard.press("r");
        await page.mouse.move(x1, y1);
        await page.mouse.down();
        await page.mouse.move(x2, y2, { steps: 12 });
        await page.mouse.up();
      }
      await page.keyboard.press("Escape");
    }
    await page.screenshot({
      path: `public/examples/${id}.png`,
      timeout: 15000,
    });
  } catch (e) {
    console.log(id, "FAILED", e.message);
  }
  await page.close();
}
await browser.close();
