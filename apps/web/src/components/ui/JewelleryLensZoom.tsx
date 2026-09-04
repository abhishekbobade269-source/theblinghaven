'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn } from 'lucide-react';

interface JewelleryLensZoomProps {
  src: string;
  alt: string;
  zoomLevel?: number;
  className?: string;
}

export function JewelleryLensZoom({
  src,
  alt,
  zoomLevel = 2.5,
  className = '',
}: JewelleryLensZoomProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0, percentX: 0, percentY: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const percentX = Math.max(0, Math.min(100, (x / width) * 100));
    const percentY = Math.max(0, Math.min(100, (y / height) * 100));
    setCoords({ x, y, percentX, percentY });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden cursor-crosshair select-none ${className}`}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover object-center transition-transform duration-300"
      />

      {/* Floating Zoom Cue Badge */}
      <div className="absolute bottom-3 right-3 pointer-events-none flex items-center space-x-1.5 rounded-full bg-obsidian-950/80 backdrop-blur-md border border-gold-500/30 px-3 py-1 text-[10px] font-mono font-medium text-gold-300 shadow-lg">
        <ZoomIn className="h-3 w-3 text-gold-400" />
        <span>Macro Detail Lens</span>
      </div>

      {/* Loupe Lens Viewport */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            style={{
              left: `${coords.x - 75}px`,
              top: `${coords.y - 75}px`,
              backgroundImage: `url(${src})`,
              backgroundPosition: `${coords.percentX}% ${coords.percentY}%`,
              backgroundSize: `${zoomLevel * 100}%`,
            }}
            className="pointer-events-none absolute h-36 w-36 rounded-full border-2 border-gold-400/90 shadow-[0_10px_30px_rgba(0,0,0,0.8),inset_0_0_15px_rgba(212,175,55,0.3)] backdrop-blur-none z-30"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
