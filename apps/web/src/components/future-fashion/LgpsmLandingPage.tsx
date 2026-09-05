'use client';

import React, { useState } from 'react';
import { ShoppingBag, ArrowUpRight, X, ChevronRight, Check } from 'lucide-react';
import { ImageRevealBackground } from './ImageRevealBackground';

const BG_IMAGE_1 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260802_074534_f0d9d476-3f86-4c67-9b12-dfc63d99da41.png&w=1920&q=85';

interface CartItem {
  id: string;
  title: string;
  price: number;
}

const CATALOG_ITEMS = [
  {
    id: 'p1',
    title: 'CYBER-TEX OVERCOAT',
    price: 850,
    tag: 'LIMITED EDITION',
  },
  {
    id: 'p2',
    title: 'GEO-MESH TECH HOODIE',
    price: 320,
    tag: 'NEW DROP',
  },
  {
    id: 'p3',
    title: 'ORBITAL TAPERED TROUSERS',
    price: 290,
    tag: 'IN STOCK',
  },
  {
    id: 'p4',
    title: 'MODULAR ALL-WEATHER VEST',
    price: 410,
    tag: 'PRE-ORDER',
  },
];

const ARCHIVE_COLLECTIONS = [
  {
    series: 'SERIES 01',
    title: 'SYNTHETIC HORIZONS',
    desc: 'Ultra-durable weather-sealed fabrics with minimalist silhouette architecture.',
  },
  {
    series: 'SERIES 02',
    title: 'KINETIC FORM',
    desc: 'Ergonomic streetwear designed for maximum mobility and temperature equilibrium.',
  },
  {
    series: 'SERIES 03',
    title: 'MONOCHROME ZERO',
    desc: 'Pure black and white structural tailoring crafted from 100% recycled polymers.',
  },
];

const JOURNAL_DISPATCHES = [
  {
    date: 'AUG 2026',
    title: 'THE ARCHITECTURE OF NEXT-GEN TEXTILES',
    readTime: '4 MIN READ',
  },
  {
    date: 'JUL 2026',
    title: 'CIRCULAR DESIGN IN HIGH-END APPAREL',
    readTime: '6 MIN READ',
  },
  {
    date: 'JUN 2026',
    title: 'MINIMALISM AS A FUNCTIONAL STATEMENT',
    readTime: '3 MIN READ',
  },
];

/* Corner Bracket SVGs */
const CornerTL = () => (
  <svg
    viewBox="0 0 12 12"
    style={{ width: 'var(--corner)', height: 'var(--corner)' }}
    className="stroke-black stroke-[1.5] fill-none"
  >
    <path d="M0 11.5V0.5H11.5" />
  </svg>
);

const CornerTR = () => (
  <svg
    viewBox="0 0 12 12"
    style={{ width: 'var(--corner)', height: 'var(--corner)' }}
    className="stroke-black stroke-[1.5] fill-none"
  >
    <path d="M0.5 0.5H11.5V11.5" />
  </svg>
);

const CornerBL = () => (
  <svg
    viewBox="0 0 12 12"
    style={{ width: 'var(--corner)', height: 'var(--corner)' }}
    className="stroke-black stroke-[1.5] fill-none"
  >
    <path d="M0 0.5V11.5H11.5" />
  </svg>
);

const CornerBR = () => (
  <svg
    viewBox="0 0 12 12"
    style={{ width: 'var(--corner)', height: 'var(--corner)' }}
    className="stroke-black stroke-[1.5] fill-none"
  >
    <path d="M0.5 11.5H11.5V0.5" />
  </svg>
);

/* Checkerboard Grid SVG: 4 rows of 3.8x3.8 black squares; even rows shifted by 2.25 */
const CheckerboardSVG = () => (
  <svg
    viewBox="0 0 36 18"
    style={{
      width: 'var(--checker-w)',
      height: 'var(--checker-h)',
      display: 'inline-block',
      verticalAlign: 'baseline',
      transform: 'translateY(2px)',
    }}
  >
    {/* Row 0: shift 0 */}
    <rect x="0" y="0" width="3.8" height="3.8" fill="#000" />
    <rect x="6.0" y="0" width="3.8" height="3.8" fill="#000" />
    <rect x="12.0" y="0" width="3.8" height="3.8" fill="#000" />
    <rect x="18.0" y="0" width="3.8" height="3.8" fill="#000" />
    <rect x="24.0" y="0" width="3.8" height="3.8" fill="#000" />
    <rect x="30.0" y="0" width="3.8" height="3.8" fill="#000" />

    {/* Row 1: shift 2.25 */}
    <rect x="2.25" y="4.6" width="3.8" height="3.8" fill="#000" />
    <rect x="8.25" y="4.6" width="3.8" height="3.8" fill="#000" />
    <rect x="14.25" y="4.6" width="3.8" height="3.8" fill="#000" />
    <rect x="20.25" y="4.6" width="3.8" height="3.8" fill="#000" />
    <rect x="26.25" y="4.6" width="3.8" height="3.8" fill="#000" />
    <rect x="32.25" y="4.6" width="3.8" height="3.8" fill="#000" />

    {/* Row 2: shift 0 */}
    <rect x="0" y="9.2" width="3.8" height="3.8" fill="#000" />
    <rect x="6.0" y="9.2" width="3.8" height="3.8" fill="#000" />
    <rect x="12.0" y="9.2" width="3.8" height="3.8" fill="#000" />
    <rect x="18.0" y="9.2" width="3.8" height="3.8" fill="#000" />
    <rect x="24.0" y="9.2" width="3.8" height="3.8" fill="#000" />
    <rect x="30.0" y="9.2" width="3.8" height="3.8" fill="#000" />

    {/* Row 3: shift 2.25 */}
    <rect x="2.25" y="13.8" width="3.8" height="3.8" fill="#000" />
    <rect x="8.25" y="13.8" width="3.8" height="3.8" fill="#000" />
    <rect x="14.25" y="13.8" width="3.8" height="3.8" fill="#000" />
    <rect x="20.25" y="13.8" width="3.8" height="3.8" fill="#000" />
    <rect x="26.25" y="13.8" width="3.8" height="3.8" fill="#000" />
    <rect x="32.25" y="13.8" width="3.8" height="3.8" fill="#000" />
  </svg>
);

/* Wireframe Globe SVG */
const WireframeGlobeSVG = () => (
  <svg
    viewBox="0 0 64 64"
    style={{ width: 'var(--globe)', height: 'var(--globe)' }}
    className="stroke-black stroke-[1.2] fill-none shrink-0"
  >
    {/* Outer circle */}
    <circle cx="32" cy="32" r="28" />
    {/* Equator */}
    <line x1="4" y1="32" x2="60" y2="32" />
    {/* Horizontal ellipses */}
    <ellipse cx="32" cy="32" rx="28" ry="14" />
    <ellipse cx="32" cy="32" rx="28" ry="22" />
    {/* Meridian */}
    <line x1="32" y1="4" x2="32" y2="60" />
    {/* Vertical ellipses */}
    <ellipse cx="32" cy="32" rx="14" ry="28" />
    <ellipse cx="32" cy="32" rx="22" ry="28" />
  </svg>
);

type ActiveDrawer = 'SHOP' | 'COLLECTIONS' | 'JOURNAL' | 'CART' | null;

export function LgpsmLandingPage() {
  const [activeDrawer, setActiveDrawer] = useState<ActiveDrawer>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3000);
  };

  const handleAddToCart = (item: { id: string; title: string; price: number }) => {
    setCart((prev) => [...prev, item]);
    triggerToast(`Added "${item.title}" to your shopping bag.`);
  };

  const handleRemoveFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCheckout = () => {
    triggerToast('Order submitted successfully!');
    setCart([]);
    setActiveDrawer(null);
  };

  return (
    <div
      className="min-h-screen bg-white text-black font-jakarta flex flex-col justify-between relative overflow-hidden selection:bg-black selection:text-white"
      style={
        {
          '--pad-x': 'clamp(1.25rem, 4.5vw, 5rem)',
          '--pad-y': 'clamp(1rem, 3vh, 4rem)',
          '--header-pt': 'clamp(1.25rem, 2.5vh, 2.5rem)',
          '--gap-nav': 'clamp(1rem, 2.2vw, 2.25rem)',
          '--logo': 'clamp(1.35rem, 1.2vw + 0.9rem, 2.1rem)',
          '--logo-deg': 'clamp(0.65rem, 0.4vw + 0.45rem, 0.9rem)',
          '--nav': 'clamp(0.65rem, 0.35vw + 0.5rem, 0.875rem)',
          '--headline': 'clamp(2.15rem, 4.5vw + 0.75rem, 5.25rem)',
          '--body': 'clamp(0.7rem, 0.35vw + 0.55rem, 0.9rem)',
          '--micro': 'clamp(0.55rem, 0.25vw + 0.45rem, 0.7rem)',
          '--btn-px': 'clamp(1.15rem, 1.4vw, 1.75rem)',
          '--btn-py': 'clamp(0.6rem, 0.9vh, 0.85rem)',
          '--btn-gap': 'clamp(0.75rem, 1vw, 1.1rem)',
          '--feature-pad': 'clamp(1rem, 1.5vw, 1.75rem)',
          '--feature-min': 'clamp(13rem, 18vw, 20rem)',
          '--globe': 'clamp(2.25rem, 2.5vw + 1rem, 3.25rem)',
          '--checker-w': 'clamp(2.75rem, 4.5vw, 6.5rem)',
          '--checker-h': 'clamp(1.35rem, 2.2vw, 3rem)',
          '--corner': 'clamp(0.65rem, 0.4vw + 0.4rem, 0.95rem)',
          '--icon': 'clamp(1rem, 0.6vw + 0.7rem, 1.35rem)',
          '--drawer-pad': 'clamp(1.25rem, 2.5vw, 2.25rem)',
          '--drawer-max': 'clamp(18rem, 28vw, 28rem)',
          '--section-gap': 'clamp(0.75rem, 1.5vh, 1.5rem)',
          '--main-py': 'clamp(1.25rem, 4vh, 4rem)',
        } as React.CSSProperties
      }
    >
      {/* Interactive Dual-Image Reveal Desktop Background */}
      <ImageRevealBackground />

      {/* 1. Header (z-20) */}
      <header
        className="relative z-20 flex items-center justify-between"
        style={{
          paddingInline: 'var(--pad-x)',
          paddingTop: 'var(--header-pt)',
          paddingBottom: 'var(--section-gap)',
        }}
      >
        {/* Logo */}
        <button
          onClick={() => setActiveDrawer(null)}
          className="font-orbitron font-black text-black tracking-[0.15em] flex items-center hover:opacity-80 transition-opacity focus:outline-none"
          style={{ fontSize: 'var(--logo)' }}
        >
          <span>LGPSM</span>
          <span
            className="-mt-0.5 ml-0.5 font-bold"
            style={{ fontSize: 'var(--logo-deg)' }}
          >
            ˚
          </span>
        </button>

        {/* Nav */}
        <nav
          className="flex items-center uppercase font-medium"
          style={{
            fontSize: 'var(--nav)',
            letterSpacing: '0.2em',
            gap: 'var(--gap-nav)',
          }}
        >
          <button
            onClick={() => setActiveDrawer('SHOP')}
            className="hover:opacity-50 transition-opacity"
          >
            SHOP
          </button>
          <button
            onClick={() => setActiveDrawer('COLLECTIONS')}
            className="hover:opacity-50 transition-opacity"
          >
            COLLECTIONS
          </button>
          <button
            onClick={() => setActiveDrawer('JOURNAL')}
            className="hover:opacity-50 transition-opacity"
          >
            JOURNAL
          </button>

          <span className="text-gray-300 select-none">|</span>

          {/* Cart Trigger */}
          <button
            onClick={() => setActiveDrawer('CART')}
            className="relative hover:opacity-50 transition-opacity p-1 flex items-center justify-center"
            aria-label="Shopping Bag"
          >
            <ShoppingBag
              strokeWidth={1.5}
              style={{ width: 'var(--icon)', height: 'var(--icon)' }}
            />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-black text-white text-[9px] font-bold flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </nav>
      </header>

      {/* 2. Main Hero (flex-1) */}
      <main
        className="relative z-10 flex-1 flex flex-col justify-center lg:flex-row lg:items-center lg:justify-between"
        style={{
          paddingInline: 'var(--pad-x)',
          paddingBlock: 'var(--main-py)',
        }}
      >
        {/* Left Headline Block */}
        <div className="relative flex flex-col items-start max-w-4xl py-4">
          {/* Top-Left Corner Bracket */}
          <div className="mb-2">
            <CornerTL />
          </div>

          {/* Three-Line Orbitron Headline */}
          <h1
            className="font-orbitron font-extrabold uppercase text-black"
            style={{
              fontSize: 'var(--headline)',
              letterSpacing: '0.08em',
              lineHeight: 1.05,
            }}
          >
            <span className="block">FUTURE</span>
            <span className="block">FORWARD</span>
            <span className="inline-flex items-baseline gap-3 flex-wrap">
              <span>FASHION</span>
              <CheckerboardSVG />
            </span>
          </h1>

          {/* Bottom-Left Corner Bracket */}
          <div className="mt-3 mb-6">
            <CornerBL />
          </div>

          {/* CTA Button: SHOP NOW */}
          <button
            onClick={() => setActiveDrawer('SHOP')}
            className="group inline-flex items-center border border-gray-400 rounded-md uppercase text-black font-jakarta hover:bg-black hover:text-white hover:border-black transition-all duration-200"
            style={{
              letterSpacing: '0.18em',
              fontSize: 'var(--body)',
              paddingInline: 'var(--btn-px)',
              paddingBlock: 'var(--btn-py)',
              gap: 'var(--btn-gap)',
            }}
          >
            <span>SHOP NOW</span>
            <ArrowUpRight
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              style={{ width: 'var(--icon)', height: 'var(--icon)' }}
            />
          </button>
        </div>

        {/* Right Lower Feature Block: Wireframe Globe + Taglines */}
        <div
          className="self-end mt-8 lg:mt-0 relative flex items-center gap-4"
          style={{
            minWidth: 'var(--feature-min)',
            padding: 'var(--feature-pad)',
          }}
        >
          {/* 4 Corner Brackets */}
          <div className="absolute top-0 left-0">
            <CornerTL />
          </div>
          <div className="absolute top-0 right-0">
            <CornerTR />
          </div>
          <div className="absolute bottom-0 left-0">
            <CornerBL />
          </div>
          <div className="absolute bottom-0 right-0">
            <CornerBR />
          </div>

          {/* Wireframe Globe */}
          <WireframeGlobeSVG />

          {/* Tagline */}
          <div
            className="font-jakarta font-semibold uppercase text-black"
            style={{
              fontSize: 'var(--body)',
              letterSpacing: '0.18em',
              lineHeight: 1.4,
            }}
          >
            <p>BEYOND TRENDS.</p>
            <p>BUILT FOR TOMORROW.</p>
          </div>
        </div>
      </main>

      {/* Mobile Static Bordered Image Below Hero (Below lg viewports) */}
      <section
        className="lg:hidden relative z-10 w-full mb-8"
        style={{ paddingInline: 'var(--pad-x)' }}
      >
        <div className="w-full aspect-[4/5] sm:aspect-[16/9] border border-gray-200 overflow-hidden relative">
          <img
            src={BG_IMAGE_1}
            alt="LGPSM Future Forward Fashion"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* 3. Toast Notifications (Black toast top-right) */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-black text-white px-5 py-3 rounded-md shadow-2xl flex items-center gap-2.5 text-xs font-jakarta tracking-wide animate-in fade-in slide-in-from-top-2 duration-200">
          <Check className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 4. Side Drawers over Dimmed Backdrop */}
      {activeDrawer && (
        <div className="fixed inset-0 z-40 flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setActiveDrawer(null)}
            className="absolute inset-0 bg-black/20 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Panel */}
          <div
            className="relative z-10 h-full w-full bg-white border-l border-gray-200 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200"
            style={{
              maxWidth: 'var(--drawer-max)',
              padding: 'var(--drawer-pad)',
            }}
          >
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <h2
                    className="font-orbitron font-bold uppercase tracking-wider text-black"
                    style={{ fontSize: 'var(--body)' }}
                  >
                    {activeDrawer === 'SHOP' && 'Catalog'}
                    {activeDrawer === 'COLLECTIONS' && 'Archive 2026'}
                    {activeDrawer === 'JOURNAL' && 'Editorial'}
                    {activeDrawer === 'CART' && 'Shopping Bag'}
                  </h2>
                  <p
                    className="text-gray-400 uppercase font-jakarta"
                    style={{ fontSize: 'var(--micro)' }}
                  >
                    {activeDrawer === 'SHOP' && 'Featured Garments'}
                    {activeDrawer === 'COLLECTIONS' && 'Season Lineup'}
                    {activeDrawer === 'JOURNAL' && 'Latest Dispatches'}
                    {activeDrawer === 'CART' && `${cart.length} item(s) selected`}
                  </p>
                </div>

                <button
                  onClick={() => setActiveDrawer(null)}
                  className="p-1 text-gray-400 hover:text-black transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="py-6 space-y-6 overflow-y-auto max-h-[70vh]">
                {/* SHOP DRAWER */}
                {activeDrawer === 'SHOP' && (
                  <div className="space-y-4">
                    {CATALOG_ITEMS.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 border border-gray-200 rounded-sm flex items-center justify-between hover:border-black transition-colors"
                      >
                        <div>
                          <span
                            className="text-gray-400 font-mono block mb-1 uppercase"
                            style={{ fontSize: 'var(--micro)' }}
                          >
                            {item.tag}
                          </span>
                          <h4
                            className="font-orbitron font-semibold text-black uppercase"
                            style={{ fontSize: 'var(--body)' }}
                          >
                            {item.title}
                          </h4>
                          <p
                            className="font-jakarta font-medium text-gray-600 mt-0.5"
                            style={{ fontSize: 'var(--body)' }}
                          >
                            ${item.price}
                          </p>
                        </div>

                        <button
                          onClick={() => handleAddToCart(item)}
                          className="px-3 py-1.5 border border-black text-xs font-semibold uppercase hover:bg-black hover:text-white transition-colors"
                        >
                          ADD
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* COLLECTIONS DRAWER */}
                {activeDrawer === 'COLLECTIONS' && (
                  <div className="space-y-5">
                    {ARCHIVE_COLLECTIONS.map((c, i) => (
                      <div key={i} className="space-y-1.5 pb-4 border-b border-gray-100 last:border-b-0">
                        <span
                          className="text-gray-400 font-mono uppercase"
                          style={{ fontSize: 'var(--micro)' }}
                        >
                          {c.series}
                        </span>
                        <h4
                          className="font-orbitron font-bold text-black uppercase"
                          style={{ fontSize: 'var(--body)' }}
                        >
                          {c.title}
                        </h4>
                        <p
                          className="font-jakarta text-gray-600 leading-relaxed"
                          style={{ fontSize: 'var(--body)' }}
                        >
                          {c.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* JOURNAL DRAWER */}
                {activeDrawer === 'JOURNAL' && (
                  <div className="space-y-5">
                    {JOURNAL_DISPATCHES.map((j, i) => (
                      <div key={i} className="space-y-1 pb-4 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center justify-between text-gray-400 font-mono" style={{ fontSize: 'var(--micro)' }}>
                          <span>{j.date}</span>
                          <span>{j.readTime}</span>
                        </div>
                        <h4
                          className="font-orbitron font-semibold text-black uppercase"
                          style={{ fontSize: 'var(--body)' }}
                        >
                          {j.title}
                        </h4>
                      </div>
                    ))}
                  </div>
                )}

                {/* CART DRAWER */}
                {activeDrawer === 'CART' && (
                  <div>
                    {cart.length === 0 ? (
                      <div className="py-12 flex flex-col items-center justify-center text-center text-gray-400 space-y-3">
                        <ShoppingBag className="h-8 w-8 stroke-[1.2]" />
                        <p className="font-jakarta" style={{ fontSize: 'var(--body)' }}>
                          Your shopping bag is empty.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {cart.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-3 border border-gray-200 flex items-center justify-between"
                          >
                            <div>
                              <h4
                                className="font-orbitron font-semibold text-black text-xs uppercase"
                              >
                                {item.title}
                              </h4>
                              <p className="text-gray-600 text-xs font-mono mt-0.5">
                                ${item.price}
                              </p>
                            </div>
                            <button
                              onClick={() => handleRemoveFromCart(idx)}
                              className="text-gray-400 hover:text-black text-xs uppercase font-mono transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        ))}

                        <div className="pt-4 border-t border-gray-200 flex items-center justify-between font-orbitron font-bold">
                          <span>TOTAL</span>
                          <span>
                            ${cart.reduce((sum, item) => sum + item.price, 0)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-gray-200">
              {activeDrawer === 'CART' && cart.length > 0 ? (
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 bg-black text-white uppercase font-jakarta font-semibold tracking-widest flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors"
                  style={{ fontSize: 'var(--body)' }}
                >
                  <span>CHECKOUT NOW</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <p
                  className="text-gray-400 uppercase font-jakarta text-center tracking-widest"
                  style={{ fontSize: 'var(--micro)' }}
                >
                  LGPSM © 2026 — FUTURE FORWARD FASHION
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
