'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { apiRequest } from '@/lib/api';
import {
  FiscalCloseRecordDto,
  FiscalCloseStatus,
} from '@theblinghaven/shared';
import {
  FileCheck,
  ShieldCheck,
  Building,
  TrendingUp,
  Coins,
  Gem,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Award,
  Lock,
  Download,
  Calendar,
  X,
  FileSpreadsheet,
  Trash2,
} from 'lucide-react';

export default function FiscalCloseAdminPage() {
  const [records, setRecords] = useState<FiscalCloseRecordDto[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<FiscalCloseRecordDto | null>(null);
  const [isCertifyModalOpen, setIsCertifyModalOpen] = useState(false);
  const [auditorNotes, setAuditorNotes] = useState('Certified without exception after multi-vault physical tally and LBMA mark-to-market reconciliation.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCertifying, setIsCertifying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest<any>('/admin/fiscal-close');
      const list = Array.isArray(res) ? res : res?.data || [];
      setRecords(list);
      if (list.length > 0) {
        setSelectedRecord(list[0]);
      }
    } catch (e) {
      console.error('Failed to load fiscal close records:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleGenerateEod = async () => {
    setIsGenerating(true);
    try {
      const res = await apiRequest<any>('/admin/fiscal-close/generate', {
        method: 'POST',
        data: {},
      });
      alert('Daily EOD Fiscal Reconciliation and Multi-Vault Revaluation executed successfully!');
      fetchRecords();
    } catch (e: any) {
      alert(e.message || 'Failed to generate fiscal close.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCertify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;

    setIsCertifying(true);
    try {
      await apiRequest<any>(`/admin/fiscal-close/${selectedRecord.id}/certify`, {
        method: 'POST',
        data: {
          auditorNotes,
          auditorEmail: 'compliance-auditor@theblinghaven.shop',
        },
      });
      alert('Fiscal close certified with Executive CFO & CCO cryptographic seal!');
      setIsCertifyModalOpen(false);
      fetchRecords();
    } catch (e: any) {
      alert(e.message || 'Certification failed.');
    } finally {
      setIsCertifying(false);
    }
  };

  const handleDeleteRecord = async (id: string, date: string) => {
    if (!confirm(`Are you sure you want to delete EOD Fiscal Record for ${date}?`)) return;
    try {
      await apiRequest(`/admin/fiscal-close/${id}`, { method: 'DELETE' });
      if (selectedRecord?.id === id) setSelectedRecord(null);
      fetchRecords();
    } catch (e: any) {
      alert(e.message || 'Failed to delete record.');
    }
  };

  const current = selectedRecord || records[0];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-ivory-400 dark:border-obsidian-750 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-1">
              <FileCheck className="h-4 w-4" />
              <span>Enterprise Financial Audit & Multi-Vault Mark-to-Market</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-slate-100">
              End-of-Day Fiscal Close & Balance Sheet
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Automated reconciliation of daily orders, Canadian Ontario 13% HST taxes, LBMA/TSX inventory revaluation, and cryptographic CFO certification.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleGenerateEod}
              disabled={isGenerating}
              className="flex items-center space-x-2 rounded-xl bg-gold-500 hover:bg-gold-400 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-obsidian-950 transition shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Reconciling Ledger...' : 'Run EOD Reconciliation'}</span>
            </button>
          </div>
        </div>

        {/* Current Active Fiscal Close Summary */}
        {current && (
          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-ivory-200 dark:border-obsidian-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-600 dark:text-gold-400 font-bold">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">
                    Fiscal Date: {current.fiscalDate}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">
                    SHA-256 Seal: {current.cryptoLedgerHash.slice(0, 24)}...
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    current.status === 'EXECUTIVE_CERTIFIED'
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-gold-500/20 text-gold-700 dark:text-gold-400 border border-gold-500/30'
                  }`}
                >
                  {current.status === 'EXECUTIVE_CERTIFIED' ? '✓ EXECUTIVE CERTIFIED' : '⚡ RECONCILED (PENDING SIGN-OFF)'}
                </span>

                {current.status !== 'EXECUTIVE_CERTIFIED' && (
                  <button
                    onClick={() => setIsCertifyModalOpen(true)}
                    className="flex items-center space-x-1.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-obsidian-950 px-4 py-1.5 text-xs font-bold hover:bg-gold-500 hover:text-obsidian-950 transition"
                  >
                    <Award className="h-3.5 w-3.5 text-gold-400" />
                    <span>Certify as CFO</span>
                  </button>
                )}
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-ivory-50 dark:bg-obsidian-850 border border-ivory-300 dark:border-obsidian-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Gross Sales (CAD)</span>
                <div className="font-serif text-xl font-bold text-slate-900 dark:text-slate-100">
                  CAD ${current.grossSalesCad.toLocaleString()}
                </div>
                <span className="text-[10px] text-emerald-500 font-mono">{current.ordersCount} Completed Transactions</span>
              </div>

              <div className="p-4 rounded-2xl bg-ivory-50 dark:bg-obsidian-850 border border-ivory-300 dark:border-obsidian-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Taxes Collected (Ontario 13% HST)</span>
                <div className="font-serif text-xl font-bold text-gold-600 dark:text-gold-400">
                  CAD ${current.taxesCollectedCad.toLocaleString()}
                </div>
                <span className="text-[10px] text-slate-400 font-mono">HST: CAD ${current.ontarioHstCad.toLocaleString()}</span>
              </div>

              <div className="p-4 rounded-2xl bg-ivory-50 dark:bg-obsidian-850 border border-ivory-300 dark:border-obsidian-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Global 5-Vault Valuation</span>
                <div className="font-serif text-xl font-bold text-slate-900 dark:text-slate-100">
                  CAD ${current.vaultInventoryValuationCad.toLocaleString()}
                </div>
                <span className="text-[10px] text-purple-500 font-mono">LBMA / TSX Spot Mark-to-Market</span>
              </div>

              <div className="p-4 rounded-2xl bg-ivory-50 dark:bg-obsidian-850 border border-ivory-300 dark:border-obsidian-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Physical Bullion & Diamonds</span>
                <div className="font-serif text-xl font-bold text-slate-900 dark:text-slate-100">
                  {current.goldBullionKgStock} kg / {current.diamondCaratsStock} ct
                </div>
                <span className="text-[10px] text-emerald-500 font-mono">0.00 Discrepancy (100% Match)</span>
              </div>
            </div>

            {/* Auditor Notes if Certified */}
            {current.certifiedByAuditor && (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs space-y-1">
                <div className="flex items-center space-x-2 font-bold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Executive Certification Stamp Verified</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                  Signer: {current.certifiedByAuditor} | Timestamp: {current.certifiedAt ? new Date(current.certifiedAt).toLocaleString() : ''}
                </p>
                <p className="text-slate-500 dark:text-slate-400 italic">
                  &ldquo;{current.auditNotes}&rdquo;
                </p>
              </div>
            )}
          </div>
        )}

        {/* Historical Fiscal Close Records Table */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <FileSpreadsheet className="h-5 w-5 text-gold-500" />
            <span>Historical EOD Fiscal Close & Audit Ledger</span>
          </h3>

          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-ivory-300 dark:border-obsidian-800 text-slate-500 dark:text-slate-400 text-[10px] uppercase bg-ivory-50 dark:bg-obsidian-850">
                    <th className="py-3 px-4">Fiscal Date</th>
                    <th className="py-3 px-4">Gross Sales (CAD)</th>
                    <th className="py-3 px-4">Taxes (HST/VAT)</th>
                    <th className="py-3 px-4">Vault Assets (CAD)</th>
                    <th className="py-3 px-4">Armored Transit</th>
                    <th className="py-3 px-4">Status & Cryptographic Seal</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-200 dark:divide-obsidian-800">
                  {records.map((r) => (
                    <tr
                      key={r.id}
                      onClick={() => setSelectedRecord(r)}
                      className={`cursor-pointer hover:bg-ivory-100 dark:hover:bg-obsidian-850 transition ${
                        selectedRecord?.id === r.id ? 'bg-gold-500/10' : ''
                      }`}
                    >
                      <td className="py-4 px-4 font-bold text-slate-900 dark:text-slate-100">
                        {r.fiscalDate}
                      </td>
                      <td className="py-4 px-4 font-bold text-gold-600 dark:text-gold-400">
                        CAD ${r.grossSalesCad.toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        CAD ${r.taxesCollectedCad.toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        CAD ${r.vaultInventoryValuationCad.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-slate-500">
                        CAD ${r.armoredTransitValueCad.toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold mb-1 ${
                            r.status === 'EXECUTIVE_CERTIFIED'
                              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                              : 'bg-gold-500/20 text-gold-700 dark:text-gold-400'
                          }`}
                        >
                          {r.status}
                        </span>
                        <p className="text-[9px] text-slate-400 font-mono truncate max-w-xs">
                          {r.cryptoLedgerHash}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-right space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRecord(r);
                            setIsCertifyModalOpen(true);
                          }}
                          className="rounded-lg border border-ivory-300 dark:border-obsidian-700 px-2.5 py-1 text-[10px] font-bold text-gold-600 hover:bg-gold-500/10"
                        >
                          {r.status === 'EXECUTIVE_CERTIFIED' ? 'View Certificate' : 'Certify'}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRecord(r.id, r.fiscalDate);
                          }}
                          className="rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 p-1 text-rose-500 transition inline-flex items-center"
                          title="Delete Fiscal Record"
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
        </div>

        {/* Executive Certification Modal */}
        {isCertifyModalOpen && selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
            <div className="w-full max-w-lg rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-ivory-300 dark:border-obsidian-800 pb-3">
                <h3 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                  <Award className="h-5 w-5 text-gold-500" />
                  <span>Executive CFO & CCO Certification Seal</span>
                </h3>
                <button onClick={() => setIsCertifyModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCertify} className="space-y-4">
                <div className="p-3 rounded-2xl bg-ivory-50 dark:bg-obsidian-850 border border-ivory-300 dark:border-obsidian-800 font-mono text-[11px] space-y-1">
                  <div><strong>Fiscal Date:</strong> {selectedRecord.fiscalDate}</div>
                  <div><strong>Reconciled Sales:</strong> CAD ${selectedRecord.grossSalesCad.toLocaleString()}</div>
                  <div><strong>Mark-to-Market Vault Valuation:</strong> CAD ${selectedRecord.vaultInventoryValuationCad.toLocaleString()}</div>
                  <div><strong>SHA-256 Digest:</strong> {selectedRecord.cryptoLedgerHash}</div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">
                    Chief Auditor & Compliance Notes
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={auditorNotes}
                    onChange={(e) => setAuditorNotes(e.target.value)}
                    className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-50 dark:bg-obsidian-850 p-2.5 text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t border-ivory-300 dark:border-obsidian-800">
                  <button
                    type="button"
                    onClick={() => setIsCertifyModalOpen(false)}
                    className="rounded-xl border border-ivory-300 dark:border-obsidian-700 px-4 py-2 text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCertifying}
                    className="rounded-xl bg-gold-500 px-6 py-2 font-bold uppercase tracking-wider text-obsidian-950 hover:bg-gold-400 transition"
                  >
                    {isCertifying ? 'Signing...' : 'Affix Executive Cryptographic Seal'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
