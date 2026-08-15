export interface CurrencyRevenueBreakdown {
  currencyCode: string;
  currencySymbol: string;
  totalOrders: number;
  totalRevenueLocal: number;
  totalRevenueUsd: number;
  sharePercent: number;
}

export interface CategoryPerformanceMetric {
  categoryId: string;
  categoryName: string;
  unitsSold: number;
  grossRevenueUsd: number;
  averageItemPriceUsd: number;
}

export interface VipTierRevenueShare {
  vipTier: string;
  customerCount: number;
  totalSpendUsd: number;
  sharePercent: number;
  averageOrderValueUsd: number;
}

export interface LogisticsCarrierMetric {
  carrier: string;
  shipmentsCount: number;
  averageDeliveryDays: number;
  onTimeDeliveryRate: number;
}

export interface AnalyticsDataDto {
  period: string; // 7D, 30D, 90D, YTD, ALL
  grossRevenueUsd: number;
  netRevenueUsd: number;
  totalOrdersCount: number;
  averageOrderValueUsd: number;
  currencyBreakdown: CurrencyRevenueBreakdown[];
  categoryPerformance: CategoryPerformanceMetric[];
  vipTierRevenue: VipTierRevenueShare[];
  logisticsPerformance: LogisticsCarrierMetric[];
}

export type ReportType =
  | 'hallmark-audit'
  | 'tax-filing'
  | 'inventory-valuation'
  | 'chain-of-custody';

export interface HallmarkAuditRecordDto {
  orderNumber: string;
  orderDate: string;
  sku: string;
  itemTitle: string;
  metalPurity: string; // e.g. 18K Gold, 22K Solid Gold, Pt950
  hallmarkCertificate: string; // BIS 916 / IGI / GIA
  diamondCaratWeight?: number;
  totalPriceUsd: number;
  clientCountry: string;
}

export interface TaxFilingRecordDto {
  orderNumber: string;
  orderDate: string;
  countryCode: string;
  countryName: string;
  taxSchemeName: string;
  subtotalUsd: number;
  taxRatePercent: number;
  taxCollectedUsd: number;
  customsDutyUsd: number;
  totalAmountUsd: number;
  currencyCode: string;
  totalAmountLocal: number;
}

export interface InventoryValuationRecordDto {
  sku: string;
  title: string;
  categoryName: string;
  vaultLocation: string;
  quantityInVault: number;
  unitPriceUsd: number;
  totalReplacementValueUsd: number;
  metalType: string;
  gemstoneType?: string;
}

export interface ChainOfCustodyRecordDto {
  orderNumber: string;
  dispatchDate: string;
  carrier: string;
  trackingNumber: string;
  destinationCountry: string;
  destinationCity: string;
  vaultOrigin: string;
  tamperProofSealNumber: string;
  status: string;
  signatureRecipient?: string;
}
