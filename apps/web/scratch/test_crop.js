const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const artifactDir = 'C:\\Users\\monsx\\.gemini\\antigravity-ide\\brain\\cc0daa1c-aa23-4da3-8788-6bdac0483064';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <body style="margin:0; background:#12100e; display:flex; justify-content:center; align-items:center; height:100vh;">
        <div style="position:relative; width:900px; height:506px; border-radius:16px; overflow:hidden; border:1px solid rgba(212,175,55,0.3); box-shadow:0 30px 60px rgba(0,0,0,0.8);">
          <!-- Video with scale to completely eliminate bottom-right watermark -->
          <div style="width:100%; height:100%; overflow:hidden;">
            <video src="http://localhost:3000/gallery/model_royal_jewelry_video.mp4" autoplay muted loop playsinline
              style="width:100%; height:100%; object-fit:cover; transform:scale(1.09) translate(-1%, -1.5%); transform-origin:center center;">
            </video>
          </div>
          <!-- Luxury bottom vignette -->
          <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%); pointer-events:none;"></div>
          <!-- Hallmark stamp at bottom right replacing watermark area -->
          <div style="position:absolute; bottom:16px; right:20px; font-family:sans-serif; font-size:10px; font-weight:bold; letter-spacing:0.18em; color:rgba(255,215,0,0.8); text-transform:uppercase; background:rgba(0,0,0,0.4); backdrop-filter:blur(8px); padding:4px 10px; border-radius:999px; border:1px solid rgba(255,215,0,0.3);">
            ★ THE BLING HAVEN ATELIER
          </div>
        </div>
      </body>
    </html>
  `;
  await page.setContent(htmlContent);
  await page.waitForTimeout(2000);

  await page.screenshot({ path: path.join(artifactDir, 'video_cropped_clean.png') });
  console.log('Saved video_cropped_clean.png');

  await browser.close();
})();
