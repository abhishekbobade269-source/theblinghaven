'use client';

import React, { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
import { MediaAssetDto, MediaCategory } from '@theblinghaven/shared';
import {
  Image as ImageIcon,
  Search,
  Check,
  X,
  UploadCloud,
  Sparkles,
  Layers,
} from 'lucide-react';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (asset: MediaAssetDto) => void;
  selectedUrl?: string;
  initialCategory?: MediaCategory | 'ALL';
}

const CATEGORIES: { key: string; label: string }[] = [
  { key: 'ALL', label: 'All Media' },
  { key: 'RINGS', label: 'Rings' },
  { key: 'BRIDAL', label: 'Bridal' },
  { key: 'SETS', label: 'Sets' },
  { key: 'EARRINGS', label: 'Earrings' },
  { key: 'BANGLES', label: 'Bangles' },
  { key: 'HANDMADE', label: 'Handmade' },
  { key: 'BANNERS', label: 'Banners' },
];

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  selectedUrl,
  initialCategory = 'ALL',
}: MediaPickerModalProps) {
  const [assets, setAssets] = useState<MediaAssetDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState<string>(initialCategory);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadAssets();
    }
  }, [isOpen, category]);

  const loadAssets = async () => {
    setIsLoading(true);
    try {
      const q = new URLSearchParams();
      if (category && category !== 'ALL') q.set('category', category);
      if (search) q.set('search', search);
      q.set('limit', '60');

      const res = await apiRequest<any>(`/admin/media?${q.toString()}`);
      setAssets(Array.isArray(res) ? res : res?.data || []);
    } catch (e) {
      console.error('Failed to load media assets:', e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="flex h-[85vh] w-full max-w-5xl flex-col rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-ivory-300 dark:border-obsidian-800 px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-500/10 text-gold-600 dark:text-gold-400">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 font-serif">
                Select Jewelry Media Asset
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose high-resolution photography from the vault
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-ivory-200 dark:hover:bg-obsidian-800 hover:text-slate-700 dark:hover:text-slate-200 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-ivory-300 dark:border-obsidian-800 bg-ivory-50/50 dark:bg-obsidian-950/40 px-6 py-3">
          <div className="flex flex-wrap gap-1.5 overflow-x-auto max-w-full">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  category === cat.key
                    ? 'bg-gold-500 text-obsidian-950 shadow-sm'
                    : 'bg-white dark:bg-obsidian-850 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border border-ivory-300 dark:border-obsidian-750'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadAssets()}
              className="w-full rounded-lg border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-850 py-1.5 pl-8 pr-3 text-xs text-slate-800 dark:text-slate-200 focus:border-gold-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center space-x-2 text-xs text-slate-400">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
              <span>Loading photography assets...</span>
            </div>
          ) : assets.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-slate-400 space-y-2">
              <ImageIcon className="h-8 w-8 text-slate-500/50" />
              <p className="text-xs">No media assets found matching the criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {assets.map((asset) => {
                const isSelected = selectedUrl === asset.url;
                return (
                  <div
                    key={asset.id}
                    onClick={() => {
                      onSelect(asset);
                      onClose();
                    }}
                    className={`group relative aspect-square cursor-pointer overflow-hidden rounded-xl border transition-all ${
                      isSelected
                        ? 'border-gold-500 ring-2 ring-gold-500 shadow-lg'
                        : 'border-ivory-300 dark:border-obsidian-800 bg-ivory-100 dark:bg-obsidian-950 hover:border-gold-500/60'
                    }`}
                  >
                    <img
                      src={asset.thumbnailUrl || asset.url}
                      alt={asset.altText || asset.originalName}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 text-white">
                      <p className="text-[10px] font-bold truncate">{asset.originalName}</p>
                      <span className="text-[9px] text-gold-300 uppercase tracking-wider">
                        {asset.category}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gold-500 text-obsidian-950 shadow-md">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
