const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const artifactDir = 'C:\\Users\\monsx\\.gemini\\antigravity-ide\\brain\\cc0daa1c-aa23-4da3-8788-6bdac0483064';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <body style="margin:0; background:#000; display:flex; justify-content:center; align-items:center; height:100vh;">
        <video id="vid" src="http://localhost:3000/gallery/model_royal_jewelry_video.mp4" autoplay muted loop playsinline style="max-width:100%; max-height:100%;"></video>
      </body>
    </html>
  `;
  await page.setContent(htmlContent);
  await page.waitForTimeout(2000);

  await page.screenshot({ path: path.join(artifactDir, 'video_raw_frame.png') });
  console.log('Saved video_raw_frame.png');

  await browser.close();
})();
