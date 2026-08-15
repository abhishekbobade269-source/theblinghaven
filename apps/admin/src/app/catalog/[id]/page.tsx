'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/AdminLayout';
import { MediaPickerModal } from '@/components/MediaPickerModal';
import { apiRequest } from '@/lib/api';
import {
  ProductDto,
  CategoryDto,
  CollectionDto,
  JewelrySpecsDto,
  ProductStatus,
} from '@theblinghaven/shared';
import {
  ArrowLeft,
  Save,
  Trash2,
  Image as ImageIcon,
  Plus,
  X,
  Gem,
  CheckCircle2,
  Sparkles,
  Layers,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';

export default function ProductSkuEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === 'new';

  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [collections, setCollections] = useState<CollectionDto[]>([]);
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'IDENTITY' | 'SPECS' | 'MEDIA' | 'TAXONOMY'>('IDENTITY');

  // Media Picker state
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [pickingTarget, setPickingTarget] = useState<'PRIMARY' | 'GALLERY'>('PRIMARY');

  // Form State
  const [form, setForm] = useState<{
    sku: string;
    title: string;
    subtitle: string;
    description: string;
    basePriceUsd: number;
    comparePriceUsd: number | undefined;
    costPriceUsd: number | undefined;
    categoryId: string;
    collectionId: string;
    primaryImageUrl: string;
    galleryImages: string[];
    stockQuantity: number;
    lowStockThreshold: number;
    status: ProductStatus;
    isFeatured: boolean;
    isBestseller: boolean;
    specs: JewelrySpecsDto;
  }>({
    sku: '',
    title: '',
    subtitle: '',
    description: '',
    basePriceUsd: 1000,
    comparePriceUsd: undefined,
    costPriceUsd: undefined,
    categoryId: '',
    collectionId: '',
    primaryImageUrl: '/images/banner.jpg',
    galleryImages: [],
    stockQuantity: 1,
    lowStockThreshold: 1,
    status: 'ACTIVE',
    isFeatured: false,
    isBestseller: false,
    specs: {
      metalType: '18K Gold',
      metalPurity: '18K (750)',
      metalColor: 'Yellow Gold',
      grossWeightGrams: 5.0,
      netWeightGrams: 4.5,
      diamondWeightCarats: 1.0,
      diamondColor: 'D',
      diamondClarity: 'VVS1',
      diamondCut: 'Ideal',
      hallmarkCertificate: 'BIS Hallmarked & GIA Certified',
    },
  });

  const loadInitialData = async () => {
    try {
      const [catRes, colRes] = await Promise.all([
        apiRequest<any>('/admin/catalog/categories'),
        apiRequest<any>('/admin/catalog/collections'),
      ]);
      const cats = Array.isArray(catRes) ? catRes : catRes?.data || [];
      const cols = Array.isArray(colRes) ? colRes : colRes?.data || [];
      setCategories(cats);
      setCollections(cols);

      if (!isNew) {
        const prodRes = await apiRequest<any>(`/admin/catalog/products/${id}`);
        const p: ProductDto = prodRes.data || prodRes;
        setForm({
          sku: p.sku,
          title: p.title,
          subtitle: p.subtitle || '',
          description: p.description,
          basePriceUsd: p.basePriceUsd,
          comparePriceUsd: p.comparePriceUsd,
          costPriceUsd: p.costPriceUsd,
          categoryId: p.categoryId,
          collectionId: p.collectionId || '',
          primaryImageUrl: p.primaryImageUrl,
          galleryImages: p.galleryImages || [],
          stockQuantity: p.stockQuantity,
          lowStockThreshold: p.lowStockThreshold,
          status: p.status,
          isFeatured: p.isFeatured,
          isBestseller: p.isBestseller,
          specs: p.specs,
        });
      } else if (cats.length > 0) {
        setForm((prev) => ({
          ...prev,
          categoryId: cats[0].id,
          sku: `TBH-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        }));
      }
    } catch (e: any) {
      alert(e.message || 'Failed to load catalog data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (isNew) {
        const created = await apiRequest<any>('/admin/catalog/products', {
          method: 'POST',
          data: form,
        });
        alert('Product SKU created successfully!');
        const newId = created?.data?.id || created?.id;
        router.push(`/catalog/${newId || ''}`);
      } else {
        await apiRequest(`/admin/catalog/products/${id}`, {
          method: 'PUT',
          data: form,
        });
        alert('Product SKU updated successfully!');
        loadInitialData();
      }
    } catch (e: any) {
      alert(e.message || 'Failed to save product SKU.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product SKU?')) return;
    try {
      await apiRequest(`/admin/catalog/products/${id}`, { method: 'DELETE' });
      alert('Product SKU removed.');
      router.push('/catalog');
    } catch (e: any) {
      alert(e.message || 'Failed to delete product.');
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex h-96 items-center justify-center">
          <div className="flex flex-col items-center space-y-3 text-slate-400">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
            <p className="text-xs">Loading jewelry SKU studio...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <form onSubmit={handleSave} className="space-y-6 max-w-6xl">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-ivory-400 dark:border-obsidian-750 pb-6">
          <div className="flex items-center space-x-4">
            <Link
              href="/catalog"
              className="rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-white dark:bg-obsidian-850 p-2 text-slate-600 dark:text-slate-300 hover:bg-ivory-100 dark:hover:bg-obsidian-800 transition"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-1">
                <Gem className="h-4 w-4" />
                <span>Jewelry SKU Creation & Master Specs</span>
              </div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
                {form.title || (isNew ? 'Create New Jewelry SKU' : 'Untitled SKU')}
              </h1>
              <p className="mt-0.5 text-xs text-slate-500 font-mono">
                SKU: {form.sku} • Base Price: ${form.basePriceUsd.toLocaleString()} USD
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {!isNew && (
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-xl border border-red-500/30 bg-red-500/10 p-2.5 text-red-500 hover:bg-red-500/20"
                title="Delete SKU"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center space-x-2 rounded-xl border border-gold-500/60 bg-gradient-to-r from-gold-600 to-gold-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-obsidian-950 shadow-md hover:from-gold-500 hover:to-gold-400 transition disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? 'Saving...' : isNew ? 'Publish SKU' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 border-b border-ivory-300 dark:border-obsidian-800">
          {[
            { key: 'IDENTITY', label: '1. Identity & Pricing' },
            { key: 'SPECS', label: '2. Precious Metals & Gemstones' },
            { key: 'MEDIA', label: '3. Photography & Media Vault' },
            { key: 'TAXONOMY', label: '4. Category & Collections' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`border-b-2 px-4 py-3 text-xs font-bold transition ${
                activeTab === tab.key
                  ? 'border-gold-500 text-gold-700 dark:text-gold-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: IDENTITY & PRICING */}
        {activeTab === 'IDENTITY' && (
          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Product Title
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-3 text-sm font-serif font-bold text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                  placeholder="e.g. The Sovereign Cushion Diamond Ring"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Master SKU Code
                </label>
                <input
                  type="text"
                  required
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value.toUpperCase() })}
                  className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-3 text-xs font-mono font-bold text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                  placeholder="e.g. TBH-RNG-001"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Subtitle / Luxury Narrative
              </label>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                placeholder="e.g. 2.5ct Cushion Brilliant Diamond in 18K White Gold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Detailed Atelier Description
              </label>
              <textarea
                rows={5}
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-2xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-3 text-xs text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none leading-relaxed"
                placeholder="Provide craftsmanship details, diamond fire, and gold alloy specifications..."
              />
            </div>

            {/* Pricing Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-ivory-300 dark:border-obsidian-800">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Base Retail Price (USD $)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={form.basePriceUsd}
                  onChange={(e) => setForm({ ...form, basePriceUsd: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-sm font-serif font-bold text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Compare At / Vault MSRP (USD $)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.comparePriceUsd || ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      comparePriceUsd: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                  className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                  placeholder="Optional crossed-out price"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Cost of Goods (COG / USD $)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.costPriceUsd || ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      costPriceUsd: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                  className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                  placeholder="Private internal cost"
                />
              </div>
            </div>

            {/* Inventory & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-ivory-300 dark:border-obsidian-800">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Physical Vault Stock
                </label>
                <input
                  type="number"
                  required
                  value={form.stockQuantity}
                  onChange={(e) => setForm({ ...form, stockQuantity: parseInt(e.target.value) || 0 })}
                  className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs font-mono font-bold text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Low Stock Alert Threshold
                </label>
                <input
                  type="number"
                  value={form.lowStockThreshold}
                  onChange={(e) => setForm({ ...form, lowStockThreshold: parseInt(e.target.value) || 1 })}
                  className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs font-mono text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Product Publication Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as ProductStatus })}
                  className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs font-bold text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                >
                  <option value="ACTIVE">ACTIVE (Live on Storefront)</option>
                  <option value="DRAFT">DRAFT (Atelier Private)</option>
                  <option value="OUT_OF_STOCK">OUT OF STOCK</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRECIOUS METALS & GEMSTONE SPECS */}
        {activeTab === 'SPECS' && (
          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gold-700 dark:text-gold-400 flex items-center space-x-1.5">
              <ShieldCheck className="h-4 w-4" />
              <span>Precious Metal & Gold Weight Anatomy</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Metal Type</label>
                <input
                  type="text"
                  value={form.specs.metalType}
                  onChange={(e) =>
                    setForm({ ...form, specs: { ...form.specs, metalType: e.target.value } })
                  }
                  className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs text-slate-900 dark:text-slate-100"
                  placeholder="e.g. 18K White Gold, 22K Solid Gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Gross Weight (grams)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.specs.grossWeightGrams}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      specs: { ...form.specs, grossWeightGrams: parseFloat(e.target.value) || 0 },
                    })
                  }
                  className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs font-mono font-bold text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Net Gold Weight (grams)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.specs.netWeightGrams}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      specs: { ...form.specs, netWeightGrams: parseFloat(e.target.value) || 0 },
                    })
                  }
                  className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs font-mono font-bold text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <h3 className="text-xs font-bold uppercase tracking-wider text-gold-700 dark:text-gold-400 flex items-center space-x-1.5 pt-4 border-t border-ivory-300 dark:border-obsidian-800">
              <Gem className="h-4 w-4" />
              <span>Diamond 4Cs & Gemstone Specifications</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Diamond Carat (ct)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.specs.diamondWeightCarats || ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      specs: {
                        ...form.specs,
                        diamondWeightCarats: e.target.value ? parseFloat(e.target.value) : undefined,
                      },
                    })
                  }
                  className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs font-mono text-slate-900 dark:text-slate-100"
                  placeholder="e.g. 2.50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Diamond Color</label>
                <input
                  type="text"
                  value={form.specs.diamondColor || ''}
                  onChange={(e) =>
                    setForm({ ...form, specs: { ...form.specs, diamondColor: e.target.value } })
                  }
                  className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs text-slate-900 dark:text-slate-100"
                  placeholder="e.g. D (Colorless)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Diamond Clarity</label>
                <input
                  type="text"
                  value={form.specs.diamondClarity || ''}
                  onChange={(e) =>
                    setForm({ ...form, specs: { ...form.specs, diamondClarity: e.target.value } })
                  }
                  className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs text-slate-900 dark:text-slate-100"
                  placeholder="e.g. VVS1 / Flawless"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Cut Grade</label>
                <input
                  type="text"
                  value={form.specs.diamondCut || ''}
                  onChange={(e) =>
                    setForm({ ...form, specs: { ...form.specs, diamondCut: e.target.value } })
                  }
                  className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs text-slate-900 dark:text-slate-100"
                  placeholder="e.g. Ideal / Excellent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Gemstone Inclusions / Precious Stones
                </label>
                <input
                  type="text"
                  value={form.specs.gemstoneDetails || ''}
                  onChange={(e) =>
                    setForm({ ...form, specs: { ...form.specs, gemstoneDetails: e.target.value } })
                  }
                  className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs text-slate-900 dark:text-slate-100"
                  placeholder="e.g. 3.2ct Colombian Emerald, Natural Basra Pearls"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Hallmark Certification Authority
                </label>
                <input
                  type="text"
                  value={form.specs.hallmarkCertificate || ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      specs: { ...form.specs, hallmarkCertificate: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs text-slate-900 dark:text-slate-100"
                  placeholder="e.g. GIA Certified #64829103 & BIS 916 Hallmarked"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PHOTOGRAPHY & MEDIA VAULT */}
        {activeTab === 'MEDIA' && (
          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Primary Showcase Photograph
                  </h3>
                  <p className="text-xs text-slate-400">
                    Featured cover image on the storefront catalog grid
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPickingTarget('PRIMARY');
                    setIsMediaPickerOpen(true);
                  }}
                  className="flex items-center space-x-1.5 rounded-xl border border-gold-500 bg-gold-500/10 px-3 py-1.5 text-xs font-bold text-gold-800 dark:text-gold-300 hover:bg-gold-500 hover:text-obsidian-950 transition"
                >
                  <ImageIcon className="h-4 w-4" />
                  <span>Choose from Vault</span>
                </button>
              </div>

              <div className="h-48 w-48 overflow-hidden rounded-2xl border border-ivory-300 dark:border-obsidian-800 bg-obsidian-950 shadow-md">
                <img
                  src={form.primaryImageUrl}
                  alt="Primary product preview"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Gallery Images */}
            <div className="pt-4 border-t border-ivory-300 dark:border-obsidian-800">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    High-Res Gallery Angles ({form.galleryImages.length})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Close-up prong angles, model try-on shots, and hallmark engravings
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPickingTarget('GALLERY');
                    setIsMediaPickerOpen(true);
                  }}
                  className="flex items-center space-x-1.5 rounded-xl border border-gold-500 bg-gold-500/10 px-3 py-1.5 text-xs font-bold text-gold-800 dark:text-gold-300 hover:bg-gold-500 hover:text-obsidian-950 transition"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Gallery Angle</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {form.galleryImages.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="group relative aspect-square overflow-hidden rounded-2xl border border-ivory-300 dark:border-obsidian-800 bg-obsidian-950"
                  >
                    <img src={imgUrl} alt={`Angle ${idx + 1}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          galleryImages: form.galleryImages.filter((_, i) => i !== idx),
                        })
                      }
                      className="absolute top-1.5 right-1.5 rounded-full bg-red-600/90 p-1 text-white opacity-0 group-hover:opacity-100 transition shadow-md"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TAXONOMY & COLLECTIONS */}
        {activeTab === 'TAXONOMY' && (
          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Jewelry Category Taxonomy
                </label>
                <select
                  required
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-3 text-xs font-bold text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Premier Maison Collection
                </label>
                <select
                  value={form.collectionId}
                  onChange={(e) => setForm({ ...form, collectionId: e.target.value })}
                  className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-3 text-xs font-bold text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                >
                  <option value="">No Collection Assigned</option>
                  {collections.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-ivory-300 dark:border-obsidian-800 space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="h-4 w-4 rounded border-ivory-400 text-gold-600 focus:ring-gold-500"
                />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Feature on Global Storefront Homepage & Hero Spotlights
                </span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isBestseller}
                  onChange={(e) => setForm({ ...form, isBestseller: e.target.checked })}
                  className="h-4 w-4 rounded border-ivory-400 text-gold-600 focus:ring-gold-500"
                />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Mark as Bestseller / VIP High Demand Creation
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Media Picker Modal */}
        <MediaPickerModal
          isOpen={isMediaPickerOpen}
          onClose={() => setIsMediaPickerOpen(false)}
          onSelect={(asset) => {
            if (pickingTarget === 'PRIMARY') {
              setForm({ ...form, primaryImageUrl: asset.url });
            } else {
              setForm({ ...form, galleryImages: [...form.galleryImages, asset.url] });
            }
          }}
        />
      </form>
    </AdminLayout>
  );
}
