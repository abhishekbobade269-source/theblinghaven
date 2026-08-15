'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { apiRequest } from '@/lib/api';
import {
  MetalPriceRateDto,
  MetalPurityCode,
  JewelryPriceBreakdownDto,
  CurrencyRateDto,
} from '@theblinghaven/shared';
import {
  Coins,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Edit2,
  Calculator,
  ShieldCheck,
  Globe2,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  Flame,
  Check,
  Scale,
} from 'lucide-react';

const TROY_OZ_GRAMS = 31.1034768;

export default function MetalsPage() {
  const [rates, setRates] = useState<MetalPriceRateDto[]>([]);
  const [currencyRates, setCurrencyRates] = useState<CurrencyRateDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Market & Unit View Options
  const [activeMarket, setActiveMarket] = useState<'CANADA' | 'INTERNATIONAL'>('CANADA');
  const [unitMode, setUnitMode] = useState<'GRAM' | 'OZ'>('GRAM');

  // Edit Drawer / Modal State
  const [editingRate, setEditingRate] = useState<MetalPriceRateDto | null>(null);
  const [editSpotPrice, setEditSpotPrice] = useState<number>(0);
  const [editMakingCharge, setEditMakingCharge] = useState<number>(0);
  const [editDailyChange, setEditDailyChange] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);

  // Simulator State (Defaulted to Canadian Market & CAD)
  const [simPurity, setSimPurity] = useState<MetalPurityCode>('22K_916');
  const [simNetGrams, setSimNetGrams] = useState<number>(18.5);
  const [simGrossGrams, setSimGrossGrams] = useState<number>(19.2);
  const [simGemstoneUsd, setSimGemstoneUsd] = useState<number>(4200);
  const [simCraftsmanshipTier, setSimCraftsmanshipTier] = useState<
    'STANDARD_BENCH' | 'MASTER_ARTISAN' | 'ROYAL_HERITAGE'
  >('ROYAL_HERITAGE');
  const [simCurrency, setSimCurrency] = useState('CAD');
  const [simResult, setSimResult] = useState<JewelryPriceBreakdownDto | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const fetchRates = async () => {
    setIsLoading(true);
    try {
      const [metalRes, currRes] = await Promise.all([
        apiRequest<any>('/admin/metals/rates'),
        apiRequest<any>('/pricing/rates'),
      ]);
      const rateList = Array.isArray(metalRes) ? metalRes : metalRes?.data || [];
      const cList = Array.isArray(currRes) ? currRes : currRes?.data || [];
      setRates(rateList);
      setCurrencyRates(cList);
    } catch (e) {
      console.error('Failed to load metal rates:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncLiveMarket = async () => {
    setIsSyncing(true);
    try {
      const res = await apiRequest<any>('/metals/sync-market', { method: 'POST' });
      const updatedList = Array.isArray(res) ? res : res?.data || [];
      setRates(updatedList);
      setSyncToast('✓ Real-time LBMA London & S&P/TSX Canadian Bullion rates successfully synced.');
      setTimeout(() => setSyncToast(null), 4000);
    } catch (e: any) {
      alert(e.message || 'Failed to sync market rates.');
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const openEditModal = (r: MetalPriceRateDto) => {
    setEditingRate(r);
    setEditSpotPrice(r.spotPriceUsdPerGram);
    setEditMakingCharge(r.makingChargesDefaultUsdPerGram);
    setEditDailyChange(r.dailyChangePercent);
  };

  const handleSaveRate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRate) return;

    setIsSaving(true);
    try {
      await apiRequest(`/admin/metals/rates/${editingRate.id}`, {
        method: 'PUT',
        data: {
          spotPriceUsdPerGram: editSpotPrice,
          makingChargesDefaultUsdPerGram: editMakingCharge,
          dailyChangePercent: editDailyChange,
        },
      });
      setSyncToast(`✓ Updated live spot rate for ${editingRate.purityName}`);
      setTimeout(() => setSyncToast(null), 4000);
      setEditingRate(null);
      fetchRates();
    } catch (e: any) {
      alert(e.message || 'Failed to update rate.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRunSimulation = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSimulating(true);
    try {
      const res = await apiRequest<any>('/metals/calculate-breakdown', {
        method: 'POST',
        data: {
          purityCode: simPurity,
          netGoldWeightGrams: simNetGrams,
          grossWeightGrams: simGrossGrams,
          gemstoneValuationUsd: simGemstoneUsd,
          craftsmanshipTier: simCraftsmanshipTier,
          currencyCode: simCurrency,
        },
      });
      setSimResult(res?.data || res);
    } catch (e) {
      console.error('Simulation error:', e);
    } finally {
      setIsSimulating(false);
    }
  };

  useEffect(() => {
    if (rates.length > 0) {
      handleRunSimulation();
    }
  }, [simPurity, simNetGrams, simGrossGrams, simGemstoneUsd, simCraftsmanshipTier, simCurrency, rates]);

  // Helper for multi-currency conversion
  const cadRate = currencyRates.find((c) => c.currencyCode === 'CAD')?.effectiveRate || 1.3872;
  const getConvertedSpot = (usdPerGram: number, code: string) => {
    const c = currencyRates.find((cr) => cr.currencyCode === code);
    const eff = c ? c.effectiveRate : 1.0;
    const base = usdPerGram * eff;
    const finalVal = unitMode === 'OZ' ? base * TROY_OZ_GRAMS : base;
    return {
      symbol: c?.symbol || '$',
      amount: Math.round(finalVal * 100) / 100,
    };
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header with Canadian & Global Market Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-ivory-400 dark:border-obsidian-750 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-1">
              <Coins className="h-4 w-4" />
              <span>Canadian & Global Precious Metals Bullion Valuation</span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono text-emerald-500">
                🍁 CAD Domestic Benchmark
              </span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-slate-100">
              Live Precious Metal Spot Price Board
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Real-time Canadian Market (Bank of Canada CAD / TSX Gold) & International LBMA London spot prices with automated making charges.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Market Region Toggle */}
            <div className="flex rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-100 dark:bg-obsidian-850 p-1">
              <button
                onClick={() => setActiveMarket('CANADA')}
                className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  activeMarket === 'CANADA'
                    ? 'bg-gold-500 text-obsidian-950 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-gold-400'
                }`}
              >
                <span>🍁 Canadian (CAD C$)</span>
              </button>
              <button
                onClick={() => setActiveMarket('INTERNATIONAL')}
                className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  activeMarket === 'INTERNATIONAL'
                    ? 'bg-gold-500 text-obsidian-950 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-gold-400'
                }`}
              >
                <Globe2 className="h-3.5 w-3.5" />
                <span>International (USD / Global)</span>
              </button>
            </div>

            {/* Unit Toggle: Gram vs Troy Ounce */}
            <div className="flex rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-100 dark:bg-obsidian-850 p-1">
              <button
                onClick={() => setUnitMode('GRAM')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  unitMode === 'GRAM'
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Per Gram (/g)
              </button>
              <button
                onClick={() => setUnitMode('OZ')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  unitMode === 'OZ'
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Per Troy Oz (/oz)
              </button>
            </div>

            {/* Refresh / Sync Button */}
            <button
              onClick={handleSyncLiveMarket}
              disabled={isSyncing}
              className="flex items-center space-x-2 rounded-xl bg-gold-500 hover:bg-gold-400 px-4 py-2 text-xs font-bold text-obsidian-950 transition shadow-sm"
              title="Sync live LBMA and Bank of Canada feeds"
            >
              <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Market Rates'}</span>
            </button>
          </div>
        </div>

        {/* Sync Toast Feedback */}
        {syncToast && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-2 animate-in fade-in">
            <Check className="h-4 w-4" />
            <span>{syncToast}</span>
          </div>
        )}

        {/* 5 Precious Metal Rates Grid (Showing Canadian CAD or USD based on Active Market) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {rates.map((r) => {
            const isPositive = r.dailyChangePercent >= 0;
            const cadConverted = Math.round(r.spotPriceUsdPerGram * cadRate * (unitMode === 'OZ' ? TROY_OZ_GRAMS : 1) * 100) / 100;
            const usdVal = Math.round(r.spotPriceUsdPerGram * (unitMode === 'OZ' ? TROY_OZ_GRAMS : 1) * 100) / 100;
            const displayPrice = activeMarket === 'CANADA' ? `C$ ${cadConverted.toLocaleString()}` : `$ ${usdVal.toLocaleString()}`;
            const unitLabel = unitMode === 'OZ' ? '/ oz' : '/ gram';

            return (
              <div
                key={r.id}
                className="relative overflow-hidden rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded bg-ivory-200 dark:bg-obsidian-800 px-2 py-0.5 font-mono text-[10px] font-bold text-gold-700 dark:text-gold-400">
                    {r.purityCode.replace('_', ' ')}
                  </span>
                  <button
                    onClick={() => openEditModal(r)}
                    className="text-slate-400 hover:text-gold-500 p-1"
                    title="Edit Rate & Making Charges"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div>
                  <h3 className="font-serif text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                    {r.purityName}
                  </h3>
                  <p className="font-serif text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {displayPrice}
                    <span className="text-xs text-slate-400 font-sans font-normal"> {unitLabel}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-ivory-200 dark:border-obsidian-800 font-mono">
                  <span className="flex items-center space-x-1 font-bold">
                    {isPositive ? (
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
                    )}
                    <span className={isPositive ? 'text-emerald-600' : 'text-rose-500'}>
                      {isPositive ? '+' : ''}
                      {r.dailyChangePercent}%
                    </span>
                  </span>

                  <span className="text-slate-400 text-[10px]">
                    Making: ${r.makingChargesDefaultUsdPerGram}/g
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Multi-Currency Bullion Valuation Matrix Table */}
        <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-ivory-300 dark:border-obsidian-800 pb-3">
            <div>
              <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <Globe2 className="h-4 w-4 text-gold-500" />
                <span>Multi-Currency International & Canadian Bullion Matrix</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Simultaneous spot valuation across all 8 supported trading currencies ({unitMode === 'OZ' ? 'Per Troy Ounce' : 'Per Gram'}).
              </p>
            </div>
            <span className="text-[11px] font-mono text-gold-500 font-bold">
              1 Troy Ounce = 31.1035 Grams
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-ivory-300 dark:border-obsidian-800 text-slate-500 dark:text-slate-400 text-[10px] uppercase">
                  <th className="py-2.5 px-3">Precious Alloy</th>
                  <th className="py-2.5 px-3">Purity Code</th>
                  <th className="py-2.5 px-3 bg-gold-500/10 font-bold text-gold-600 dark:text-gold-400">
                    🇨🇦 CAD (C$)
                  </th>
                  <th className="py-2.5 px-3">🇺🇸 USD ($)</th>
                  <th className="py-2.5 px-3">🇪🇺 EUR (€)</th>
                  <th className="py-2.5 px-3">🇬🇧 GBP (£)</th>
                  <th className="py-2.5 px-3">🇦🇪 AED (AED)</th>
                  <th className="py-2.5 px-3">🇮🇳 INR (₹)</th>
                  <th className="py-2.5 px-3">🇦🇺 AUD (A$)</th>
                  <th className="py-2.5 px-3">🇸🇬 SGD (S$)</th>
                  <th className="py-2.5 px-3">Making Benchmark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200 dark:divide-obsidian-800">
                {rates.map((r) => {
                  const cad = getConvertedSpot(r.spotPriceUsdPerGram, 'CAD');
                  const usd = getConvertedSpot(r.spotPriceUsdPerGram, 'USD');
                  const eur = getConvertedSpot(r.spotPriceUsdPerGram, 'EUR');
                  const gbp = getConvertedSpot(r.spotPriceUsdPerGram, 'GBP');
                  const aed = getConvertedSpot(r.spotPriceUsdPerGram, 'AED');
                  const inr = getConvertedSpot(r.spotPriceUsdPerGram, 'INR');
                  const aud = getConvertedSpot(r.spotPriceUsdPerGram, 'AUD');
                  const sgd = getConvertedSpot(r.spotPriceUsdPerGram, 'SGD');

                  return (
                    <tr key={r.id} className="hover:bg-ivory-100 dark:hover:bg-obsidian-850 transition">
                      <td className="py-3 px-3 font-serif font-bold text-slate-800 dark:text-slate-200">
                        {r.purityName}
                      </td>
                      <td className="py-3 px-3 text-gold-600 dark:text-gold-400 font-bold">
                        {r.purityCode}
                      </td>
                      <td className="py-3 px-3 bg-gold-500/10 font-bold text-slate-900 dark:text-slate-100">
                        {cad.symbol} {cad.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                        {usd.symbol} {usd.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                        {eur.symbol} {eur.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                        {gbp.symbol} {gbp.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                        {aed.symbol} {aed.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                        {inr.symbol} {inr.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                        {aud.symbol} {aud.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                        {sgd.symbol} {sgd.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-slate-400">
                        ${r.makingChargesDefaultUsdPerGram}/g
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Interactive Pricing Simulation Studio & Transparent Formula Workbench */}
        <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ivory-300 dark:border-obsidian-800 pb-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <Calculator className="h-5 w-5 text-gold-500" />
                <span>Haute Joaillerie Dynamic Valuation Workbench</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Simulate real-time retail valuation using the formula: (Net Gold Weight × Live Spot) + (Gross Weight × Artisan Making Rate) + Gemstones + BIS Certification.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-500">Display Currency:</span>
              <select
                value={simCurrency}
                onChange={(e) => setSimCurrency(e.target.value)}
                className="rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-100 dark:bg-obsidian-800 px-3 py-1.5 text-xs font-mono font-bold text-gold-700 dark:text-gold-400 focus:outline-none"
              >
                <option value="CAD">🇨🇦 CAD (C$) [Default]</option>
                <option value="USD">🇺🇸 USD ($)</option>
                <option value="EUR">🇪🇺 EUR (€)</option>
                <option value="GBP">🇬🇧 GBP (£)</option>
                <option value="AED">🇦🇪 AED (AED)</option>
                <option value="INR">🇮🇳 INR (₹)</option>
                <option value="AUD">🇦🇺 AUD (A$)</option>
                <option value="SGD">🇸🇬 SGD (S$)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 6 Columns: Parameter Inputs */}
            <form onSubmit={handleRunSimulation} className="lg:col-span-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">
                    Metal Purity
                  </label>
                  <select
                    value={simPurity}
                    onChange={(e) => setSimPurity(e.target.value as MetalPurityCode)}
                    className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-50 dark:bg-obsidian-850 p-2.5 text-slate-900 dark:text-slate-100 focus:outline-none font-mono font-bold"
                  >
                    <option value="24K_999">24K Solid Gold (99.9%)</option>
                    <option value="22K_916">22K Royal Heritage Gold (BIS 916)</option>
                    <option value="18K_750">18K Fine Jewelry Gold (75.0%)</option>
                    <option value="PT_950">Platinum Pt950 (95.0%)</option>
                    <option value="AG_925">Artisan Sterling Silver (92.5%)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">
                    Craftsmanship Complexity Tier
                  </label>
                  <select
                    value={simCraftsmanshipTier}
                    onChange={(e) =>
                      setSimCraftsmanshipTier(
                        e.target.value as 'STANDARD_BENCH' | 'MASTER_ARTISAN' | 'ROYAL_HERITAGE',
                      )
                    }
                    className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-50 dark:bg-obsidian-850 p-2.5 text-slate-900 dark:text-slate-100 focus:outline-none font-bold"
                  >
                    <option value="STANDARD_BENCH">Standard Fine Bench (1.0x)</option>
                    <option value="MASTER_ARTISAN">Master Artisan Filigree (1.5x)</option>
                    <option value="ROYAL_HERITAGE">Imperial Royal Heritage Parure (2.2x)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">
                    Net Gold (Grams)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={simNetGrams}
                    onChange={(e) => setSimNetGrams(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-50 dark:bg-obsidian-850 p-2.5 font-mono text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">
                    Gross Weight (Grams)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={simGrossGrams}
                    onChange={(e) => setSimGrossGrams(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-50 dark:bg-obsidian-850 p-2.5 font-mono text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">
                    Gemstone Value ($)
                  </label>
                  <input
                    type="number"
                    step="50"
                    required
                    value={simGemstoneUsd}
                    onChange={(e) => setSimGemstoneUsd(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-50 dark:bg-obsidian-850 p-2.5 font-mono text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>
            </form>

            {/* Right 6 Columns: Live Breakdown Matrix */}
            <div className="lg:col-span-6 rounded-2xl bg-ivory-100 dark:bg-obsidian-950 p-6 border border-ivory-300 dark:border-obsidian-800 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-ivory-300 dark:border-obsidian-800 pb-3">
                <span className="font-serif font-bold text-slate-900 dark:text-slate-100">
                  Itemized Transparent Cost Matrix
                </span>
                <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  ✓ Canadian & LBMA Verified
                </span>
              </div>

              {simResult && (
                <div className="space-y-2.5 font-mono text-[11px]">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>
                      Gold Base ({simResult.netGoldWeightGrams}g @ ${simResult.spotPriceUsdPerGram}/g):
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      ${simResult.goldBaseValueUsd.toLocaleString()} USD
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>
                      Artisan Making Charges ({simGrossGrams}g @ ${simResult.makingChargeRateUsdPerGram}/g):
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      +${simResult.totalMakingChargesUsd.toLocaleString()} USD
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Gemstone & Solitaire Cost:</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      +${simResult.gemstoneValuationUsd.toLocaleString()} USD
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>BIS 916 Hallmarking & GIA Dossier:</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      +${simResult.hallmarkingAndCertificationUsd.toLocaleString()} USD
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-ivory-300 dark:border-obsidian-800 text-sm font-serif font-bold text-gold-700 dark:text-gold-400">
                    <span>Final Valuation ({simCurrency})</span>
                    <span>{simResult.formattedTotalLocal}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {editingRate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
            <div className="w-full max-w-md rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-ivory-300 dark:border-obsidian-800 pb-3">
                <h3 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100">
                  Edit Spot Rate: {editingRate.purityName}
                </h3>
              </div>

              <form onSubmit={handleSaveRate} className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">
                    Spot Price (USD / Gram)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editSpotPrice}
                    onChange={(e) => setEditSpotPrice(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-50 dark:bg-obsidian-850 p-2.5 font-mono text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">
                    Benchmark Making Charge (USD / Gram)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={editMakingCharge}
                    onChange={(e) => setEditMakingCharge(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-50 dark:bg-obsidian-850 p-2.5 font-mono text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">
                    Daily Market Change (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editDailyChange}
                    onChange={(e) => setEditDailyChange(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-50 dark:bg-obsidian-850 p-2.5 font-mono text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t border-ivory-300 dark:border-obsidian-800">
                  <button
                    type="button"
                    onClick={() => setEditingRate(null)}
                    className="rounded-xl border border-ivory-300 dark:border-obsidian-700 px-4 py-2 text-slate-600 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-xl bg-gold-500 px-6 py-2 font-bold uppercase tracking-wider text-obsidian-950 hover:bg-gold-400 transition"
                  >
                    {isSaving ? 'Saving...' : 'Update Rate'}
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
