const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const artifactDir = 'C:\\Users\\monsx\\.gemini\\antigravity-ide\\brain\\cc0daa1c-aa23-4da3-8788-6bdac0483064';

  console.log('Navigating to http://localhost:3000/gallery...');
  await page.goto('http://localhost:3000/gallery', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Screenshot Section 1: Top Model Lookbook
  await page.screenshot({ path: path.join(artifactDir, 'gallery_section1_model_lookbook.png') });
  console.log('Saved gallery_section1_model_lookbook.png');

  // 2. Click on the Choker Necklace pinpoint
  const necklacePin = page.locator('button[aria-label="Inspect Royal Polki Emerald Choker"]');
  if (await necklacePin.count() > 0) {
    await necklacePin.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(artifactDir, 'gallery_section1_popover_clean.png') });
    console.log('Saved gallery_section1_popover_clean.png');

    // Click "Inspect in 3D Orbit ↓" from the popover
    const inspectBtn = page.getByRole('button', { name: /Inspect in 3D Orbit/i });
    if (await inspectBtn.count() > 0) {
      await inspectBtn.click();
      await page.waitForTimeout(1200);
      await page.screenshot({ path: path.join(artifactDir, 'gallery_section2_orbit_scrolled.png') });
      console.log('Saved gallery_section2_orbit_scrolled.png');
    }
  }

  // 3. Alternatively, test scrolling directly into #3d-orbit-showcase
  await page.evaluate(() => {
    document.getElementById('3d-orbit-showcase')?.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(artifactDir, 'gallery_section2_orbit_view.png') });
  console.log('Saved gallery_section2_orbit_view.png');

  await browser.close();
  console.log('Test completed successfully!');
})();
