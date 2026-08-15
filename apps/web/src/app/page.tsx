'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import { useCurrency } from '@/context/CurrencyContext';
import {
  ProductDto,
  HeroBannerDto,
  CollectionDto,
  MetalPriceRateDto,
} from '@theblinghaven/shared';
import { PageStatusGuard } from '@/components/PageStatusGuard';
import {
  Sparkles,
  Crown,
  Gem,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Bot,
  Camera,
  Lock,
  Instagram,
  Heart,
  MessageCircle,
  Play,
  Eye,
  ExternalLink,
} from 'lucide-react';

export default function HomePage() {
  const [banners, setBanners] = useState<HeroBannerDto[]>([]);
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<ProductDto[]>([]);
  const [collections, setCollections] = useState<CollectionDto[]>([]);
  const [metalRates, setMetalRates] = useState<MetalPriceRateDto[]>([]);
  const [instagramPosts, setInstagramPosts] = useState<any[]>([]);
  const [instagramConfig, setInstagramConfig] = useState<any>(null);
  const { currentCurrency, rates, setCurrency } = useCurrency();

  const [selectedMetalCurrency, setSelectedMetalCurrency] = useState(currentCurrency || 'CAD');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentCurrency) {
      setSelectedMetalCurrency(currentCurrency);
    }
  }, [currentCurrency]);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const [bannersRes, productsRes, collectionsRes, metalsRes, igRes, confRes] = await Promise.all([
          apiRequest<any>('/cms/banners'),
          apiRequest<any>('/catalog/products?limit=8'),
          apiRequest<any>('/catalog/collections'),
          apiRequest<any>('/metals/rates'),
          apiRequest<any>('/cms/instagram-feed'),
          apiRequest<any>('/admin/cms/instagram-config').catch(() => null),
        ]);

        if (!isMounted) return;
        const bannerList = Array.isArray(bannersRes) ? bannersRes : bannersRes?.data || [];
        setBanners(bannerList.filter((b: HeroBannerDto) => b.isActive));

        const prodList = Array.isArray(productsRes) ? productsRes : productsRes?.data || [];
        setFeaturedProducts(prodList);

        const colList = Array.isArray(collectionsRes) ? collectionsRes : collectionsRes?.data || [];
        setCollections(colList);

        const ratesList = Array.isArray(metalsRes) ? metalsRes : metalsRes?.data || [];
        setMetalRates(ratesList);

        const igList = Array.isArray(igRes) ? igRes : igRes?.data || [];
        setInstagramPosts(igList);

        if (confRes) {
          setInstagramConfig(confRes.data || confRes);
        }
      } catch (e) {
        console.error('Failed to load homepage data:', e);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBannerIdx((prev) => (prev + 1) % banners.length);
    }, 7500);
    return () => clearInterval(interval);
  }, [banners.length]);

  const activeBanner = banners[activeBannerIdx] || {
    title: 'The Bling Haven • Handcrafted Luxury Jewellery',
    subtitle: 'AAA+ CZ Solitaires, 22K Micro Gold Plated Bridal Sets, and Designer Fashion Jewellery with Fast Insured Shipping.',
    badgeText: 'Premium Jewellery Collection',
    imageUrl: '/uploads/rings_03526cf9_1s6a0179.jpg',
    ctaText: 'Explore Collections',
    ctaLink: '/catalog',
  };

  const activeRateRecord = rates.find((r) => r.currencyCode === selectedMetalCurrency) || rates[0];
  const activeEffRate = activeRateRecord?.effectiveRate || 1;
  const activeSymbol = activeRateRecord?.symbol || '$';

  const scrollInstagram = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <PageStatusGuard fallbackRoute="/">
      <div className="space-y-12 sm:space-y-16 lg:space-y-20 pb-16 sm:pb-20 overflow-x-hidden">
        {/* 1. Hero Section */}
        <section className="relative h-[68dvh] sm:h-[76dvh] lg:h-[82dvh] min-h-[440px] max-h-[820px] w-full overflow-hidden bg-[#09090C]">
          <div className="absolute inset-0">
            <img
              src={activeBanner.imageUrl}
              alt={activeBanner.title}
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          </div>

          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
            <div className="max-w-2xl space-y-4 sm:space-y-6">
              <div className="inline-flex items-center space-x-2 rounded-full border border-gold-500/50 bg-black/60 px-3.5 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-mono tracking-wider uppercase text-gold-300 shadow-lg font-bold">
                <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gold-400" />
                <span className="truncate">{activeBanner.badgeText || 'Premium Fashion & Bridal Jewellery'}</span>
              </div>

              <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                {activeBanner.title}
              </h1>

              {activeBanner.subtitle && (
                <p className="text-xs sm:text-sm md:text-base text-slate-200 font-light leading-relaxed max-w-xl line-clamp-3 sm:line-clamp-none">
                  {activeBanner.subtitle}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 pt-2 sm:pt-4">
                <Link
                  href={activeBanner.ctaLink || '/catalog'}
                  className="flex items-center space-x-2 rounded-2xl bg-gold-500 hover:bg-gold-400 px-6 sm:px-8 py-3 sm:py-3.5 text-xs font-bold uppercase tracking-wider text-obsidian-950 shadow-xl transition"
                >
                  <span>{activeBanner.ctaText || 'Shop Collections'}</span>
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Link>

                <Link
                  href="/try-on"
                  className="flex items-center space-x-1.5 rounded-2xl border border-gold-500/50 bg-black/50 px-4 sm:px-6 py-3 sm:py-3.5 text-xs font-bold uppercase tracking-wider text-gold-300 hover:bg-gold-500/20 transition"
                >
                  <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gold-400" />
                  <span>Virtual Try-On</span>
                </Link>

                <Link
                  href="/ai-concierge"
                  className="hidden sm:flex items-center space-x-1.5 rounded-2xl border border-white/30 bg-black/50 px-4 sm:px-6 py-3 sm:py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:border-gold-400 hover:text-gold-300 transition"
                >
                  <Bot className="h-4 w-4 text-gold-400" />
                  <span>AI Voice Assistant</span>
                </Link>
              </div>
            </div>
          </div>

          {banners.length > 1 && (
            <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 flex items-center space-x-2 sm:space-x-3 z-20">
              <button
                onClick={() =>
                  setActiveBannerIdx((prev) => (prev === 0 ? banners.length - 1 : prev - 1))
                }
                className="rounded-full border border-gold-500/40 bg-black/70 p-2 sm:p-2.5 text-gold-400 hover:bg-gold-500 hover:text-obsidian-950 transition"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
              <div className="flex space-x-1.5">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveBannerIdx(i)}
                    className={`h-1.5 sm:h-2 rounded-full transition-all ${
                      activeBannerIdx === i ? 'w-5 sm:w-6 bg-gold-500' : 'w-1.5 sm:w-2 bg-white/40'
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setActiveBannerIdx((prev) => (prev + 1) % banners.length)}
                className="rounded-full border border-gold-500/40 bg-black/70 p-2.5 text-gold-400 hover:bg-gold-500 hover:text-obsidian-950 transition"
                aria-label="Next Slide"
              >
                <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            </div>
          )}
        </section>

        {/* 2. Curated Collections Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 dark:border-gold-500/20 pb-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-gold-700 dark:text-gold-400 mb-1">
                <Crown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Featured Collections</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100">
                Explore Our Top Categories
              </h2>
            </div>
            <Link
              href="/catalog"
              className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-gold-700 dark:text-gold-400 hover:text-gold-600 transition"
            >
              <span>View All Collections</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {collections.map((col) => (
              <Link
                key={col.id}
                href={`/catalog?collection=${col.id}`}
                className="group card-luxury-hover relative h-80 sm:h-96 overflow-hidden rounded-3xl border border-slate-200 dark:border-gold-500/20 bg-slate-900 shadow-md hover:border-gold-500/60"
              >
                <img
                  src={col.heroBannerUrl || '/uploads/sets_00c2f42a_1s6a9390.jpg'}
                  alt={col.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 space-y-1.5 sm:space-y-2">
                  <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-gold-400 block font-bold">
                    The Bling Haven
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white group-hover:text-gold-400 transition">
                    {col.name}
                  </h3>
                  {col.description && (
                    <p className="text-xs text-slate-300 line-clamp-2">{col.description}</p>
                  )}
                  <div className="pt-1.5 flex items-center space-x-1 text-xs font-bold text-gold-400 group-hover:translate-x-1 transition-transform">
                    <span>View Jewellery</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. Featured Products Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 dark:border-gold-500/20 pb-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-gold-700 dark:text-gold-400 mb-1">
                <Gem className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Trending Pieces</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100">
                Featured Jewellery
              </h2>
            </div>
            <Link
              href="/catalog"
              className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-gold-700 dark:text-gold-400 hover:text-gold-600 transition"
            >
              <span>View Full Catalog</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* 4. AR Virtual Try-On Spotlight */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-[#0E0E14] p-6 sm:p-10 lg:p-12 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div className="space-y-4 sm:space-y-6">
                <div className="inline-flex items-center space-x-2 rounded-full bg-gold-500/15 px-3 sm:px-3.5 py-1 text-[11px] sm:text-xs font-mono font-bold text-gold-700 dark:text-gold-400 border border-gold-500/30">
                  <Camera className="h-3.5 w-3.5" />
                  <span>Virtual Fitting Studio</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                  Try On Jewellery Online with Virtual AR
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
                  See how rings, bridal necklaces, and bangles look on your hand and portrait directly in your browser with real-time size adjustments.
                </p>
                <div className="flex flex-wrap gap-3 pt-2 font-mono">
                  <Link
                    href="/try-on"
                    className="flex items-center space-x-2 rounded-2xl bg-gold-500 hover:bg-gold-400 px-6 sm:px-7 py-3 sm:py-3.5 text-xs font-bold uppercase tracking-wider text-obsidian-950 shadow-lg transition"
                  >
                    <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>Try On Now</span>
                  </Link>
                  <Link
                    href="/verify"
                    className="flex items-center space-x-2 rounded-2xl border border-slate-300 dark:border-gold-500/30 bg-slate-50 dark:bg-obsidian-900 px-5 sm:px-6 py-3 sm:py-3.5 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 hover:border-gold-500 transition"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gold-500" />
                    <span>Quality Guarantee</span>
                  </Link>
                </div>
              </div>

              <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-gold-500/30 shadow-md bg-slate-100 dark:bg-black">
                <img
                  src="/uploads/rings_03526cf9_1s6a0179.jpg"
                  alt="Virtual Fitting Demo"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                  <div className="flex items-center justify-between w-full text-[10px] sm:text-[11px] font-mono text-white">
                    <span className="flex items-center space-x-1.5 font-bold truncate">
                      <Gem className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gold-400 shrink-0" />
                      <span className="truncate">The Sovereign 5ct Solitaire Ring</span>
                    </span>
                    <span className="text-gold-400 uppercase font-bold shrink-0 ml-2">Live Virtual Fitting</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Instagram Showcase Carousel */}
        {instagramPosts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-gold-500/20 pb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  <Instagram className="h-4 w-4" />
                  <span>Instagram Highlights</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100">
                  Follow Us On Instagram
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Live unboxings, styling reels, and customer showcases.
                </p>
              </div>

              <div className="flex items-center space-x-3 font-mono">
                <a
                  href={`https://www.instagram.com/${instagramConfig?.username ? instagramConfig.username.replace('@', '') : 'the_bling_haven'}/`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-2 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 px-4 sm:px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg hover:opacity-90 transition"
                >
                  <Instagram className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>Follow Us</span>
                </a>

                <div className="hidden sm:flex items-center space-x-1.5">
                  <button
                    onClick={() => scrollInstagram('left')}
                    className="p-2 rounded-xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-obsidian-900 text-slate-700 dark:text-gold-400 hover:bg-gold-500 hover:text-obsidian-950 transition shadow-sm"
                    aria-label="Previous Post"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => scrollInstagram('right')}
                    className="p-2 rounded-xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-obsidian-900 text-slate-700 dark:text-gold-400 hover:bg-gold-500 hover:text-obsidian-950 transition shadow-sm"
                    aria-label="Next Post"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div
              ref={scrollContainerRef}
              className="flex space-x-4 sm:space-x-5 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth snap-x snap-mandatory"
            >
              {instagramPosts.map((post) => {
                const targetHandle = instagramConfig?.username ? instagramConfig.username.replace('@', '') : 'the_bling_haven';
                const postUrl = post.permalink || `https://www.instagram.com/${targetHandle}/`;
                return (
                  <div
                    key={post.id}
                    className="group relative flex-none w-64 sm:w-72 md:w-80 rounded-3xl overflow-hidden border border-slate-200 dark:border-gold-500/25 bg-white dark:bg-[#0E0E14] shadow-md hover:shadow-2xl dark:hover:border-rose-500/60 transition snap-start flex flex-col justify-between"
                  >
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-900">
                      <img
                        src={post.thumbnailUrl || post.mediaUrl}
                        alt={post.caption || 'Instagram Post'}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/uploads/sets_00c2f42a_1s6a9390.jpg';
                        }}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                      <div className="absolute top-3 left-3 z-10">
                        {post.mediaType === 'REEL' ? (
                          <span className="inline-flex items-center space-x-1 rounded-full bg-rose-600 px-2.5 py-0.5 text-[9px] font-mono font-bold text-white shadow-md">
                            <Play className="h-3 w-3 fill-current" />
                            <span>REEL</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 rounded-full bg-black/70 px-2.5 py-0.5 text-[9px] font-mono font-bold text-white shadow-md">
                            <Instagram className="h-3 w-3" />
                            <span>POST</span>
                          </span>
                        )}
                      </div>

                      {post.mediaType === 'REEL' && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="h-11 w-11 rounded-full bg-white/30 border border-white/40 flex items-center justify-center text-white transform group-hover:scale-110 transition-transform">
                            <Play className="h-4 w-4 fill-current ml-0.5" />
                          </div>
                        </div>
                      )}

                      <div className="absolute bottom-3 inset-x-3 z-10 flex items-center justify-between text-white text-xs font-mono">
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center space-x-1">
                            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
                            <span>{post.likesCount}</span>
                          </span>
                          {post.viewsCount > 0 && (
                            <span className="flex items-center space-x-1">
                              <Eye className="h-3.5 w-3.5 text-amber-400" />
                              <span>{post.viewsCount}</span>
                            </span>
                          )}
                          <span className="flex items-center space-x-1">
                            <MessageCircle className="h-3.5 w-3.5 text-blue-400" />
                            <span>{post.commentsCount}</span>
                          </span>
                        </div>

                        <a
                          href={postUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full bg-white/20 hover:bg-white/40 p-1.5 text-white transition"
                          title="View on Instagram"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {post.caption}
                      </p>

                      <div className="pt-2 border-t border-slate-100 dark:border-gold-500/15 flex items-center justify-between text-[11px] font-mono">
                        <a
                          href={postUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-rose-600 dark:text-rose-400 font-bold hover:underline inline-flex items-center space-x-1"
                        >
                          <span>View on Instagram</span>
                          <ArrowRight className="h-3 w-3" />
                        </a>

                        <span className="text-[10px] text-slate-400">@{targetHandle}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 6. Live Precious Metals Rates */}
        {metalRates.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
            <div className="rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-[#0E0E14] p-5 sm:p-8 shadow-xl space-y-5 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-gold-500/20 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                      Live Gold & Silver Benchmark Rates
                    </h3>
                    <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      Real-time bullion price per gram in your selected currency.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-obsidian-900 p-1.5 rounded-2xl border border-slate-200 dark:border-gold-500/20 overflow-x-auto max-w-full">
                  {rates.map((r) => {
                    const isSelected = selectedMetalCurrency === r.currencyCode;
                    return (
                      <button
                        key={r.currencyCode}
                        onClick={() => {
                          setSelectedMetalCurrency(r.currencyCode);
                          setCurrency(r.currencyCode);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 ${
                          isSelected
                            ? 'bg-gold-500 text-obsidian-950 shadow-md scale-105'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {r.currencyCode}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {metalRates.map((r) => {
                  const calculatedGramPrice = Math.round(r.spotPriceUsdPerGram * activeEffRate * 10) / 10;
                  return (
                    <div
                      key={r.id}
                      className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-gold-500/20 font-mono shadow-sm flex flex-col justify-between space-y-2 hover:border-gold-500/50 transition"
                    >
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider block truncate">
                          {r.metalType} • {r.purityCode}
                        </span>
                        <h4 className="font-serif text-xs font-bold text-slate-900 dark:text-slate-200 truncate">
                          {r.purityName}
                        </h4>
                      </div>
                      <div className="pt-2 border-t border-slate-200 dark:border-gold-500/15">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">Rate / Gram</span>
                        <strong className="text-gold-700 dark:text-gold-400 text-sm sm:text-base font-bold">
                          {activeSymbol} {calculatedGramPrice}
                        </strong>
                        <span className="text-[9px] text-slate-400 font-mono block">{selectedMetalCurrency}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </div>
    </PageStatusGuard>
  );
}
