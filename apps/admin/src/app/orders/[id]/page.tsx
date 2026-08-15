'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AdminLayout } from '@/components/AdminLayout';
import { apiRequest } from '@/lib/api';
import {
  OrderDto,
  OrderStatus,
  ShippingCarrier,
} from '@theblinghaven/shared';
import {
  ArrowLeft,
  Printer,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Clock,
  Gem,
  DollarSign,
  UserCheck,
  X,
  FileText,
  MapPin,
  Phone,
  Mail,
  Lock,
} from 'lucide-react';

const ORDER_STATUSES: OrderStatus[] = [
  'PENDING_VERIFICATION',
  'CONFIRMED',
  'VAULT_ALLOCATION',
  'CUSTOM_SIZING_IN_PROGRESS',
  'QUALITY_INSPECTION_PASSED',
  'SECURE_DISPATCH_ARMORED',
  'DELIVERED_SIGNATURE_REQUIRED',
];

const CARRIERS: { key: ShippingCarrier; label: string }[] = [
  { key: 'FERRARI_GROUP_SECURE', label: 'Ferrari Group Secure Logistics' },
  { key: 'BRINKS_GLOBAL', label: "Brink's Global Armored Services" },
  { key: 'MALCA_AMIT', label: 'Malca-Amit High-Jewelry Express' },
  { key: 'DHL_EXPRESS_INSURED', label: 'DHL Express Insured Signature' },
  { key: 'FEDEX_PRIORITY_DIRECT', label: 'FedEx Priority Direct Signature' },
];

export default function OrderInspectorPage() {
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<OrderDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Status Transition Modal
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus>('CONFIRMED');
  const [carrier, setCarrier] = useState<ShippingCarrier>('FERRARI_GROUP_SECURE');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [signatureName, setSignatureName] = useState('');

  const fetchOrder = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest<any>(`/admin/orders/${id}`);
      const data: OrderDto = res.data || res;
      setOrder(data);
      setNewStatus(data.status);
      if (data.shippingCarrier) setCarrier(data.shippingCarrier);
      if (data.trackingNumber) setTrackingNumber(data.trackingNumber);
    } catch (e: any) {
      alert(e.message || 'Failed to load order.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await apiRequest(`/admin/orders/${id}/status`, {
        method: 'PUT',
        data: {
          status: newStatus,
          shippingCarrier: carrier,
          trackingNumber: trackingNumber || undefined,
          notes: statusNotes || undefined,
          deliverySignatureName: signatureName || undefined,
        },
      });
      alert('Order status and fulfillment timeline updated.');
      setStatusModalOpen(false);
      setStatusNotes('');
      fetchOrder();
    } catch (e: any) {
      alert(e.message || 'Failed to update order status.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading || !order) {
    return (
      <AdminLayout>
        <div className="flex h-96 items-center justify-center">
          <div className="flex flex-col items-center space-x-2 text-slate-400">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
            <p className="text-xs mt-2">Loading luxury order details...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-ivory-400 dark:border-obsidian-750 pb-6">
          <div className="flex items-center space-x-4">
            <Link
              href="/orders"
              className="rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-white dark:bg-obsidian-850 p-2 text-slate-600 dark:text-slate-300 hover:bg-ivory-100 dark:hover:bg-obsidian-800 transition"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-1">
                <Truck className="h-4 w-4" />
                <span>Haute Joaillerie Order Details</span>
              </div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
                Order #{order.orderNumber}
              </h1>
              <p className="mt-0.5 text-xs text-slate-500 font-mono">
                Placed on {new Date(order.createdAt).toLocaleString()} • VIP Tier: {order.customerVipTier}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsInvoiceOpen(true)}
              className="flex items-center space-x-2 rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-white dark:bg-obsidian-850 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 shadow-sm hover:bg-ivory-100 dark:hover:bg-obsidian-800 transition"
            >
              <Printer className="h-4 w-4 text-gold-500" />
              <span>Luxury Tax Invoice</span>
            </button>

            <button
              onClick={() => setStatusModalOpen(true)}
              className="flex items-center space-x-2 rounded-xl border border-gold-500/60 bg-gradient-to-r from-gold-600 to-gold-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-obsidian-950 shadow-md hover:from-gold-500 hover:to-gold-400 transition"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Update Fulfillment Stage</span>
            </button>
          </div>
        </div>

        {/* 3 Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Fulfillment Stage
            </span>
            <div className="flex items-center space-x-2">
              <span className="h-3 w-3 rounded-full bg-gold-500 animate-pulse" />
              <p className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">
                {order.status.replace(/_/g, ' ')}
              </p>
            </div>
            <p className="text-xs text-slate-400">Payment Status: {order.paymentStatus}</p>
          </div>

          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Order Value
            </span>
            <p className="font-serif text-2xl font-bold text-gold-700 dark:text-gold-400">
              {order.currencySymbol} {order.totalAmountLocal.toLocaleString()}
            </p>
            <p className="text-xs text-slate-400 font-mono">
              Converted at Base ${order.totalAmountUsd.toLocaleString()} USD
            </p>
          </div>

          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Insured Armored Logistics
            </span>
            <p className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">
              {order.shippingCarrier ? order.shippingCarrier.replace('_', ' ') : 'Atelier Safe Allocation'}
            </p>
            <p className="text-xs text-slate-400 font-mono">
              Tracking: {order.trackingNumber || 'Awaiting Armored Handover'}
            </p>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Line Items & Order Summary (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Jewelry Pieces Table */}
            <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm space-y-4">
              <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100 border-b border-ivory-300 dark:border-obsidian-800 pb-3">
                Jewelry Pieces in Order ({order.items.length})
              </h2>

              <div className="divide-y divide-ivory-300 dark:divide-obsidian-800">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 py-4">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl border border-ivory-300 dark:border-obsidian-800 bg-obsidian-950">
                      <img src={item.primaryImageUrl} alt={item.title} className="h-full w-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-serif font-bold text-sm text-slate-900 dark:text-slate-100">
                        {item.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="font-mono text-[11px] font-bold text-gold-700 dark:text-gold-400">
                          {item.sku}
                        </span>
                        {item.selectedRingSize && (
                          <span className="rounded bg-ivory-200 dark:bg-obsidian-800 px-2 py-0.5 text-[10px] font-bold">
                            Size: {item.selectedRingSize}
                          </span>
                        )}
                        {item.hallmarkCertificate && (
                          <span className="rounded bg-gold-500/10 px-2 py-0.5 text-[10px] font-bold text-gold-800 dark:text-gold-300">
                            🛡️ {item.hallmarkCertificate}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-serif font-bold text-sm text-slate-900 dark:text-slate-100">
                        ${item.totalPriceUsd.toLocaleString()} USD
                      </p>
                      <p className="text-[10px] text-slate-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fulfillment Timeline */}
            <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm space-y-4">
              <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100 border-b border-ivory-300 dark:border-obsidian-800 pb-3">
                Fulfillment Timeline & Chain of Custody
              </h2>

              <div className="relative border-l-2 border-gold-500/40 ml-3 space-y-6 py-2">
                {order.timeline.map((step, idx) => (
                  <div key={step.id} className="relative pl-6">
                    <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-gold-500 bg-white dark:bg-obsidian-950" />
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-xs text-gold-700 dark:text-gold-400">
                        {step.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(step.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">{step.notes}</p>
                    {step.actorEmail && (
                      <p className="text-[10px] text-slate-400 mt-0.5">By: {step.actorEmail}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer & Shipping Details (1 Col) */}
          <div className="space-y-6">
            {/* VIP Client Card */}
            <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-ivory-300 dark:border-obsidian-800 pb-3">
                <h3 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100">
                  Private Client Profile
                </h3>
                <span className="rounded-full bg-gold-500/20 px-2.5 py-0.5 text-[10px] font-bold text-gold-800 dark:text-gold-300">
                  {order.customerVipTier}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <p className="font-serif font-bold text-sm text-slate-900 dark:text-slate-100">
                  {order.customerName}
                </p>
                <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span>{order.customerEmail}</span>
                </div>
                {order.customerPhone && (
                  <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span>{order.customerPhone}</span>
                  </div>
                )}
              </div>

              <Link
                href={`/customers/${order.customerId}`}
                className="block w-full text-center rounded-xl border border-ivory-300 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-850 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-gold-500 hover:text-obsidian-950 transition"
              >
                View Full Client File & Preferences
              </Link>
            </div>

            {/* Destination Address */}
            <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm space-y-3">
              <h3 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100 border-b border-ivory-300 dark:border-obsidian-800 pb-3">
                Secure Delivery Destination
              </h3>

              <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <p className="font-bold">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city} {order.shippingAddress.postalCode}
                </p>
                <p className="font-bold text-gold-700 dark:text-gold-400">{order.shippingAddress.country}</p>
              </div>

              {order.customerNotes && (
                <div className="rounded-xl bg-ivory-50 dark:bg-obsidian-850 p-3 text-xs border border-ivory-200 dark:border-obsidian-800">
                  <span className="font-bold text-[10px] uppercase text-slate-400 block mb-1">
                    Client Delivery Note:
                  </span>
                  <p className="italic text-slate-600 dark:text-slate-300">"{order.customerNotes}"</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Update Fulfillment Stage Modal */}
        {statusModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
            <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-ivory-300 dark:border-obsidian-800 pb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">
                    Update Order Fulfillment Stage
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">Order #{order.orderNumber}</p>
                </div>
                <button
                  onClick={() => setStatusModalOpen(false)}
                  className="rounded-full p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleStatusSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Select Target Stage
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                    className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs font-bold text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Armored Secure Carrier
                  </label>
                  <select
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value as ShippingCarrier)}
                    className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs font-bold text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                  >
                    {CARRIERS.map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Armored Tracking Code / Seal Serial
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 font-mono text-xs font-bold text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                    placeholder="e.g. FG-DXB-992014-VAULT"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Fulfillment Progress Notes
                  </label>
                  <textarea
                    rows={2}
                    value={statusNotes}
                    onChange={(e) => setStatusNotes(e.target.value)}
                    className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                    placeholder="e.g. BIS Hallmarking confirmed. Dispatched in tamper-proof titanium lock box."
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-ivory-300 dark:border-obsidian-800">
                  <button
                    type="button"
                    onClick={() => setStatusModalOpen(false)}
                    className="rounded-xl border border-ivory-300 dark:border-obsidian-750 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-ivory-100 dark:hover:bg-obsidian-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="rounded-xl border border-gold-500/60 bg-gradient-to-r from-gold-600 to-gold-500 px-5 py-2 text-xs font-bold uppercase tracking-wider text-obsidian-950 shadow-md hover:from-gold-500 hover:to-gold-400 transition disabled:opacity-50"
                  >
                    {isUpdating ? 'Updating...' : 'Commit Fulfillment Update'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Printable Luxury Tax Invoice Modal */}
        {isInvoiceOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
            <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-8 shadow-2xl space-y-6">
              {/* Header Strip */}
              <div className="flex items-center justify-between border-b-2 border-gold-500 pb-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold tracking-wider text-slate-900 dark:text-slate-100">
                    THE BLING HAVEN
                  </h2>
                  <p className="text-[11px] font-mono uppercase tracking-widest text-gold-700 dark:text-gold-400">
                    Maison de Haute Joaillerie & High Fine Jewelry
                  </p>
                </div>
                <div className="text-right">
                  <span className="rounded-md bg-gold-500/15 px-3 py-1 text-xs font-bold font-mono text-gold-800 dark:text-gold-300">
                    INVOICE #{order.orderNumber}
                  </span>
                  <p className="text-xs text-slate-400 mt-1">
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Client & Shipping */}
              <div className="grid grid-cols-2 gap-6 text-xs">
                <div>
                  <span className="font-bold uppercase text-slate-400">Billed To (VIP Client):</span>
                  <p className="font-serif font-bold text-sm text-slate-900 dark:text-slate-100 mt-1">
                    {order.customerName}
                  </p>
                  <p className="text-slate-500">{order.customerEmail}</p>
                  <p className="text-slate-500">{order.customerPhone}</p>
                </div>
                <div>
                  <span className="font-bold uppercase text-slate-400">Insured Delivery Address:</span>
                  <p className="text-slate-700 dark:text-slate-300 mt-1">
                    {order.shippingAddress.street}
                  </p>
                  <p className="text-slate-700 dark:text-slate-300">
                    {order.shippingAddress.city}, {order.shippingAddress.country}
                  </p>
                  <p className="font-mono text-gold-700 dark:text-gold-400">
                    Carrier: {order.shippingCarrier?.replace('_', ' ')}
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left text-xs border-t border-b border-ivory-300 dark:border-obsidian-800 py-3">
                <thead>
                  <tr className="text-slate-500">
                    <th className="py-2">Description & SKU</th>
                    <th className="py-2">Certificates</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-200 dark:divide-obsidian-800 text-slate-800 dark:text-slate-200">
                  {order.items.map((i) => (
                    <tr key={i.id}>
                      <td className="py-2.5 font-bold">
                        {i.title}
                        <span className="block font-mono font-normal text-[10px] text-slate-400">
                          {i.sku} {i.selectedRingSize ? `• Size: ${i.selectedRingSize}` : ''}
                        </span>
                      </td>
                      <td className="py-2.5 text-[10px] font-mono text-gold-700 dark:text-gold-400">
                        {i.hallmarkCertificate || 'BIS 916 & IGI Certified'}
                      </td>
                      <td className="py-2.5 text-center font-mono">{i.quantity}</td>
                      <td className="py-2.5 text-right font-mono font-bold">
                        ${i.totalPriceUsd.toLocaleString()} USD
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total Summary */}
              <div className="flex justify-end text-xs">
                <div className="w-64 space-y-1">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal:</span>
                    <span className="font-mono">${order.subtotalUsd.toLocaleString()} USD</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Insured Armored Freight:</span>
                    <span className="font-mono text-emerald-600 font-bold">COMPLIMENTARY</span>
                  </div>
                  <div className="flex justify-between font-serif text-base font-bold text-gold-700 dark:text-gold-400 pt-2 border-t border-gold-500/40">
                    <span>Total Amount:</span>
                    <span>
                      {order.currencySymbol} {order.totalAmountLocal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-ivory-300 dark:border-obsidian-800">
                <p className="text-[10px] text-slate-400 italic">
                  Certified authentic by The Bling Haven Master Atelier. All pieces BIS Hallmarked.
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => window.print()}
                    className="rounded-xl border border-ivory-300 dark:border-obsidian-750 bg-ivory-100 dark:bg-obsidian-800 px-4 py-2 text-xs font-bold"
                  >
                    Print Document
                  </button>
                  <button
                    onClick={() => setIsInvoiceOpen(false)}
                    className="rounded-xl bg-gold-500 px-4 py-2 text-xs font-bold text-obsidian-950"
                  >
                    Close Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
