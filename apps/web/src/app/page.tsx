'use client';

import React, { useEffect, useState } from 'react';
import { useCatalog } from '@/hooks/useCatalog';
import { getInstagramPosts, InstagramPostDto } from '@/services/cms.service';
import { PageStatusGuard } from '@/components/PageStatusGuard';

import { HeroCarousel } from '@/components/home/HeroCarousel';
import { ShopByCollection } from '@/components/home/ShopByCollection';
import { AIStylistBanner } from '@/components/home/AIStylistBanner';
import { MasterpieceGrid } from '@/components/home/MasterpieceGrid';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { TheBridalEditStrip } from '@/components/home/TheBridalEditStrip';
import { CuratedCollectionRail } from '@/components/home/CuratedCollectionRail';
import { InteractiveGalleryBanner } from '@/components/home/InteractiveGalleryBanner';
import { InstagramReelsRail } from '@/components/home/InstagramReelsRail';
import { FounderSpotlight } from '@/components/home/FounderSpotlight';

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
      <div className="w-full flex flex-col space-y-0 overflow-x-hidden bg-[#FAF7F2] dark:bg-black text-[#1A1817] dark:text-[#F3EDE2] transition-colors duration-300">
        {/* 1. Cinematic Editorial Hero Banner */}
        <HeroCarousel />

        {/* 2. Shop By Collection (5 rounded visual cards) */}
        <ShopByCollection />

        {/* 3. AI Stylist Interactive Banner */}
        <AIStylistBanner />

        {/* 4. 90 Masterpiece Creations Grid with Filters & Quick Bag */}
        <MasterpieceGrid products={products} />

        {/* 5. Why Choose The Bling Haven (6 Pillars) */}
        <WhyChooseUs />

        {/* 6. Testimonial + The Bridal Edit Card + Trust Guarantees & Payment Badges */}
        <TheBridalEditStrip />

        {/* 7. Curated Collection Slider & Heirlooms */}
        <CuratedCollectionRail products={products} />

        {/* 8. Kinetic Haute Joaillerie Vault Gallery Showcase */}
        <InteractiveGalleryBanner />

        {/* 9. Real Instagram Reels Showcase */}
        <InstagramReelsRail posts={instagramPosts} />

        {/* 10. Meet Founder Neha Singh & Brand Curation */}
        <FounderSpotlight />
      </div>
    </PageStatusGuard>
  );
}

