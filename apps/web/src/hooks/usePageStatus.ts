'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { PageControlDto, getPageControl, getCachedPageControlSync } from '@/services/cms.service';

export function usePageStatus(fallbackRoute?: string) {
  const pathname = usePathname();
  const rawRoute = fallbackRoute || pathname || '/';
  const currentRoute = rawRoute.endsWith('/') && rawRoute.length > 1 ? rawRoute.slice(0, -1) : rawRoute;

  // Synchronous resolution on frame 0 using in-memory cache
  const [pageData, setPageData] = useState<PageControlDto>(() => {
    return (
      getCachedPageControlSync(currentRoute) || {
        id: `pc_${currentRoute.replace(/[^a-z0-9]/gi, '_')}`,
        pageRoute: currentRoute,
        pageTitle: 'The Bling Haven Canada',
        pageType: 'CORE_SYSTEM',
        status: 'ACTIVE',
        hideFromNavigation: false,
        productIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Check root home lock
    const checkHomeAndRoute = async () => {
      try {
        if (currentRoute !== '/') {
          const home = await getPageControl('/');
          if (home && home.status !== 'ACTIVE') {
            if (isMounted) setPageData({ ...home, isGlobalHomeLock: true } as any);
            return;
          }
        }

        const current = await getPageControl(currentRoute);
        if (isMounted && current) {
          setPageData(current);
        }
      } catch {}
    };

    checkHomeAndRoute();

    return () => {
      isMounted = false;
    };
  }, [currentRoute]);

  const isBlocked = pageData.status !== 'ACTIVE';

  return {
    pageData,
    isBlocked,
    status: pageData.status,
    currentRoute,
    isLoading,
  };
}
