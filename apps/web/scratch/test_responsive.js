const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();

  const viewports = [
    { name: 'desktop_1920x1080', width: 1920, height: 1080 },
    { name: 'laptop_1366x768', width: 1366, height: 768 },
    { name: 'zoomed_150_laptop', width: 1024, height: 640 }, // represents 150% zoom on 1536x960
    { name: 'tablet_ipad_768x1024', width: 768, height: 1024 },
    { name: 'mobile_390x844', width: 390, height: 844 },
  ];

  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();
    await page.goto('http://localhost:3000/gallery', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    
    // Screenshot section 1
    await page.screenshot({ path: path.join('apps/web/scratch', `resp_sec1_${vp.name}.png`) });

    // Scroll to section 2
    await page.evaluate(() => {
      document.getElementById('3d-orbit-showcase')?.scrollIntoView({ behavior: 'instant' });
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join('apps/web/scratch', `resp_sec2_${vp.name}.png`) });

    await context.close();
    console.log('Tested', vp.name);
  }

  await browser.close();
})();
