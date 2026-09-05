const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/gallery', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Scroll directly into Section 2
  await page.evaluate(() => {
    document.getElementById('3d-orbit-showcase')?.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(1000);

  // Take screenshot of first item (ANGOOTHI)
  await page.screenshot({ path: path.join('apps/web/scratch', 'orbit_3d_angPosition.png') });
  console.log('Saved orbit_3d_angPosition.png');

  // Click Next arrow to go to CHOKER (the user's screenshot item)
  const nextBtn = page.getByRole('button', { name: 'Next Item' });
  if (await nextBtn.count() > 0) {
    await nextBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join('apps/web/scratch', 'orbit_3d_choker_overlapping.png') });
    console.log('Saved orbit_3d_choker_overlapping.png');
  }

  await browser.close();
})();
