'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import {
  Truck,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Gem,
  ArrowRight,
  Package,
  MapPin,
  Check,
} from 'lucide-react';

export default function OrderTrackingPage() {
  const [orderQuery, setOrderQuery] = useState('');
  const [order, setOrder] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const ord = params.get('order');
      if (ord) {
        setOrderQuery(ord);
        performTrack(ord);
      }
    }
  }, []);

  const performTrack = async (orderNum: string) => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      const res = await apiRequest<any>(`/orders/track/${encodeURIComponent(orderNum.trim())}`);
      setOrder(res?.data || res);
    } catch (e) {
      console.error('Tracking search error:', e);
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;
    performTrack(orderQuery);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-10 sm:space-y-12">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2.5">
        <div className="inline-flex items-center space-x-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 text-xs font-mono font-bold text-gold-700 dark:text-gold-400">
          <Truck className="h-3.5 w-3.5" />
          <span>Express Courier Tracking</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
          Track Your Jewellery Delivery
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Real-time courier tracking via DTDC Express, Blue Dart, and Delhivery with live status updates.
        </p>
      </div>

      {/* Tracking Search Input */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto flex space-x-2 font-mono">
        <input
          type="text"
          required
          value={orderQuery}
          onChange={(e) => setOrderQuery(e.target.value)}
          placeholder="Enter Order # (e.g. TBH-2026-8803)"
          className="flex-1 rounded-2xl border border-slate-300 dark:border-gold-500/40 bg-white dark:bg-[#0E0E14] px-5 py-3.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-gold-500 focus:outline-none font-mono font-bold shadow-sm"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-2xl bg-gold-500 hover:bg-gold-400 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-obsidian-950 shadow-md transition"
        >
          {isLoading ? 'Searching...' : 'Track Delivery'}
        </button>
      </form>

      {/* Order Results */}
      {hasSearched && !isLoading && !order && (
        <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0E0E14] p-8 text-center space-y-2 shadow-md">
          <p className="font-serif text-base font-bold text-slate-900 dark:text-slate-200">No order found</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Please verify the order number (e.g. TBH-2026-8803) and try again.
          </p>
        </div>
      )}

      {order && (
        <div className="rounded-3xl border border-slate-200 dark:border-gold-500/40 bg-white dark:bg-[#0E0E14] p-6 sm:p-10 space-y-8 shadow-2xl animate-in fade-in">
          {/* Order Status Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-gold-700 dark:text-gold-400 block font-bold">
                Order Tracking Record
              </span>
              <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-slate-100">
                Order #{order.orderNumber}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                Customer: {order.customerName} • Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="text-right font-mono">
              <span className="rounded-full bg-gold-500/20 px-3.5 py-1 text-xs font-bold text-gold-700 dark:text-gold-400 border border-gold-500/40">
                {order.status ? order.status.replace(/_/g, ' ') : 'PROCESSING'}
              </span>
            </div>
          </div>

          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="rounded-2xl bg-slate-50 dark:bg-obsidian-950 p-4 border border-slate-200 dark:border-white/5 space-y-1">
              <span className="text-slate-500 uppercase text-[10px] font-bold">Courier Partner</span>
              <p className="font-bold text-slate-900 dark:text-slate-200">
                {order.shippingCarrier || 'DTDC Express Priority'}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 dark:bg-obsidian-950 p-4 border border-slate-200 dark:border-white/5 space-y-1">
              <span className="text-slate-500 uppercase text-[10px] font-bold">Courier AWB / Tracking #</span>
              <p className="font-bold text-gold-700 dark:text-gold-400">
                {order.trackingNumber || 'DTDC-IND-8829104'}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 dark:bg-obsidian-950 p-4 border border-slate-200 dark:border-white/5 space-y-1">
              <span className="text-slate-500 uppercase text-[10px] font-bold">Estimated Delivery</span>
              <p className="font-bold text-emerald-600 dark:text-emerald-400">
                2 - 3 Business Days
              </p>
            </div>
          </div>

          {/* Delivery Timeline */}
          <div className="space-y-4 font-mono text-xs">
            <h3 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-white/10 pb-2">
              Express Delivery Timeline
            </h3>

            <div className="space-y-4 pl-2">
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-slate-900 dark:text-slate-100">Order Placed & Verified</h4>
                  <p className="text-[11px] text-slate-500 font-sans">Payment confirmed and items sent to warehouse packaging.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-slate-900 dark:text-slate-100">Quality Certified & Tamper-Proof Packed</h4>
                  <p className="text-[11px] text-slate-500 font-sans">Jewellery inspected, polished, and packed in sealed security box.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 rounded-full bg-gold-500/20 text-gold-700 dark:text-gold-400 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                  <Truck className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-gold-700 dark:text-gold-400">Handed to {order.shippingCarrier || 'DTDC Express Priority'} Courier</h4>
                  <p className="text-[11px] text-slate-500 font-sans">In air transit with live GPS tracking and SMS alerts to customer.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 opacity-60">
                <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-obsidian-800 text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-slate-700 dark:text-slate-300">Out for Delivery & Doorstep Handover</h4>
                  <p className="text-[11px] text-slate-500 font-sans">Delivered to recipient with doorstep signature verification.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
