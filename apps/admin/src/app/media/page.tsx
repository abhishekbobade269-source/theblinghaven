'use client';

import React, { useEffect, useState, useRef } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { apiRequest } from '@/lib/api';
import { MediaAssetDto, MediaCategory } from '@theblinghaven/shared';
import {
  Image as ImageIcon,
  Search,
  Upload,
  RefreshCw,
  Trash2,
  Copy,
  Check,
  Eye,
  Filter,
  Layers,
  Sparkles,
  ExternalLink,
  Info,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const CATEGORIES: { key: string; label: string }[] = [
  { key: 'ALL', label: 'All Photography (240)' },
  { key: 'SETS', label: 'Necklace Sets (72)' },
  { key: 'EARRINGS', label: 'Earrings (31)' },
  { key: 'HANDMADE', label: 'Handmade Silver (17)' },
  { key: 'BANGLES', label: 'Bangles (16)' },
  { key: 'RINGS', label: 'Rings (14)' },
  { key: 'BANNERS', label: 'Banners & Branding (2)' },
  { key: 'BRIDAL', label: 'Bridal (1)' },
  { key: 'GENERAL', label: 'General Jewelry' },
];

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState<MediaAssetDto[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 24, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedAsset, setSelectedAsset] = useState<MediaAssetDto | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async (targetPage = page) => {
    setIsLoading(true);
    try {
      const q = new URLSearchParams();
      if (category !== 'ALL') q.set('category', category);
      if (search) q.set('search', search);
      q.set('page', targetPage.toString());
      q.set('limit', '24');

      const res = await apiRequest<any>(`/admin/media?${q.toString()}`);
      if (res && res.data) {
        setAssets(res.data);
        if (res.meta) setMeta(res.meta);
      } else if (Array.isArray(res)) {
        setAssets(res);
      }
    } catch (e) {
      console.error('Failed to load media:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchMedia(1);
  }, [category]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchMedia(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category === 'ALL' ? 'GENERAL' : category);

        const token = localStorage.getItem('access_token');
        await fetch('http://localhost:4000/admin/media/upload', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      }
      alert('Upload completed successfully.');
      fetchMedia(1);
    } catch (e: any) {
      alert(e.message || 'Failed to upload media.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this media asset?')) return;
    try {
      await apiRequest(`/admin/media/${id}`, { method: 'DELETE' });
      setSelectedAsset(null);
      fetchMedia(page);
    } catch (e: any) {
      alert(e.message || 'Failed to delete asset.');
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-ivory-400 dark:border-obsidian-750 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-1">
              <Sparkles className="h-4 w-4" />
              <span>Optimized High-Speed Vault CDN</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-slate-100">
              Media & Photography Vault
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Instant thumbnail preview pipeline with database indexing and zero-lag pagination ({meta.total} assets indexed).
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center space-x-2 rounded-xl border border-gold-500/60 bg-gradient-to-r from-gold-600 to-gold-500 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-obsidian-950 shadow-lg shadow-gold-500/20 hover:from-gold-500 hover:to-gold-400 transition disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />
              <span>{isUploading ? 'Uploading...' : 'Upload Photos'}</span>
            </button>
            <button
              onClick={() => fetchMedia(page)}
              className="rounded-lg border border-ivory-400 dark:border-obsidian-700 bg-white dark:bg-obsidian-850 p-2.5 text-slate-600 dark:text-slate-300 hover:bg-ivory-100 dark:hover:bg-obsidian-800"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Category Filter Pills & Search */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                  category === cat.key
                    ? 'bg-gold-500 text-obsidian-950 shadow-md ring-1 ring-gold-400'
                    : 'bg-white dark:bg-obsidian-900 text-slate-700 dark:text-slate-300 hover:bg-ivory-100 dark:hover:bg-obsidian-800 border border-ivory-300 dark:border-obsidian-750'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search photography by filename or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchMedia(1)}
              className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 py-2 pl-9 pr-4 text-xs text-slate-800 dark:text-slate-200 focus:border-gold-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Gallery Grid (Instant Thumbnail Render) */}
        <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm">
          {isLoading ? (
            <div className="flex h-96 items-center justify-center space-x-2 text-xs text-slate-400">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
              <span>Loading optimized photography...</span>
            </div>
          ) : assets.length === 0 ? (
            <div className="flex h-96 flex-col items-center justify-center text-slate-400 space-y-3">
              <ImageIcon className="h-12 w-12 text-slate-500/40" />
              <p className="text-sm font-serif">No media assets found in this collection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset)}
                  className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl border border-ivory-300 dark:border-obsidian-800 bg-ivory-100 dark:bg-obsidian-950 transition-all hover:scale-[1.02] hover:border-gold-500 hover:shadow-xl"
                >
                  <img
                    src={asset.thumbnailUrl || asset.url}
                    alt={asset.altText || asset.originalName}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/90 via-obsidian-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 text-white">
                    <p className="text-xs font-bold truncate">{asset.originalName}</p>
                    <div className="flex items-center justify-between mt-1 text-[10px] text-gold-300">
                      <span className="uppercase tracking-wider">{asset.category}</span>
                      <span>{(asset.sizeBytes / 1024).toFixed(0)} KB</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {meta.totalPages > 1 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-ivory-300 dark:border-obsidian-800 pt-6">
              <p className="text-xs text-slate-500 font-mono">
                Showing {((meta.page - 1) * meta.limit) + 1}–{Math.min(meta.page * meta.limit, meta.total)} of {meta.total} assets
              </p>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handlePageChange(meta.page - 1)}
                  disabled={meta.page <= 1}
                  className="flex items-center space-x-1 rounded-xl border border-ivory-300 dark:border-obsidian-750 bg-white dark:bg-obsidian-850 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-ivory-100 dark:hover:bg-obsidian-800 disabled:opacity-40 transition"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === meta.totalPages || Math.abs(p - meta.page) <= 2)
                  .map((p, idx, arr) => (
                    <React.Fragment key={p}>
                      {idx > 0 && arr[idx - 1] !== p - 1 && (
                        <span className="px-2 text-xs text-slate-400">...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(p)}
                        className={`h-8 w-8 rounded-xl text-xs font-bold transition ${
                          meta.page === p
                            ? 'bg-gold-500 text-obsidian-950 shadow-md'
                            : 'bg-white dark:bg-obsidian-850 text-slate-700 dark:text-slate-300 hover:bg-ivory-100 dark:hover:bg-obsidian-800 border border-ivory-300 dark:border-obsidian-750'
                        }`}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  ))}

                <button
                  onClick={() => handlePageChange(meta.page + 1)}
                  disabled={meta.page >= meta.totalPages}
                  className="flex items-center space-x-1 rounded-xl border border-ivory-300 dark:border-obsidian-750 bg-white dark:bg-obsidian-850 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-ivory-100 dark:hover:bg-obsidian-800 disabled:opacity-40 transition"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Selected Asset Full-Resolution Detail Drawer */}
        {selectedAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
            <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col md:flex-row overflow-hidden rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 shadow-2xl">
              {/* Image Preview Container */}
              <div className="flex flex-1 items-center justify-center bg-ivory-100 dark:bg-obsidian-950 p-6">
                <img
                  src={selectedAsset.url}
                  alt={selectedAsset.altText || selectedAsset.originalName}
                  className="max-h-[60vh] max-w-full rounded-xl object-contain shadow-md"
                />
              </div>

              {/* Asset Metadata Sidebar */}
              <div className="flex w-full md:w-80 flex-col justify-between border-t md:border-t-0 md:border-l border-ivory-300 dark:border-obsidian-800 p-6 space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-gold-500/15 px-3 py-1 text-[11px] font-bold uppercase text-gold-800 dark:text-gold-300">
                      {selectedAsset.category}
                    </span>
                    <button
                      onClick={() => setSelectedAsset(null)}
                      className="rounded-full p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                      {selectedAsset.originalName}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5 truncate">
                      {selectedAsset.filename}
                    </p>
                  </div>

                  <div className="space-y-2 rounded-xl bg-ivory-50 dark:bg-obsidian-850 p-3 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Dimensions:</span>
                      <span className="font-mono font-bold">
                        {selectedAsset.width || '1200'} x {selectedAsset.height || '1200'} px
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">File Size:</span>
                      <span className="font-mono font-bold">
                        {(selectedAsset.sizeBytes / 1024).toFixed(1)} KB
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">MIME Type:</span>
                      <span className="font-mono font-bold">{selectedAsset.mimeType}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Public Static URL
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        readOnly
                        value={selectedAsset.url}
                        className="w-full rounded-lg border border-ivory-300 dark:border-obsidian-800 bg-ivory-100 dark:bg-obsidian-950 p-2 text-xs font-mono text-slate-700 dark:text-slate-300"
                      />
                      <button
                        onClick={() => copyToClipboard(selectedAsset.url)}
                        className="rounded-lg border border-ivory-300 dark:border-obsidian-750 bg-white dark:bg-obsidian-850 p-2 text-slate-700 dark:text-slate-300 hover:bg-gold-500 hover:text-obsidian-950 transition"
                        title="Copy URL"
                      >
                        {copiedUrl ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-ivory-300 dark:border-obsidian-800 flex items-center justify-between">
                  <button
                    onClick={() => handleDelete(selectedAsset.id)}
                    className="flex items-center space-x-1.5 text-xs font-bold text-red-500 hover:text-red-600 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Asset</span>
                  </button>

                  <a
                    href={selectedAsset.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1 text-xs font-bold text-gold-700 dark:text-gold-400 hover:underline"
                  >
                    <span>Open Full Res</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
