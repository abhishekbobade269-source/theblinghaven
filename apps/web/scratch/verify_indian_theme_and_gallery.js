const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log('1. Testing Homepage Banner and Curated Rail...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Take screenshot of InteractiveGalleryBanner
  const galleryBanner = page.locator('section:has-text("Shahi Jewellery Gallery")');
  if (await galleryBanner.count() > 0) {
    await galleryBanner.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await galleryBanner.screenshot({ path: path.join(__dirname, 'homepage_gallery_banner.png') });
    console.log('Captured homepage_gallery_banner.png');
  } else {
    console.log('Could not find Shahi Jewellery Gallery banner element');
  }

  // Take screenshot of CuratedCollectionRail
  const curatedRail = page.locator('section:has-text("Featured Creations")');
  if (await curatedRail.count() > 0) {
    await curatedRail.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await curatedRail.screenshot({ path: path.join(__dirname, 'homepage_curated_rail.png') });
    console.log('Captured homepage_curated_rail.png');
  }

  console.log('2. Testing /gallery full screen & watermark coverage...');
  await page.goto('http://localhost:3000/gallery', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  // Capture full Section 1 video mode
  await page.screenshot({ path: path.join(__dirname, 'gallery_section1_video_fullscreen.png') });
  console.log('Captured gallery_section1_video_fullscreen.png');

  // Switch to Pinpoints mode
  const pinpointsBtn = page.getByRole('button', { name: /INSPECT LOOK/i });
  if (await pinpointsBtn.count() > 0) {
    await pinpointsBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(__dirname, 'gallery_section1_pinpoints_fullscreen.png') });
    console.log('Captured gallery_section1_pinpoints_fullscreen.png');
  }

  // Scroll to Section 2 (Orbit Showcase)
  const scrollCue = page.getByText(/SCROLL DOWN TO EXPLORE GALLERY/i);
  if (await scrollCue.count() > 0) {
    await scrollCue.click();
  } else {
    await page.evaluate(() => {
      document.getElementById('3d-orbit-showcase')?.scrollIntoView({ behavior: 'smooth' });
    });
  }
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(__dirname, 'gallery_section2_orbit_fullscreen.png') });
  console.log('Captured gallery_section2_orbit_fullscreen.png');

  await browser.close();
  console.log('Verification finished successfully!');
})();
