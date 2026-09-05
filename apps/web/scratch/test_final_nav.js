const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/gallery', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const exactStyle = 'background: linear-gradient(180deg, rgba(22, 16, 10, 0.88) 0%, rgba(16, 12, 8, 0.80) 100%); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border-bottom: 1px solid rgba(245, 158, 11, 0.3); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(251, 191, 36, 0.25);';

  await page.evaluate((css) => {
    const h = document.querySelector('header');
    if (h) h.style = css;
  }, exactStyle);

  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join('apps/web/scratch', 'final_nav_at_top.png') });
  console.log('Saved final_nav_at_top.png');

  await page.evaluate(() => window.scrollBy(0, 300));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join('apps/web/scratch', 'final_nav_at_scrolled.png') });
  console.log('Saved final_nav_at_scrolled.png');

  await browser.close();
})();
