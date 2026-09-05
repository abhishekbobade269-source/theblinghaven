const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const artifactDir = 'C:\\Users\\monsx\\.gemini\\antigravity-ide\\brain\\cc0daa1c-aa23-4da3-8788-6bdac0483064';

  console.log('Navigating to http://localhost:3000/gallery...');
  await page.goto('http://localhost:3000/gallery', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // 1. Screenshot of Fullscreen Section 1 in Video Mode
  await page.screenshot({ path: path.join(artifactDir, 'gallery_fullscreen_video_mode.png') });
  console.log('Saved gallery_fullscreen_video_mode.png');

  // 2. Click "PINPOINTS" button to switch to fullscreen interactive still view
  const pinpointsBtn = page.locator('button[aria-label="View Interactive Jewelry Radar Pinpoints"]');
  if (await pinpointsBtn.count() > 0) {
    await pinpointsBtn.click();
    await page.waitForTimeout(1000);

    // Hover over the necklace pinpoint
    const necklacePin = page.locator('button[aria-label="Inspect Royal Polki Emerald Choker"]');
    if (await necklacePin.count() > 0) {
      await necklacePin.hover();
      await page.waitForTimeout(600);
    }

    await page.screenshot({ path: path.join(artifactDir, 'gallery_fullscreen_pinpoints_mode.png') });
    console.log('Saved gallery_fullscreen_pinpoints_mode.png');
  }

  // 3. Scroll to Section 2 (3D Orbit) below Section 1
  const orbitSection = page.locator('[id="3d-orbit-showcase"]');
  if (await orbitSection.count() > 0) {
    await orbitSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(artifactDir, 'gallery_section2_orbit_scrolled.png') });
    console.log('Saved gallery_section2_orbit_scrolled.png');
  }

  await browser.close();
  console.log('All screenshots completed successfully!');
})();
