import { apiRequest } from '@/lib/api';
import { MetalPriceRateDto } from '@theblinghaven/shared';

export const fallbackRates: MetalPriceRateDto[] = [
  {
    id: 'rate-24k',
    metalType: 'GOLD',
    purityCode: '24K_999',
    purityName: '24K Pure Gold',
    spotPriceUsdPerGram: 84.5,
    marketSource: 'LBMA_LONDON',
    dailyChangePercent: 0.42,
    isMarketOpen: true,
    makingChargesDefaultUsdPerGram: 12.0,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rate-22k',
    metalType: 'GOLD',
    purityCode: '22K_916',
    purityName: '22K Sovereign Gold',
    spotPriceUsdPerGram: 78.2,
    marketSource: 'LBMA_LONDON',
    dailyChangePercent: 0.38,
    isMarketOpen: true,
    makingChargesDefaultUsdPerGram: 10.5,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rate-18k',
    metalType: 'GOLD',
    purityCode: '18K_750',
    purityName: '18K Fine Gold',
    spotPriceUsdPerGram: 64.1,
    marketSource: 'LBMA_LONDON',
    dailyChangePercent: 0.29,
    isMarketOpen: true,
    makingChargesDefaultUsdPerGram: 9.0,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'rate-silver',
    metalType: 'SILVER',
    purityCode: 'AG_925',
    purityName: '925 Sterling Silver',
    spotPriceUsdPerGram: 1.15,
    marketSource: 'LBMA_LONDON',
    dailyChangePercent: -0.15,
    isMarketOpen: true,
    makingChargesDefaultUsdPerGram: 2.5,
    updatedAt: new Date().toISOString(),
  },
];

let cachedRates: MetalPriceRateDto[] | null = null;

export async function getLiveRates(): Promise<MetalPriceRateDto[]> {
  if (cachedRates) return cachedRates;

  try {
    const res = await apiRequest<any>('/pricing/metal-rates');
    const list = Array.isArray(res) ? res : res?.data || [];
    if (list.length > 0) {
      cachedRates = list;
      return list;
    }
  } catch {}

  cachedRates = fallbackRates;
  return fallbackRates;
}
