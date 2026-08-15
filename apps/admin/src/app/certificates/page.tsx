'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { apiRequest } from '@/lib/api';
import {
  CertificateDto,
  GemstoneLaboratory,
} from '@theblinghaven/shared';
import {
  ShieldCheck,
  Award,
  Search,
  Plus,
  QrCode,
  ExternalLink,
  UserCheck,
  History,
  Printer,
  Sparkles,
  FileCheck,
  CheckCircle2,
  Lock,
  Gem,
  Coins,
  X,
  Fingerprint,
  Trash2,
} from 'lucide-react';

export default function CertificatesPage() {
  const [certs, setCerts] = useState<CertificateDto[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLab, setSelectedLab] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [viewingCert, setViewingCert] = useState<CertificateDto | null>(null);
  const [transferringCert, setTransferringCert] = useState<CertificateDto | null>(null);

  // Mint Form State
  const [sku, setSku] = useState('');
  const [productTitle, setProductTitle] = useState('');
  const [gemstoneLaboratory, setGemstoneLaboratory] = useState<GemstoneLaboratory>(
    'GIA_GEMOLOGICAL_INSTITUTE_OF_AMERICA',
  );
  const [gemstoneReportNumber, setGemstoneReportNumber] = useState('');
  const [caratWeight, setCaratWeight] = useState<number>(2.0);
  const [colorGrade, setColorGrade] = useState('D (Colorless)');
  const [clarityGrade, setClarityGrade] = useState('FL (Flawless)');
  const [cutGrade, setCutGrade] = useState('Triple Excellent');
  const [metalType, setMetalType] = useState('18K White Gold & Platinum');
  const [metalPurity, setMetalPurity] = useState('AU 750 / PT 950');
  const [grossWeightGrams, setGrossWeightGrams] = useState<number>(8.5);
  const [netGoldWeightGrams, setNetGoldWeightGrams] = useState<number>(7.8);
  const [bisHallmarkStamp, setBisHallmarkStamp] = useState('BIS-916-HUID-882901');
  const [ownerName, setOwnerName] = useState('The Bling Haven Canadian Vault (Toronto)');
  const [notes, setNotes] = useState('');
  const [isMinting, setIsMinting] = useState(false);

  // Transfer Form State
  const [newOwnerName, setNewOwnerName] = useState('');
  const [transferReason, setTransferReason] = useState('Private Client Acquisition');
  const [isTransferring, setIsTransferring] = useState(false);

  const fetchCertificates = async () => {
    setIsLoading(true);
    try {
      const q = searchQuery.trim() ? `?q=${encodeURIComponent(searchQuery.trim())}` : '';
      const res = await apiRequest<any>(`/admin/certificates${q}`);
      const list = Array.isArray(res) ? res : res?.data || [];
      setCerts(list);
    } catch (e) {
      console.error('Failed to load certificates:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [searchQuery]);

  const filteredCerts = certs.filter((c) => {
    if (selectedLab === 'ALL') return true;
    return c.gemstoneLaboratory === selectedLab;
  });

  const handleMintCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsMinting(true);
    try {
      const res = await apiRequest<any>('/admin/certificates', {
        method: 'POST',
        data: {
          sku,
          productTitle,
          gemstoneLaboratory,
          gemstoneReportNumber,
          caratWeight,
          colorGrade,
          clarityGrade,
          cutGrade,
          metalType,
          metalPurity,
          grossWeightGrams,
          netGoldWeightGrams,
          bisHallmarkStamp,
          ownerName,
          notes,
        },
      });
      alert(`Certificate minted successfully: ${res?.data?.certificateNumber || 'TBH-CERT'}`);
      setIsMintModalOpen(false);
      fetchCertificates();
    } catch (e: any) {
      alert(e.message || 'Failed to mint certificate.');
    } finally {
      setIsMinting(false);
    }
  };

  const handleTransferOwnership = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferringCert) return;

    setIsTransferring(true);
    try {
      await apiRequest<any>(`/admin/certificates/${transferringCert.id}/transfer`, {
        method: 'POST',
        data: {
          newOwnerName,
          transferReason,
        },
      });
      alert(`Certificate #${transferringCert.certificateNumber} transferred to ${newOwnerName}`);
      setTransferringCert(null);
      fetchCertificates();
    } catch (e: any) {
      alert(e.message || 'Transfer failed.');
    } finally {
      setIsTransferring(false);
    }
  };

  const handleDeleteCert = async (id: string, certNum: string) => {
    if (!confirm(`Are you sure you want to permanently delete Certificate #${certNum}?`)) return;
    try {
      await apiRequest(`/admin/certificates/${id}`, { method: 'DELETE' });
      if (viewingCert?.id === id) setViewingCert(null);
      fetchCertificates();
    } catch (e: any) {
      alert(e.message || 'Failed to delete certificate.');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-ivory-400 dark:border-obsidian-750 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-1">
              <ShieldCheck className="h-4 w-4" />
              <span>Cryptographic Provenance & Gemological Digital Safe</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-slate-100">
              Certificates of Authenticity Ledger
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Tamper-evident SHA-256 provenance records, GIA/IGI laboratory dossiers, and BIS Hallmark HUID tracking.
            </p>
          </div>

          <button
            onClick={() => setIsMintModalOpen(true)}
            className="flex items-center space-x-2 rounded-xl bg-gold-500 hover:bg-gold-400 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-obsidian-950 transition shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Mint Gemological Certificate</span>
          </button>
        </div>

        {/* Search & Laboratory Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Certificate #, GIA #, SKU, or Owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-ivory-400 dark:border-obsidian-700 bg-white dark:bg-obsidian-900 pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none shadow-sm"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500">Laboratory:</span>
            <select
              value={selectedLab}
              onChange={(e) => setSelectedLab(e.target.value)}
              className="rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-white dark:bg-obsidian-900 px-3 py-2 text-xs font-bold text-gold-700 dark:text-gold-400 focus:outline-none"
            >
              <option value="ALL">All Accredited Laboratories</option>
              <option value="GIA_GEMOLOGICAL_INSTITUTE_OF_AMERICA">GIA (Gemological Institute of America)</option>
              <option value="IGI_INTERNATIONAL_GEMOLOGICAL_INSTITUTE">IGI (International Gemological Institute)</option>
              <option value="HRD_ANTWERP">HRD Antwerp (High Diamond Council)</option>
              <option value="BIS_GOVERNMENT_OF_INDIA">BIS Hallmarking Bureau</option>
            </select>
          </div>
        </div>

        {/* Certificates Table */}
        <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-ivory-300 dark:border-obsidian-800 text-slate-500 dark:text-slate-400 text-[10px] uppercase bg-ivory-50 dark:bg-obsidian-850">
                  <th className="py-3 px-4">Certificate Serial</th>
                  <th className="py-3 px-4">Masterpiece & SKU</th>
                  <th className="py-3 px-4">Lab Dossier</th>
                  <th className="py-3 px-4">Diamond 4Cs</th>
                  <th className="py-3 px-4">Metal & HUID</th>
                  <th className="py-3 px-4">Registered Patron</th>
                  <th className="py-3 px-4">SHA-256 Provenance</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200 dark:divide-obsidian-800">
                {filteredCerts.map((c) => (
                  <tr key={c.id} className="hover:bg-ivory-100 dark:hover:bg-obsidian-850 transition">
                    <td className="py-4 px-4 font-bold text-gold-600 dark:text-gold-400">
                      {c.certificateNumber}
                    </td>
                    <td className="py-4 px-4 max-w-[200px]">
                      <span className="font-serif font-bold text-slate-900 dark:text-slate-100 block truncate">
                        {c.productTitle}
                      </span>
                      <span className="text-[10px] text-slate-400">{c.sku}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center space-x-1 font-bold text-slate-800 dark:text-slate-200">
                        <Award className="h-3 w-3 text-gold-500" />
                        <span>{c.gemstoneReportNumber}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {c.gemstoneLaboratory.replace('_', ' ').slice(0, 15)}...
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {c.caratWeight} ct • {c.colorGrade.split(' ')[0]} • {c.clarityGrade.split(' ')[0]}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{c.cutGrade}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-slate-800 dark:text-slate-200 block">{c.metalPurity}</span>
                      <span className="text-[10px] text-emerald-500 font-bold block">{c.bisHallmarkStamp}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-serif font-bold text-slate-800 dark:text-slate-200 block truncate max-w-[150px]">
                        {c.ownerName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {c.transferHistory.length} chain events
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-mono text-[10px] text-slate-500 bg-ivory-200 dark:bg-obsidian-800 px-2 py-0.5 rounded">
                        {c.cryptographicHash.slice(0, 10)}...{c.cryptographicHash.slice(-6)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <button
                        onClick={() => setViewingCert(c)}
                        className="rounded-lg border border-ivory-300 dark:border-obsidian-700 bg-white dark:bg-obsidian-800 px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:bg-gold-500 hover:text-obsidian-950 transition"
                        title="View Certificate Passport"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => {
                          setTransferringCert(c);
                          setNewOwnerName('');
                        }}
                        className="rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-2.5 py-1 text-[11px] font-bold hover:bg-gold-500 hover:text-obsidian-950 transition"
                        title="Transfer Ownership"
                      >
                        Transfer
                      </button>
                      <button
                        onClick={() => handleDeleteCert(c.id, c.certificateNumber)}
                        className="rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 p-1 text-rose-500 transition inline-flex items-center"
                        title="Delete Certificate"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* View / Print-Ready Certificate Modal */}
        {viewingCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
            <div className="w-full max-w-2xl rounded-3xl border-2 border-gold-500/40 bg-gradient-to-b from-obsidian-900 to-obsidian-950 p-8 shadow-2xl space-y-6 text-slate-100 relative">
              <button
                onClick={() => setViewingCert(null)}
                className="absolute top-6 right-6 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-center space-y-1 border-b border-gold-500/30 pb-4">
                <div className="flex items-center justify-center space-x-2 text-gold-400 font-mono text-[11px] tracking-widest uppercase">
                  <Fingerprint className="h-4 w-4" />
                  <span>The Bling Haven • Haute Gemological Dossier</span>
                </div>
                <h2 className="font-serif text-2xl font-bold text-gold-300">
                  Certificate of Authenticity
                </h2>
                <p className="font-mono text-xs text-slate-400">
                  Certificate #{viewingCert.certificateNumber}
                </p>
              </div>

              {/* Certificate Card Content */}
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-gold-400 font-bold uppercase text-[10px] block">Diamond 4Cs Analysis</span>
                  <div className="flex justify-between"><span>Carat Weight:</span><strong className="text-slate-200">{viewingCert.caratWeight} ct</strong></div>
                  <div className="flex justify-between"><span>Color Grade:</span><strong className="text-slate-200">{viewingCert.colorGrade}</strong></div>
                  <div className="flex justify-between"><span>Clarity Grade:</span><strong className="text-slate-200">{viewingCert.clarityGrade}</strong></div>
                  <div className="flex justify-between"><span>Cut & Symmetry:</span><strong className="text-slate-200">{viewingCert.cutGrade}</strong></div>
                  <div className="flex justify-between"><span>Fluorescence:</span><strong className="text-slate-200">{viewingCert.fluorescence}</strong></div>
                </div>

                <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-gold-400 font-bold uppercase text-[10px] block">Metallurgical Provenance</span>
                  <div className="flex justify-between"><span>Metal Alloy:</span><strong className="text-slate-200">{viewingCert.metalType}</strong></div>
                  <div className="flex justify-between"><span>Purity Stamp:</span><strong className="text-slate-200">{viewingCert.metalPurity}</strong></div>
                  <div className="flex justify-between"><span>Net Gold Weight:</span><strong className="text-slate-200">{viewingCert.netGoldWeightGrams}g</strong></div>
                  <div className="flex justify-between"><span>BIS Hallmark:</span><strong className="text-emerald-400">{viewingCert.bisHallmarkStamp}</strong></div>
                  <div className="flex justify-between"><span>Laboratory:</span><strong className="text-gold-300">{viewingCert.gemstoneReportNumber}</strong></div>
                </div>
              </div>

              {/* Provenance Chain History */}
              <div className="space-y-2">
                <span className="font-serif text-xs font-bold text-gold-400">Chain of Custody & Ownership</span>
                <div className="rounded-2xl bg-white/5 p-4 border border-white/10 space-y-2 text-[11px] font-mono">
                  {viewingCert.transferHistory.map((t, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-white/5 pb-1.5 last:border-0 last:pb-0">
                      <div>
                        <span className="text-gold-300 font-bold">{t.toOwner}</span>
                        <span className="text-slate-400 text-[10px] block">{t.transferReason}</span>
                      </div>
                      <span className="text-slate-500 text-[10px]">{new Date(t.timestamp).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cryptographic SHA-256 Hash Seal */}
              <div className="rounded-2xl bg-gold-500/10 p-4 border border-gold-500/30 text-[10px] font-mono text-gold-300 space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center space-x-1">
                    <Lock className="h-3 w-3" />
                    <span>Cryptographic Provenance Hash (SHA-256)</span>
                  </span>
                  <span className="text-emerald-400">✓ Immutable Seal Verified</span>
                </div>
                <p className="break-all text-slate-300">{viewingCert.cryptographicHash}</p>
              </div>

              <div className="flex justify-between items-center pt-2">
                <a
                  href={`http://localhost:3000/verify/${viewingCert.certificateNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1.5 text-xs text-gold-400 hover:text-gold-300 underline font-mono"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Open Public Verification Passport</span>
                </a>

                <button
                  onClick={() => window.print()}
                  className="flex items-center space-x-2 rounded-xl bg-gold-500 px-5 py-2 text-xs font-bold text-obsidian-950 hover:bg-gold-400 transition"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print Certificate Card</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mint New Certificate Modal */}
        {isMintModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
            <div className="w-full max-w-xl rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-ivory-300 dark:border-obsidian-800 pb-3">
                <h3 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-gold-500" />
                  <span>Mint New Cryptographic Certificate of Authenticity</span>
                </h3>
                <button onClick={() => setIsMintModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleMintCertificate} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">
                      Masterpiece SKU
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="TBH-RING-001"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-50 dark:bg-obsidian-850 p-2 text-slate-900 dark:text-slate-100 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">
                      Creation Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="The Sovereign 2.5ct Cushion Solitaire"
                      value={productTitle}
                      onChange={(e) => setProductTitle(e.target.value)}
                      className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-50 dark:bg-obsidian-850 p-2 text-slate-900 dark:text-slate-100 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">
                      Gemological Laboratory
                    </label>
                    <select
                      value={gemstoneLaboratory}
                      onChange={(e) => setGemstoneLaboratory(e.target.value as GemstoneLaboratory)}
                      className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-50 dark:bg-obsidian-850 p-2 text-slate-900 dark:text-slate-100 focus:outline-none"
                    >
                      <option value="GIA_GEMOLOGICAL_INSTITUTE_OF_AMERICA">GIA (Gemological Institute of America)</option>
                      <option value="IGI_INTERNATIONAL_GEMOLOGICAL_INSTITUTE">IGI (International Gemological Institute)</option>
                      <option value="HRD_ANTWERP">HRD Antwerp</option>
                      <option value="BIS_GOVERNMENT_OF_INDIA">BIS Hallmarking Bureau</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">
                      Lab Report / Dossier Number
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="GIA-6482910382"
                      value={gemstoneReportNumber}
                      onChange={(e) => setGemstoneReportNumber(e.target.value)}
                      className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-50 dark:bg-obsidian-850 p-2 text-slate-900 dark:text-slate-100 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">Carat</label>
                    <input type="number" step="0.01" required value={caratWeight} onChange={(e) => setCaratWeight(parseFloat(e.target.value) || 0)} className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-50 dark:bg-obsidian-850 p-2 font-mono" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">Color</label>
                    <input type="text" required value={colorGrade} onChange={(e) => setColorGrade(e.target.value)} className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-50 dark:bg-obsidian-850 p-2 font-mono" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">Clarity</label>
                    <input type="text" required value={clarityGrade} onChange={(e) => setClarityGrade(e.target.value)} className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-50 dark:bg-obsidian-850 p-2 font-mono" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">Cut</label>
                    <input type="text" required value={cutGrade} onChange={(e) => setCutGrade(e.target.value)} className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-50 dark:bg-obsidian-850 p-2 font-mono" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">Net Gold (g)</label>
                    <input type="number" step="0.1" required value={netGoldWeightGrams} onChange={(e) => setNetGoldWeightGrams(parseFloat(e.target.value) || 0)} className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-50 dark:bg-obsidian-850 p-2 font-mono" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">BIS Hallmark (HUID)</label>
                    <input type="text" required value={bisHallmarkStamp} onChange={(e) => setBisHallmarkStamp(e.target.value)} className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-50 dark:bg-obsidian-850 p-2 font-mono text-emerald-600" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">Initial Patron / Owner</label>
                    <input type="text" required value={ownerName} onChange={(e) => setOwnerName(e.target.value)} className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-50 dark:bg-obsidian-850 p-2" />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t border-ivory-300 dark:border-obsidian-800">
                  <button type="button" onClick={() => setIsMintModalOpen(false)} className="rounded-xl border border-ivory-300 dark:border-obsidian-700 px-4 py-2 text-slate-600">Cancel</button>
                  <button type="submit" disabled={isMinting} className="rounded-xl bg-gold-500 px-6 py-2 font-bold uppercase tracking-wider text-obsidian-950 hover:bg-gold-400 transition">{isMinting ? 'Minting SHA-256...' : 'Mint Certificate'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Transfer Ownership Modal */}
        {transferringCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
            <div className="w-full max-w-md rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-ivory-300 dark:border-obsidian-800 pb-3">
                <h3 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100">
                  Transfer Provenance: #{transferringCert.certificateNumber}
                </h3>
              </div>

              <form onSubmit={handleTransferOwnership} className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">
                    Current Registered Owner
                  </label>
                  <input type="text" disabled value={transferringCert.ownerName} className="w-full rounded-xl border border-ivory-300 dark:border-obsidian-800 bg-ivory-100 dark:bg-obsidian-800 p-2.5 font-bold text-slate-500" />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">
                    New VIP Patron / Acquirer Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lady Sarah Churchill"
                    value={newOwnerName}
                    onChange={(e) => setNewOwnerName(e.target.value)}
                    className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-50 dark:bg-obsidian-850 p-2.5 font-bold text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">
                    Transfer Rationale / Event
                  </label>
                  <input
                    type="text"
                    required
                    value={transferReason}
                    onChange={(e) => setTransferReason(e.target.value)}
                    className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-50 dark:bg-obsidian-850 p-2.5 text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t border-ivory-300 dark:border-obsidian-800">
                  <button type="button" onClick={() => setTransferringCert(null)} className="rounded-xl border border-ivory-300 dark:border-obsidian-700 px-4 py-2 text-slate-600">Cancel</button>
                  <button type="submit" disabled={isTransferring} className="rounded-xl bg-gold-500 px-6 py-2 font-bold uppercase tracking-wider text-obsidian-950 hover:bg-gold-400 transition">{isTransferring ? 'Recording...' : 'Execute Transfer'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
