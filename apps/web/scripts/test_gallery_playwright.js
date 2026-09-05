const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://localhost:3000/gallery', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  // Ensure we are at scroll position 0
  await page.evaluate(() => window.scrollTo(0, 0));
  
  // Screenshot 1: Rings
  await page.screenshot({ path: 'gallery_view_01_rings.png' });
  console.log('Saved: gallery_view_01_rings.png');
  
  // Click Next via JS to avoid page scrolling
  await page.evaluate(() => document.querySelector('button[aria-label="Next Item"]')?.click());
  await page.waitForTimeout(800);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: 'gallery_view_02_necklace.png' });
  console.log('Saved: gallery_view_02_necklace.png');
  
  // Click Next
  await page.evaluate(() => document.querySelector('button[aria-label="Next Item"]')?.click());
  await page.waitForTimeout(800);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: 'gallery_view_03_earrings.png' });
  console.log('Saved: gallery_view_03_earrings.png');
  
  // Click Next
  await page.evaluate(() => document.querySelector('button[aria-label="Next Item"]')?.click());
  await page.waitForTimeout(800);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: 'gallery_view_04_bangles.png' });
  console.log('Saved: gallery_view_04_bangles.png');
  
  await browser.close();
  console.log('Playwright captures completed successfully!');
})();
