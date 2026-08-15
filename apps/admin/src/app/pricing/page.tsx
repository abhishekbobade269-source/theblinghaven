'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { apiRequest } from '@/lib/api';
import {
  CurrencyRateDto,
  PriceOverrideDto,
  ProductDto,
  RoundingRule,
} from '@theblinghaven/shared';
import {
  DollarSign,
  Globe2,
  RefreshCw,
  TrendingUp,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sliders,
  Sparkles,
  Calculator,
} from 'lucide-react';

export default function MultiCurrencyPricingPage() {
  const [rates, setRates] = useState<CurrencyRateDto[]>([]);
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);

  // Live Simulator state
  const [previewCurrency, setPreviewCurrency] = useState('AED');
  const [simulatedAmount, setSimulatedAmount] = useState<number>(10000);
  const [conversionResult, setConversionResult] = useState<any>(null);

  const fetchPricingData = async () => {
    setIsLoading(true);
    try {
      const [ratesRes, prodRes] = await Promise.all([
        apiRequest<any>('/admin/pricing/rates'),
        apiRequest<any>('/admin/catalog/products?limit=10'),
      ]);

      setRates(Array.isArray(ratesRes) ? ratesRes : ratesRes?.data || []);
      setProducts(Array.isArray(prodRes) ? prodRes : prodRes?.data || []);
    } catch (e) {
      console.error('Failed to load pricing data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPricingData();
  }, []);

  const handleRateUpdate = async (r: CurrencyRateDto) => {
    setIsSaving(r.currencyCode);
    try {
      await apiRequest(`/admin/pricing/rates/${r.currencyCode}`, {
        method: 'PUT',
        data: {
          rateToUsd: r.rateToUsd,
          fxBufferPercent: r.fxBufferPercent,
          roundingRule: r.roundingRule,
          isActive: r.isActive,
        },
      });
      alert(`Updated exchange rates and FX buffer for ${r.currencyCode}.`);
      fetchPricingData();
    } catch (e: any) {
      alert(e.message || 'Failed to update currency rate.');
    } finally {
      setIsSaving(null);
    }
  };

  const handleSimulate = async () => {
    try {
      const res = await apiRequest<any>(
        `/pricing/convert?amount=${simulatedAmount}&from=USD&to=${previewCurrency}`,
      );
      setConversionResult(res.data || res);
    } catch (e) {
      console.error('Conversion failed:', e);
    }
  };

  useEffect(() => {
    if (rates.length > 0) {
      handleSimulate();
    }
  }, [previewCurrency, simulatedAmount, rates]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-ivory-400 dark:border-obsidian-750 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-1">
              <Globe2 className="h-4 w-4" />
              <span>International Haute Joaillerie FX Engine</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-slate-100">
              Multi-Currency Dynamic Pricing
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Manage 8 international currencies, FX risk volatility buffers, and luxury psychological rounding rules.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchPricingData}
              className="rounded-lg border border-ivory-400 dark:border-obsidian-700 bg-white dark:bg-obsidian-850 p-2.5 text-slate-600 dark:text-slate-300 hover:bg-ivory-100 dark:hover:bg-obsidian-800"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Currency Rates Table */}
        <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-ivory-300 dark:border-obsidian-800 pb-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-slate-100">
                Global Currency Exchange Rates & Margins
              </h2>
              <p className="text-xs text-slate-500">
                Adjust base exchange rates to USD and set risk buffers to safeguard high-value jewelry transactions.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[900px]">
              <thead>
                <tr className="border-b border-ivory-300 dark:border-obsidian-800 text-slate-500 dark:text-slate-400">
                  <th className="pb-3 font-bold uppercase tracking-wider">Currency</th>
                  <th className="pb-3 font-bold uppercase tracking-wider">Base Rate (1 USD =)</th>
                  <th className="pb-3 font-bold uppercase tracking-wider">FX Risk Buffer (%)</th>
                  <th className="pb-3 font-bold uppercase tracking-wider">Effective Rate</th>
                  <th className="pb-3 font-bold uppercase tracking-wider">Luxury Rounding</th>
                  <th className="pb-3 font-bold uppercase tracking-wider">Storefront Status</th>
                  <th className="pb-3 font-bold uppercase tracking-wider text-right">Save</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-300 dark:divide-obsidian-800 text-slate-700 dark:text-slate-300">
                {rates.map((r, idx) => (
                  <tr key={r.currencyCode} className="hover:bg-ivory-100 dark:hover:bg-obsidian-850/50 transition">
                    <td className="py-3">
                      <div className="flex items-center space-x-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gold-500/15 font-mono font-bold text-gold-700 dark:text-gold-300">
                          {r.symbol}
                        </span>
                        <div>
                          <p className="font-serif font-bold text-slate-900 dark:text-slate-100">
                            {r.currencyCode}
                          </p>
                          <p className="text-[10px] text-slate-400">{r.currencyName}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3">
                      <input
                        type="number"
                        step="0.0001"
                        disabled={r.currencyCode === 'USD'}
                        value={r.rateToUsd}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          const next = [...rates];
                          next[idx].rateToUsd = val;
                          setRates(next);
                        }}
                        className="w-28 rounded-lg border border-ivory-300 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-1.5 font-mono text-xs font-bold disabled:opacity-50"
                      />
                    </td>

                    <td className="py-3">
                      <div className="flex items-center space-x-1">
                        <input
                          type="number"
                          step="0.1"
                          disabled={r.currencyCode === 'USD'}
                          value={r.fxBufferPercent}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            const next = [...rates];
                            next[idx].fxBufferPercent = val;
                            setRates(next);
                          }}
                          className="w-20 rounded-lg border border-ivory-300 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-1.5 font-mono text-xs font-bold disabled:opacity-50"
                        />
                        <span className="text-slate-400 font-bold">%</span>
                      </div>
                    </td>

                    <td className="py-3 font-mono font-bold text-gold-700 dark:text-gold-400">
                      {r.currencyCode === 'USD'
                        ? '1.0000'
                        : (r.rateToUsd * (1 + r.fxBufferPercent / 100)).toFixed(4)}
                    </td>

                    <td className="py-3">
                      <select
                        value={r.roundingRule}
                        onChange={(e) => {
                          const next = [...rates];
                          next[idx].roundingRule = e.target.value as RoundingRule;
                          setRates(next);
                        }}
                        className="rounded-lg border border-ivory-300 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-1.5 text-xs font-bold"
                      >
                        <option value="ROUND_WHOLE_LUXURY">Whole Luxury ($18,500)</option>
                        <option value="ROUND_99">End in .99 ($18,499.99)</option>
                        <option value="NO_ROUND">Exact Decimal</option>
                      </select>
                    </td>

                    <td className="py-3">
                      <button
                        onClick={() => {
                          const next = [...rates];
                          next[idx].isActive = !next[idx].isActive;
                          setRates(next);
                        }}
                        disabled={r.currencyCode === 'USD'}
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          r.isActive
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : 'bg-slate-500/15 text-slate-400'
                        }`}
                      >
                        {r.isActive ? 'ACTIVE' : 'DISABLED'}
                      </button>
                    </td>

                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleRateUpdate(r)}
                        disabled={isSaving === r.currencyCode}
                        className="inline-flex items-center space-x-1 rounded-xl border border-gold-500/60 bg-gold-500/10 px-3 py-1.5 text-xs font-bold text-gold-800 dark:text-gold-300 hover:bg-gold-500 hover:text-obsidian-950 transition disabled:opacity-50"
                      >
                        <Save className="h-3.5 w-3.5" />
                        <span>{isSaving === r.currencyCode ? 'Saving...' : 'Apply'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Multi-Currency Luxury Catalog Preview Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Currency Calculator Widget */}
          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <Calculator className="h-5 w-5 text-gold-500" />
              <span>Real-Time FX Calculator</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Base Amount in USD ($)
                </label>
                <input
                  type="number"
                  value={simulatedAmount}
                  onChange={(e) => setSimulatedAmount(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-xl border border-ivory-300 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 font-mono text-sm font-bold text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Target Destination Currency
                </label>
                <select
                  value={previewCurrency}
                  onChange={(e) => setPreviewCurrency(e.target.value)}
                  className="w-full rounded-xl border border-ivory-300 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs font-bold text-slate-900 dark:text-slate-100"
                >
                  {rates.map((r) => (
                    <option key={r.currencyCode} value={r.currencyCode}>
                      {r.currencyCode} ({r.currencyName} - {r.symbol})
                    </option>
                  ))}
                </select>
              </div>

              {conversionResult && (
                <div className="rounded-2xl bg-gold-500/10 border border-gold-500/30 p-4 text-center space-y-1">
                  <p className="text-xs uppercase font-bold text-gold-700 dark:text-gold-400">
                    Converted Customer Price
                  </p>
                  <p className="font-serif text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {conversionResult.formattedAmount}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Includes FX volatility margin & luxury rounding
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Catalog Multi-Currency Simulator Grid */}
          <div className="lg:col-span-2 rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-ivory-300 dark:border-obsidian-800 pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">
                  Storefront Catalog Price Simulation
                </h3>
                <p className="text-xs text-slate-500">
                  Previewing jewelry pieces converted to <strong>{previewCurrency}</strong>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
              {products.slice(0, 6).map((p) => {
                const targetRate = rates.find((r) => r.currencyCode === previewCurrency);
                const effective =
                  previewCurrency === 'USD'
                    ? 1.0
                    : targetRate
                    ? targetRate.rateToUsd * (1 + targetRate.fxBufferPercent / 100)
                    : 1.0;
                const converted = Math.round(p.basePriceUsd * effective);
                const symbol = targetRate?.symbol || previewCurrency;

                return (
                  <div
                    key={p.id}
                    className="flex items-center space-x-3 rounded-2xl border border-ivory-300 dark:border-obsidian-800 bg-ivory-50 dark:bg-obsidian-850 p-3"
                  >
                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-obsidian-950">
                      <img
                        src={p.primaryImageUrl}
                        alt={p.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                        {p.title}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Base: ${p.basePriceUsd.toLocaleString()} USD
                      </p>
                      <p className="font-serif font-bold text-sm text-gold-700 dark:text-gold-400 mt-0.5">
                        {symbol} {converted.toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
