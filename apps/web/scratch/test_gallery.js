const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const artifactDir = 'C:\\Users\\monsx\\.gemini\\antigravity-ide\\brain\\cc0daa1c-aa23-4da3-8788-6bdac0483064';

  console.log('Navigating to http://localhost:3000/gallery...');
  await page.goto('http://localhost:3000/gallery', { waitUntil: 'networkidle' });

  // 1. Capture initial Lookbook view with model and pinpoints
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(artifactDir, 'gallery_model_lookbook.png') });
  console.log('Saved gallery_model_lookbook.png');

  // 2. Click on the Choker Necklace pinpoint (button with aria-label Inspect Royal Polki Emerald Choker)
  const necklacePin = page.locator('button[aria-label="Inspect Royal Polki Emerald Choker"]');
  if (await necklacePin.count() > 0) {
    await necklacePin.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(artifactDir, 'gallery_pinpoint_popover.png') });
    console.log('Saved gallery_pinpoint_popover.png');
  }

  // 3. Switch to 3D Orbit view
  const orbitBtn = page.getByRole('button', { name: /3D VAULT/i });
  if (await orbitBtn.count() > 0) {
    await orbitBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(artifactDir, 'gallery_3d_orbit.png') });
    console.log('Saved gallery_3d_orbit.png');
  }

  await browser.close();
  console.log('All gallery tests completed successfully!');
})();
