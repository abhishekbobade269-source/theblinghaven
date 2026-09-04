'use client';

import React, { useEffect, useState } from 'react';
import { useCatalog } from '@/hooks/useCatalog';
import { getInstagramPosts, InstagramPostDto } from '@/services/cms.service';
import { PageStatusGuard } from '@/components/PageStatusGuard';

import { HeroCarousel } from '@/components/home/HeroCarousel';
import { CategoryBento } from '@/components/home/CategoryBento';
import { CuratedCollectionRail } from '@/components/home/CuratedCollectionRail';
import { VirtualTryOnBanner } from '@/components/home/VirtualTryOnBanner';
import { InteractiveGalleryBanner } from '@/components/home/InteractiveGalleryBanner';
import { InstagramReelsRail } from '@/components/home/InstagramReelsRail';
import { MaisonHeritage } from '@/components/home/MaisonHeritage';

export default function HomePage() {
  const { products } = useCatalog();
  const [instagramPosts, setInstagramPosts] = useState<InstagramPostDto[]>([]);

  useEffect(() => {
    let isMounted = true;
    getInstagramPosts().then((data) => {
      if (isMounted) setInstagramPosts(data);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <PageStatusGuard fallbackRoute="/">
      <div className="w-full flex flex-col space-y-0 overflow-x-hidden">
        {/* 1. Cinematic Luxury Hero Carousel */}
        <HeroCarousel />

        {/* 2. Asymmetric Jewellery Category Bento */}
        <CategoryBento />

        {/* 3. Featured Heirlooms & Solitaires with Tabs */}
        <CuratedCollectionRail products={products} />

        {/* 4. 3D Kinetic Figurines & Haute Joaillerie Gallery Banner */}
        <InteractiveGalleryBanner />

        {/* 5. 3D AR Virtual Try-On Studio Banner */}
        <VirtualTryOnBanner />

        {/* 6. Real Instagram Reels Showcase */}
        <InstagramReelsRail posts={instagramPosts} />

        {/* 7. Maison Heritage & Hallmark Purity Guarantee */}
        <MaisonHeritage />
      </div>
    </PageStatusGuard>
  );
}
