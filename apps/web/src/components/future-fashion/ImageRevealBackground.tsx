'use client';

import React, { useEffect, useRef, useState } from 'react';

const BG_IMAGE_1 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260802_074534_f0d9d476-3f86-4c67-9b12-dfc63d99da41.png&w=1920&q=85';

const BG_IMAGE_2 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260802_075145_1b557479-775b-43af-8270-f45d79d97d5a.png&w=1920&q=85';

export function ImageRevealBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const revealLayerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const smoothRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const gridOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const [gridCellSize, setGridCellSize] = useState<number>(48);
  const [gridOffset, setGridOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Update fluid grid cell size on resize
  useEffect(() => {
    const updateSize = () => {
      const cell = Math.round(Math.min(64, Math.max(36, window.innerWidth * 0.028)));
      setGridCellSize(cell);
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Track raw mouse on window
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (smoothRef.current.x === -1000) {
        smoothRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animation frame loop: eased spotlight mask + parallax grid offset
  useEffect(() => {
    let animId: number;

    const render = () => {
      const mouse = mouseRef.current;
      const smooth = smoothRef.current;

      // Ease toward mouse with factor 0.1
      smooth.x += (mouse.x - smooth.x) * 0.1;
      smooth.y += (mouse.y - smooth.y) * 0.1;

      // Spotlight radius (fluid): Math.round(Math.min(420, Math.max(160, window.innerWidth * 0.16)))
      const radius = Math.round(Math.min(420, Math.max(160, window.innerWidth * 0.16)));

      // Offscreen canvas for soft radial gradient mask
      const canvas = canvasRef.current;
      if (canvas && revealLayerRef.current) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (smooth.x > -500 && smooth.y > -500) {
            const grad = ctx.createRadialGradient(
              smooth.x,
              smooth.y,
              0,
              smooth.x,
              smooth.y,
              radius
            );
            grad.addColorStop(0, 'rgba(255,255,255,1)');
            grad.addColorStop(0.4, 'rgba(255,255,255,1)');
            grad.addColorStop(0.6, 'rgba(255,255,255,0.75)');
            grad.addColorStop(0.75, 'rgba(255,255,255,0.4)');
            grad.addColorStop(0.88, 'rgba(255,255,255,0.12)');
            grad.addColorStop(1, 'rgba(255,255,255,0)');

            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const dataUrl = canvas.toDataURL();
            revealLayerRef.current.style.maskImage = `url(${dataUrl})`;
            revealLayerRef.current.style.webkitMaskImage = `url(${dataUrl})`;
            revealLayerRef.current.style.maskSize = '100% 100%';
            (revealLayerRef.current.style as any).webkitMaskSize = '100% 100%';
          }
        }
      }

      // Parallax Grid: normalize smoothed cursor to container (-0.5 to 0.5), ease offset toward cx*16 / cy*16 with factor 0.06
      const cx = window.innerWidth > 0 ? smooth.x / window.innerWidth - 0.5 : 0;
      const cy = window.innerHeight > 0 ? smooth.y / window.innerHeight - 0.5 : 0;

      const targetOffsetX = cx * 16;
      const targetOffsetY = cy * 16;

      gridOffsetRef.current.x += (targetOffsetX - gridOffsetRef.current.x) * 0.06;
      gridOffsetRef.current.y += (targetOffsetY - gridOffsetRef.current.y) * 0.06;

      setGridOffset({
        x: Math.round(gridOffsetRef.current.x * 100) / 100,
        y: Math.round(gridOffsetRef.current.y * 100) / 100,
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div
      ref={containerRef}
      className="hidden lg:block fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Hidden offscreen canvas for mask generation */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Layer 1: Base image full-bleed */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${BG_IMAGE_1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Layer 2: Reveal image full-bleed, clipped by canvas mask */}
      <div
        ref={revealLayerRef}
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${BG_IMAGE_2})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Layer 3: Subtle SVG grid overlay at opacity 0.10, stroke #64748b, strokeWidth 0.6 with eased parallax offset */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.1 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="lgpsm-grid-pattern"
            width={gridCellSize}
            height={gridCellSize}
            patternUnits="userSpaceOnUse"
            x={gridOffset.x}
            y={gridOffset.y}
          >
            <path
              d={`M ${gridCellSize} 0 L 0 0 0 ${gridCellSize}`}
              fill="none"
              stroke="#64748b"
              strokeWidth="0.6"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#lgpsm-grid-pattern)" />
      </svg>
    </div>
  );
}
