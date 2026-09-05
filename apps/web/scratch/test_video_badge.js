const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const artifactDir = 'C:\\Users\\monsx\\.gemini\\antigravity-ide\\brain\\cc0daa1c-aa23-4da3-8788-6bdac0483064';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <body style="margin:0; background:#1C1510; display:flex; justify-content:center; align-items:center; height:100vh; font-family:sans-serif;">
        <div style="position:relative; width:920px; height:518px; border-radius:20px; overflow:hidden; border:1px solid rgba(212,175,55,0.35); box-shadow:0 35px 80px rgba(0,0,0,0.9);">
          <!-- Video with tiny 1.03 scale to move edges nicely -->
          <div style="width:100%; height:100%; overflow:hidden;">
            <video src="http://localhost:3000/gallery/model_royal_jewelry_video.mp4" autoplay muted loop playsinline
              style="width:100%; height:100%; object-fit:cover; transform:scale(1.03) translate(-0.5%, -0.5%); transform-origin:center center;">
            </video>
          </div>

          <!-- Subtle bottom cinematic vignette gradient -->
          <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(10,8,6,0.6) 0%, transparent 45%); pointer-events:none;"></div>

          <!-- Luxury Haute Joaillerie Atelier Badge covering watermark completely -->
          <div style="position:absolute; bottom:40px; right:28px; z-index:30; display:flex; align-items:center; gap:12px; padding:14px 22px; border-radius:16px; background:rgba(12,10,8,0.95); backdrop-filter:blur(24px); border:1px solid rgba(245,158,11,0.55); box-shadow:0 20px 40px rgba(0,0,0,0.95); min-width:260px;">
            <div style="width:38px; height:38px; border-radius:50%; background:linear-gradient(135deg, #f59e0b, #b45309); display:flex; align-items:center; justify-content:center; color:#000; font-size:18px; font-weight:bold; box-shadow:0 0 16px rgba(245,158,11,0.6); flex-shrink:0;">
              ✦
            </div>
            <div>
              <div style="font-size:10px; font-family:monospace; font-weight:bold; letter-spacing:0.2em; color:#fbbf24; text-transform:uppercase;">
                THE BLING HAVEN
              </div>
              <div style="font-size:12px; font-family:serif; color:#f3f4f6; font-weight:600; letter-spacing:0.03em;">
                8K Haute Joaillerie Motion
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
  await page.setContent(htmlContent);
  await page.waitForTimeout(2500);

  await page.screenshot({ path: path.join(artifactDir, 'video_watermark_test_coverage.png') });
  console.log('Saved video_watermark_test_coverage.png');
  await browser.close();
})();
