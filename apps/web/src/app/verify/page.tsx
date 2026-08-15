'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Search,
  Award,
  Fingerprint,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

const SAMPLE_CERTS = [
  { num: 'TBH-CERT-2026-9001', title: 'The Sovereign 2.5ct Cushion Solitaire Ring', lab: 'GIA-6482910382' },
  { num: 'TBH-CERT-2026-9002', title: 'Imperial Emerald & Radiant Diamond Cocktail Ring', lab: 'GIA-2219847291' },
  { num: 'TBH-CERT-2026-9003', title: 'Maharani Royal Heritage Polki & Emerald Bridal Choker', lab: 'IGI-5829104829' },
  { num: 'TBH-CERT-2026-9004', title: 'Noor-E-Jahan Hand-Strung Basra Pearl & Polki Necklace', lab: 'GIA-5928103948' },
];

export default function VerifyIndexPage() {
  const router = useRouter();
  const [certInput, setCertInput] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certInput.trim()) return;
    router.push(`/verify/${encodeURIComponent(certInput.trim())}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10 sm:space-y-12">
      {/* Header */}
      <div className="text-center space-y-2.5">
        <div className="inline-flex items-center space-x-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1 text-xs font-mono tracking-widest text-gold-700 dark:text-gold-400 uppercase font-bold">
          <Fingerprint className="h-3.5 w-3.5" />
          <span>Maison Cryptographic Provenance Ledger</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
          Verify Gemological Certificate of Authenticity
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Authenticate any high-jewelry creation from The Bling Haven against immutable SHA-256 cryptographic records and GIA/IGI laboratory dossiers.
        </p>
      </div>

      {/* Search Box */}
      <form
        onSubmit={handleSearch}
        className="rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-[#0E0E14] p-6 sm:p-8 shadow-2xl space-y-4 text-xs font-mono"
      >
        <label className="block font-serif text-sm font-bold text-slate-900 dark:text-slate-200">
          Enter Certificate Serial Number or GIA Report #
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              required
              placeholder="e.g. TBH-CERT-2026-9001 or GIA-6482910382"
              value={certInput}
              onChange={(e) => setCertInput(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 dark:border-gold-500/30 bg-slate-50 dark:bg-white/5 pl-11 pr-4 py-3 text-sm font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-gold-500"
            />
          </div>
          <button
            type="submit"
            className="rounded-2xl bg-gold-500 hover:bg-gold-400 px-8 py-3 text-xs font-bold uppercase tracking-wider text-obsidian-950 transition flex items-center justify-center space-x-2 shadow-lg"
          >
            <span>Verify Passport</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>

      {/* Quick Access Samples */}
      <div className="space-y-4">
        <h3 className="font-serif text-sm font-bold text-slate-800 dark:text-slate-300">
          Inspect Registered Masterpiece Certificates
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SAMPLE_CERTS.map((s) => (
            <Link
              key={s.num}
              href={`/verify/${s.num}`}
              className="group rounded-2xl border border-slate-200 dark:border-gold-500/20 bg-white dark:bg-obsidian-900/60 p-4 hover:border-gold-500 transition flex items-center justify-between shadow-sm"
            >
              <div className="space-y-1">
                <span className="font-mono text-xs font-bold text-gold-700 dark:text-gold-400">
                  {s.num}
                </span>
                <p className="font-serif text-xs font-bold text-slate-900 dark:text-slate-200 line-clamp-1">
                  {s.title}
                </p>
                <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 block">
                  Dossier: {s.lab}
                </span>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-gold-500 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
