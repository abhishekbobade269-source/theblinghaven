'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import {
  Sparkles,
  Crown,
  Clock,
  Wrench,
  Lock,
  ArrowRight,
  PhoneCall,
  Home,
  ShieldAlert,
  RefreshCw,
} from 'lucide-react';
import cmsManifest from '@/data/cms-manifest.json';

interface PageStatusGuardProps {
  children: React.ReactNode;
  fallbackRoute?: string;
}

// Global memory cache for instant 0ms route resolution across client navigations
let globalCache: Record<string, any> = {};
let globalFetchPromise: Promise<any> = null as any;

const getInitialCache = () => {
  const cache: Record<string, any> = {};

  // 1. Base default from static manifest
  if (cmsManifest?.pageControls) {
    (cmsManifest.pageControls as any[]).forEach((p) => {
      if (p.pageRoute) cache[p.pageRoute] = p;
    });
  }

  // 2. Client-side stored live cache
  if (typeof window !== 'undefined') {
    try {
      const savedCache = localStorage.getItem('tbh_page_controls_cache');
      if (savedCache) {
        const parsed = JSON.parse(savedCache);
        Object.assign(cache, parsed);
      }
    } catch {}

    try {
      const overrides = localStorage.getItem('tbh_page_controls_override');
      if (overrides) {
        const parsed = JSON.parse(overrides);
        Object.assign(cache, parsed);
      }
    } catch {}
  }

  return cache;
};

// Initialize cache synchronously
globalCache = getInitialCache();

export function PageStatusGuard({ children, fallbackRoute }: PageStatusGuardProps) {
  const pathname = usePathname();
  const rawRoute = fallbackRoute || pathname || '/';
  const currentRoute = rawRoute.endsWith('/') && rawRoute.length > 1 ? rawRoute.slice(0, -1) : rawRoute;

  // Synchronous resolution on frame 0
  const getResolvedStatus = (route: string) => {
    if (globalCache[route]) return globalCache[route];
    if (typeof window !== 'undefined') {
      try {
        const overrides = JSON.parse(localStorage.getItem('tbh_page_controls_override') || '{}');
        if (overrides[route]) return overrides[route];
      } catch {}
    }
    return { pageRoute: route, status: 'ACTIVE' };
  };

  const initialRouteData = getResolvedStatus(currentRoute);
  const initialHomeData = getResolvedStatus('/');

  const [pageData, setPageData] = useState<any>(() => {
    if (currentRoute !== '/' && initialHomeData?.status && initialHomeData.status !== 'ACTIVE') {
      return { ...initialHomeData, isGlobalHomeLock: true };
    }
    return initialRouteData;
  });

  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const syncRoute = () => {
      const home = getResolvedStatus('/');
      if (currentRoute !== '/' && home?.status && home.status !== 'ACTIVE') {
        if (isMounted) setPageData({ ...home, isGlobalHomeLock: true });
        return;
      }

      const current = getResolvedStatus(currentRoute);
      if (isMounted) setPageData(current);
    };

    // Instant local sync
    syncRoute();

    // Fetch and update global cache from API in background
    const fetchLatest = async () => {
      try {
        if (!globalFetchPromise) {
          globalFetchPromise = apiRequest<any>('/cms/page-controls')
            .then((res) => (Array.isArray(res) ? res : res?.data || []))
            .catch(() => []);
        }

        const allPages = await globalFetchPromise;
        globalFetchPromise = null as any;

        if (Array.isArray(allPages) && allPages.length > 0) {
          allPages.forEach((p: any) => {
            if (p.pageRoute) globalCache[p.pageRoute] = p;
          });

          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem('tbh_page_controls_cache', JSON.stringify(globalCache));
            } catch {}
          }

          if (isMounted) {
            syncRoute();
          }
        }
      } catch {}
    };

    fetchLatest();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tbh_page_controls_override' || e.key === 'tbh_page_controls_cache') {
        globalCache = getInitialCache();
        syncRoute();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [currentRoute]);

  // If status is ACTIVE, render the page normally
  if (!pageData || pageData.status === 'ACTIVE') {
    return <>{children}</>;
  }

  // Render luxury status screens for COMING_SOON, UNDER_MAINTENANCE, ON_HOLD, DISABLED
  const status = pageData.status;
  const headline = pageData.customHeadline || (
    status === 'COMING_SOON' ? 'Exclusive Collection Launching Soon' :
    status === 'UNDER_MAINTENANCE' ? 'Atelier Upgrades in Progress' :
    status === 'ON_HOLD' ? 'Private Salon Viewing Access Only' :
    'Page Currently Unavailable'
  );

  const subtext = pageData.customSubtext || (
    status === 'COMING_SOON' ? 'Our master jewelers in Toronto are currently finalizing new handcrafted heirlooms. Join our priority guest list for early acquisition access.' :
    status === 'UNDER_MAINTENANCE' ? 'Our digital salon is undergoing scheduled maintenance to enhance your luxury shopping experience. We will be back online shortly.' :
    status === 'ON_HOLD' ? 'This showcase is currently reserved for private VIP salon appointments at 100 Bloor St W, Toronto.' :
    'This page has been temporarily deactivated by Maison administration.'
  );

  const getStatusIcon = () => {
    switch (status) {
      case 'COMING_SOON':
        return <Sparkles className="h-12 w-12 text-gold-400 animate-pulse mx-auto" />;
      case 'UNDER_MAINTENANCE':
        return <Wrench className="h-12 w-12 text-orange-400 animate-spin mx-auto" />;
      case 'ON_HOLD':
        return <Lock className="h-12 w-12 text-purple-400 mx-auto" />;
      default:
        return <ShieldAlert className="h-12 w-12 text-red-400 mx-auto" />;
    }
  };

  const getBadgeStyle = () => {
    switch (status) {
      case 'COMING_SOON':
        return 'bg-gold-500/20 text-gold-400 border-gold-500/40';
      case 'UNDER_MAINTENANCE':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'ON_HOLD':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
      default:
        return 'bg-red-500/20 text-red-400 border-red-500/40';
    }
  };

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center px-4 py-16">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border-2 border-gold-500/40 bg-[#0C0C10] p-8 sm:p-14 shadow-[0_30px_90px_rgba(0,0,0,1)] text-center space-y-6 animate-in fade-in duration-500">
        {/* Brand Emblem */}
        <div className="mx-auto relative h-20 w-20 overflow-hidden rounded-2xl border-2 border-gold-400/80 bg-white p-1.5 shadow-xl shadow-gold-500/20">
          <img
            src="/images/logo.png"
            alt="The Bling Haven Logo"
            className="h-full w-full object-contain"
          />
        </div>

        {/* Status Indicator Pill */}
        <div className="flex justify-center">
          <span className={`inline-flex items-center rounded-full px-4 py-1 border text-xs font-mono uppercase tracking-widest font-bold ${getBadgeStyle()}`}>
            {status.replace('_', ' ')}
          </span>
        </div>

        {/* Icon & Headline */}
        <div className="space-y-3">
          {getStatusIcon()}
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-100 leading-tight">
            {headline}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed max-w-lg mx-auto">
            {subtext}
          </p>
        </div>

        {/* Estimated Return Date (if set) */}
        {pageData.estimatedReturnAt && (
          <div className="inline-flex items-center space-x-2 rounded-2xl border border-gold-500/30 bg-[#16161E] px-4 py-2 text-xs font-mono text-gold-400">
            <Clock className="h-4 w-4" />
            <span>Estimated Return: {pageData.estimatedReturnAt}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="flex items-center space-x-2 rounded-2xl bg-gold-500 hover:bg-gold-400 px-6 py-3 text-xs font-bold uppercase tracking-wider text-obsidian-950 transition shadow-xl"
          >
            <Home className="h-4 w-4" />
            <span>Flagship Home</span>
          </Link>

          <Link
            href="/concierge"
            className="flex items-center space-x-2 rounded-2xl border border-gold-500/40 bg-[#14141C] hover:border-gold-400 hover:text-gold-400 px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-200 transition"
          >
            <PhoneCall className="h-4 w-4 text-gold-400" />
            <span>Contact Salon Advisor</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
