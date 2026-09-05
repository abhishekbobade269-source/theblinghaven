const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/gallery', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const styles = [
    {
      name: 'current',
      css: 'background: rgba(0,0,0,0.3); backdrop-filter: blur(24px); border-bottom: 1px solid rgba(255,255,255,0.1);'
    },
    {
      name: 'warm_golden_glass_1',
      css: 'background: linear-gradient(180deg, rgba(20, 15, 10, 0.78) 0%, rgba(14, 10, 7, 0.70) 100%); backdrop-filter: blur(24px); border-bottom: 1px solid rgba(245, 158, 11, 0.28); box-shadow: 0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(251, 191, 36, 0.22);'
    },
    {
      name: 'warm_golden_glass_2',
      css: 'background: linear-gradient(180deg, rgba(24, 17, 11, 0.85) 0%, rgba(15, 11, 7, 0.75) 100%); backdrop-filter: blur(24px); border-bottom: 1px solid rgba(217, 119, 6, 0.35); box-shadow: 0 10px 36px rgba(0,0,0,0.7), inset 0 1px 0 rgba(245, 158, 11, 0.3);'
    },
    {
      name: 'warm_golden_glass_emerald',
      css: 'background: linear-gradient(180deg, rgba(12, 18, 14, 0.82) 0%, rgba(18, 14, 10, 0.75) 100%); backdrop-filter: blur(24px); border-bottom: 1px solid rgba(245, 158, 11, 0.28); box-shadow: 0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(251, 191, 36, 0.22);'
    }
  ];

  for (const s of styles) {
    await page.evaluate((css) => {
      const header = document.querySelector('header');
      if (header) {
        header.style = css;
      }
    }, s.css);
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join('apps/web/scratch', `test_nav_${s.name}.png`) });
    console.log('Captured', s.name);
  }

  await browser.close();
})();
