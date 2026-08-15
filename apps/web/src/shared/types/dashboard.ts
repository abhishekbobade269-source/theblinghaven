export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'AED' | 'INR' | 'CAD' | 'AUD' | 'SGD';

export interface CurrencyRate {
  code: CurrencyCode;
  symbol: string;
  rate: number; // Against USD
  name: string;
}

export interface DashboardKpiDto {
  currency: CurrencyCode;
  currencySymbol: string;
  grossRevenue: number;
  netRevenue: number;
  revenueGrowthPct: number;
  totalOrders: number;
  ordersGrowthPct: number;
  averageOrderValue: number;
  aovGrowthPct: number;
  totalCustomers: number;
  customersGrowthPct: number;
  conversionRate: number;
  pendingShipments: number;
  lowStockAlerts: number;
}

export interface RevenueDataPointDto {
  date: string;
  label: string;
  revenue: number;
  orders: number;
  formattedRevenue: string;
}

export interface TopCategoryDto {
  name: string;
  sharePct: number;
  revenue: number;
  unitsSold: number;
  color: string;
}

export interface DashboardActivityDto {
  id: string;
  type: 'ORDER_PLACED' | 'PAYMENT_RECEIVED' | 'INVENTORY_LOW' | 'NEW_CUSTOMER' | 'SECURITY_ALERT';
  title: string;
  description: string;
  amount?: number;
  currency?: CurrencyCode;
  timestamp: string;
}
