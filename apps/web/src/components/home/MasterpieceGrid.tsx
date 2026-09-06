'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ProductDto } from '@theblinghaven/shared';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/context/CartContext';
import { Heart, Star, Eye, ShoppingBag, Check } from 'lucide-react';

interface MasterpieceGridProps {
  products: ProductDto[];
}

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'rings', label: 'Rings' },
  { id: 'earrings', label: 'Earrings' },
  { id: 'bridal', label: 'Bridal' },
  { id: 'bangles', label: 'Bangles' },
  { id: 'silver', label: 'Silver' },
];

export function MasterpieceGrid({ products }: MasterpieceGridProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high'>('featured');
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();

  const toggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  const handleAdd = (e: React.MouseEvent, product: ProductDto) => {
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

    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory !== 'all') {
      const query = selectedCategory.toLowerCase();
      list = list.filter((p) => {
        const cat = p.category?.toLowerCase() || '';
        const title = p.title?.toLowerCase() || '';
        const slug = p.slug?.toLowerCase() || '';
        return cat.includes(query) || title.includes(query) || slug.includes(query);
      });
    }

    if (sortBy === 'price-low') {
      list.sort((a, b) => a.basePriceUsd - b.basePriceUsd);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.basePriceUsd - a.basePriceUsd);
    }

    return list.slice(0, 10);
  }, [products, selectedCategory, sortBy]);

  return (
    <section className="py-14 sm:py-20 bg-[#fbf9f5] dark:bg-obsidian-950 border-t border-stone-200/70 dark:border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-gold-600 dark:text-gold-400 uppercase block mb-1">
              Atelier Vault
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-white">
              90 Masterpiece Creations
            </h2>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <label htmlFor="sort-select" className="text-xs font-mono text-stone-500 dark:text-stone-400">
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white dark:bg-stone-900 border border-stone-300/80 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs font-mono text-stone-800 dark:text-stone-200 focus:outline-none focus:border-gold-500 shadow-sm"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-xs font-mono font-semibold tracking-wider transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-stone-900 text-white dark:bg-gold-500 dark:text-obsidian-950 shadow-md'
                    : 'bg-white dark:bg-stone-900/80 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-white/10 hover:border-gold-500'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Products Grid (5-column on xl, 4 on lg, 2 on sm) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {filteredProducts.map((product, idx) => {
            const isWishlisted = !!wishlist[product.id];
            const isAdded = !!addedItems[product.id];
            const originalPrice = product.basePriceUsd * 1.33; // 25% discount display
            const rating = 4.7 + ((idx % 3) * 0.1);
            const reviewsCount = 95 + ((idx * 17) % 65);
            const badgeType = idx % 2 === 0 ? 'BESTSELLER' : 'NEW ARRIVAL';

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (idx % 5) * 0.05 }}
                className="group relative flex flex-col justify-between rounded-2xl overflow-hidden border border-stone-200/90 dark:border-white/10 bg-white dark:bg-stone-900/90 p-3 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div>
                  {/* Image Frame with Badges */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-950 mb-3">
                    <img
                      src={product.primaryImageUrl}
                      alt={product.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-108"
                    />

                    {/* Badge */}
                    <div className="absolute top-2 left-2 z-10">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold tracking-wider uppercase text-white shadow-sm ${
                        badgeType === 'BESTSELLER' ? 'bg-amber-600' : 'bg-stone-800 dark:bg-gold-600'
                      }`}>
                        {badgeType}
                      </span>
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => toggleWishlist(e, product.id)}
                      aria-label="Wishlist"
                      className="absolute top-2 right-2 z-10 h-7 w-7 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md flex items-center justify-center text-stone-700 dark:text-stone-300 hover:text-rose-500 transition-colors shadow-sm"
                    >
                      <Heart
                        className={`h-3.5 w-3.5 ${
                          isWishlisted ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Title */}
                  <Link href={`/products/${product.slug}`} className="block">
                    <h3 className="font-serif text-xs sm:text-sm font-semibold text-stone-900 dark:text-white line-clamp-1 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
                      {product.title}
                    </h3>
                  </Link>

                  {/* Pricing with strikethrough & % discount */}
                  <div className="mt-1 flex items-baseline space-x-1.5">
                    <span className="font-mono text-xs sm:text-sm font-bold text-stone-900 dark:text-gold-300">
                      {formatPrice(product.basePriceUsd)}
                    </span>
                    <span className="font-mono text-[10px] text-stone-400 line-through">
                      {formatPrice(originalPrice)}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      (25% OFF)
                    </span>
                  </div>

                  {/* Star Rating */}
                  <div className="mt-1.5 flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-[10px] font-mono font-bold text-stone-700 dark:text-stone-300">
                      {rating.toFixed(1)}
                    </span>
                    <span className="text-[10px] font-mono text-stone-400">
                      ({reviewsCount})
                    </span>
                  </div>
                </div>

                {/* Actions: Add to Bag & Quick View */}
                <div className="mt-3 pt-2 border-t border-stone-100 dark:border-white/5 flex items-center space-x-1.5">
                  <button
                    onClick={(e) => handleAdd(e, product)}
                    type="button"
                    className={`flex-1 flex items-center justify-center space-x-1.5 rounded-xl py-2 px-2.5 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-sm ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950 hover:brightness-110'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="h-3 w-3" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-3 w-3" />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>

                  <Link
                    href={`/products/${product.slug}`}
                    aria-label="Quick View"
                    className="p-2 rounded-xl border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/catalog"
            className="inline-flex items-center space-x-2 rounded-full border border-stone-300 dark:border-gold-500/40 px-8 py-3.5 text-xs font-mono font-bold uppercase tracking-widest text-stone-800 dark:text-stone-200 hover:bg-stone-900 hover:text-white dark:hover:bg-gold-500 dark:hover:text-obsidian-950 transition-all shadow-sm"
          >
            <span>View All 90 Masterpieces</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
