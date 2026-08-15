'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { apiRequest } from '@/lib/api';
import { TaxRuleDto, TaxCalculationResultDto } from '@theblinghaven/shared';
import {
  Globe2,
  RefreshCw,
  Edit,
  Save,
  CheckCircle2,
  AlertCircle,
  Landmark,
  Calculator,
  ShieldCheck,
  DollarSign,
  X,
} from 'lucide-react';

export default function TaxesAndCustomsPage() {
  const [rules, setRules] = useState<TaxRuleDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingRule, setEditingRule] = useState<TaxRuleDto | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Dynamic Calculator Simulator state
  const [simCountry, setSimCountry] = useState('GB');
  const [simSubtotal, setSimSubtotal] = useState<number>(18500);
  const [simCurrency, setSimCurrency] = useState('GBP');
  const [calcResult, setCalcResult] = useState<TaxCalculationResultDto | null>(null);

  const fetchTaxRules = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest<any>('/admin/taxes');
      setRules(Array.isArray(res) ? res : res?.data || []);
    } catch (e) {
      console.error('Failed to load tax rules:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxRules();
  }, []);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRule) return;

    setIsSaving(true);
    try {
      await apiRequest(`/admin/taxes/${editingRule.id}`, {
        method: 'PUT',
        data: {
          taxName: editingRule.taxName,
          taxRatePercent: editingRule.taxRatePercent,
          customsDutyPercent: editingRule.customsDutyPercent,
          isTaxIncludedInPrice: editingRule.isTaxIncludedInPrice,
          isActive: editingRule.isActive,
          notes: editingRule.notes,
        },
      });
      alert(`Updated tax and customs rule for ${editingRule.countryName}.`);
      setEditingRule(null);
      fetchTaxRules();
    } catch (e: any) {
      alert(e.message || 'Failed to update tax rule.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSimulate = async () => {
    try {
      const res = await apiRequest<any>('/taxes/calculate', {
        method: 'POST',
        data: {
          countryCode: simCountry,
          subtotalUsd: simSubtotal,
          currencyCode: simCurrency,
        },
      });
      setCalcResult(res.data || res);
    } catch (e) {
      console.error('Tax calculation failed:', e);
    }
  };

  useEffect(() => {
    if (rules.length > 0) {
      handleSimulate();
    }
  }, [simCountry, simSubtotal, simCurrency, rules]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-ivory-400 dark:border-obsidian-750 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-1">
              <Landmark className="h-4 w-4" />
              <span>Cross-Border Fiscal Compliance & Customs Engine</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-slate-100">
              Global Taxes, VAT & Customs Duties
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Configure jurisdiction VAT, state sales taxes, GST, and precious gemstone customs duties.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchTaxRules}
              className="rounded-lg border border-ivory-400 dark:border-obsidian-700 bg-white dark:bg-obsidian-850 p-2.5 text-slate-600 dark:text-slate-300 hover:bg-ivory-100 dark:hover:bg-obsidian-800"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Tax Rules Table */}
        <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-ivory-300 dark:border-obsidian-800 pb-3">
            <div>
              <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-slate-100">
                Country & Regional Fiscal Jurisdiction Table
              </h2>
              <p className="text-xs text-slate-500">
                10 international jurisdictions with automated checkout tax calculation.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[900px]">
              <thead>
                <tr className="border-b border-ivory-300 dark:border-obsidian-800 text-slate-500 dark:text-slate-400">
                  <th className="pb-3 font-bold uppercase tracking-wider">Country & Region</th>
                  <th className="pb-3 font-bold uppercase tracking-wider">Tax Scheme Name</th>
                  <th className="pb-3 font-bold uppercase tracking-wider">Tax Rate (%)</th>
                  <th className="pb-3 font-bold uppercase tracking-wider">Customs Duty (%)</th>
                  <th className="pb-3 font-bold uppercase tracking-wider">Price Inclusion</th>
                  <th className="pb-3 font-bold uppercase tracking-wider">Status</th>
                  <th className="pb-3 font-bold uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-300 dark:divide-obsidian-800 text-slate-700 dark:text-slate-300">
                {rules.map((r) => (
                  <tr key={r.id} className="hover:bg-ivory-100 dark:hover:bg-obsidian-850/50 transition">
                    <td className="py-3.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-gold-700 dark:text-gold-400">
                          {r.countryCode} {r.regionCode ? `(${r.regionCode})` : ''}
                        </span>
                        <span className="font-serif font-bold text-slate-900 dark:text-slate-100">
                          {r.countryName}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 font-medium">{r.taxName}</td>

                    <td className="py-3.5 font-mono font-bold text-gold-700 dark:text-gold-400">
                      {r.taxRatePercent}%
                    </td>

                    <td className="py-3.5 font-mono font-bold">
                      {r.customsDutyPercent > 0 ? `${r.customsDutyPercent}%` : '0%'}
                    </td>

                    <td className="py-3.5">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                          r.isTaxIncludedInPrice
                            ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                            : 'bg-ivory-200 dark:bg-obsidian-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {r.isTaxIncludedInPrice ? 'Included in Price' : 'Added at Checkout'}
                      </span>
                    </td>

                    <td className="py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          r.isActive
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : 'bg-slate-500/15 text-slate-400'
                        }`}
                      >
                        {r.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>

                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => setEditingRule(r)}
                        className="inline-flex items-center space-x-1 rounded-xl border border-ivory-300 dark:border-obsidian-750 bg-ivory-100 dark:bg-obsidian-800 px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-gold-600 dark:hover:text-gold-400 transition"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span>Edit Rule</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Tax & Customs Calculator Simulator */}
        <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-ivory-300 dark:border-obsidian-800 pb-3">
            <Calculator className="h-5 w-5 text-gold-500" />
            <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">
              Cross-Border Checkout Fiscal Simulator
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                Destination Jurisdiction
              </label>
              <select
                value={simCountry}
                onChange={(e) => {
                  setSimCountry(e.target.value);
                  if (e.target.value === 'GB') setSimCurrency('GBP');
                  if (e.target.value === 'AE') setSimCurrency('AED');
                  if (e.target.value === 'IN') setSimCurrency('INR');
                  if (e.target.value === 'US') setSimCurrency('USD');
                }}
                className="w-full rounded-xl border border-ivory-300 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs font-bold text-slate-900 dark:text-slate-100"
              >
                <option value="US">United States (US)</option>
                <option value="GB">United Kingdom (GB - 20% VAT)</option>
                <option value="AE">United Arab Emirates (AE - 5% VAT)</option>
                <option value="IN">India (IN - 3% GST + 5% Customs)</option>
                <option value="FR">France (FR - 20% TVA)</option>
                <option value="DE">Germany (DE - 19% MwSt)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                Jewelry Subtotal ($ USD)
              </label>
              <input
                type="number"
                value={simSubtotal}
                onChange={(e) => setSimSubtotal(parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl border border-ivory-300 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 font-mono text-sm font-bold text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                Display Currency
              </label>
              <select
                value={simCurrency}
                onChange={(e) => setSimCurrency(e.target.value)}
                className="w-full rounded-xl border border-ivory-300 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs font-bold text-slate-900 dark:text-slate-100"
              >
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
                <option value="AED">AED (AED)</option>
                <option value="EUR">EUR (€)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
          </div>

          {calcResult && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-ivory-300 dark:border-obsidian-800 text-xs">
              <div className="rounded-xl bg-ivory-50 dark:bg-obsidian-850 p-3">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Tax Scheme</span>
                <p className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {calcResult.taxName} ({calcResult.taxRatePercent}%)
                </p>
                <p className="font-mono text-slate-500 mt-0.5">
                  ${calcResult.taxAmountUsd.toLocaleString()} USD
                </p>
              </div>

              <div className="rounded-xl bg-ivory-50 dark:bg-obsidian-850 p-3">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Customs Duty</span>
                <p className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {calcResult.customsDutyPercent}% Duty
                </p>
                <p className="font-mono text-slate-500 mt-0.5">
                  ${calcResult.customsDutyAmountUsd.toLocaleString()} USD
                </p>
              </div>

              <div className="rounded-xl bg-ivory-50 dark:bg-obsidian-850 p-3">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Tax Pricing Model</span>
                <p className="font-bold text-gold-700 dark:text-gold-400 mt-0.5">
                  {calcResult.isTaxIncludedInPrice ? 'Included in Price' : 'Added at Checkout'}
                </p>
              </div>

              <div className="rounded-xl bg-gold-500/10 border border-gold-500/30 p-3 text-right">
                <span className="text-gold-800 dark:text-gold-300 block text-[10px] uppercase font-bold">
                  Final Client Amount
                </span>
                <p className="font-serif text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {calcResult.formattedTotalLocal}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Edit Rule Modal */}
        {editingRule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
            <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-ivory-300 dark:border-obsidian-800 pb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">
                    Edit Fiscal Rule for {editingRule.countryName}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {editingRule.countryCode} {editingRule.regionCode ? `(${editingRule.regionCode})` : ''}
                  </p>
                </div>
                <button
                  onClick={() => setEditingRule(null)}
                  className="rounded-full p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Tax Scheme Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingRule.taxName}
                    onChange={(e) => setEditingRule({ ...editingRule, taxName: e.target.value })}
                    className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      required
                      value={editingRule.taxRatePercent}
                      onChange={(e) =>
                        setEditingRule({
                          ...editingRule,
                          taxRatePercent: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 font-mono text-xs font-bold text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Customs Duty (%)
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      value={editingRule.customsDutyPercent}
                      onChange={(e) =>
                        setEditingRule({
                          ...editingRule,
                          customsDutyPercent: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 font-mono text-xs font-bold text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-ivory-300 dark:border-obsidian-800">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingRule.isTaxIncludedInPrice}
                      onChange={(e) =>
                        setEditingRule({ ...editingRule, isTaxIncludedInPrice: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-ivory-400 text-gold-600 focus:ring-gold-500"
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Tax is included in base product prices (e.g. UK/EU VAT model)
                    </span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingRule.isActive}
                      onChange={(e) => setEditingRule({ ...editingRule, isActive: e.target.checked })}
                      className="h-4 w-4 rounded border-ivory-400 text-gold-600 focus:ring-gold-500"
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Rule Active on Global Checkout
                    </span>
                  </label>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-ivory-300 dark:border-obsidian-800">
                  <button
                    type="button"
                    onClick={() => setEditingRule(null)}
                    className="rounded-xl border border-ivory-300 dark:border-obsidian-750 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-ivory-100 dark:hover:bg-obsidian-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-xl border border-gold-500/60 bg-gradient-to-r from-gold-600 to-gold-500 px-5 py-2 text-xs font-bold uppercase tracking-wider text-obsidian-950 shadow-md hover:from-gold-500 hover:to-gold-400 transition disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Apply Changes'}
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
