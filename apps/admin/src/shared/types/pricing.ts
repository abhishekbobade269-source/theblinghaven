export type RoundingRule = 'NO_ROUND' | 'ROUND_99' | 'ROUND_WHOLE_LUXURY';

export interface CurrencyRateDto {
  id: string;
  currencyCode: string; // USD, EUR, GBP, AED, INR, CAD, AUD, SGD
  currencyName: string;
  symbol: string;
  rateToUsd: number;    // 1 USD = rateToUsd in this currency
  fxBufferPercent: number; // e.g. 2.5%
  effectiveRate: number;   // rateToUsd * (1 + fxBufferPercent / 100)
  roundingRule: RoundingRule;
  isActive: boolean;
  updatedAt: string;
}

export interface PriceOverrideDto {
  id: string;
  productId: string;
  sku: string;
  productTitle: string;
  currencyCode: string;
  manualPrice: number;
  reason?: string;
  updatedAt: string;
}

export interface UpdateCurrencyRateDto {
  rateToUsd?: number;
  fxBufferPercent?: number;
  roundingRule?: RoundingRule;
  isActive?: boolean;
}

export interface SetPriceOverrideDto {
  productId: string;
  currencyCode: string;
  manualPrice: number;
  reason?: string;
}

export interface CurrencyConversionResultDto {
  fromCurrency: string;
  toCurrency: string;
  originalAmount: number;
  convertedAmount: number;
  formattedAmount: string;
  effectiveRate: number;
}
