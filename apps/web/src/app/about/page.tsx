'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Sparkles, 
  Gem, 
  ShieldCheck, 
  ArrowRight, 
  Instagram, 
  Heart, 
  MessageCircle, 
  Play, 
  Eye, 
  ExternalLink,
  Award,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { AnimatedBrandLogo } from '@/components/ui/AnimatedBrandLogo';
import { DiamondGlint } from '@/components/ui/DiamondGlint';
import { getInstagramPosts, InstagramPostDto } from '@/services/cms.service';

export default function AboutHeritagePage() {
  const [instagramPosts, setInstagramPosts] = useState<InstagramPostDto[]>([]);

  useEffect(() => {
    let isMounted = true;
    getInstagramPosts().then((posts) => {
      if (isMounted) setInstagramPosts(posts);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const displayPosts = instagramPosts.length > 0 ? instagramPosts : [
    {
      id: 'ig-1',
      mediaType: 'REEL',
      mediaUrl: '/uploads/sets_00c2f42a_1s6a9390.jpg',
      caption: 'Unveiling the Imperial Royal Kundan Parure ✨ Handcrafted over 180 hours in our atelier.',
      likes: 1840,
      comments: 68,
      views: 24500,
      permalink: 'https://www.instagram.com/the_bling_haven?stkn=dG54bGY1ZGgyMzJr',
    },
    {
      id: 'ig-2',
      mediaType: 'REEL',
      mediaUrl: '/uploads/rings_15ca97c8_1s6a0175.jpg',
      caption: 'Solitaire perfection: 3.5 Carat Emerald Cut in 18K Yellow Gold with hidden halo 💍',
      likes: 2190,
      comments: 112,
      views: 34100,
      permalink: 'https://www.instagram.com/the_bling_haven?stkn=dG54bGY1ZGgyMzJr',
    },
    {
      id: 'ig-3',
      mediaType: 'IMAGE',
      mediaUrl: '/uploads/earrings_01462b03_1s6a0431.jpg',
      caption: 'Heritage Chandbali Jhumkas adorned with freshwater pearls & ruby accents ✨',
      likes: 1290,
      comments: 42,
      views: 12900,
      permalink: 'https://www.instagram.com/the_bling_haven?stkn=dG54bGY1ZGgyMzJr',
    },
    {
      id: 'ig-4',
      mediaType: 'REEL',
      mediaUrl: '/uploads/bangles_0deb44c0_1s6a9953.jpg',
      caption: 'Stackable American Diamond bangles crafted for modern everyday elegance.',
      likes: 2150,
      comments: 93,
      views: 31200,
      permalink: 'https://www.instagram.com/the_bling_haven?stkn=dG54bGY1ZGgyMzJr',
    },
  ];

  return (
    <div className="relative min-h-screen bg-obsidian-950 text-slate-100 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-25">
        <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] rounded-full bg-gold-500/20 blur-[130px]" />
        <div className="absolute top-[10%] right-[15%] w-[450px] h-[450px] rounded-full bg-rose-500/15 blur-[140px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-24 sm:space-y-32">
        {/* 1. HERO WITH ANIMATED LOGO */}
        <section className="text-center max-w-4xl mx-auto space-y-6">
          <div className="flex justify-center pb-4">
            <AnimatedBrandLogo size="hero" enableGlint={true} useVideo={true} />
          </div>

          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gold-500/40 bg-gold-500/10 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-gold-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-300">
              The Heritage of The Bling Haven
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
            Curated Elegance, <br />
            <span className="bg-gradient-to-r from-gold-300 via-amber-200 to-gold-500 bg-clip-text text-transparent">
              Timeless Radiance.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
            Founded by <strong className="text-gold-300 font-semibold">Neha Singh</strong>, The Bling Haven was created to bridge the grandeur of royal Indian heirloom jewelry with modern, wearable luxury.
          </p>
        </section>

        {/* 2. MEET THE FOUNDER: NEHA SINGH */}
        <section className="relative rounded-3xl border border-gold-500/25 bg-gradient-to-b from-obsidian-900/90 via-obsidian-900/60 to-obsidian-950/90 p-8 sm:p-12 lg:p-16 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left: Neha's Portrait with Luxury Aura */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                {/* Golden Halo border */}
                <div className="absolute -inset-2 rounded-[32px] bg-gradient-to-tr from-gold-500/50 via-pink-400/30 to-amber-300/60 opacity-80 blur-lg" />

                <div className="relative rounded-[28px] overflow-hidden border border-gold-400/40 bg-black shadow-2xl aspect-[4/5]">
                  <img
                    src="/images/about/neha_singh.jpg"
                    alt="Neha Singh - Founder & Creative Director"
                    className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.03] transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  
                  {/* Founder badge chip */}
                  <div className="absolute bottom-6 inset-x-6">
                    <div className="p-4 rounded-2xl border border-white/15 bg-black/70 backdrop-blur-md space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif text-xl font-bold text-white">Neha Singh</h3>
                        <span className="p-1 rounded-full bg-gold-500/20 text-gold-400">
                          <Crown className="h-4 w-4" />
                        </span>
                      </div>
                      <p className="text-xs font-mono uppercase tracking-wider text-gold-400">
                        Founder & Creative Director
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mini Gallery Strip: Features 360p Earring Sparkle Reel Wisely in Compact Card */}
              <div className="mt-4 grid grid-cols-2 gap-3 max-w-md mx-auto">
                <div className="relative rounded-2xl overflow-hidden border border-gold-500/30 aspect-video group bg-black shadow-md">
                  <video
                    src="/videos/woman_wearing_diamond_earrings.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover filter brightness-[0.98] group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors pointer-events-none" />
                  <span className="absolute bottom-2 left-2 text-[10px] font-mono text-white/95 bg-black/75 px-2 py-0.5 rounded backdrop-blur-sm flex items-center space-x-1 border border-white/10">
                    <Play className="h-2.5 w-2.5 fill-gold-400 text-gold-400" />
                    <span>Sparkle Reel</span>
                  </span>
                </div>
                <div className="relative rounded-2xl overflow-hidden border border-gold-500/20 aspect-video group">
                  <img
                    src="/images/about/neha_singh_atelier.jpg"
                    alt="Neha Singh - Brand Curation"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors" />
                  <span className="absolute bottom-2 left-2 text-[10px] font-mono text-white/90 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                    Atelier Shoot
                  </span>
                </div>
              </div>
            </div>

            {/* Right: The Founder's Vision */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 text-gold-400 font-mono text-xs font-bold uppercase tracking-widest">
                <Crown className="h-4 w-4" />
                <span>Maison Story & Vision</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                "Jewelry should evoke the empress in every woman."
              </h2>

              <blockquote className="border-l-2 border-gold-400 pl-4 py-1 text-base sm:text-lg italic text-slate-200 font-light leading-relaxed">
                “When I started The Bling Haven, my dream was simple yet uncompromising: to create regal, statement pieces that make women feel confident and opulent—without the stress of fragile care or unreasonable markups.”
              </blockquote>

              <div className="space-y-4 text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                <p>
                  Every collection is personally curated by Neha Singh. Drawing inspiration from Indian royal jewelry, Mughal Jadau masterpieces, and European high-fashion runways, Neha works closely with master karigars to handcraft each piece with microscopic detail.
                </p>
                <p>
                  From 22K micro-gold anti-tarnish plating to hypoallergenic finishes and precision-cut American diamonds, The Bling Haven stands as a testament to modern luxury crafted with heart and heritage.
                </p>
              </div>

              {/* Value Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center space-x-3 p-3.5 rounded-2xl border border-white/10 bg-white/5">
                  <CheckCircle2 className="h-5 w-5 text-gold-400 flex-shrink-0" />
                  <span className="text-xs font-medium text-slate-200">Ethically Sourced Precious Stones</span>
                </div>
                <div className="flex items-center space-x-3 p-3.5 rounded-2xl border border-white/10 bg-white/5">
                  <CheckCircle2 className="h-5 w-5 text-gold-400 flex-shrink-0" />
                  <span className="text-xs font-medium text-slate-200">22K Micro-Gold Anti-Tarnish Finish</span>
                </div>
                <div className="flex items-center space-x-3 p-3.5 rounded-2xl border border-white/10 bg-white/5">
                  <CheckCircle2 className="h-5 w-5 text-gold-400 flex-shrink-0" />
                  <span className="text-xs font-medium text-slate-200">100% Skin-Safe & Hypoallergenic</span>
                </div>
                <div className="flex items-center space-x-3 p-3.5 rounded-2xl border border-white/10 bg-white/5">
                  <CheckCircle2 className="h-5 w-5 text-gold-400 flex-shrink-0" />
                  <span className="text-xs font-medium text-slate-200">Personalized Bridal Consultation</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <a
                  href="https://www.instagram.com/the_bling_haven?stkn=dG54bGY1ZGgyMzJr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 rounded-2xl border border-gold-500/60 bg-gradient-to-r from-gold-600 to-gold-500 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-obsidian-950 shadow-lg hover:brightness-110 transition-all"
                >
                  <Instagram className="h-4 w-4" />
                  <span>Connect With Neha on Instagram</span>
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>

                <Link
                  href="/catalog"
                  className="inline-flex items-center space-x-2 rounded-2xl border border-white/20 bg-white/5 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all"
                >
                  <span>Explore The Collection</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 2.5 HAUTE JOAILLERIE CAMPAIGN FILM — NEHA SINGH ATELIER */}
        <section className="relative rounded-3xl border border-gold-500/30 bg-gradient-to-b from-obsidian-900/95 via-stone-950/90 to-obsidian-950 p-6 sm:p-10 lg:p-12 shadow-2xl overflow-hidden backdrop-blur-xl space-y-8">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gold-500/10 blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full border border-gold-400/40 bg-gold-500/15 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-gold-300" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-gold-200">
                  Haute Joaillerie Campaign Film
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                The Art of Inspection: Royal Kundan in Motion
              </h2>
              <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                Watch the master campaign take featuring Neha Singh hand-evaluating our signature royal gold necklace parure under warm atelier key lights.
              </p>
            </div>

            <div className="flex items-center space-x-3 text-xs font-mono text-gold-400">
              <span className="px-3.5 py-1.5 rounded-full border border-gold-500/30 bg-black/40 backdrop-blur-sm">
                Cinematic Campaign
              </span>
              <span className="px-3.5 py-1.5 rounded-full border border-gold-500/30 bg-black/40 backdrop-blur-sm">
                Neha Singh Atelier
              </span>
            </div>
          </div>

          {/* Cinematic Cinema Frame */}
          <div className="relative rounded-[28px] overflow-hidden border border-gold-500/40 bg-black shadow-[0_0_50px_rgba(212,175,55,0.18)] aspect-[16/9] max-w-5xl mx-auto group">
            <video
              src="/videos/woman_inspects_gold_necklace.mp4"
              autoPlay
              loop
              muted
              playsInline
              controls
              className="w-full h-full object-cover object-center"
            />
            {/* Ambient gold border edge */}
            <div className="absolute inset-0 pointer-events-none border border-gold-500/20 rounded-[28px]" />
          </div>

          {/* Three Campaign Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 max-w-5xl mx-auto">
            <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm space-y-1">
              <div className="font-serif text-base font-bold text-gold-300">22K Artisanal Plating</div>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Lustrous multi-coat micro-gold plating crafted to resist oxidation and maintain warm regal brilliance.
              </p>
            </div>
            <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm space-y-1">
              <div className="font-serif text-base font-bold text-gold-300">Hand-Inspected Prongs</div>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Every uncut polki stone and bezel setting is tested by hand for stone retention and seamless neckline drape.
              </p>
            </div>
            <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm space-y-1">
              <div className="font-serif text-base font-bold text-gold-300">Heirloom Weight & Feel</div>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Engineered with authentic bridal weight without compromising on ergonomic, day-to-night comfort.
              </p>
            </div>
          </div>
        </section>

        {/* 3. THREE CRAFT PILLARS */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-400">
              The Artisan Benchmark
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Why Connoisseurs Choose The Bling Haven
            </h2>
            <p className="text-sm text-slate-400 font-light">
              Craftsmanship standards inspired by century-old royal jewelry traditions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-3xl border border-gold-500/20 bg-obsidian-900/80 p-8 space-y-4 hover:border-gold-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:scale-110 transition-transform">
                <Crown className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white">Generational Karigari</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
                Each bridal set, necklace, and kada bangle is sculpted by seasoned artisans with decades of specialized bench experience in Jaipur, Surat, and Mumbai.
              </p>
            </div>

            <div className="rounded-3xl border border-gold-500/20 bg-obsidian-900/80 p-8 space-y-4 hover:border-gold-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white">22K Micro-Gold Metallurgy</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
                Our multi-layer micro-gold bonding process creates deep, lustrous yellow and rose gold tones that resist moisture, sweat, and environmental oxidation.
              </p>
            </div>

            <div className="rounded-3xl border border-gold-500/20 bg-obsidian-900/80 p-8 space-y-4 hover:border-gold-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:scale-110 transition-transform">
                <Gem className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white">Bespoke Bridal Concierge</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
                Direct consultation with our styling team for custom trousseau matching, lehenga palette harmony, and personalized bridal party gifting.
              </p>
            </div>
          </div>
        </section>

        {/* 4. LIVE INSTAGRAM FEED SECTION */}
        <section className="space-y-10 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-8">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-widest text-gold-400">
                <Instagram className="h-4 w-4" />
                <span>Live Feed • @the_bling_haven</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                Follow The Journey on Instagram
              </h2>
              <p className="text-sm text-slate-400 font-light">
                1,400+ Jewelry lovers following our latest creations, unboxings, and bridal sparkle tests.
              </p>
            </div>

            <a
              href="https://www.instagram.com/the_bling_haven?stkn=dG54bGY1ZGgyMzJr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 rounded-full border border-gold-500/50 bg-gold-500/10 hover:bg-gold-500 hover:text-obsidian-950 px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider text-gold-300 transition-all shadow-md self-start sm:self-auto"
            >
              <Instagram className="h-4 w-4" />
              <span>Follow @the_bling_haven</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Instagram Posts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayPosts.map((post) => (
              <motion.a
                key={post.id}
                href={post.permalink || 'https://www.instagram.com/the_bling_haven?stkn=dG54bGY1ZGgyMzJr'}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="group relative block aspect-[9/14] rounded-3xl overflow-hidden border border-white/10 bg-black shadow-lg hover:shadow-2xl"
              >
                <img
                  src={post.mediaUrl}
                  alt={post.caption || 'The Bling Haven on Instagram'}
                  className="h-full w-full object-cover object-center filter brightness-95 transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
                <DiamondGlint />

                {/* Play Indicator */}
                <div className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 border border-white/20 text-white backdrop-blur-md group-hover:scale-110 transition-transform">
                  <Play className="h-3.5 w-3.5 fill-current" />
                </div>

                {/* Views Counter */}
                {post.views && post.views > 0 && (
                  <div className="absolute top-4 left-4 z-10 flex items-center space-x-1 rounded-full bg-black/60 border border-white/20 px-2.5 py-1 text-[10px] font-mono text-white/90 backdrop-blur-md">
                    <Eye className="h-3 w-3 text-gold-400" />
                    <span>{post.views.toLocaleString()}</span>
                  </div>
                )}

                {/* Caption & Stats */}
                <div className="absolute bottom-0 inset-x-0 p-5 space-y-3 z-10">
                  <p className="text-xs text-white/90 font-light line-clamp-2 leading-relaxed">
                    {post.caption}
                  </p>

                  <div className="flex items-center space-x-4 text-[11px] font-mono text-gold-300">
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3.5 w-3.5 fill-gold-500/20 text-gold-400" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-3.5 w-3.5 text-gold-400" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </section>

        {/* 5. BRAND EMBLEM & FOOTER BANNER */}
        <section className="relative rounded-3xl border border-gold-500/30 bg-gradient-to-r from-obsidian-900 via-obsidian-950 to-obsidian-900 p-12 text-center overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <AnimatedBrandLogo size="lg" enableGlint={true} />
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Step Into The Bling Haven
            </h2>
            <p className="text-sm text-slate-300 font-light leading-relaxed">
              Explore our royal sets, solitaires, and statement jewels crafted to shine for a lifetime.
            </p>
            <div className="pt-2">
              <Link
                href="/catalog"
                className="inline-flex items-center space-x-2 rounded-2xl border border-gold-500/60 bg-gradient-to-r from-gold-600 to-gold-500 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-obsidian-950 shadow-lg hover:brightness-110 transition-all"
              >
                <span>Browse All Collections</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
