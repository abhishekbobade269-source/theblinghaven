const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log('Testing /gallery...');
  await page.goto('http://localhost:3000/gallery', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(__dirname, 'nav_gallery.png') });

  console.log('Testing Home / ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(__dirname, 'nav_home.png') });

  console.log('Testing /collections ...');
  await page.goto('http://localhost:3000/collections', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(__dirname, 'nav_collections.png') });

  console.log('Testing /ai-assistant ...');
  await page.goto('http://localhost:3000/ai-assistant', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(__dirname, 'nav_ai_assistant.png') });

  await browser.close();
  console.log('Done!');
})();
