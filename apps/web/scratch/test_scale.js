const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body style="margin:0; background:black; overflow:hidden;">
        <video src="http://localhost:3000/gallery/model_royal_jewelry_video.mp4" autoplay muted loop 
          style="width:100vw; height:100vh; object-fit:cover; transform:scale(1.04); transform-origin:bottom right;">
        </video>
      </body>
    </html>
  `);
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(__dirname, 'scaled_video_test.png') });
  await browser.close();
  console.log('captured scaled');
})();
