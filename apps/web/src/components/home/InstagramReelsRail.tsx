'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Heart, MessageCircle, Play, Eye, ExternalLink } from 'lucide-react';
import { InstagramPostDto } from '@/services/cms.service';
import { DiamondGlint } from '@/components/ui/DiamondGlint';
import { SpotlightCard, ShinyText, Magnet, CountUp } from '@/components/react-bits';

interface InstagramReelsRailProps {
  posts: InstagramPostDto[];
}

export function InstagramReelsRail({ posts }: InstagramReelsRailProps) {
  const displayPosts = posts && posts.length > 0 ? posts : [
    {
      id: 'ig-1',
      mediaType: 'REEL',
      mediaUrl: '/uploads/sets_00c2f42a_1s6a9390.jpg',
      caption: 'Sparkle in royal polki choker parures. Handcrafted in Toronto atelier.',
      likes: 1420,
      comments: 84,
      views: 18400,
      permalink: 'https://instagram.com/the_bling_haven',
    },
    {
      id: 'ig-2',
      mediaType: 'REEL',
      mediaUrl: '/uploads/rings_15ca97c8_1s6a0175.jpg',
      caption: '3.2ct Emerald Cut Solitaire sparkle test in direct sunlight.',
      likes: 2190,
      comments: 112,
      views: 34100,
      permalink: 'https://instagram.com/the_bling_haven',
    },
    {
      id: 'ig-3',
      mediaType: 'REEL',
      mediaUrl: '/uploads/earrings_01462b03_1s6a0431.jpg',
      caption: 'Waterfall chandelier drops with natural freshwater pearls.',
      likes: 980,
      comments: 42,
      views: 12900,
      permalink: 'https://instagram.com/the_bling_haven',
    },
    {
      id: 'ig-4',
      mediaType: 'REEL',
      mediaUrl: '/uploads/bangles_0deb44c0_1s6a9953.jpg',
      caption: 'Heritage elephant-head kada bangles in 22K micro gold plating.',
      likes: 1750,
      comments: 93,
      views: 22600,
      permalink: 'https://instagram.com/the_bling_haven',
    },
  ];

  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-12 gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400">
            <Instagram className="h-4 w-4" />
            <ShinyText text="@the_bling_haven" color="#ca8a04" shineColor="#fef08a" speed={2.5} />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            As Seen on Real Clients
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-light">
            Watch real sparkle tests, unboxing moments, and styling reels in natural ambient daylight.
          </p>
        </div>

        <Magnet padding={40} magnetStrength={3}>
          <a
            href="https://instagram.com/the_bling_haven"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 rounded-full border border-gold-500/40 bg-white dark:bg-obsidian-900 px-6 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-gold-700 dark:text-gold-300 hover:bg-gold-500 hover:text-obsidian-950 transition-all shadow-sm"
          >
            <span>Follow on Instagram</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </Magnet>
      </div>

      {/* Reels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayPosts.map((post) => (
          <motion.a
            key={post.id}
            href={post.permalink || 'https://instagram.com/the_bling_haven'}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -6, scale: 1.015 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="group relative block aspect-[9/14] rounded-3xl overflow-hidden border border-slate-200/80 dark:border-white/10 bg-black shadow-md hover:shadow-2xl"
          >
            <img
              src={post.mediaUrl}
              alt={post.caption || 'Instagram Reel'}
              className="h-full w-full object-cover object-center filter brightness-[0.9] transition-transform duration-700 ease-out group-hover:scale-108"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
            <DiamondGlint />

            {/* Play Reel Indicator */}
            <div className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 border border-white/20 text-white backdrop-blur-md group-hover:scale-110 transition-transform">
              <Play className="h-3.5 w-3.5 fill-current" />
            </div>

            {/* View Count Badge */}
            {post.views && (
              <div className="absolute top-4 left-4 z-10 flex items-center space-x-1 rounded-full bg-black/60 border border-white/20 px-2.5 py-1 text-[10px] font-mono text-white/90 backdrop-blur-md">
                <Eye className="h-3 w-3 text-gold-400" />
                <span>
                  <CountUp to={post.views} duration={1.5} />
                </span>
              </div>
            )}

            {/* Caption & Social Counters */}
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
  );
}
