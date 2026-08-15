'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  MapPin,
  Mail,
  Phone,
  Crown,
  Lock,
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-100 dark:bg-obsidian-950 text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-gold-500/20 pt-14 pb-12 transition-colors duration-200">
      {/* 4 Trust Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-slate-200 dark:border-gold-500/20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start space-x-4">
            <div className="rounded-2xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-obsidian-900 p-3 text-gold-600 dark:text-gold-400 shadow-sm">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                100% Insured Delivery
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Fast & safe insured courier delivery with online tracking.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="rounded-2xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-obsidian-900 p-3 text-gold-600 dark:text-gold-400 shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Certified Quality & Hallmarked
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Every stone and gold plating finish is quality certified.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="rounded-2xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-obsidian-900 p-3 text-gold-600 dark:text-gold-400 shadow-sm">
              <Crown className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Bridal & Custom Fittings
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Book private jewellery consultations and custom size fittings.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="rounded-2xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-obsidian-900 p-3 text-gold-600 dark:text-gold-400 shadow-sm">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Anti-Tarnish Guarantee
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Complimentary inspection, polishing & anti-tarnish protection.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 overflow-hidden rounded-xl border border-gold-500/40 bg-white p-1">
                <img src="/images/logo.png" alt="Logo" className="h-full w-full object-contain" />
              </div>
              <span className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">
                THE BLING HAVEN
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Your destination for luxury fashion and bridal jewellery. Handcrafted Kundan sets, AAA+ CZ solitaires, and 22K micro gold plated heirlooms.
            </p>
          </div>

          <div className="space-y-3">
            <h5 className="font-mono text-xs font-bold uppercase tracking-widest text-gold-700 dark:text-gold-400">
              Jewellery
            </h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/rings" className="hover:text-gold-600 transition">Solitaire Rings</Link></li>
              <li><Link href="/bridal-sets" className="hover:text-gold-600 transition">Kundan Bridal Sets</Link></li>
              <li><Link href="/earrings" className="hover:text-gold-600 transition">Partywear Earrings</Link></li>
              <li><Link href="/bangles" className="hover:text-gold-600 transition">Gold Bangles & Kadas</Link></li>
              <li><Link href="/artisan-silver" className="hover:text-gold-600 transition">925 Silver Plated</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-mono text-xs font-bold uppercase tracking-widest text-gold-700 dark:text-gold-400">
              Customer Services
            </h5>
            <ul className="space-y-2 text-xs">
              <li><Link href="/account" className="hover:text-gold-600 transition">My Account & Profile</Link></li>
              <li><Link href="/concierge" className="hover:text-gold-600 transition">Book Appointment</Link></li>
              <li><Link href="/try-on" className="hover:text-gold-600 transition">Virtual Try-On</Link></li>
              <li><Link href="/track" className="hover:text-gold-600 transition">Track Your Order</Link></li>
              <li><Link href="/verify" className="hover:text-gold-600 transition">Verify Certificate</Link></li>
              <li><Link href="/support" className="hover:text-gold-600 transition">Help & Support</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-mono text-xs font-bold uppercase tracking-widest text-gold-700 dark:text-gold-400">
              Contact & Store
            </h5>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              100 Bloor St W, Suite 400<br />
              Yorkville, Toronto, ON, Canada
            </p>
            <p className="text-xs text-gold-700 dark:text-gold-400 font-mono font-bold">
              support@theblinghaven.shop
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-200 dark:border-gold-500/20 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
        <p>© 2026 The Bling Haven. All rights reserved.</p>
        <p className="font-mono text-[10px] text-gold-700 dark:text-gold-400 font-bold">Quality Certified • Hallmarked • 100% Insured Delivery</p>
      </div>
    </footer>
  );
}
