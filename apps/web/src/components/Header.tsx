'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/context/CartContext';
import { useUserAuth } from '@/context/UserAuthContext';
import { apiRequest } from '@/lib/api';
import { ThemeToggle } from './ThemeToggle';
import {
  ShoppingBag,
  Globe2,
  Sparkles,
  Menu,
  X,
  ChevronDown,
  Crown,
  PhoneCall,
  Gem,
  Bot,
  LifeBuoy,
  ShieldCheck,
  Truck,
  ArrowRight,
  CircleDot,
  Award,
  User,
  Heart,
  Tag,
  LogOut,
  Package,
} from 'lucide-react';

const CATEGORIES = [
  {
    name: 'AAA+ CZ Solitaires & Rings',
    subtitle: 'Anti-tarnish 18K gold & rhodium plated designer rings',
    href: '/rings',
    icon: Gem,
    thumbnail: '/uploads/rings_03526cf9_1s6a0179.jpg',
  },
  {
    name: 'Royal Kundan & Polki Bridal Sets',
    subtitle: 'Handcrafted Meenakari Jadau chokers, necklaces & earrings',
    href: '/bridal-sets',
    icon: Crown,
    thumbnail: '/uploads/sets_00c2f42a_1s6a9390.jpg',
  },
  {
    name: 'Austrian Crystal Earrings',
    subtitle: 'Lightweight partywear chandeliers & jhumkas',
    href: '/earrings',
    icon: Sparkles,
    thumbnail: '/uploads/earrings_d696144e_1s6a9783.jpg',
  },
  {
    name: '22K Gold Plated Bangles & Kadas',
    subtitle: 'Premium openable kadas with ruby & emerald stone work',
    href: '/bangles',
    icon: Award,
    thumbnail: '/uploads/bangles_8897c8d9_1s6a0166.jpg',
  },
  {
    name: 'Pure 925 Silver Plated Jewellery',
    subtitle: 'Daily wear waterproof chains, pendants & bracelets',
    href: '/artisan-silver',
    icon: CircleDot,
    thumbnail: '/uploads/handmade_59b489a2_1s6a0201.jpg',
  },
];

export function Header() {
  const pathname = usePathname();
  const { currentCurrency, currencySymbol, rates, setCurrency } = useCurrency();
  const { itemCount, setIsCartOpen } = useCart();
  const { user, openAuthModal, logout, wishlistCount } = useUserAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [metalRates, setMetalRates] = useState<any[]>([]);
  const [pageControls, setPageControls] = useState<any[]>([]);

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const [metalsRes, pagesRes] = await Promise.all([
          apiRequest<any>('/metals/rates'),
          apiRequest<any>('/cms/page-controls'),
        ]);
        setMetalRates(Array.isArray(metalsRes) ? metalsRes : metalsRes?.data || []);
        const pcList = Array.isArray(pagesRes) ? pagesRes : pagesRes?.data || [];
        setPageControls(pcList);
      } catch {}
    };
    fetchHeaderData();
  }, []);

  const isRouteVisible = (routePath: string) => {
    const pc = pageControls.find((p) => p.pageRoute === routePath);
    if (!pc) return true;
    if (pc.hideFromNavigation) return false;
    if (pc.status === 'DISABLED') return false;
    return true;
  };

  const getRouteStatus = (routePath: string) => {
    const pc = pageControls.find((p) => p.pageRoute === routePath);
    return pc?.status || 'ACTIVE';
  };

  const customNavPages = pageControls.filter(
    (p) => p.pageType === 'CUSTOM_PAGE' && isRouteVisible(p.pageRoute)
  );

  const visibleCategories = CATEGORIES.filter((c) => isRouteVisible(c.href));

  const rate22K = metalRates.find((m) => m.purityCode === '22K_916');
  const rate18K = metalRates.find((m) => m.purityCode === '18K_750');

  const activeRateRecord = rates.find((r) => r.currencyCode === currentCurrency) || rates[0];
  const conv22K = rate22K
    ? Math.round(rate22K.spotPriceUsdPerGram * (activeRateRecord?.effectiveRate || 1) * 10) / 10
    : 108.3;
  const conv18K = rate18K
    ? Math.round(rate18K.spotPriceUsdPerGram * (activeRateRecord?.effectiveRate || 1) * 10) / 10
    : 81.9;

  return (
    <>
      {/* 1. Top Announcement Bar */}
      <div className="bg-[#121216] dark:bg-[#070709] text-gold-400 border-b border-gold-500/20 py-2 px-4 sm:px-8 lg:px-12 text-[11px] font-mono tracking-wider flex items-center justify-between z-50 relative">
        <div className="hidden lg:flex items-center space-x-3 text-slate-300 dark:text-slate-400">
          <span className="text-gold-400 font-bold flex items-center">
            <span className="h-2 w-2 rounded-full bg-emerald-400 mr-2" />
            LIVE GOLD RATE:
          </span>
          <span>
            22K: <strong className="text-white">{currencySymbol} {conv22K}/g</strong>
          </span>
          <span>•</span>
          <span>
            18K: <strong className="text-white">{currencySymbol} {conv18K}/g</strong>
          </span>
        </div>

        <div className="mx-auto flex items-center space-x-2 text-gold-300 text-center text-xs">
          <Sparkles className="h-3.5 w-3.5 text-gold-400 shrink-0" />
          <span className="truncate">Handcrafted Luxury Fashion & Demi-Fine Jewellery • Fast Insured Delivery Worldwide</span>
        </div>

        <div className="hidden md:flex items-center space-x-4 text-slate-300 text-xs">
          <Link href="/concierge" className="hover:text-gold-400 transition flex items-center space-x-1">
            <PhoneCall className="h-3 w-3 text-gold-500" />
            <span>Book Appointment</span>
          </Link>
          <Link href="/support" className="hover:text-gold-400 transition flex items-center space-x-1">
            <LifeBuoy className="h-3 w-3 text-gold-500" />
            <span>Help & Support</span>
          </Link>
        </div>
      </div>

      {/* 2. Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0A0A0E]/95 backdrop-blur-md border-b border-slate-200 dark:border-gold-500/20 shadow-sm transition-colors duration-200">
        <div className="w-full px-4 sm:px-8 lg:px-12 flex h-20 sm:h-24 items-center justify-between">
          {/* Mobile Menu Trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-2xl border border-slate-300 dark:border-gold-500/30 p-2 text-slate-700 dark:text-gold-400 hover:text-gold-600 transition"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Brand Identity */}
          <Link href="/" className="flex items-center space-x-3 sm:space-x-4 group shrink-0">
            <div className="relative h-11 w-11 sm:h-14 sm:w-14 overflow-hidden rounded-2xl border-2 border-gold-500/40 bg-white p-1.5 shadow-md group-hover:border-gold-500 transition-all duration-300 group-hover:scale-105">
              <img
                src="/images/logo.png"
                alt="The Bling Haven Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <span className="font-serif text-lg sm:text-2xl font-extrabold tracking-wider text-slate-900 dark:text-slate-100 uppercase block group-hover:text-gold-700 dark:group-hover:text-gold-400 transition">
                THE BLING HAVEN
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-gold-700 dark:text-gold-400 font-bold block uppercase">
                Luxury Fashion & Bridal Jewellery
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Clear, friendly Indian English terms) */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-mono tracking-wider uppercase font-bold text-slate-800 dark:text-slate-200">
            {/* 1. Jewellery Collections Mega Menu */}
            <div className="relative group py-2">
              <Link
                href="/catalog"
                className={`flex items-center space-x-1.5 hover:text-gold-600 dark:hover:text-gold-400 transition py-1.5 ${
                  pathname.startsWith('/catalog') ? 'text-gold-600 dark:text-gold-400 font-extrabold' : ''
                }`}
              >
                <span>Jewellery Collections</span>
                <ChevronDown className="h-3.5 w-3.5 text-gold-500 group-hover:rotate-180 transition-transform duration-200" />
              </Link>

              {/* Mega Menu Dropdown */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full hidden group-hover:block w-[780px] pt-3 z-[100] animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="rounded-3xl border-2 border-slate-200 dark:border-gold-500/40 bg-white dark:bg-[#0C0C10] p-6 shadow-2xl grid grid-cols-12 gap-6 text-slate-900 dark:text-slate-100">
                  <div className="col-span-7 space-y-2 border-r border-slate-200 dark:border-gold-500/20 pr-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-gold-500/20">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-gold-700 dark:text-gold-400 font-bold">
                        Browse by Category
                      </span>
                      <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400">All Collections</span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {visibleCategories.map((cat) => {
                        const IconComponent = cat.icon;
                        const catStatus = getRouteStatus(cat.href);
                        return (
                          <Link
                            key={cat.name}
                            href={cat.href}
                            className="group/item flex items-center space-x-3 rounded-2xl p-2.5 bg-slate-50 dark:bg-[#14141A] border border-slate-200 dark:border-gold-500/20 hover:border-gold-500 hover:bg-gold-500/10 transition"
                          >
                            <div className="rounded-xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-obsidian-950 p-2 text-gold-600 dark:text-gold-400 group-hover/item:bg-gold-500 group-hover/item:text-obsidian-950 transition shrink-0 shadow-sm">
                              <IconComponent className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <p className="font-serif font-bold text-slate-900 dark:text-slate-100 text-xs normal-case group-hover/item:text-gold-700 dark:group-hover/item:text-gold-400 transition truncate">
                                  {cat.name}
                                </p>
                                {catStatus === 'COMING_SOON' && (
                                  <span className="rounded bg-gold-500/20 px-1.5 py-0.5 text-[8px] font-mono text-gold-700 dark:text-gold-400 uppercase font-bold">
                                    Soon
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 normal-case line-clamp-1 font-normal">
                                {cat.subtitle}
                              </p>
                            </div>
                            <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover/item:text-gold-600 dark:group-hover/item:text-gold-400 group-hover/item:translate-x-1 transition shrink-0" />
                          </Link>
                        );
                      })}

                      {customNavPages.length > 0 && (
                        <div className="pt-2 border-t border-slate-200 dark:border-gold-500/20 mt-2 space-y-1">
                          <span className="text-[9px] font-mono uppercase tracking-widest text-gold-700 dark:text-gold-400 font-bold block px-1">
                            Special Collections
                          </span>
                          {customNavPages.map((cp) => (
                            <Link
                              key={cp.id}
                              href={cp.pageRoute}
                              className="group/item flex items-center justify-between rounded-xl px-3 py-1.5 bg-slate-100 dark:bg-[#101016] hover:bg-gold-500/15 border border-slate-200 dark:border-gold-500/15 transition text-xs font-serif text-slate-800 dark:text-slate-200 hover:text-gold-700 dark:hover:text-gold-400"
                            >
                              <span className="truncate">{cp.pageTitle}</span>
                              {cp.badgeText && (
                                <span className="text-[8px] font-mono bg-gold-500/20 text-gold-800 dark:text-gold-300 px-1.5 py-0.5 rounded font-bold uppercase">
                                  {cp.badgeText}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-span-5 flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-gold-500/40 bg-slate-50 dark:bg-[#14141A] p-4 relative overflow-hidden">
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200 dark:border-gold-500/30 mb-3 bg-black">
                      <img
                        src="/uploads/sets_00c2f42a_1s6a9390.jpg"
                        alt="Featured Jewellery"
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute top-2 left-2 rounded-full bg-gold-500 px-2.5 py-0.5 font-mono text-[8px] font-bold text-obsidian-950 uppercase tracking-wider shadow-md">
                        Best Seller
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-serif font-bold text-xs text-slate-900 dark:text-slate-100 normal-case">
                        Maharani Royal Kundan Bridal Set
                      </h4>
                      <p className="font-mono text-xs font-bold text-gold-700 dark:text-gold-400">
                        ₹ 14,999 / CAD $249
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 normal-case">
                        Handcrafted in 22K micro gold plating with hydro emerald beads.
                      </p>
                    </div>

                    <Link
                      href="/catalog"
                      className="mt-3 flex items-center justify-center space-x-2 rounded-xl bg-gold-500 hover:bg-gold-400 py-2.5 text-[10px] font-bold uppercase tracking-wider text-obsidian-950 transition shadow-md"
                    >
                      <span>View All Jewellery</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Custom 3D Jewellery */}
            {isRouteVisible('/bespoke') && (
              <Link
                href="/bespoke"
                className={`hover:text-gold-600 dark:hover:text-gold-400 transition flex items-center space-x-1.5 py-1.5 ${
                  pathname === '/bespoke' ? 'text-gold-600 dark:text-gold-400 font-extrabold' : ''
                }`}
              >
                <Gem className="h-3.5 w-3.5 text-gold-500" />
                <span>Custom Jewellery</span>
              </Link>
            )}

            {/* 3. AR Virtual Try-On */}
            {isRouteVisible('/try-on') && (
              <Link
                href="/try-on"
                className={`hover:text-gold-600 dark:hover:text-gold-400 transition flex items-center space-x-1.5 py-1.5 ${
                  pathname === '/try-on' ? 'text-gold-600 dark:text-gold-400 font-extrabold' : ''
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 text-gold-500" />
                <span>Virtual Try-On</span>
              </Link>
            )}

            {/* 4. VIP Club */}
            {isRouteVisible('/vip-lounge') && (
              <Link
                href="/vip-lounge"
                className={`hover:text-gold-600 dark:hover:text-gold-400 transition flex items-center space-x-1.5 py-1.5 ${
                  pathname === '/vip-lounge' ? 'text-gold-600 dark:text-gold-400 font-extrabold' : ''
                }`}
              >
                <Crown className="h-3.5 w-3.5 text-gold-500" />
                <span>VIP Club</span>
              </Link>
            )}

            {/* 5. Customer Services Dropdown */}
            <div className="relative group py-2">
              <span className="flex items-center space-x-1.5 cursor-pointer hover:text-gold-600 dark:hover:text-gold-400 transition py-1.5">
                <span>Customer Help</span>
                <ChevronDown className="h-3.5 w-3.5 text-gold-500 group-hover:rotate-180 transition-transform duration-200" />
              </span>

              <div className="absolute right-0 top-full hidden group-hover:block w-[440px] pt-3 z-[100] animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="rounded-3xl border-2 border-slate-200 dark:border-gold-500/40 bg-white dark:bg-[#0C0C10] p-5 shadow-2xl space-y-2 text-slate-900 dark:text-slate-100">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-gold-500/20">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gold-700 dark:text-gold-400 font-bold">
                      Customer Assistance
                    </span>
                    <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400">Available 24/7</span>
                  </div>

                  <Link
                    href="/concierge"
                    className="group/item flex items-center space-x-3 rounded-2xl p-2.5 bg-slate-50 dark:bg-[#14141A] border border-slate-200 dark:border-gold-500/20 hover:border-gold-500 hover:bg-gold-500/10 transition"
                  >
                    <div className="rounded-xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-obsidian-950 p-2 text-gold-600 dark:text-gold-400 group-hover/item:bg-gold-500 group-hover/item:text-obsidian-950 transition">
                      <PhoneCall className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-serif font-bold text-slate-900 dark:text-slate-100 text-xs normal-case group-hover/item:text-gold-700 dark:group-hover/item:text-gold-400 transition">
                        Book Showroom Appointment
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 normal-case font-normal">
                        Book a private viewing or bridal jewellery consultation
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/ai-concierge"
                    className="group/item flex items-center space-x-3 rounded-2xl p-2.5 bg-slate-50 dark:bg-[#14141A] border border-slate-200 dark:border-gold-500/20 hover:border-gold-500 hover:bg-gold-500/10 transition"
                  >
                    <div className="rounded-xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-obsidian-950 p-2 text-gold-600 dark:text-gold-400 group-hover/item:bg-gold-500 group-hover/item:text-obsidian-950 transition">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-serif font-bold text-slate-900 dark:text-slate-100 text-xs normal-case group-hover/item:text-gold-700 dark:group-hover/item:text-gold-400 transition">
                        AI Jewellery Assistant ("Aura")
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 normal-case font-normal">
                        Instant voice & text guidance for diamond cuts, sizing & care
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/track"
                    className="group/item flex items-center space-x-3 rounded-2xl p-2.5 bg-slate-50 dark:bg-[#14141A] border border-slate-200 dark:border-gold-500/20 hover:border-gold-500 hover:bg-gold-500/10 transition"
                  >
                    <div className="rounded-xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-obsidian-950 p-2 text-gold-600 dark:text-gold-400 group-hover/item:bg-gold-500 group-hover/item:text-obsidian-950 transition">
                      <Truck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-serif font-bold text-slate-900 dark:text-slate-100 text-xs normal-case group-hover/item:text-gold-700 dark:group-hover/item:text-gold-400 transition">
                        Track Your Order
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 normal-case font-normal">
                        Real-time courier and insured delivery tracking
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/verify"
                    className="group/item flex items-center space-x-3 rounded-2xl p-2.5 bg-slate-50 dark:bg-[#14141A] border border-slate-200 dark:border-gold-500/20 hover:border-gold-500 hover:bg-gold-500/10 transition"
                  >
                    <div className="rounded-xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-obsidian-950 p-2 text-gold-600 dark:text-gold-400 group-hover/item:bg-gold-500 group-hover/item:text-obsidian-950 transition">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-serif font-bold text-slate-900 dark:text-slate-100 text-xs normal-case group-hover/item:text-gold-700 dark:group-hover/item:text-gold-400 transition">
                        Verify Authenticity Certificate
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 normal-case font-normal">
                        Verify your jewellery certificate and hallmark details
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* 6. About Us */}
            <Link
              href="/about"
              className={`hover:text-gold-600 dark:hover:text-gold-400 transition py-1.5 ${
                pathname === '/about' ? 'text-gold-600 dark:text-gold-400 font-extrabold' : ''
              }`}
            >
              About Us
            </Link>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-2 sm:space-x-3 pl-2 lg:pl-6 shrink-0">
            <ThemeToggle />

            {/* Wishlist Button */}
            <Link
              href="/account"
              className="relative rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-[#121216] p-2.5 sm:p-3 text-slate-700 dark:text-slate-300 hover:border-gold-500 hover:text-rose-500 transition shadow-sm"
              title="My Wishlist"
            >
              <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-rose-500 text-white font-mono text-[9px] sm:text-[10px] font-bold shadow-md">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* User Profile / Login Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-2 rounded-2xl border border-gold-500/50 bg-slate-50 dark:bg-[#121216] p-1.5 pr-3 hover:border-gold-500 transition shadow-sm"
                >
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl overflow-hidden border border-gold-500/40 bg-gold-500/10">
                    <img src={user.avatarUrl} alt={user.fullName} className="h-full w-full object-cover" />
                  </div>
                  <span className="hidden md:inline font-mono text-xs font-bold text-slate-900 dark:text-slate-100 max-w-[100px] truncate">
                    {user.firstName}
                  </span>
                  <ChevronDown className="h-3 w-3 text-gold-500 hidden sm:block" />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-3xl border-2 border-slate-200 dark:border-gold-500/40 bg-white dark:bg-[#0C0C10] p-4 shadow-2xl z-[100] animate-in fade-in slide-in-from-top-1 text-slate-900 dark:text-slate-100 font-mono text-xs space-y-3">
                    <div className="border-b border-slate-100 dark:border-white/10 pb-3 space-y-0.5">
                      <p className="font-serif font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                        {user.fullName}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 rounded-full bg-gold-500/20 text-gold-700 dark:text-gold-400 text-[9px] font-bold px-2 py-0.5">
                        Member Account
                      </span>
                    </div>

                    <div className="space-y-1">
                      <Link
                        href="/account"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center space-x-2.5 p-2 rounded-xl hover:bg-gold-500/15 transition text-slate-800 dark:text-slate-200"
                      >
                        <User className="h-4 w-4 text-gold-600 dark:text-gold-400" />
                        <span>My Profile & Settings</span>
                      </Link>

                      <Link
                        href="/account"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center space-x-2.5 p-2 rounded-xl hover:bg-gold-500/15 transition text-slate-800 dark:text-slate-200"
                      >
                        <Package className="h-4 w-4 text-gold-600 dark:text-gold-400" />
                        <span>My Orders & Tracking</span>
                      </Link>

                      <Link
                        href="/account"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center space-x-2.5 p-2 rounded-xl hover:bg-gold-500/15 transition text-slate-800 dark:text-slate-200"
                      >
                        <Heart className="h-4 w-4 text-gold-600 dark:text-gold-400" />
                        <span>Wishlist ({wishlistCount})</span>
                      </Link>

                      <Link
                        href="/account"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center space-x-2.5 p-2 rounded-xl hover:bg-gold-500/15 transition text-slate-800 dark:text-slate-200"
                      >
                        <Tag className="h-4 w-4 text-gold-600 dark:text-gold-400" />
                        <span>Discount Coupons</span>
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 dark:border-white/10 pt-2">
                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          logout();
                        }}
                        className="flex w-full items-center space-x-2 p-2 rounded-xl text-rose-600 hover:bg-rose-500/10 transition"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('LOGIN')}
                className="flex items-center space-x-1.5 rounded-2xl border border-slate-300 dark:border-gold-500/40 bg-slate-50 dark:bg-[#121216] px-3.5 py-2 text-xs font-mono font-bold text-slate-800 dark:text-gold-400 hover:border-gold-500 hover:bg-gold-500/10 transition shadow-sm"
              >
                <User className="h-4 w-4 text-gold-600 dark:text-gold-400" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Currency Selector */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                className="flex items-center space-x-1.5 rounded-2xl border border-slate-300 dark:border-gold-500/50 bg-slate-50 dark:bg-[#121216] px-3 py-2 text-xs font-mono font-bold text-slate-800 dark:text-gold-400 hover:border-gold-500 hover:bg-gold-500/10 transition shadow-sm"
              >
                <Globe2 className="h-3.5 w-3.5 text-gold-600 dark:text-gold-400" />
                <span>{currentCurrency}</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              {isCurrencyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-3xl border-2 border-slate-200 dark:border-gold-500/50 bg-white dark:bg-[#0C0C10] p-3 shadow-2xl z-[100] animate-in fade-in slide-in-from-top-1">
                  <div className="text-[9px] uppercase font-mono font-bold text-gold-700 dark:text-gold-400 px-3 py-1 border-b border-slate-200 dark:border-gold-500/25 mb-1.5">
                    Select Currency
                  </div>
                  <div className="space-y-1">
                    {rates.map((r) => (
                      <button
                        key={r.currencyCode}
                        onClick={() => {
                          setCurrency(r.currencyCode);
                          setIsCurrencyDropdownOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition font-mono ${
                          currentCurrency === r.currencyCode
                            ? 'bg-gold-500 text-obsidian-950 font-bold shadow-sm'
                            : 'text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-[#14141A] hover:bg-gold-500/20 hover:text-gold-700 dark:hover:text-gold-400'
                        }`}
                      >
                        <span>{r.currencyCode}</span>
                        <span className="font-serif font-bold">
                          {r.symbol} {r.currencyName}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Bag Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative rounded-2xl border border-gold-500/50 bg-gradient-to-r from-gold-500/10 via-gold-500/20 to-gold-500/10 p-2.5 sm:p-3 text-gold-700 dark:text-gold-300 hover:bg-gold-500 hover:text-obsidian-950 transition shadow-md hover:scale-105"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-gold-500 text-obsidian-950 font-mono text-[9px] sm:text-[10px] font-bold shadow-lg">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Over Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-gold-500/30 bg-white dark:bg-[#0C0C10] px-6 py-6 space-y-6 animate-in slide-in-from-top duration-200 z-50 shadow-2xl font-mono text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#14141A] border border-slate-200 dark:border-gold-500/20 flex items-center justify-between">
              {user ? (
                <Link
                  href="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 flex-1 min-w-0"
                >
                  <img src={user.avatarUrl} alt={user.fullName} className="h-9 w-9 rounded-xl object-cover border border-gold-500/40" />
                  <div className="min-w-0 flex-1">
                    <p className="font-serif font-bold text-slate-900 dark:text-slate-100 truncate">{user.fullName}</p>
                    <span className="text-[10px] text-gold-700 dark:text-gold-400 font-bold block">View My Profile</span>
                  </div>
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openAuthModal('LOGIN');
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl bg-gold-500 text-obsidian-950 font-bold uppercase tracking-wider"
                >
                  <User className="h-4 w-4" />
                  <span>Sign In / Create Account</span>
                </button>
              )}
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gold-700 dark:text-gold-400 block font-bold">
                Jewellery Categories
              </span>
              <div className="grid grid-cols-1 gap-2">
                {visibleCategories.map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-50 dark:bg-[#14141A] text-slate-800 dark:text-slate-200 hover:text-gold-600 dark:hover:text-gold-400 font-serif text-sm border border-slate-200 dark:border-gold-500/20"
                  >
                    <div className="h-2 w-2 rounded-full bg-gold-500" />
                    <span>{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200 dark:border-gold-500/20">
              <Link
                href="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-50 dark:bg-[#14141A] text-xs font-mono uppercase font-bold text-slate-800 dark:text-slate-200"
              >
                <User className="h-4 w-4 text-gold-500" />
                <span>My Profile</span>
              </Link>
              <Link
                href="/bespoke"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-50 dark:bg-[#14141A] text-xs font-mono uppercase font-bold text-slate-800 dark:text-slate-200"
              >
                <Gem className="h-4 w-4 text-gold-500" />
                <span>Custom Designs</span>
              </Link>
              <Link
                href="/try-on"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-50 dark:bg-[#14141A] text-xs font-mono uppercase font-bold text-slate-800 dark:text-slate-200"
              >
                <Sparkles className="h-4 w-4 text-gold-500" />
                <span>Virtual Try-On</span>
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-50 dark:bg-[#14141A] text-xs font-mono uppercase font-bold text-slate-800 dark:text-slate-200"
              >
                <span>About Us</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
