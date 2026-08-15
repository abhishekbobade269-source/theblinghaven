'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
import { CurrencyRateDto } from '@theblinghaven/shared';

interface CurrencyContextType {
  currentCurrency: string;
  currencySymbol: string;
  rates: CurrencyRateDto[];
  setCurrency: (code: string) => void;
  formatPrice: (usdAmount: number) => string;
  convertPrice: (usdAmount: number) => { localAmount: number; symbol: string; currency: string };
}

const DEFAULT_RATES: CurrencyRateDto[] = [
  { id: '6', currencyCode: 'CAD', currencyName: 'Canadian Dollar (Domestic)', symbol: 'C$', rateToUsd: 1.36, fxBufferPercent: 2.0, effectiveRate: 1.3872, roundingRule: 'ROUND_WHOLE_LUXURY', isActive: true, updatedAt: '' },
  { id: '1', currencyCode: 'USD', currencyName: 'US Dollar', symbol: '$', rateToUsd: 1.0, fxBufferPercent: 0, effectiveRate: 1.0, roundingRule: 'ROUND_WHOLE_LUXURY', isActive: true, updatedAt: '' },
  { id: '2', currencyCode: 'EUR', currencyName: 'Euro', symbol: '€', rateToUsd: 0.92, fxBufferPercent: 2.5, effectiveRate: 0.943, roundingRule: 'ROUND_WHOLE_LUXURY', isActive: true, updatedAt: '' },
  { id: '3', currencyCode: 'GBP', currencyName: 'British Pound', symbol: '£', rateToUsd: 0.79, fxBufferPercent: 2.0, effectiveRate: 0.8058, roundingRule: 'ROUND_WHOLE_LUXURY', isActive: true, updatedAt: '' },
  { id: '4', currencyCode: 'AED', currencyName: 'UAE Dirham', symbol: 'AED', rateToUsd: 3.67, fxBufferPercent: 2.0, effectiveRate: 3.7434, roundingRule: 'ROUND_WHOLE_LUXURY', isActive: true, updatedAt: '' },
  { id: '5', currencyCode: 'INR', currencyName: 'Indian Rupee', symbol: '₹', rateToUsd: 83.5, fxBufferPercent: 2.5, effectiveRate: 85.5875, roundingRule: 'ROUND_WHOLE_LUXURY', isActive: true, updatedAt: '' },
  { id: '7', currencyCode: 'AUD', currencyName: 'Australian Dollar', symbol: 'A$', rateToUsd: 1.52, fxBufferPercent: 2.0, effectiveRate: 1.5504, roundingRule: 'ROUND_WHOLE_LUXURY', isActive: true, updatedAt: '' },
  { id: '8', currencyCode: 'SGD', currencyName: 'Singapore Dollar', symbol: 'S$', rateToUsd: 1.35, fxBufferPercent: 2.0, effectiveRate: 1.377, roundingRule: 'ROUND_WHOLE_LUXURY', isActive: true, updatedAt: '' },
];

const CurrencyContext = createContext<CurrencyContextType>({
  currentCurrency: 'CAD',
  currencySymbol: 'C$',
  rates: DEFAULT_RATES,
  setCurrency: () => {},
  formatPrice: (amt) => `C$${amt.toLocaleString()}`,
  convertPrice: (amt) => ({ localAmount: amt, symbol: 'C$', currency: 'CAD' }),
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currentCurrency, setCurrentCurrency] = useState('CAD');
  const [rates, setRates] = useState<CurrencyRateDto[]>(DEFAULT_RATES);

  useEffect(() => {
    const saved = localStorage.getItem('theblinghaven_currency');
    if (saved) {
      setCurrentCurrency(saved);
    } else {
      setCurrentCurrency('CAD');
    }

    const fetchRates = async () => {
      try {
        const res = await apiRequest<any>('/pricing/rates');
        const rateList = Array.isArray(res) ? res : res?.data || [];
        if (rateList.length > 0) setRates(rateList);
      } catch {
        // Fallback to default rates
      }
    };
    fetchRates();
  }, []);

  const setCurrency = (code: string) => {
    setCurrentCurrency(code);
    localStorage.setItem('theblinghaven_currency', code);
  };

  const activeRateRecord = rates.find((r) => r.currencyCode === currentCurrency) || rates[0];
  const currencySymbol = activeRateRecord?.symbol || '$';

  const convertPrice = (usdAmount: number) => {
    if (currentCurrency === 'USD') {
      return { localAmount: usdAmount, symbol: '$', currency: 'USD' };
    }
    const r = activeRateRecord;
    const effectiveRate = r.rateToUsd * (1 + r.fxBufferPercent / 100);
    const rawLocal = usdAmount * effectiveRate;
    const rounded = Math.round(rawLocal);
    return { localAmount: rounded, symbol: r.symbol, currency: r.currencyCode };
  };

  const formatPrice = (usdAmount: number) => {
    const { localAmount, symbol } = convertPrice(usdAmount);
    return `${symbol} ${localAmount.toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currentCurrency,
        currencySymbol,
        rates,
        setCurrency,
        formatPrice,
        convertPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
