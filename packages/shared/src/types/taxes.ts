export interface TaxRuleDto {
  id: string;
  countryCode: string; // US, GB, AE, IN, FR, DE, CA, AU
  countryName: string;
  regionCode?: string; // NY, CA, ON, etc.
  taxName: string;     // e.g. VAT, Sales Tax, GST, Customs
  taxRatePercent: number; // e.g. 20.0 for 20%
  customsDutyPercent: number; // e.g. 5.0 for 5%
  isTaxIncludedInPrice: boolean;
  isActive: boolean;
  notes?: string;
  updatedAt: string;
}

export interface UpdateTaxRuleDto {
  taxName?: string;
  taxRatePercent?: number;
  customsDutyPercent?: number;
  isTaxIncludedInPrice?: boolean;
  isActive?: boolean;
  notes?: string;
}

export interface CalculateTaxDto {
  countryCode: string;
  regionCode?: string;
  subtotalUsd: number;
  currencyCode?: string;
}

export interface TaxCalculationResultDto {
  countryCode: string;
  countryName: string;
  taxName: string;
  taxRatePercent: number;
  taxAmountUsd: number;
  customsDutyPercent: number;
  customsDutyAmountUsd: number;
  totalTaxAndDutiesUsd: number;
  isTaxIncludedInPrice: boolean;
  finalTotalUsd: number;
  currencyCode: string;
  finalTotalLocal: number;
  formattedTotalLocal: string;
}
