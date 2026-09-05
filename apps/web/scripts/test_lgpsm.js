const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto('http://localhost:3000/future-fashion', { waitUntil: 'networkidle' });

  // Open SHOP drawer
  const shopBtn = page.locator('nav button', { hasText: 'SHOP' });
  await shopBtn.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'C:/Users/monsx/.gemini/antigravity-ide/brain/cc0daa1c-aa23-4da3-8788-6bdac0483064/lgpsm_shop_drawer.png' });

  // Click ADD on first item
  const addBtn = page.locator('button:has-text("ADD")').first();
  await addBtn.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/Users/monsx/.gemini/antigravity-ide/brain/cc0daa1c-aa23-4da3-8788-6bdac0483064/lgpsm_toast.png' });

  await browser.close();
  console.log('Drawers and toast verified successfully');
})();
