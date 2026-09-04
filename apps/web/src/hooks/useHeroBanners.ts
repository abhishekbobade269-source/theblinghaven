'use client';

import { useState, useEffect, useCallback } from 'react';
import { HeroBannerDto } from '@theblinghaven/shared';
import { getHeroBanners } from '@/services/cms.service';

export function useHeroBanners(autoAdvanceIntervalMs = 6000) {
  const [banners, setBanners] = useState<HeroBannerDto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getHeroBanners().then((list) => {
      if (isMounted) {
        setBanners(list);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const nextSlide = useCallback(() => {
    if (banners.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    if (banners.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    if (isPaused || banners.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, autoAdvanceIntervalMs);
    return () => clearInterval(timer);
  }, [isPaused, banners.length, autoAdvanceIntervalMs, nextSlide]);

  return {
    banners,
    currentBanner: banners[currentIndex] || null,
    currentIndex,
    nextSlide,
    prevSlide,
    goToSlide,
    setIsPaused,
    isLoading,
  };
}
