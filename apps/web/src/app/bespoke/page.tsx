'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import {
  Gem,
  Sparkles,
  Crown,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Palette,
  Layers,
  Send,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'Ring', name: 'Solitaire & Cocktail Ring', icon: '💍' },
  { id: 'Choker', name: 'Grand Bridal Choker / Haar', icon: '👑' },
  { id: 'Kada', name: 'Imperial Bangle / Kada', icon: '✨' },
  { id: 'Earrings', name: 'Haute Joaillerie Drops', icon: '💎' },
  { id: 'Pendant', name: 'Heritage Solitaire Pendant', icon: '🌟' },
];

const METALS = [
  { id: 'Platinum Pt950', name: 'Platinum Pt950', desc: 'Hypoallergenic pure white brilliance' },
  { id: '18K White Gold', name: '18K White Gold (750)', desc: 'Modern mirror-polished luster' },
  { id: '18K Yellow Gold', name: '18K Yellow Gold', desc: 'Warm classic champagne hue' },
  { id: '22K Solid Heritage Gold', name: '22K Solid Heritage Gold (916)', desc: 'Traditional royal Indian & Middle Eastern purity' },
];

const GEMSTONES = [
  { id: 'D-Flawless Type IIa Diamond', name: 'D-Flawless Diamond', desc: 'GIA certified triple excellent' },
  { id: 'Muzo Colombian Vivid Emerald', name: 'Muzo Colombian Emerald', desc: 'Untreated vivid green saturation' },
  { id: 'Burmese Pigeon Blood Ruby', name: 'Burmese Ruby', desc: 'Natural unheated gemological rarity' },
  { id: 'Certified Natural Basra Pearl', name: 'Natural Basra Pearls', desc: 'Antique Persian Gulf saltwater pearls' },
];

const DIAMOND_SHAPES = ['Emerald Cut', 'Cushion Cut', 'Round Brilliant', 'Pear Brilliant', 'Oval Brilliant'];
const BUDGET_RANGES = [
  '$10,000 - $25,000 USD',
  '$25,000 - $50,000 USD',
  '$50,000 - $100,000 USD',
  '$100,000 - $250,000+ USD',
];

export default function BespokeStudioPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{ referenceNumber: string } | null>(null);

  // Form State
  const [form, setForm] = useState<{
    category: string;
    metalPreference: string;
    gemstonePreference: string;
    estimatedCaratWeight: number;
    diamondShape: string;
    ringOrWristSize: string;
    engravingText: string;
    budgetRangeUsd: string;
    inspirationPhotoUrl: string;
    designBrief: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    clientCountry: string;
  }>({
    category: 'Ring',
    metalPreference: 'Platinum Pt950',
    gemstonePreference: 'D-Flawless Type IIa Diamond',
    estimatedCaratWeight: 3.5,
    diamondShape: 'Emerald Cut',
    ringOrWristSize: 'US 6.5',
    engravingText: '',
    budgetRangeUsd: '$25,000 - $50,000 USD',
    inspirationPhotoUrl: '',
    designBrief: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientCountry: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await apiRequest('/bespoke/submit', {
        method: 'POST',
        data: form,
      });
      const data = res.data || res;
      setSubmissionResult({ referenceNumber: data.referenceNumber });
    } catch (e: any) {
      alert(e.message || 'Failed to submit bespoke request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-10 sm:space-y-12">
      {/* Studio Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2.5">
        <div className="inline-flex items-center space-x-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 text-xs font-mono font-bold text-gold-700 dark:text-gold-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Haute Joaillerie 3D Atelier</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 dark:text-slate-100">
          Bespoke Jewelry Customizer
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Sculpt your one-of-a-kind creation with our Master Goldsmiths and receive 3D CAD modeling within 48 hours.
        </p>
      </div>

      {/* Completion Success View */}
      {submissionResult ? (
        <div className="rounded-3xl border border-slate-200 dark:border-gold-500/40 bg-white dark:bg-[#0E0E14] p-8 sm:p-12 text-center space-y-6 shadow-2xl animate-in zoom-in-95">
          <div className="rounded-full border-2 border-gold-500 bg-gold-500/20 p-5 text-gold-600 dark:text-gold-400 w-fit mx-auto">
            <CheckCircle2 className="h-12 w-12" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-700 dark:text-gold-400">
              Commission Registered with Master Goldsmith
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
              Commission #{submissionResult.referenceNumber}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Our High-Jewelry Director and Master Artisan have received your design brief. A confidential encrypted dossier with initial 3D CAD renders will be sent to <span className="text-gold-700 dark:text-gold-300 font-mono font-bold">{form.clientEmail}</span>.
            </p>
          </div>

          <div className="pt-4 flex justify-center gap-4">
            <Link
              href="/"
              className="rounded-2xl bg-gold-500 hover:bg-gold-400 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-obsidian-950 shadow-lg"
            >
              Return to Maison
            </Link>
          </div>
        </div>
      ) : (
        /* Multi-Step Customizer Container */
        <div className="rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-[#0E0E14] shadow-2xl overflow-hidden">
          {/* Step Progress Header */}
          <div className="grid grid-cols-4 border-b border-slate-200 dark:border-white/10 text-center text-xs font-mono py-4 bg-slate-50 dark:bg-obsidian-950/80">
            <div className={`${currentStep === 1 ? 'text-gold-700 dark:text-gold-400 font-bold' : 'text-slate-400 dark:text-slate-500'}`}>
              1. Category & Metal
            </div>
            <div className={`${currentStep === 2 ? 'text-gold-700 dark:text-gold-400 font-bold' : 'text-slate-400 dark:text-slate-500'}`}>
              2. Gemstone 4Cs
            </div>
            <div className={`${currentStep === 3 ? 'text-gold-700 dark:text-gold-400 font-bold' : 'text-slate-400 dark:text-slate-500'}`}>
              3. Sizing & Brief
            </div>
            <div className={`${currentStep === 4 ? 'text-gold-700 dark:text-gold-400 font-bold' : 'text-slate-400 dark:text-slate-500'}`}>
              4. Client Profile
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
            {/* STEP 1: Category & Metal Choice */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-in fade-in">
                {/* Categories */}
                <div className="space-y-3">
                  <label className="block text-xs font-mono font-bold uppercase tracking-widest text-gold-700 dark:text-gold-400">
                    Step 1A: Choose Jewelry Category
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {CATEGORIES.map((cat) => (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setForm({ ...form, category: cat.id })}
                        className={`rounded-2xl border p-4 text-center transition flex flex-col items-center space-y-2 ${
                          form.category === cat.id
                            ? 'border-gold-500 bg-gold-500/15 shadow-md ring-1 ring-gold-500 text-gold-900 dark:text-gold-300 font-bold'
                            : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-obsidian-950 text-slate-700 dark:text-slate-300 hover:border-gold-500/40'
                        }`}
                      >
                        <span className="text-2xl">{cat.icon}</span>
                        <span className="font-serif text-xs font-bold">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Metals */}
                <div className="space-y-3">
                  <label className="block text-xs font-mono font-bold uppercase tracking-widest text-gold-700 dark:text-gold-400">
                    Step 1B: Choose Precious Metal Alloy
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {METALS.map((m) => (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setForm({ ...form, metalPreference: m.id })}
                        className={`rounded-2xl border p-4 text-left transition space-y-1 ${
                          form.metalPreference === m.id
                            ? 'border-gold-500 bg-gold-500/15 shadow-md ring-1 ring-gold-500'
                            : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-obsidian-950 hover:border-gold-500/40'
                        }`}
                      >
                        <p className="font-serif text-sm font-bold text-slate-900 dark:text-slate-100">{m.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{m.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Gemstone Choice & 4Cs */}
            {currentStep === 2 && (
              <div className="space-y-8 animate-in fade-in">
                {/* Gemstone Type */}
                <div className="space-y-3">
                  <label className="block text-xs font-mono font-bold uppercase tracking-widest text-gold-700 dark:text-gold-400">
                    Step 2A: Select Precious Gemstone
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {GEMSTONES.map((g) => (
                      <button
                        type="button"
                        key={g.id}
                        onClick={() => setForm({ ...form, gemstonePreference: g.id })}
                        className={`rounded-2xl border p-4 text-left transition space-y-1 ${
                          form.gemstonePreference === g.id
                            ? 'border-gold-500 bg-gold-500/15 shadow-md ring-1 ring-gold-500'
                            : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-obsidian-950 hover:border-gold-500/40'
                        }`}
                      >
                        <p className="font-serif text-sm font-bold text-slate-900 dark:text-slate-100">{g.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{g.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Carat Weight Slider & Cut Shape */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-white/10">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Center Stone Carat Weight
                      </label>
                      <span className="font-mono text-base font-bold text-gold-700 dark:text-gold-400">
                        {form.estimatedCaratWeight} Carats
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="12.0"
                      step="0.25"
                      value={form.estimatedCaratWeight}
                      onChange={(e) =>
                        setForm({ ...form, estimatedCaratWeight: parseFloat(e.target.value) })
                      }
                      className="w-full accent-gold-500 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                      Diamond / Gemstone Cut Shape
                    </label>
                    <select
                      value={form.diamondShape}
                      onChange={(e) => setForm({ ...form, diamondShape: e.target.value })}
                      className="w-full rounded-2xl border border-slate-300 dark:border-gold-500/30 bg-slate-50 dark:bg-obsidian-950 p-3 text-xs text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                    >
                      {DIAMOND_SHAPES.map((shp) => (
                        <option key={shp} value={shp}>
                          {shp}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Sizing, Engraving & Design Brief */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Ring or Wrist Size (Optional)
                    </label>
                    <input
                      type="text"
                      value={form.ringOrWristSize}
                      onChange={(e) => setForm({ ...form, ringOrWristSize: e.target.value })}
                      placeholder="e.g. US 6.5 or 60mm"
                      className="w-full rounded-2xl border border-slate-300 dark:border-gold-500/30 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Target Acquisition Budget Range
                    </label>
                    <select
                      value={form.budgetRangeUsd}
                      onChange={(e) => setForm({ ...form, budgetRangeUsd: e.target.value })}
                      className="w-full rounded-2xl border border-slate-300 dark:border-gold-500/30 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                    >
                      {BUDGET_RANGES.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Custom Laser Engraving Inscription (Optional)
                  </label>
                  <input
                    type="text"
                    value={form.engravingText}
                    onChange={(e) => setForm({ ...form, engravingText: e.target.value })}
                    placeholder="e.g. Tariq & Shaikha • Eternally 2026"
                    className="w-full rounded-2xl border border-slate-300 dark:border-gold-500/30 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Inspiration Photo / Sketch URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={form.inspirationPhotoUrl}
                    onChange={(e) => setForm({ ...form, inspirationPhotoUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full rounded-2xl border border-slate-300 dark:border-gold-500/30 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Atelier Design Brief & Aesthetic Vision
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.designBrief}
                    onChange={(e) => setForm({ ...form, designBrief: e.target.value })}
                    placeholder="Describe your bespoke heirloom vision, claw settings, side diamonds, or historical inspirations..."
                    className="w-full rounded-2xl border border-slate-300 dark:border-gold-500/30 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none leading-relaxed font-sans"
                  />
                </div>
              </div>
            )}

            {/* STEP 4: Client Profile & Submission */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in text-xs font-mono">
                <div className="rounded-2xl bg-slate-50 dark:bg-obsidian-950 p-5 border border-slate-200 dark:border-gold-500/30 space-y-2">
                  <span className="text-gold-700 dark:text-gold-400 font-bold uppercase text-[10px] block">
                    Bespoke Commission Summary
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                    <p>Category: <span className="text-slate-900 dark:text-white font-bold">{form.category}</span></p>
                    <p>Metal: <span className="text-slate-900 dark:text-white font-bold">{form.metalPreference}</span></p>
                    <p>Gemstone: <span className="text-gold-700 dark:text-gold-300 font-bold">{form.estimatedCaratWeight}ct {form.gemstonePreference}</span></p>
                    <p>Budget: <span className="text-slate-900 dark:text-white font-bold">{form.budgetRangeUsd}</span></p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Private Client Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.clientName}
                      onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                      placeholder="e.g. Princess Noor Al-Sabah"
                      className="w-full rounded-2xl border border-slate-300 dark:border-gold-500/30 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Confidential Email
                    </label>
                    <input
                      type="email"
                      required
                      value={form.clientEmail}
                      onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                      placeholder="e.g. client@private-holding.com"
                      className="w-full rounded-2xl border border-slate-300 dark:border-gold-500/30 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Contact Phone & WhatsApp
                    </label>
                    <input
                      type="text"
                      value={form.clientPhone}
                      onChange={(e) => setForm({ ...form, clientPhone: e.target.value })}
                      placeholder="+971 50 123 4567"
                      className="w-full rounded-2xl border border-slate-300 dark:border-gold-500/30 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Country of Residence
                    </label>
                    <input
                      type="text"
                      required
                      value={form.clientCountry}
                      onChange={(e) => setForm({ ...form, clientCountry: e.target.value })}
                      placeholder="United Arab Emirates / United Kingdom / Canada"
                      className="w-full rounded-2xl border border-slate-300 dark:border-gold-500/30 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step Navigation Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-white/10">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex items-center space-x-2 rounded-2xl border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-obsidian-950 px-6 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous Step</span>
                </button>
              ) : <div />}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="flex items-center space-x-2 rounded-2xl bg-gold-500 hover:bg-gold-400 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-obsidian-950 shadow-md transition"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 rounded-2xl bg-gold-500 hover:bg-gold-400 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-obsidian-950 shadow-xl transition disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  <span>{isSubmitting ? 'Transmitting...' : 'Submit to Master Goldsmith'}</span>
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
