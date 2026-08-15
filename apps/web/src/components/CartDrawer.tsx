'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import {
  ShoppingBag,
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  Gem,
} from 'lucide-react';

export function CartDrawer() {
  const { items, itemCount, subtotalUsd, isCartOpen, setIsCartOpen, removeItem, updateQuantity } =
    useCart();
  const { formatPrice } = useCurrency();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-obsidian-950 border-l border-gold-500/30 text-slate-100 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-gold-500/20 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5 text-gold-400" />
              <h2 className="font-serif text-lg font-bold tracking-wider">
                Shopping Bag ({itemCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="rounded-full p-2 text-slate-400 hover:text-gold-400 hover:bg-gold-500/10 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-white/10">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-3 py-16">
                <div className="rounded-full border border-gold-500/30 bg-obsidian-900 p-4 text-gold-400">
                  <Gem className="h-8 w-8" />
                </div>
                <h3 className="font-serif text-lg font-bold">Your Bag is Empty</h3>
                <p className="text-xs text-slate-400 max-w-xs">
                  Explore our curated collections and select bespoke haute joaillerie masterpieces.
                </p>
                <Link
                  href="/catalog"
                  onClick={() => setIsCartOpen(false)}
                  className="rounded-xl border border-gold-500/60 bg-gradient-to-r from-gold-600 to-gold-500 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-obsidian-950 shadow-md hover:from-gold-500 hover:to-gold-400 transition mt-2"
                >
                  Explore Catalog
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex space-x-4">
                  {/* Thumbnail */}
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border border-gold-500/30 bg-obsidian-900">
                    <img
                      src={item.primaryImageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-sm text-slate-100 truncate">
                      {item.title}
                    </h4>
                    <p className="text-[11px] font-mono text-gold-400 mt-0.5">
                      {formatPrice(item.unitPriceUsd)}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px] text-slate-400">
                      {item.selectedRingSize && (
                        <span className="rounded bg-obsidian-850 px-2 py-0.5 border border-white/10 font-mono">
                          Size: {item.selectedRingSize}
                        </span>
                      )}
                      {item.customEngraving && (
                        <span className="rounded bg-gold-500/10 text-gold-300 px-2 py-0.5 font-mono">
                          Engraved: "{item.customEngraving}"
                        </span>
                      )}
                    </div>

                    {/* Quantity & Delete Controls */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-2 border border-white/10 rounded-lg px-2 py-1 bg-obsidian-900">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-slate-400 hover:text-gold-400"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="font-mono text-xs font-bold px-1">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-slate-400 hover:text-gold-400"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-500 hover:text-red-400 p-1"
                        title="Remove piece"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-6 border-t border-gold-500/20 bg-obsidian-900/60 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal Estimated</span>
                  <span className="font-mono font-bold text-slate-100">
                    {formatPrice(subtotalUsd)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Armored Insured Freight</span>
                  <span className="font-mono font-bold text-emerald-400">COMPLIMENTARY</span>
                </div>
                <div className="flex justify-between text-sm font-serif font-bold text-gold-400 pt-2 border-t border-white/10">
                  <span>Acquisition Total</span>
                  <span>{formatPrice(subtotalUsd)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="flex w-full items-center justify-center space-x-2 rounded-2xl border border-gold-500/60 bg-gradient-to-r from-gold-600 to-gold-500 py-3.5 text-xs font-bold uppercase tracking-widest text-obsidian-950 shadow-xl shadow-gold-500/20 hover:from-gold-500 hover:to-gold-400 transition"
              >
                <span>Proceed to Insured Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-400 text-center font-mono">
                <ShieldCheck className="h-3.5 w-3.5 text-gold-500" />
                <span>BIS 916 & GIA Certified • Ferrari Armored Logistics</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
