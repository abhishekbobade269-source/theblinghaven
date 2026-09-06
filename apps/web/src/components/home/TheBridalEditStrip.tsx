'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, ChevronLeft, ChevronRight, Truck, ShieldCheck, RotateCcw, Headphones, ArrowRight } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    author: 'Sneha P.',
    city: 'Mumbai',
    text: 'Absolutely gorgeous! The finish looks even better in person. Highly recommend The Bling Haven!',
    rating: 5,
    avatar: '/images/about/neha_singh.jpg',
  },
  {
    id: 2,
    author: 'Pooja M.',
    city: 'Delhi',
    text: 'Wore the Kundan choker for my wedding reception. Received countless compliments all night!',
    rating: 5,
    avatar: '/images/models/woman_1.png',
  },
  {
    id: 3,
    author: 'Ananya S.',
    city: 'Toronto',
    text: 'Heirloom quality without the crazy price tag. The anti-tarnish coating is 100% genuine.',
    rating: 5,
    avatar: '/images/models/woman_2.png',
  },
];

export function TheBridalEditStrip() {
  const [reviewIdx, setReviewIdx] = useState(0);

  const prevReview = () => setReviewIdx((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
  const nextReview = () => setReviewIdx((prev) => (prev + 1) % REVIEWS.length);

  const review = REVIEWS[reviewIdx];

  return (
    <section className="py-12 sm:py-16 bg-[#fbf9f5] dark:bg-obsidian-950 border-t border-stone-200/70 dark:border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* 1. Loved by Thousands Testimonial (lg:col-span-4) */}
          <div className="lg:col-span-4 p-6 rounded-3xl border border-stone-200 dark:border-white/10 bg-white dark:bg-stone-900/90 shadow-sm space-y-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white">
                Loved by Thousands
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-light">
                Real stories. Real people. Real love.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full overflow-hidden border border-gold-500/30 bg-stone-100 flex-shrink-0">
                <img
                  src={review.avatar}
                  alt={review.author}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1 mb-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-stone-700 dark:text-stone-300 font-light line-clamp-2 italic">
                  "{review.text}"
                </p>
                <span className="text-[10px] font-mono text-stone-400 mt-1 block">
                  — {review.author} | {review.city}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-1.5 pt-1">
              <button
                onClick={prevReview}
                aria-label="Previous review"
                className="p-1.5 rounded-full border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-400 hover:text-gold-600 dark:hover:text-gold-400 transition"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={nextReview}
                aria-label="Next review"
                className="p-1.5 rounded-full border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-400 hover:text-gold-600 dark:hover:text-gold-400 transition"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* 2. The Bridal Edit Featured Banner (lg:col-span-5) */}
          <div className="lg:col-span-5 relative rounded-3xl overflow-hidden border border-amber-900/10 dark:border-gold-500/20 bg-stone-900 text-white p-6 sm:p-7 shadow-lg flex items-center justify-between min-h-[160px]">
            <div className="relative z-10 max-w-[60%] space-y-2">
              <h3 className="font-serif text-xl font-bold tracking-tight text-gold-300">
                The Bridal Edit
              </h3>
              <p className="text-xs text-stone-300 font-light leading-snug">
                For the bride who deserves nothing ordinary.
              </p>
              <div className="pt-2">
                <Link
                  href="/bridal-sets"
                  className="inline-flex items-center space-x-2 rounded-full border border-gold-400/80 bg-gold-500 px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-wider text-obsidian-950 hover:brightness-110 transition shadow"
                >
                  <span>Explore Bridal</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            <div className="absolute right-0 inset-y-0 w-[45%]">
              <img
                src="/images/models/woman_3.png"
                alt="The Bridal Edit"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-900/40 to-transparent" />
            </div>
          </div>

          {/* 3. Guarantees & Payment Trust (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Truck className="h-4 w-4 text-gold-600 dark:text-gold-400 flex-shrink-0" />
                <div className="text-[10px] leading-tight">
                  <span className="font-bold block text-stone-800 dark:text-stone-200">Free Shipping</span>
                  <span className="text-stone-500">Above ₹999</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-4 w-4 text-gold-600 dark:text-gold-400 flex-shrink-0" />
                <div className="text-[10px] leading-tight">
                  <span className="font-bold block text-stone-800 dark:text-stone-200">Secure Payments</span>
                  <span className="text-stone-500">100% Safe</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <RotateCcw className="h-4 w-4 text-gold-600 dark:text-gold-400 flex-shrink-0" />
                <div className="text-[10px] leading-tight">
                  <span className="font-bold block text-stone-800 dark:text-stone-200">Easy Returns</span>
                  <span className="text-stone-500">Within 7 Days</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Headphones className="h-4 w-4 text-gold-600 dark:text-gold-400 flex-shrink-0" />
                <div className="text-[10px] leading-tight">
                  <span className="font-bold block text-stone-800 dark:text-stone-200">24/7 Support</span>
                  <span className="text-stone-500">We're here for you</span>
                </div>
              </div>
            </div>

            {/* Payment Method Badges */}
            <div className="pt-2 border-t border-stone-200 dark:border-white/10 flex items-center justify-between opacity-80 text-[10px] font-mono font-bold tracking-wider text-stone-600 dark:text-stone-400">
              <span className="px-2 py-1 rounded bg-stone-200/80 dark:bg-white/10">VISA</span>
              <span className="px-2 py-1 rounded bg-stone-200/80 dark:bg-white/10">Mastercard</span>
              <span className="px-2 py-1 rounded bg-stone-200/80 dark:bg-white/10">RuPay</span>
              <span className="px-2 py-1 rounded bg-stone-200/80 dark:bg-white/10">UPI</span>
              <span className="px-2 py-1 rounded bg-stone-200/80 dark:bg-white/10">PayPal</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
