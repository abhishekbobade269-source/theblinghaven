'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { apiRequest } from '@/lib/api';
import { ReportType } from '@theblinghaven/shared';
import {
  FileSpreadsheet,
  Download,
  ShieldCheck,
  Landmark,
  Boxes,
  Truck,
  RefreshCw,
  FileText,
  Eye,
  CheckCircle2,
  Lock,
  BarChart3,
  PackageCheck,
} from 'lucide-react';

interface ReportCard {
  id: ReportType;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
}

const REPORT_TYPES: ReportCard[] = [
  {
    id: 'sales-summary',
    title: 'Sales & Revenue Performance Ledger',
    subtitle: 'Order Sales, Gross & Net Revenue Analytics',
    description:
      'Complete breakdown of customer orders, net sales in CAD and USD, payment methods, and order fulfillment statuses.',
    icon: BarChart3,
    badge: 'Sales & Revenue',
  },
  {
    id: 'order-fulfillment',
    title: 'Courier Shipping & Delivery Ledger',
    subtitle: 'Canada Post, FedEx & DHL Tracking Status',
    description:
      'Chronological courier dispatch ledger mapping parcels, tracking numbers, destination cities, and doorstep delivery confirmations.',
    icon: Truck,
    badge: 'Fulfillment',
  },
  {
    id: 'inventory-movement',
    title: 'Product Inventory & Stock Movement Audit',
    subtitle: 'SKU Stock Movements & Catalog Valuation',
    description:
      'Comprehensive audit trail of artificial jewellery stock counts, reserved orders, low-stock thresholds, and catalog valuations.',
    icon: Boxes,
    badge: 'Inventory Audit',
  },
  {
    id: 'tax-filing',
    title: 'GST, HST & Sales Tax Compliance Ledger',
    subtitle: 'Canadian HST/GST & Regional Tax Filings',
    description:
      'Accounting tax ledger calculating taxable turnover, Canadian HST/GST collected, and cross-border exemptions for compliance filings.',
    icon: Landmark,
    badge: 'Tax Compliance',
  },
];

export default function ReportsExportPage() {
  const [selectedReport, setSelectedReport] = useState<ReportType>('sales-summary');
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isLoadingPreview, setIsLoadingPreview] = useState(true);

  const fetchPreview = async (type: ReportType) => {
    setIsLoadingPreview(true);
    try {
      const res = await apiRequest<any>(`/admin/reports/export/${type}?format=json`);
      setPreviewData(res?.data || []);
    } catch (e) {
      console.error('Failed to load report preview:', e);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  useEffect(() => {
    fetchPreview(selectedReport);
  }, [selectedReport]);

  const handleDownloadCsv = (type: ReportType) => {
    const url = `http://localhost:4000/admin/reports/export/${type}?format=csv`;
    window.open(url, '_blank');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-ivory-400 dark:border-obsidian-750 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-1">
              <FileSpreadsheet className="h-4 w-4" />
              <span>E-Commerce Sales & Inventory Audit Engine</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-slate-100">
              Sales, Fulfillment & Inventory Reports
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Export verified ledgers for sales revenue, courier deliveries, inventory valuation, and GST/HST tax filings.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleDownloadCsv(selectedReport)}
              className="flex items-center space-x-2 rounded-xl border border-gold-500/60 bg-gradient-to-r from-gold-600 to-gold-500 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-obsidian-950 shadow-lg shadow-gold-500/20 hover:from-gold-500 hover:to-gold-400 transition"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV Ledger</span>
            </button>
          </div>
        </div>

        {/* 4 Report Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REPORT_TYPES.map((r) => {
            const Icon = r.icon;
            const isSelected = selectedReport === r.id;
            return (
              <div
                key={r.id}
                onClick={() => setSelectedReport(r.id)}
                className={`cursor-pointer rounded-3xl border p-6 transition-all duration-300 ${
                  isSelected
                    ? 'border-gold-500 bg-gold-500/5 dark:bg-gold-500/10 shadow-md ring-1 ring-gold-500'
                    : 'border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 hover:border-gold-500/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`rounded-2xl p-3 ${
                        isSelected
                          ? 'bg-gold-500 text-obsidian-950'
                          : 'bg-ivory-100 dark:bg-obsidian-800 text-gold-600 dark:text-gold-400'
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100">
                        {r.title}
                      </h3>
                      <p className="text-xs text-gold-700 dark:text-gold-400 font-medium">
                        {r.subtitle}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-gold-500/15 px-2.5 py-0.5 text-[10px] font-bold text-gold-800 dark:text-gold-300">
                    {r.badge}
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {r.description}
                </p>

                <div className="mt-4 flex items-center justify-between pt-3 border-t border-ivory-200 dark:border-obsidian-800">
                  <span className="text-[11px] font-bold text-slate-500">
                    {isSelected ? '✓ Active in Live Table' : 'Click to inspect'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadCsv(r.id);
                    }}
                    className="inline-flex items-center space-x-1.5 rounded-lg border border-ivory-300 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-850 px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-gold-500 hover:text-obsidian-950 transition"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download CSV</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Report Preview Table */}
        <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-ivory-300 dark:border-obsidian-800 pb-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <FileText className="h-4 w-4 text-gold-500" />
                <span>Live Audit Ledger Preview ({previewData.length} Records)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Displaying certified records formatted for regulatory export.
              </p>
            </div>

            <button
              onClick={() => fetchPreview(selectedReport)}
              className="rounded-lg border border-ivory-300 dark:border-obsidian-750 bg-ivory-100 dark:bg-obsidian-800 p-2 text-slate-600 dark:text-slate-300"
            >
              <RefreshCw className={`h-4 w-4 ${isLoadingPreview ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="overflow-x-auto">
            {isLoadingPreview ? (
              <div className="py-12 text-center text-slate-400">
                <div className="flex items-center justify-center space-x-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
                  <span>Generating cryptographic ledger snapshot...</span>
                </div>
              </div>
            ) : previewData.length === 0 ? (
              <div className="py-12 text-center text-slate-400">No records found.</div>
            ) : (
              <table className="w-full text-left text-xs min-w-[900px]">
                <thead>
                  <tr className="border-b border-ivory-300 dark:border-obsidian-800 text-slate-500 dark:text-slate-400">
                    {Object.keys(previewData[0]).map((key) => (
                      <th key={key} className="pb-3 font-bold uppercase tracking-wider">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-300 dark:divide-obsidian-800 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                  {previewData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-ivory-100 dark:hover:bg-obsidian-850/50 transition">
                      {Object.values(row).map((val: any, vIdx) => (
                        <td key={vIdx} className="py-3">
                          {typeof val === 'number'
                            ? val > 100
                              ? `$${val.toLocaleString()}`
                              : val
                            : String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
