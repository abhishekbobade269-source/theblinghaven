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

interface PageStatusGuardProps {
  children: React.ReactNode;
  fallbackRoute?: string;
}

export function PageStatusGuard({ children, fallbackRoute }: PageStatusGuardProps) {
  const pathname = usePathname();
  const rawRoute = fallbackRoute || pathname || '/';
  const currentRoute = rawRoute.endsWith('/') && rawRoute.length > 1 ? rawRoute.slice(0, -1) : rawRoute;

  const [pageData, setPageData] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkStatus = async () => {
      try {
        // 1. Fetch current route control
        const routeRes = await apiRequest<any>(
          `/cms/page-controls/route?path=${encodeURIComponent(currentRoute)}`
        );
        const currentData = routeRes?.data || routeRes;

        // 2. If current route is not root '/', also check if root '/' is locked in maintenance
        if (currentRoute !== '/') {
          const homeRes = await apiRequest<any>(`/cms/page-controls/route?path=%2F`);
          const homeData = homeRes?.data || homeRes;
          if (homeData && homeData.status && homeData.status !== 'ACTIVE') {
            if (isMounted) {
              setPageData({
                ...homeData,
                isGlobalHomeLock: true,
              });
              setIsChecking(false);
              return;
            }
          }
        }

        if (isMounted) {
          setPageData(currentData || { status: 'ACTIVE' });
          setIsChecking(false);
        }
      } catch (e) {
        if (isMounted) {
          setPageData({ status: 'ACTIVE' });
          setIsChecking(false);
        }
      }
    };

    checkStatus();

    return () => {
      isMounted = false;
    };
  }, [currentRoute]);

  // While checking status, do a fast non-blocking render or spinner if route might be locked
  if (isChecking) {
    return <>{children}</>;
  }

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
