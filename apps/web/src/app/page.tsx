'use client';

import React, { useEffect, useState } from 'react';
import { useCatalog } from '@/hooks/useCatalog';
import { getInstagramPosts, InstagramPostDto } from '@/services/cms.service';
import { PageStatusGuard } from '@/components/PageStatusGuard';

import { HeroCarousel } from '@/components/home/HeroCarousel';
import { CategoryVideoHero } from '@/components/home/CategoryVideoHero';
import { CuratedCollectionRail } from '@/components/home/CuratedCollectionRail';
import { InteractiveGalleryBanner } from '@/components/home/InteractiveGalleryBanner';
import { AtelierCaseStudies } from '@/components/home/AtelierCaseStudies';
import { InstagramReelsRail } from '@/components/home/InstagramReelsRail';
import { FounderSpotlight } from '@/components/home/FounderSpotlight';
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

        {/* 2. Featured Heirlooms & Solitaires with Interactive Tabs */}
        <CuratedCollectionRail products={products} />

        {/* 3. 3-Column Split Category Portal (In The Middle) */}
        <CategoryVideoHero />

        {/* 4. Featured Customer Favorites with 12x8 Pixel-Dissolve & Magnetic Physics */}
        <AtelierCaseStudies />

        {/* 5. Kinetic Haute Joaillerie Vault Gallery Showcase */}
        <InteractiveGalleryBanner />

        {/* 6. Real Instagram Reels Showcase */}
        <InstagramReelsRail posts={instagramPosts} />

        {/* 7. Meet Founder Neha Singh & Brand Curation */}
        <FounderSpotlight />

        {/* 8. Maison Heritage & Hallmark Purity Guarantee */}
        <MaisonHeritage />
      </div>
    </PageStatusGuard>
  );
}
