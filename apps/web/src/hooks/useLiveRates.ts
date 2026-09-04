'use client';

import { useState, useEffect } from 'react';
import { MetalPriceRateDto } from '@theblinghaven/shared';
import { getLiveRates, fallbackRates } from '@/services/rates.service';

export function useLiveRates(pollIntervalMs = 60000) {
  const [rates, setRates] = useState<MetalPriceRateDto[]>(fallbackRates);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    let isMounted = true;

    const fetchRates = () => {
      getLiveRates().then((data) => {
        if (isMounted && data && data.length > 0) {
          setRates(data);
          setLastUpdated(new Date());
        }
      });
    };

    fetchRates();
    const interval = setInterval(fetchRates, pollIntervalMs);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [pollIntervalMs]);

  return { rates, lastUpdated };
}
