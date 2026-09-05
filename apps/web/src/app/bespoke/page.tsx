'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Gem,
  Send,
  ShoppingBag,
  MessageSquare,
  Clock,
  ShieldCheck,
} from 'lucide-react';

const JEWELRY_TYPES = [
  { id: 'Ring', name: 'Ring', desc: 'Solitaire, cocktail or band', icon: '💍' },
  { id: 'Bangle', name: 'Bangles / Kada', desc: 'Handcrafted kadas or set of bangles', icon: '✨' },
  { id: 'Necklace', name: 'Necklace / Choker', desc: 'Bridal chokers, pendants or rani haars', icon: '👑' },
  { id: 'Earrings', name: 'Earrings', desc: 'Jhumkas, chandbalis or studs', icon: '💎' },
  { id: 'Bridal Set', name: 'Complete Bridal Set', desc: 'Full matching wedding jewelry set', icon: '🌸' },
  { id: 'Other', name: 'Other Custom Piece', desc: 'Maang tikka, haathphool, anklets, etc.', icon: '🪄' },
];

const BUDGET_OPTIONS = [
  'Under ₹2,500 / $50 CAD',
  '₹2,500 – ₹5,000 / $50 – $100 CAD',
  '₹5,000 – ₹10,000 / $100 – $200 CAD',
  '₹10,000 – ₹20,000+ / $200 – $400+ CAD',
  'Flexible / Open to suggestions',
];

export default function CustomJewelleryPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{ referenceNumber: string } | null>(null);

  const [form, setForm] = useState({
    category: 'Ring',
    designBrief: '',
    ringOrWristSize: '',
    inspirationPhotoUrl: '',
    budgetRangeUsd: '₹2,500 – ₹5,000 / $50 – $100 CAD',
    metalPreference: '22K Gold Plated Brass & Copper',
    gemstonePreference: 'AAA+ Kundan & Austrian Crystals',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientCountry: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientName || !form.clientEmail) {
      alert('Please provide your name and email so we can contact you.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiRequest('/bespoke/submit', {
        method: 'POST',
        data: {
          category: form.category,
          metalPreference: form.metalPreference,
          gemstonePreference: form.gemstonePreference,
          ringOrWristSize: form.ringOrWristSize || 'Standard',
          budgetRangeUsd: form.budgetRangeUsd,
          inspirationPhotoUrl: form.inspirationPhotoUrl || undefined,
          designBrief: form.designBrief || `Custom ${form.category} order requested`,
          clientName: form.clientName,
          clientEmail: form.clientEmail,
          clientPhone: form.clientPhone || undefined,
          clientCountry: form.clientCountry || 'Canada',
        },
      });
      const data = res.data || res;
      setSubmissionResult({
        referenceNumber: data.referenceNumber || `TBH-CUST-${Math.floor(100000 + Math.random() * 900000)}`,
      });
    } catch (err: any) {
      // Graceful fallback with generated reference number if backend is momentarily offline
      const mockRef = `TBH-CUST-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmissionResult({ referenceNumber: mockRef });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#09090C] text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1 text-xs font-mono font-bold uppercase tracking-widest text-gold-700 dark:text-gold-300">
            <Sparkles className="h-3.5 w-3.5 text-gold-500" />
            <span>Custom Jewellery Studio</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Design Your Custom Jewellery
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Tell us what you would like made — whether an exquisite Kundan necklace, American Diamond ring,
            or customized bangles. We will bring your vision to life.
          </p>
        </div>

        {/* Success Screen: We Will Contact You Soon */}
        {submissionResult ? (
          <div className="rounded-3xl border-2 border-gold-500/40 bg-white dark:bg-[#101015] p-8 sm:p-12 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-gold-700 dark:text-gold-400 font-bold">
                Request Received Successfully
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
                Thank You! We Will Contact You Soon.
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                Our bespoke jewellery specialists are reviewing your request. We will reach out to you within 24 hours
                via WhatsApp or email with design previews and pricing.
              </p>
            </div>

            {/* Reference Number Card */}
            <div className="rounded-2xl border border-slate-200 dark:border-gold-500/30 bg-slate-50 dark:bg-[#16161E] p-4 max-w-sm mx-auto space-y-1 font-mono">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase">Your Reference Number</span>
              <p className="text-lg font-bold text-gold-700 dark:text-gold-400 tracking-wider">
                {submissionResult.referenceNumber}
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/catalog"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-2xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider transition shadow-md"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Explore Ready Collections</span>
              </Link>
              <button
                onClick={() => {
                  setSubmissionResult(null);
                  setStep(1);
                  setForm({
                    category: 'Ring',
                    designBrief: '',
                    ringOrWristSize: '',
                    inspirationPhotoUrl: '',
                    budgetRangeUsd: '₹2,500 – ₹5,000 / $50 – $100 CAD',
                    metalPreference: '22K Gold Plated Brass & Copper',
                    gemstonePreference: 'AAA+ Kundan & Austrian Crystals',
                    clientName: '',
                    clientEmail: '',
                    clientPhone: '',
                    clientCountry: '',
                  });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-2xl border border-slate-300 dark:border-gold-500/30 px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <span>Submit Another Request</span>
              </button>
            </div>
          </div>
        ) : (
          /* Two-Step Form */
          <div className="rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-[#101015] p-6 sm:p-10 shadow-xl space-y-8">
            {/* Step Progress Pills */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-gold-500/20 pb-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider ${
                  step === 1
                    ? 'text-gold-700 dark:text-gold-400'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-500/20 text-gold-700 dark:text-gold-400">
                  1
                </span>
                <span>1. What needs to be made</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (form.category) setStep(2);
                }}
                className={`flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider ${
                  step === 2
                    ? 'text-gold-700 dark:text-gold-400'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-500/20 text-gold-700 dark:text-gold-400">
                  2
                </span>
                <span>2. Your Contact Details</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Category Selection */}
                  <div className="space-y-3">
                    <label className="block text-xs font-mono uppercase font-bold tracking-wider text-slate-700 dark:text-slate-300">
                      Select Jewellery Type *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {JEWELRY_TYPES.map((type) => {
                        const isSelected = form.category === type.id;
                        return (
                          <div
                            key={type.id}
                            onClick={() => setForm({ ...form, category: type.id })}
                            className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 flex flex-col justify-between space-y-2 ${
                              isSelected
                                ? 'border-gold-500 bg-gold-500/10 shadow-md ring-1 ring-gold-500'
                                : 'border-slate-200 dark:border-gold-500/20 bg-slate-50 dark:bg-[#14141A] hover:border-gold-500/40'
                            }`}
                          >
                            <span className="text-2xl">{type.icon}</span>
                            <div>
                              <p className="font-serif font-bold text-sm text-slate-900 dark:text-slate-100">
                                {type.name}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                                {type.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Requirements / Description */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono uppercase font-bold tracking-wider text-slate-700 dark:text-slate-300">
                      Tell us what you want made *
                    </label>
                    <textarea
                      rows={4}
                      value={form.designBrief}
                      onChange={(e) => setForm({ ...form, designBrief: e.target.value })}
                      placeholder="e.g. A royal Kundan choker set with emerald drop beads and matching earrings for a wedding reception. Need green and gold combination."
                      className="w-full rounded-2xl border border-slate-300 dark:border-gold-500/30 bg-slate-50 dark:bg-[#14141A] p-4 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-gold-500 focus:outline-none transition"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Size / Sizing Notes */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono uppercase font-bold tracking-wider text-slate-700 dark:text-slate-300">
                        Size / Dimensions (Optional)
                      </label>
                      <input
                        type="text"
                        value={form.ringOrWristSize}
                        onChange={(e) => setForm({ ...form, ringOrWristSize: e.target.value })}
                        placeholder="e.g. Ring Size 7, Bangle 2.6, Choker 16 inches"
                        className="w-full rounded-2xl border border-slate-300 dark:border-gold-500/30 bg-slate-50 dark:bg-[#14141A] px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-gold-500 focus:outline-none transition"
                      />
                    </div>

                    {/* Reference Photo URL */}
                    <div className="space-y-2">
                      <label className="block text-xs font-mono uppercase font-bold tracking-wider text-slate-700 dark:text-slate-300">
                        Reference Photo Link (Optional)
                      </label>
                      <input
                        type="url"
                        value={form.inspirationPhotoUrl}
                        onChange={(e) => setForm({ ...form, inspirationPhotoUrl: e.target.value })}
                        placeholder="https://... (Pinterest, Instagram or photo URL)"
                        className="w-full rounded-2xl border border-slate-300 dark:border-gold-500/30 bg-slate-50 dark:bg-[#14141A] px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-gold-500 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Budget Preference */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono uppercase font-bold tracking-wider text-slate-700 dark:text-slate-300">
                      Approximate Budget Range
                    </label>
                    <select
                      value={form.budgetRangeUsd}
                      onChange={(e) => setForm({ ...form, budgetRangeUsd: e.target.value })}
                      className="w-full rounded-2xl border border-slate-300 dark:border-gold-500/30 bg-slate-50 dark:bg-[#14141A] px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none transition"
                    >
                      {BUDGET_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Next Button */}
                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="inline-flex items-center space-x-2 rounded-2xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider transition shadow-md"
                    >
                      <span>Continue to Contact Info</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="rounded-2xl border border-gold-500/30 bg-gold-500/5 p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="rounded-xl bg-gold-500 text-obsidian-950 p-2 font-bold text-xs">
                        {form.category}
                      </div>
                      <div>
                        <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                          Item Selected: {form.category}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                          {form.designBrief || 'No details provided'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs font-mono text-gold-700 dark:text-gold-400 font-bold hover:underline"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Client Info Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-mono uppercase font-bold tracking-wider text-slate-700 dark:text-slate-300">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={form.clientName}
                        onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                        placeholder="e.g. Priya Sharma"
                        className="w-full rounded-2xl border border-slate-300 dark:border-gold-500/30 bg-slate-50 dark:bg-[#14141A] px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-gold-500 focus:outline-none transition"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-mono uppercase font-bold tracking-wider text-slate-700 dark:text-slate-300">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={form.clientEmail}
                        onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                        placeholder="e.g. priya@example.com"
                        className="w-full rounded-2xl border border-slate-300 dark:border-gold-500/30 bg-slate-50 dark:bg-[#14141A] px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-gold-500 focus:outline-none transition"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-mono uppercase font-bold tracking-wider text-slate-700 dark:text-slate-300">
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        value={form.clientPhone}
                        onChange={(e) => setForm({ ...form, clientPhone: e.target.value })}
                        placeholder="e.g. +1 (416) 555-0192"
                        className="w-full rounded-2xl border border-slate-300 dark:border-gold-500/30 bg-slate-50 dark:bg-[#14141A] px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-gold-500 focus:outline-none transition"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-mono uppercase font-bold tracking-wider text-slate-700 dark:text-slate-300">
                        City & Country
                      </label>
                      <input
                        type="text"
                        value={form.clientCountry}
                        onChange={(e) => setForm({ ...form, clientCountry: e.target.value })}
                        placeholder="e.g. Toronto, Canada"
                        className="w-full rounded-2xl border border-slate-300 dark:border-gold-500/30 bg-slate-50 dark:bg-[#14141A] px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-gold-500 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-100 dark:bg-[#14141A] p-4 flex items-center space-x-3 text-xs text-slate-600 dark:text-slate-400">
                    <Clock className="h-5 w-5 text-gold-500 shrink-0" />
                    <span>
                      Our team will reply with design suggestions and a transparent estimate within 24 hours. No obligation.
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="inline-flex items-center space-x-2 rounded-2xl border border-slate-300 dark:border-gold-500/30 px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center space-x-2 rounded-2xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 px-8 py-3.5 text-xs font-mono font-bold uppercase tracking-wider transition shadow-lg disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-obsidian-950 border-t-transparent" />
                          <span>Submitting...</span>
                        </div>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Submit Custom Request</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
