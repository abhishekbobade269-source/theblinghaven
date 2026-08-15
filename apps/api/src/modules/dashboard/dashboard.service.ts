import { Injectable } from '@nestjs/common';
import {
  CurrencyCode,
  DashboardKpiDto,
  RevenueDataPointDto,
  TopCategoryDto,
  DashboardActivityDto,
} from '@theblinghaven/shared';

const CURRENCY_RATES: Record<CurrencyCode, { rate: number; symbol: string; name: string }> = {
  USD: { rate: 1.0, symbol: '$', name: 'US Dollar' },
  EUR: { rate: 0.92, symbol: '€', name: 'Euro' },
  GBP: { rate: 0.79, symbol: '£', name: 'British Pound' },
  AED: { rate: 3.67, symbol: 'AED ', name: 'UAE Dirham' },
  INR: { rate: 83.5, symbol: '₹', name: 'Indian Rupee' },
  CAD: { rate: 1.36, symbol: 'CA$', name: 'Canadian Dollar' },
  AUD: { rate: 1.52, symbol: 'AU$', name: 'Australian Dollar' },
  SGD: { rate: 1.34, symbol: 'SG$', name: 'Singapore Dollar' },
};

@Injectable()
export class DashboardService {
  private convert(amountUsd: number, currency: CurrencyCode): number {
    const info = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
    return Math.round(amountUsd * info.rate * 100) / 100;
  }

  private getSymbol(currency: CurrencyCode): string {
    return CURRENCY_RATES[currency]?.symbol || '$';
  }

  async getKpis(currency: CurrencyCode = 'USD'): Promise<DashboardKpiDto> {
    const baseGrossUsd = 284500;
    const baseNetUsd = 246800;
    const baseAovUsd = 345.5;

    const symbol = this.getSymbol(currency);

    return {
      currency,
      currencySymbol: symbol,
      grossRevenue: this.convert(baseGrossUsd, currency),
      netRevenue: this.convert(baseNetUsd, currency),
      revenueGrowthPct: 18.4,
      totalOrders: 1420,
      ordersGrowthPct: 12.6,
      averageOrderValue: this.convert(baseAovUsd, currency),
      aovGrowthPct: 5.2,
      totalCustomers: 3890,
      customersGrowthPct: 15.8,
      conversionRate: 3.85,
      pendingShipments: 14,
      lowStockAlerts: 6,
    };
  }

  async getRevenueChart(
    range: '7d' | '30d' | '90d' | '1y' = '30d',
    currency: CurrencyCode = 'USD',
  ): Promise<RevenueDataPointDto[]> {
    const symbol = this.getSymbol(currency);
    const pointsCount = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 12 : 12;
    const data: RevenueDataPointDto[] = [];
    const now = new Date();

    for (let i = pointsCount - 1; i >= 0; i--) {
      const d = new Date(now);
      if (range === '7d' || range === '30d') {
        d.setDate(d.getDate() - i);
      } else if (range === '90d') {
        d.setDate(d.getDate() - i * 7);
      } else {
        d.setMonth(d.getMonth() - i);
      }

      // Base curve with realistic luxury seasonality & weekend spikes
      const dayFactor = Math.sin((i / pointsCount) * Math.PI) * 2000 + 4000;
      const noise = (Math.random() - 0.5) * 1200;
      const baseRevUsd = Math.max(1500, Math.round(dayFactor + noise));
      const convertedRev = this.convert(baseRevUsd, currency);
      const orders = Math.max(5, Math.round(baseRevUsd / 280));

      const dateStr = d.toISOString().split('T')[0];
      const label =
        range === '1y'
          ? d.toLocaleString('default', { month: 'short' })
          : `${d.getMonth() + 1}/${d.getDate()}`;

      data.push({
        date: dateStr,
        label,
        revenue: convertedRev,
        orders,
        formattedRevenue: `${symbol}${convertedRev.toLocaleString()}`,
      });
    }

    return data;
  }

  async getTopCategories(currency: CurrencyCode = 'USD'): Promise<TopCategoryDto[]> {
    return [
      {
        name: 'Bridal & Solitaire Sets',
        sharePct: 38,
        revenue: this.convert(108110, currency),
        unitsSold: 284,
        color: '#C5A880', // Gold
      },
      {
        name: 'Diamond & Gemstone Rings',
        sharePct: 26,
        revenue: this.convert(73970, currency),
        unitsSold: 395,
        color: '#DEC49B',
      },
      {
        name: 'Heritage Gold Bangles',
        sharePct: 18,
        revenue: this.convert(51210, currency),
        unitsSold: 168,
        color: '#8C6C42',
      },
      {
        name: 'Fine Earrings & Studs',
        sharePct: 12,
        revenue: this.convert(34140, currency),
        unitsSold: 420,
        color: '#60A5FA',
      },
      {
        name: 'Handmade Artisan Silver',
        sharePct: 6,
        revenue: this.convert(17070, currency),
        unitsSold: 153,
        color: '#A78BFA',
      },
    ];
  }

  async getRecentActivities(currency: CurrencyCode = 'USD'): Promise<DashboardActivityDto[]> {
    const symbol = this.getSymbol(currency);
    return [
      {
        id: 'act-1',
        type: 'ORDER_PLACED',
        title: 'New Luxury Order #TBH-9482',
        description: `Victoria Sterling placed an order for "Royal Peacock Polki Choker Set" (${symbol}${this.convert(1450, currency).toLocaleString()})`,
        amount: this.convert(1450, currency),
        currency,
        timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      },
      {
        id: 'act-2',
        type: 'PAYMENT_RECEIVED',
        title: 'Stripe International Capture Succeeded',
        description: `Payment authorized via 3D Secure for Dubai order #TBH-9481 (${symbol}${this.convert(2890, currency).toLocaleString()})`,
        amount: this.convert(2890, currency),
        currency,
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      },
      {
        id: 'act-3',
        type: 'INVENTORY_LOW',
        title: 'Low Stock Notification',
        description: 'Emerald Cut Solitaire Ring (Size 7, 18K Yellow Gold) down to 2 units remaining in Main Vault.',
        timestamp: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
      },
      {
        id: 'act-4',
        type: 'NEW_CUSTOMER',
        title: 'VIP Client Registered',
        description: 'Eleanor Roosevelt created a verified customer profile from London, UK.',
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      },
      {
        id: 'act-5',
        type: 'SECURITY_ALERT',
        title: 'Privileged Session Initialized',
        description: 'Super Admin authenticated from verified IP with MFA challenge.',
        timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
      },
    ];
  }
}
