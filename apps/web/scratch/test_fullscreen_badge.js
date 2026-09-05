const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const artifactDir = 'C:\\Users\\monsx\\.gemini\\antigravity-ide\\brain\\cc0daa1c-aa23-4da3-8788-6bdac0483064';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
      </head>
      <body style="margin:0; padding:0; overflow:hidden; background:#000; font-family:'Plus Jakarta Sans', sans-serif;">
        <div style="position:relative; width:100vw; height:100vh; overflow:hidden;">
          <!-- Fullscreen Video -->
          <video src="http://localhost:3000/gallery/model_royal_jewelry_video.mp4" autoplay muted loop playsinline
            style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; transform:scale(1.02); transform-origin:center center;">
          </video>

          <!-- Subtle Cinema Gradients -->
          <div style="position:absolute; inset:0; background:linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 25%, transparent 70%, rgba(0,0,0,0.75) 100%); pointer-events:none;"></div>

          <!-- Top Header Overlay -->
          <div style="position:absolute; top:28px; left:40px; right:40px; display:flex; justify-content:space-between; align-items:center; z-index:30;">
            <div style="display:flex; align-items:center; gap:16px;">
              <span style="font-family:'Cinzel', serif; font-size:18px; font-weight:700; letter-spacing:0.2em; color:#fef3c7;">
                THE BLING HAVEN
              </span>
              <span style="padding:4px 12px; border-radius:999px; background:rgba(245,158,11,0.2); border:1px solid rgba(245,158,11,0.4); color:#fde68a; font-size:11px; font-family:monospace; font-weight:600;">
                ✦ 8K ROYAL CINEMATIC PROJECTION
              </span>
            </div>

            <!-- Switcher -->
            <div style="display:flex; align-items:center; background:rgba(0,0,0,0.65); backdrop-filter:blur(16px); border:1px solid rgba(245,158,11,0.4); border-radius:999px; padding:4px;">
              <button style="padding:6px 18px; border-radius:999px; border:none; background:linear-gradient(135deg, #f59e0b, #d97706); color:#000; font-size:11px; font-family:monospace; font-weight:800; cursor:pointer; letter-spacing:0.1em;">
                🎥 8K FILM
              </button>
              <button style="padding:6px 18px; border-radius:999px; border:none; background:transparent; color:#d1d5db; font-size:11px; font-family:monospace; font-weight:700; cursor:pointer; letter-spacing:0.1em;">
                ✦ PINPOINTS
              </button>
            </div>
          </div>

          <!-- Localized deep corner vignette ensuring zero watermark leakage -->
          <div style="position:absolute; bottom:0; right:0; width:420px; height:260px; background:radial-gradient(ellipse at bottom right, rgba(10,8,6,0.96) 0%, rgba(10,8,6,0.85) 45%, transparent 80%); pointer-events:none; z-index:32;"></div>

          <!-- Hallmark Badge concealing watermark 100% -->
          <div style="position:absolute; bottom:82px; right:18px; z-index:35; display:flex; align-items:center; gap:14px; padding:15px 24px; border-radius:18px; background:rgba(12,10,8,0.96); backdrop-filter:blur(24px); border:1px solid rgba(245,158,11,0.55); box-shadow:0 25px 50px rgba(0,0,0,0.95); min-width:285px;">
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

          <!-- Bottom Ensemble Bar & Scroll Cue -->
          <div style="position:absolute; bottom:24px; left:50%; transform:translateX(-50%); z-index:30; display:flex; flex-direction:column; align-items:center; gap:12px; width:100%; max-width:860px; padding:0 20px;">
            <div style="display:flex; align-items:center; justify-content:center; gap:12px; width:100%; padding:10px 18px; border-radius:20px; background:rgba(0,0,0,0.7); backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,0.15);">
              <span style="font-size:10px; font-family:monospace; font-weight:bold; color:#fbbf24; letter-spacing:0.18em; text-transform:uppercase;">ENSEMBLE:</span>
              <span style="padding:6px 14px; border-radius:12px; background:rgba(255,255,255,0.1); color:#fff; font-size:12px;">Imperial Emerald Ring</span>
              <span style="padding:6px 14px; border-radius:12px; background:rgba(255,255,255,0.1); color:#fff; font-size:12px;">Royal Polki Choker</span>
              <span style="padding:6px 14px; border-radius:12px; background:rgba(255,255,255,0.1); color:#fff; font-size:12px;">Cascading Chandbalis</span>
              <span style="padding:6px 14px; border-radius:12px; background:rgba(255,255,255,0.1); color:#fff; font-size:12px;">Heritage Micro-Pavé Kadas</span>
            </div>

            <div style="font-size:10px; font-family:monospace; color:rgba(255,255,255,0.7); letter-spacing:0.25em; text-transform:uppercase;">
              SCROLL DOWN TO EXPLORE 3D VAULT ORBIT ↓
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
  await page.setContent(htmlContent);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(artifactDir, 'scratch', 'test_fullscreen_raw.png') });
  console.log('Saved test_fullscreen_raw.png');
  await browser.close();
})();
