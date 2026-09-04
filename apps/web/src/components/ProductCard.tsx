'use client';

import React, { useState, memo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/context/CartContext';
import { ProductDto } from '@theblinghaven/shared';
import { DiamondGlint } from '@/components/ui/DiamondGlint';
import { ShinyText } from '@/components/react-bits';
import {
  ShoppingBag,
  Sparkles,
  Camera,
  Check,
  Award,
} from 'lucide-react';

interface ProductCardProps {
  product: ProductDto;
  priority?: boolean;
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
    setTimeout(() => setIsAdded(false), 2200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col h-full overflow-hidden rounded-3xl border border-slate-200/90 dark:border-gold-500/20 bg-white dark:bg-[#0B0B10] shadow-sm hover:shadow-[0_20px_45px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-300"
    >
      <Link href={`/products/${product.slug}`} className="flex flex-col flex-1">
        {/* Visual Showcase with Diamond Shimmer */}
        <div className="relative aspect-square w-full overflow-hidden bg-slate-50 dark:bg-black/50">
          <img
            src={product.primaryImageUrl}
            alt={product.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
          />

          <DiamondGlint />

          {/* Maison Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.isFeatured && (
              <span className="inline-flex items-center space-x-1 rounded-full bg-gradient-to-r from-gold-500 to-amber-600 px-2.5 py-0.5 font-mono text-[9px] font-extrabold uppercase tracking-wider text-obsidian-950 shadow-md">
                <Sparkles className="h-2.5 w-2.5" />
                <ShinyText text="Haute Joaillerie" color="#09090b" shineColor="#ffffff" speed={2.5} />
              </span>
            )}
            {(product.subtitle || (product as any).badgeText) && !product.isFeatured && (
              <span className="rounded-full bg-obsidian-900/90 text-gold-300 border border-gold-500/40 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider shadow-sm">
                {product.subtitle || (product as any).badgeText}
              </span>
            )}
            {(product.specs?.diamondWeightCarats || (product.specs as any)?.gemstoneCarat) && (
              <span className="rounded-full bg-white/95 dark:bg-obsidian-950/95 border border-gold-500/30 px-2 py-0.5 font-mono text-[9px] font-semibold text-gold-700 dark:text-gold-300 shadow-sm backdrop-blur-md">
                💎 {product.specs?.diamondWeightCarats || (product.specs as any)?.gemstoneCarat} ct
              </span>
            )}
          </div>

          {/* AR Try-On Shortcut Badge */}
          <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="inline-flex items-center space-x-1 rounded-full bg-obsidian-950/90 border border-gold-400/60 px-2.5 py-1 font-mono text-[9px] font-bold text-gold-300 shadow-lg backdrop-blur-md">
              <Camera className="h-3 w-3 text-gold-400" />
              <span>AR Fit</span>
            </span>
          </div>

          {/* Bottom Quick-Acquire Button */}
          <div className="absolute bottom-3 inset-x-3 z-10 opacity-0 group-hover:opacity-100 transform translate-y-3 group-hover:translate-y-0 transition-all duration-200">
            <button
              onClick={handleQuickAdd}
              type="button"
              className={`w-full flex items-center justify-center space-x-2 rounded-2xl py-2.5 px-4 text-xs font-mono font-bold uppercase tracking-wider shadow-xl transition-all duration-200 ${
                isAdded
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gradient-to-r from-gold-400 via-gold-500 to-amber-500 text-obsidian-950 hover:brightness-110'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Placed in Velvet Pouch</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Acquire Creation</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Product Details & Pricing */}
        <div className="flex flex-col flex-1 p-4 sm:p-5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-gold-600 dark:text-gold-400/80">
              {product.categoryName || 'Fine Jewellery'}
            </span>
            {(product.specs?.hallmarkCertificate || (product.specs as any)?.hallmark) && (
              <span className="inline-flex items-center space-x-0.5 text-[9px] font-mono text-slate-500 dark:text-slate-400">
                <Award className="h-2.5 w-2.5 text-gold-500" />
                <span>{product.specs?.hallmarkCertificate || (product.specs as any)?.hallmark}</span>
              </span>
            )}
          </div>

          <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
            {product.title}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 font-light">
            {product.specs?.metalType || (product.specs as any)?.metal || product.description}
          </p>

          <div className="pt-1 mt-auto flex items-baseline justify-between border-t border-slate-100 dark:border-white/5">
            <div className="flex items-baseline space-x-2">
              <span className="font-mono text-base sm:text-lg font-bold text-slate-900 dark:text-gold-400">
                {formatPrice(product.basePriceUsd)}
              </span>
              {product.comparePriceUsd && product.comparePriceUsd > product.basePriceUsd && (
                <span className="font-mono text-xs text-slate-400 line-through">
                  {formatPrice(product.comparePriceUsd)}
                </span>
              )}
            </div>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">
              Insured Transit
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});
