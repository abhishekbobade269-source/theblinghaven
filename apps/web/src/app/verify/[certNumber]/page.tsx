'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import {
  CertificateVerificationResultDto,
} from '@theblinghaven/shared';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  Lock,
  Printer,
  ExternalLink,
  Fingerprint,
  Gem,
  Coins,
  History,
  ArrowLeft,
  AlertTriangle,
  QrCode,
  Share2,
} from 'lucide-react';

export default function CertificateDetailPage() {
  const params = useParams();
  const certNumber = params.certNumber as string;

  const [result, setResult] = useState<CertificateVerificationResultDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVerification = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await apiRequest<any>(`/certificates/verify/${encodeURIComponent(certNumber)}`);
        setResult(res?.data || res);
      } catch (e: any) {
        setError(e.message || 'Certificate not found.');
      } finally {
        setIsLoading(false);
      }
    };
    if (certNumber) {
      fetchVerification();
    }
  }, [certNumber]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="h-10 w-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="font-mono text-xs text-gold-400 uppercase tracking-widest">
          Authenticating Cryptographic Provenance...
        </p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="h-16 w-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-slate-100">
          Certificate Not Found
        </h2>
        <p className="text-xs text-slate-400 font-mono">
          Certificate #{certNumber} was not found in the Maison Provenance Vault. Please verify the serial number.
        </p>
        <Link
          href="/verify"
          className="inline-flex items-center space-x-2 rounded-xl bg-gold-500 px-6 py-2.5 text-xs font-bold text-obsidian-950 uppercase"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Verification Desk</span>
        </Link>
      </div>
    );
  }

  const cert = result.certificate;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Back Link & Title */}
      <div className="flex items-center justify-between border-b border-gold-500/20 pb-4">
        <Link
          href="/verify"
          className="flex items-center space-x-2 text-xs font-mono text-slate-400 hover:text-gold-400 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Verification Desk</span>
        </Link>

        <button
          onClick={() => window.print()}
          className="flex items-center space-x-1.5 rounded-xl border border-gold-500/30 bg-white/5 px-4 py-2 text-xs font-mono text-gold-400 hover:bg-gold-500 hover:text-obsidian-950 transition"
        >
          <Printer className="h-4 w-4" />
          <span>Print Digital Passport</span>
        </button>
      </div>

      {/* Main Luxury Certificate Card */}
      <div className="rounded-3xl border-2 border-gold-500/40 bg-gradient-to-b from-obsidian-900 to-obsidian-950 p-6 sm:p-10 shadow-2xl space-y-8 text-slate-100 relative overflow-hidden">
        {/* Decorative Watermark */}
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Award className="h-96 w-96 text-gold-400" />
        </div>

        {/* Header Ribbon */}
        <div className="text-center space-y-2 border-b border-gold-500/30 pb-6 relative z-10">
          <div className="flex items-center justify-center space-x-2 text-gold-400 font-mono text-xs tracking-widest uppercase">
            <Fingerprint className="h-4 w-4" />
            <span>Maison de Haute Joaillerie • Provenance Ledger</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gold-300">
            Certificate of Authenticity
          </h1>
          <p className="font-mono text-xs text-slate-400">
            Official Serial: <strong className="text-gold-400">{cert.certificateNumber}</strong>
          </p>

          {/* Verification Status Badge */}
          <div className="inline-flex items-center space-x-2 rounded-full bg-emerald-500/15 border border-emerald-500/40 px-4 py-1.5 text-xs font-mono font-bold text-emerald-400 mt-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>AUTHENTIC & CRYPTOGRAPHICALLY VERIFIED</span>
          </div>
        </div>

        {/* Masterpiece Title */}
        <div className="text-center space-y-1 relative z-10">
          <h2 className="font-serif text-2xl font-bold text-slate-100">
            {cert.productTitle}
          </h2>
          <span className="font-mono text-xs text-gold-400">
            Creation SKU: {cert.sku}
          </span>
        </div>

        {/* 4Cs & Metallurgical Specs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 text-xs font-mono">
          {/* Diamond 4Cs Analysis */}
          <div className="rounded-2xl bg-white/5 border border-gold-500/20 p-5 space-y-3">
            <div className="flex items-center space-x-2 text-gold-400 font-serif font-bold text-sm border-b border-white/10 pb-2">
              <Gem className="h-4 w-4" />
              <span>Diamond 4Cs Gemological Dossier</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-slate-400">Carat Weight:</span>
              <strong className="text-gold-400 font-bold">{cert.caratWeight} ct</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-slate-400">Color Grade:</span>
              <strong className="text-slate-200">{cert.colorGrade}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-slate-400">Clarity Grade:</span>
              <strong className="text-slate-200">{cert.clarityGrade}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-slate-400">Cut & Symmetry:</span>
              <strong className="text-slate-200">{cert.cutGrade}</strong>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Accredited Laboratory:</span>
              <strong className="text-gold-300">{cert.gemstoneReportNumber}</strong>
            </div>
          </div>

          {/* Metallurgical Provenance */}
          <div className="rounded-2xl bg-white/5 border border-gold-500/20 p-5 space-y-3">
            <div className="flex items-center space-x-2 text-gold-400 font-serif font-bold text-sm border-b border-white/10 pb-2">
              <Coins className="h-4 w-4" />
              <span>Metallurgical & Hallmarking Provenance</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-slate-400">Precious Metal Alloy:</span>
              <strong className="text-slate-200">{cert.metalType}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-slate-400">Purity Standard:</span>
              <strong className="text-slate-200">{cert.metalPurity}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-slate-400">Net Gold Weight:</span>
              <strong className="text-slate-200">{cert.netGoldWeightGrams}g</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-slate-400">BIS Hallmark (HUID):</span>
              <strong className="text-emerald-400">{cert.bisHallmarkStamp}</strong>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Current Registered Patron:</span>
              <strong className="text-slate-200 truncate max-w-[180px]">{cert.ownerName}</strong>
            </div>
          </div>
        </div>

        {/* Chain of Custody & Ownership History */}
        <div className="space-y-3 relative z-10">
          <div className="flex items-center space-x-2 font-serif text-sm font-bold text-gold-400">
            <History className="h-4 w-4" />
            <span>Immutable Provenance Chain & Ownership Transfers</span>
          </div>

          <div className="rounded-2xl bg-white/5 p-5 border border-gold-500/20 space-y-3 text-xs font-mono">
            {cert.transferHistory.map((h, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0 gap-1"
              >
                <div>
                  <span className="text-gold-300 font-bold">{h.toOwner}</span>
                  <span className="text-slate-400 text-[11px] block">{h.transferReason}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 text-[10px] block">
                    {new Date(h.timestamp).toLocaleDateString()}
                  </span>
                  {h.transactionHash && (
                    <span className="text-[9px] font-mono text-gold-500/70">{h.transactionHash}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cryptographic SHA-256 Signature Stamp */}
        <div className="rounded-2xl bg-gold-500/10 p-5 border border-gold-500/30 space-y-2 text-xs font-mono relative z-10">
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1.5 font-bold text-gold-400">
              <Lock className="h-4 w-4" />
              <span>SHA-256 Provenance Fingerprint</span>
            </span>
            <span className="text-emerald-400 text-[11px] font-bold">✓ Central Vault Match</span>
          </div>
          <p className="text-slate-300 text-[11px] break-all">
            {cert.cryptographicHash}
          </p>
        </div>
      </div>
    </div>
  );
}
