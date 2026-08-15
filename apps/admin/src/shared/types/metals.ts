export type MetalType = 'GOLD' | 'PLATINUM' | 'SILVER';

export type MetalPurityCode =
  | '24K_999'
  | '22K_916'
  | '18K_750'
  | 'PT_950'
  | 'AG_925';

export interface MetalPriceRateDto {
  id: string;
  metalType: MetalType;
  purityCode: MetalPurityCode;
  purityName: string;
  spotPriceUsdPerGram: number;
  marketSource: string; // LBMA_LONDON, DGCX_DUBAI, MCX_INDIA, COMEX_NY
  dailyChangePercent: number;
  isMarketOpen: boolean;
  makingChargesDefaultUsdPerGram: number;
  updatedAt: string;
}

export interface UpdateMetalPriceDto {
  spotPriceUsdPerGram?: number;
  dailyChangePercent?: number;
  isMarketOpen?: boolean;
  makingChargesDefaultUsdPerGram?: number;
}

export interface CalculateJewelryPriceDto {
  purityCode: MetalPurityCode;
  netGoldWeightGrams: number;
  grossWeightGrams: number;
  gemstoneValuationUsd: number;
  craftsmanshipTier?: 'STANDARD_BENCH' | 'MASTER_ARTISAN' | 'ROYAL_HERITAGE';
  customMakingChargeUsdPerGram?: number;
  currencyCode?: string;
}

export interface JewelryPriceBreakdownDto {
  purityCode: MetalPurityCode;
  purityName: string;
  spotPriceUsdPerGram: number;
  netGoldWeightGrams: number;
  goldBaseValueUsd: number;
  gemstoneValuationUsd: number;
  makingChargeRateUsdPerGram: number;
  totalMakingChargesUsd: number;
  hallmarkingAndCertificationUsd: number;
  estimatedTotalUsd: number;
  currencyCode: string;
  estimatedTotalLocal: number;
  formattedTotalLocal: string;
}
