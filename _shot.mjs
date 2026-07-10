import { chromium } from "playwright";

const base = "http://localhost:3001";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

async function go(path) {
  await page.goto(base + path, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1400);
}

// Demo — dark (default)
await go("/theme/filament-amber");
await page.screenshot({ path: "/tmp/demo-dark.png" });

// Demo — light
await page.getByRole("button", { name: "Light" }).click();
await page.waitForTimeout(900);
await page.screenshot({ path: "/tmp/demo-light.png" });

// CSS dialog
await page.getByRole("button", { name: "View theme CSS" }).click();
await page.waitForTimeout(700);
await page.screenshot({ path: "/tmp/demo-css.png" });

// Index
await go("/theme");
await page.screenshot({ path: "/tmp/index.png" });

// Mobile demo
await page.setViewportSize({ width: 390, height: 844 });
await go("/theme/filament-amber");
await page.screenshot({ path: "/tmp/demo-mobile.png" });

await browser.close();
console.log("done");
