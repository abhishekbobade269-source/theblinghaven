'use client';

import React, { useState, memo } from 'react';
import Link from 'next/link';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/context/CartContext';
import { ProductDto } from '@theblinghaven/shared';
import {
  Gem,
  ShoppingBag,
  ShieldCheck,
  Sparkles,
  Camera,
  Check,
} from 'lucide-react';

interface ProductCardProps {
  product: ProductDto;
}

export const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: product.id,
      sku: product.sku,
      title: product.title,
      slug: product.slug,
      unitPriceUsd: product.basePriceUsd,
      quantity: 1,
      primaryImageUrl: product.primaryImageUrl,
      hallmarkCertificate: product.specs?.hallmarkCertificate,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group card-luxury-hover relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 dark:border-gold-500/20 bg-white dark:bg-[#0E0E14] hover:border-gold-500/70 dark:hover:border-gold-500/60 shadow-sm hover:shadow-xl transition-all duration-200"
    >
      {/* Image Container with Luxury Shimmer Sweep */}
      <div className="shine-sweep-container relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-black">
        <img
          src={product.primaryImageUrl}
          alt={product.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex flex-col gap-1 z-10">
          {product.isFeatured && (
            <span className="rounded-full bg-gold-500 px-2.5 py-0.5 font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-obsidian-950 shadow-md">
              Maison Masterpiece
            </span>
          )}
          {(product.specs?.diamondWeightCarats || (product.specs as any)?.gemstoneCarat) && (
            <span className="rounded-full bg-white/95 dark:bg-obsidian-950/95 border border-gold-500/30 px-2 py-0.5 font-mono text-[8px] sm:text-[9px] font-bold text-gold-700 dark:text-gold-300 shadow-sm">
              💎 {product.specs?.diamondWeightCarats || (product.specs as any)?.gemstoneCarat} ct
            </span>
          )}
        </div>

        {/* Top Right AR Shortcut Pill */}
        <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <span className="inline-flex items-center space-x-1 rounded-full bg-white/95 dark:bg-obsidian-950/95 border border-gold-500/40 px-2 py-0.5 font-mono text-[8px] sm:text-[9px] font-bold text-gold-700 dark:text-gold-400 shadow-md">
            <Camera className="h-3 w-3 text-gold-500" />
            <span className="hidden sm:inline">AR Try-On</span>
          </span>
        </div>

        {/* Bottom Slide-up Quick Action Pill Bar */}
        <div className="absolute bottom-2.5 inset-x-2.5 sm:bottom-3 sm:inset-x-3 z-10 flex items-center justify-between opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-150">
          <button
            onClick={handleQuickAdd}
            type="button"
            className={`flex-1 flex items-center justify-center space-x-1.5 rounded-2xl py-2 px-3 sm:py-2.5 sm:px-4 text-[11px] sm:text-xs font-bold font-mono uppercase tracking-wider shadow-lg transition-colors duration-150 ${
              isAdded
                ? 'bg-emerald-500 text-white'
                : 'bg-gold-500 hover:bg-gold-400 text-obsidian-950'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-5 space-y-2 sm:space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
            <span className="font-bold truncate">{(product as any).category?.name || product.categoryName || 'High Jewelry'}</span>
            <span className="text-gold-700 dark:text-gold-400 font-bold shrink-0 ml-1">{product.specs?.metalType || '18K Gold Plated'}</span>
          </div>

          <h3 className="font-serif text-xs sm:text-sm md:text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-gold-700 dark:group-hover:text-gold-400 transition-colors line-clamp-1">
            {product.title}
          </h3>

          {product.subtitle && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 font-normal hidden sm:block">
              {product.subtitle}
            </p>
          )}
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-gold-500/10 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[8px] sm:text-[9px] uppercase font-bold text-slate-400">Price</span>
            <strong className="text-xs sm:text-base font-mono font-bold text-gold-700 dark:text-gold-400">
              {formatPrice(product.basePriceUsd)}
            </strong>
          </div>

          <div className="flex items-center space-x-1 text-[9px] sm:text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-500/30">
            <ShieldCheck className="h-3 w-3 shrink-0" />
            <span className="hidden sm:inline">Certified</span>
          </div>
        </div>
      </div>
    </Link>
  );
});
