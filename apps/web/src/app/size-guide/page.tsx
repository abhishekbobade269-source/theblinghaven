'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Ruler, Sparkles, HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function SizeGuidePage() {
  const [activeTab, setActiveTab] = useState<'rings' | 'bangles'>('rings');
  const [sliderDiameter, setSliderDiameter] = useState<number>(17.3);

  // Approximate US & Indian size calculation for the ring slider
  const getRingSize = (mm: number) => {
    if (mm < 15.5) return { us: 4.5, ind: 8, circum: '48.7 mm' };
    if (mm < 16.1) return { us: 5.5, ind: 10, circum: '50.6 mm' };
    if (mm < 16.7) return { us: 6.0, ind: 12, circum: '52.4 mm' };
    if (mm < 17.3) return { us: 7.0, ind: 14, circum: '54.4 mm' };
    if (mm < 18.1) return { us: 8.0, ind: 16, circum: '57.0 mm' };
    if (mm < 18.9) return { us: 9.0, ind: 18, circum: '59.5 mm' };
    return { us: 10.0, ind: 20, circum: '62.1 mm' };
  };

  const calculated = getRingSize(sliderDiameter);

  return (
    <div className="min-h-screen bg-[#FAF9F5] dark:bg-[#09090C] text-stone-900 dark:text-stone-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-gold-400/10 text-gold-600 dark:text-gold-400 border border-gold-400/30 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            <Ruler className="w-3.5 h-3.5" /> Haute Joaillerie Fit Guide
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-medium tracking-tight mb-4">
            The Bling Haven Size Guide
          </h1>
          <p className="text-stone-600 dark:text-stone-400 max-w-xl mx-auto text-sm sm:text-base">
            Find your flawless fit for handcrafted rings and heirloom kadas. Our bespoke sizing
            ensures complete comfort and enduring luxury.
          </p>

          {/* Sizing Tabs */}
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setActiveTab('rings')}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeTab === 'rings'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-md'
                  : 'bg-stone-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300'
              }`}
            >
              Ring Sizing Guide
            </button>
            <button
              onClick={() => setActiveTab('bangles')}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeTab === 'bangles'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-md'
                  : 'bg-stone-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300'
              }`}
            >
              Bangle & Kada Sizes
            </button>
          </div>
        </div>

        {activeTab === 'rings' && (
          <div className="space-y-12">
            {/* Interactive Ring Sizer Tool */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-serif font-medium">Interactive Ring Diameter Tool</h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Place an existing ring on your screen or adjust the slider to match its inner
                    diameter in millimeters.
                  </p>
                </div>
                <Sparkles className="w-5 h-5 text-gold-500" />
              </div>

              {/* Visual Ring Circle */}
              <div className="flex flex-col items-center justify-center my-8 py-6 bg-stone-50 dark:bg-stone-950/40 rounded-xl border border-dashed border-stone-300 dark:border-stone-800">
                <div
                  style={{
                    width: `${sliderDiameter * 4.2}px`,
                    height: `${sliderDiameter * 4.2}px`,
                  }}
                  className="rounded-full border-4 border-gold-500/80 bg-white dark:bg-stone-900 shadow-inner flex items-center justify-center transition-all duration-150"
                >
                  <span className="text-xs font-mono font-semibold text-gold-600 dark:text-gold-400">
                    {sliderDiameter} mm
                  </span>
                </div>
                <span className="text-[11px] text-stone-400 mt-4">
                  Inner Circle Diameter (Scaled Simulation)
                </span>
              </div>

              {/* Slider */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-mono">
                  <span>14.0 mm</span>
                  <span className="font-bold text-gold-600 dark:text-gold-400">
                    {sliderDiameter} mm
                  </span>
                  <span>21.0 mm</span>
                </div>
                <input
                  type="range"
                  min="14.0"
                  max="21.0"
                  step="0.1"
                  value={sliderDiameter}
                  onChange={(e) => setSliderDiameter(parseFloat(e.target.value))}
                  className="w-full accent-gold-500 h-2 bg-stone-200 dark:bg-stone-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Calculated Result Card */}
              <div className="mt-8 grid grid-cols-3 gap-3 p-4 bg-gold-400/10 border border-gold-400/20 rounded-xl text-center">
                <div>
                  <span className="text-xs text-stone-500 uppercase font-medium">US / Canada Size</span>
                  <p className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                    {calculated.us}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-stone-500 uppercase font-medium">Indian / UK Size</span>
                  <p className="text-xl font-bold text-gold-600 dark:text-gold-400 mt-0.5">
                    {calculated.ind}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-stone-500 uppercase font-medium">Circumference</span>
                  <p className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                    {calculated.circum}
                  </p>
                </div>
              </div>
            </div>

            {/* Comprehensive Ring Chart Table */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 overflow-x-auto shadow-sm">
              <h3 className="text-lg font-serif font-medium mb-4">Standard Ring Size Chart</h3>
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-500 text-xs uppercase font-semibold">
                    <th className="py-3 px-4">US / Canada</th>
                    <th className="py-3 px-4">Indian Size</th>
                    <th className="py-3 px-4">Inner Diameter (mm)</th>
                    <th className="py-3 px-4">Circumference (mm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  <tr>
                    <td className="py-3 px-4 font-medium">5.0</td>
                    <td className="py-3 px-4">9 - 10</td>
                    <td className="py-3 px-4">15.7 mm</td>
                    <td className="py-3 px-4">49.3 mm</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">6.0</td>
                    <td className="py-3 px-4">11 - 12</td>
                    <td className="py-3 px-4">16.5 mm</td>
                    <td className="py-3 px-4">51.9 mm</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">7.0</td>
                    <td className="py-3 px-4">13 - 14</td>
                    <td className="py-3 px-4">17.3 mm</td>
                    <td className="py-3 px-4">54.4 mm</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">8.0</td>
                    <td className="py-3 px-4">15 - 16</td>
                    <td className="py-3 px-4">18.1 mm</td>
                    <td className="py-3 px-4">57.0 mm</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">9.0</td>
                    <td className="py-3 px-4">17 - 18</td>
                    <td className="py-3 px-4">18.9 mm</td>
                    <td className="py-3 px-4">59.5 mm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'bangles' && (
          <div className="space-y-12">
            {/* Bangle Sizing Guidance */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-serif font-medium mb-3">Indian & International Bangle Sizes</h2>
              <p className="text-sm text-stone-600 dark:text-stone-400 mb-6">
                Bangles in traditional Indian craftsmanship are specified in inches (e.g., 2.4 means 2
                and 4/16th inches inner diameter). Most openable kadas fit wrist sizes 2.4 through 2.8
                comfortably with their hidden magnetic clasp.
              </p>

              <div className="grid sm:grid-cols-4 gap-4">
                {[
                  { size: '2.4', label: 'Extra Small / Petite', inner: '57.2 mm', inches: '2.25"' },
                  { size: '2.6', label: 'Medium (Standard)', inner: '60.3 mm', inches: '2.375"' },
                  { size: '2.8', label: 'Large', inner: '63.5 mm', inches: '2.5"' },
                  { size: '2.10', label: 'Extra Large', inner: '66.7 mm', inches: '2.625"' },
                ].map((bangle) => (
                  <div
                    key={bangle.size}
                    className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/40 text-center"
                  >
                    <span className="text-2xl font-serif font-bold text-gold-600 dark:text-gold-400">
                      {bangle.size}
                    </span>
                    <p className="text-xs font-semibold text-stone-800 dark:text-stone-200 mt-1">
                      {bangle.label}
                    </p>
                    <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-800 text-[11px] text-stone-500">
                      <div>Diameter: {bangle.inner}</div>
                      <div>Inches: {bangle.inches}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* How to Measure at Home */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-serif font-medium mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-gold-500" /> How to Measure Your Bangle Size at
                Home
              </h3>
              <ol className="list-decimal list-inside space-y-3 text-sm text-stone-600 dark:text-stone-400">
                <li>
                  <strong className="text-stone-900 dark:text-stone-100">Fold your hand:</strong> Bring
                  your thumb and little finger together, as if you were sliding on a bangle.
                </li>
                <li>
                  <strong className="text-stone-900 dark:text-stone-100">Measure with a string:</strong>{' '}
                  Wrap a soft measuring tape or thread tightly around the widest part of your folded hand
                  (across knuckles).
                </li>
                <li>
                  <strong className="text-stone-900 dark:text-stone-100">Check the length:</strong> Mark
                  where the thread meets and measure against a flat ruler. If it measures 7.5 inches, your
                  ideal size is <strong>2.6</strong>.
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* Need Help Banner */}
        <div className="mt-12 p-6 bg-stone-100 dark:bg-stone-900 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gold-400/20 flex items-center justify-center text-gold-600 dark:text-gold-400 shrink-0">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-medium text-base">Unsure about your exact measurement?</h4>
              <p className="text-xs text-stone-500">
                Our Toronto styling concierges are on standby to verify your sizing before dispatch.
              </p>
            </div>
          </div>
          <Link
            href="/concierge"
            className="px-5 py-2.5 bg-black text-white dark:bg-white dark:text-black rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:opacity-90 shrink-0"
          >
            Chat with Stylist <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
