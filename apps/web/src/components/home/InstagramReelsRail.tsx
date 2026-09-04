'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Heart, MessageCircle, Play, Eye, ExternalLink } from 'lucide-react';
import { InstagramPostDto } from '@/services/cms.service';

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
          <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-widest text-pink-600 dark:text-pink-400">
            <Instagram className="h-4 w-4" />
            <span>@the_bling_haven Maison Social</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Follow the Sparkle on Instagram
          </h2>
        </div>

        <a
          href="https://instagram.com/the_bling_haven"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 rounded-full border border-pink-500/40 bg-pink-500/10 px-5 py-2.5 text-xs font-mono font-bold text-pink-600 dark:text-pink-400 hover:bg-pink-500 hover:text-white transition-all shadow-sm"
        >
          <span>Join 52K+ Patrons</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Grid of Reels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayPosts.slice(0, 4).map((post) => (
          <motion.a
            key={post.id}
            href={post.permalink || 'https://instagram.com/the_bling_haven'}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -6 }}
            className="group relative flex flex-col aspect-[4/5] rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 bg-black shadow-md hover:shadow-2xl transition-all"
          >
            <img
              src={post.mediaUrl}
              alt={post.caption || 'Instagram Reel'}
              className="h-full w-full object-cover object-center filter brightness-[0.85] transition-transform duration-700 group-hover:scale-108"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            {/* Reel Badge */}
            <div className="absolute top-3.5 right-3.5 flex items-center space-x-1 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono text-white">
              <Play className="h-3 w-3 fill-white text-white" />
              <span>REEL</span>
            </div>

            {/* Bottom Caption and Metrics */}
            <div className="relative z-10 mt-auto p-5 space-y-2.5 text-white">
              <p className="text-xs font-light line-clamp-2 text-slate-200">
                {post.caption}
              </p>

              <div className="flex items-center space-x-4 text-[11px] font-mono text-slate-300">
                <div className="flex items-center space-x-1">
                  <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" />
                  <span>{(post.likes || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-3.5 w-3.5 text-blue-400" />
                  <span>{post.comments || 0}</span>
                </div>
                {post.views ? (
                  <div className="flex items-center space-x-1">
                    <Eye className="h-3.5 w-3.5 text-gold-400" />
                    <span>{(post.views).toLocaleString()}</span>
                  </div>
                ) : null}
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
