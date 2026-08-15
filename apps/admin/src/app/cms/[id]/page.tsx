'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/AdminLayout';
import { MediaPickerModal } from '@/components/MediaPickerModal';
import { apiRequest } from '@/lib/api';
import { CmsPageDto, PageStatus } from '@theblinghaven/shared';
import {
  ArrowLeft,
  Save,
  Eye,
  Sparkles,
  Image as ImageIcon,
  CheckCircle2,
  Globe,
  Share2,
  FileText,
  Search,
} from 'lucide-react';

export default function CmsPageEditor() {
  const params = useParams();
  const router = useRouter();
  const pageId = params.id as string;

  const [page, setPage] = useState<CmsPageDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    content: '',
    seoTitle: '',
    seoDescription: '',
    status: 'PUBLISHED' as PageStatus,
  });

  const loadPage = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest<any>(`/admin/cms/pages/${pageId}`);
      const data = res.data || res;
      setPage(data);
      setForm({
        title: data.title,
        subtitle: data.subtitle || '',
        content: data.content,
        seoTitle: data.seoTitle || '',
        seoDescription: data.seoDescription || '',
        status: data.status,
      });
    } catch (e: any) {
      alert(e.message || 'Failed to load CMS page.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (pageId) loadPage();
  }, [pageId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await apiRequest(`/admin/cms/pages/${pageId}`, {
        method: 'PUT',
        data: form,
      });
      alert('Page saved successfully!');
      loadPage();
    } catch (e: any) {
      alert(e.message || 'Failed to update page.');
    } finally {
      setIsSaving(false);
    }
  };

  const insertImageMarkdown = (url: string, alt: string) => {
    const mdSnippet = `\n![${alt}](${url})\n`;
    setForm({ ...form, content: form.content + mdSnippet });
  };

  if (isLoading || !page) {
    return (
      <AdminLayout>
        <div className="flex h-96 items-center justify-center">
          <div className="flex flex-col items-center space-y-3 text-slate-400">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
            <p className="text-xs">Loading CMS page editor...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <form onSubmit={handleSave} className="space-y-6">
        {/* Navigation & Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-ivory-400 dark:border-obsidian-750 pb-6">
          <div className="flex items-center space-x-4">
            <Link
              href="/cms"
              className="rounded-lg border border-ivory-400 dark:border-obsidian-700 bg-white dark:bg-obsidian-850 p-2 text-slate-600 dark:text-slate-300 hover:bg-ivory-100 dark:hover:bg-obsidian-800 transition"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-1">
                <FileText className="h-4 w-4" />
                <span>Storytelling Page Editor</span>
              </div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
                {form.title || 'Untitled Page'}
              </h1>
              <p className="mt-0.5 text-xs text-slate-500 font-mono">
                Slug: /{page.slug} • Last Saved: {new Date(page.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as PageStatus })}
              className="rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-850 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 focus:border-gold-500 focus:outline-none"
            >
              <option value="PUBLISHED">PUBLISHED (Live)</option>
              <option value="DRAFT">DRAFT (Hidden)</option>
            </select>

            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center space-x-2 rounded-xl border border-gold-500/60 bg-gradient-to-r from-gold-600 to-gold-500 px-5 py-2 text-xs font-bold uppercase tracking-wider text-obsidian-950 shadow-md hover:from-gold-500 hover:to-gold-400 transition disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Page Title
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-3 text-sm font-serif font-bold text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Subtitle / Narrative Abstract
              </label>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-3 text-xs text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
              />
            </div>
          </div>

          {/* SEO Metadata & Google Preview */}
          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
              <Globe className="h-4 w-4 text-gold-500" />
              <span>International SEO & SERP Snippet</span>
            </h3>

            <div className="rounded-2xl border border-ivory-300 dark:border-obsidian-800 bg-ivory-50 dark:bg-obsidian-950 p-3 text-xs space-y-1">
              <p className="font-medium text-blue-600 dark:text-blue-400 truncate">
                {form.seoTitle || form.title} | The Bling Haven
              </p>
              <p className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                https://theblinghaven.shop/cms/{page.slug}
              </p>
              <p className="text-[11px] text-slate-500 line-clamp-2">
                {form.seoDescription || form.subtitle || 'Explore luxury fine jewelry and hallmarked creations at The Bling Haven.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <input
                type="text"
                placeholder="Custom SEO Title Tag"
                value={form.seoTitle}
                onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                className="rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2 text-xs text-slate-800 dark:text-slate-200"
              />
              <input
                type="text"
                placeholder="Meta Description..."
                value={form.seoDescription}
                onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                className="rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2 text-xs text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Content Editor & Live Preview */}
        <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-ivory-300 dark:border-obsidian-800 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Storytelling Content & Layout
            </h3>
            <button
              type="button"
              onClick={() => setIsMediaPickerOpen(true)}
              className="flex items-center space-x-1.5 rounded-xl border border-gold-500 bg-gold-500/10 px-3 py-1.5 text-xs font-bold text-gold-800 dark:text-gold-300 hover:bg-gold-500 hover:text-obsidian-950 transition"
            >
              <ImageIcon className="h-4 w-4" />
              <span>Insert Vault Photography</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Editor Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 font-mono">
                Markdown / Story Source:
              </label>
              <textarea
                rows={18}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full rounded-2xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-4 font-mono text-xs text-slate-800 dark:text-slate-200 focus:border-gold-500 focus:outline-none leading-relaxed"
              />
            </div>

            {/* Live Visual Luxury Preview */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 font-mono">
                Storefront Live Preview:
              </label>
              <div className="h-[420px] overflow-y-auto rounded-2xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50/50 dark:bg-obsidian-950/70 p-6 text-slate-800 dark:text-slate-200">
                <div className="border-b border-gold-500/20 pb-4 mb-4">
                  <h1 className="font-serif text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {form.title}
                  </h1>
                  {form.subtitle && (
                    <p className="mt-1 text-xs text-gold-700 dark:text-gold-400 italic">
                      {form.subtitle}
                    </p>
                  )}
                </div>
                <div className="prose dark:prose-invert max-w-none text-xs leading-relaxed space-y-3 whitespace-pre-wrap">
                  {form.content}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Media Picker Modal */}
        <MediaPickerModal
          isOpen={isMediaPickerOpen}
          onClose={() => setIsMediaPickerOpen(false)}
          onSelect={(asset) => {
            insertImageMarkdown(asset.url, asset.altText || asset.originalName);
          }}
        />
      </form>
    </AdminLayout>
  );
}
