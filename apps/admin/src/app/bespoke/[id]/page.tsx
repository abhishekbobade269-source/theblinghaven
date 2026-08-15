'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AdminLayout } from '@/components/AdminLayout';
import { apiRequest } from '@/lib/api';
import { BespokeRequestDto, BespokeStatus } from '@theblinghaven/shared';
import {
  ArrowLeft,
  Gem,
  Crown,
  Save,
  Clock,
  UserCheck,
  CheckCircle2,
  Image as ImageIcon,
  Palette,
  FileText,
  Mail,
  Phone,
  DollarSign,
  Layers,
} from 'lucide-react';

const BESPOKE_STAGES: BespokeStatus[] = [
  'SUBMITTED',
  'CAD_DESIGN_IN_PROGRESS',
  'QUOTE_PENDING_CLIENT',
  'QUOTE_ACCEPTED',
  'CASTING_AND_SETTING',
  'HALLMARK_AND_CERTIFICATION',
  'COMPLETED_DISPATCHED',
  'DECLINED',
];

const GOLDSMITHS = [
  'Master Artisan Pierre Dubois (Geneva)',
  'Syndicate Jadau Atelier Jaipur',
  'Master Goldsmith Rajeshwar Verma (Surat)',
  'Maison High-Jewelry Bench Paris',
  'Atelier Concierge Desk',
];

export default function BespokeProjectStudioPage() {
  const params = useParams();
  const id = params.id as string;

  const [project, setProject] = useState<BespokeRequestDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [form, setForm] = useState<{
    status: BespokeStatus;
    assignedGoldsmith: string;
    quotedAmountUsd?: number;
    cadRenderUrl: string;
    estimatedCompletionWeeks?: number;
    atelierNotes: string;
  }>({
    status: 'SUBMITTED',
    assignedGoldsmith: '',
    quotedAmountUsd: undefined,
    cadRenderUrl: '',
    estimatedCompletionWeeks: undefined,
    atelierNotes: '',
  });

  const fetchProject = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest<any>(`/admin/bespoke/${id}`);
      const data: BespokeRequestDto = res.data || res;
      setProject(data);
      setForm({
        status: data.status,
        assignedGoldsmith: data.assignedGoldsmith || '',
        quotedAmountUsd: data.quotedAmountUsd || undefined,
        cadRenderUrl: data.cadRenderUrl || '',
        estimatedCompletionWeeks: data.estimatedCompletionWeeks || undefined,
        atelierNotes: data.atelierNotes || '',
      });
    } catch (e: any) {
      alert(e.message || 'Failed to load bespoke commission.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await apiRequest(`/admin/bespoke/${id}`, {
        method: 'PUT',
        data: {
          ...form,
          assignedGoldsmith: form.assignedGoldsmith || undefined,
          cadRenderUrl: form.cadRenderUrl || undefined,
          atelierNotes: form.atelierNotes || undefined,
        },
      });
      alert('Bespoke atelier project updated.');
      fetchProject();
    } catch (e: any) {
      alert(e.message || 'Failed to update bespoke project.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !project) {
    return (
      <AdminLayout>
        <div className="flex h-96 items-center justify-center">
          <div className="flex flex-col items-center space-x-2 text-slate-400">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
            <p className="text-xs mt-2">Loading bespoke atelier commission...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <form onSubmit={handleSave} className="space-y-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-ivory-400 dark:border-obsidian-750 pb-6">
          <div className="flex items-center space-x-4">
            <Link
              href="/bespoke"
              className="rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-white dark:bg-obsidian-850 p-2 text-slate-600 dark:text-slate-300 hover:bg-ivory-100 dark:hover:bg-obsidian-800 transition"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-1">
                <Gem className="h-4 w-4" />
                <span>Haute Joaillerie Bespoke Studio</span>
              </div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
                Commission #{project.referenceNumber}
              </h1>
              <p className="mt-0.5 text-xs text-slate-500 font-mono">
                Client: {project.clientName} ({project.clientCountry}) • Created on{' '}
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center space-x-2 rounded-xl border border-gold-500/60 bg-gradient-to-r from-gold-600 to-gold-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-obsidian-950 shadow-md hover:from-gold-500 hover:to-gold-400 transition disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? 'Updating...' : 'Commit Atelier Updates'}</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Commission Status Stage
            </span>
            <p className="font-serif text-lg font-bold text-gold-700 dark:text-gold-400">
              {project.status.replace(/_/g, ' ')}
            </p>
            <p className="text-xs text-slate-400">
              {project.estimatedCompletionWeeks ? `${project.estimatedCompletionWeeks} weeks crafting timeline` : 'Timeline pending quote'}
            </p>
          </div>

          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Official Atelier Quote
            </span>
            <p className="font-serif text-2xl font-bold text-slate-900 dark:text-slate-100">
              {project.quotedAmountUsd ? `$${project.quotedAmountUsd.toLocaleString()} USD` : 'Awaiting Quote'}
            </p>
            <p className="text-xs text-slate-400 font-mono">Budget: {project.budgetRangeUsd}</p>
          </div>

          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Master Jeweler Allocated
            </span>
            <p className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">
              {project.assignedGoldsmith || 'Atelier Concierge Desk'}
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              Haute Joaillerie Bench
            </p>
          </div>
        </div>

        {/* 2 Column Layout: Specifications & Renders vs Atelier Workshop controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Visual CAD & Design Brief */}
          <div className="space-y-6">
            {/* Visual Renders Box */}
            <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm space-y-4">
              <h3 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2 border-b border-ivory-300 dark:border-obsidian-800 pb-3">
                <ImageIcon className="h-4 w-4 text-gold-500" />
                <span>3D CAD Render & Inspiration Visuals</span>
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block mb-1.5 uppercase">
                    Client Inspiration Photo
                  </span>
                  <div className="h-44 w-full overflow-hidden rounded-2xl border border-ivory-300 dark:border-obsidian-750 bg-obsidian-950">
                    {project.inspirationPhotoUrl ? (
                      <img
                        src={project.inspirationPhotoUrl}
                        alt="Inspiration"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-600">
                        No photo attached
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 block mb-1.5 uppercase">
                    Atelier 3D CAD Preview
                  </span>
                  <div className="h-44 w-full overflow-hidden rounded-2xl border border-ivory-300 dark:border-obsidian-750 bg-obsidian-950">
                    {form.cadRenderUrl || project.cadRenderUrl ? (
                      <img
                        src={form.cadRenderUrl || project.cadRenderUrl}
                        alt="CAD Render"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-600 text-xs text-center p-2">
                        CAD render pending generation
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  CAD Render Image URL
                </label>
                <input
                  type="text"
                  value={form.cadRenderUrl}
                  onChange={(e) => setForm({ ...form, cadRenderUrl: e.target.value })}
                  className="w-full rounded-xl border border-ivory-300 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 font-mono text-xs text-slate-900 dark:text-slate-100"
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Design Brief & Gemstone Specs */}
            <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm space-y-4 text-xs">
              <h3 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100 border-b border-ivory-300 dark:border-obsidian-800 pb-3">
                Design Specifications & 4Cs
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block font-bold">Jewelry Category:</span>
                  <p className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">{project.category}</p>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">Precious Metal Alloy:</span>
                  <p className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">{project.metalPreference}</p>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">Gemstone Choice:</span>
                  <p className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                    {project.gemstonePreference || 'Atelier Selected'}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">Carat & Shape:</span>
                  <p className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                    {project.estimatedCaratWeight ? `${project.estimatedCaratWeight} ct` : ''}{' '}
                    {project.diamondShape ? `• ${project.diamondShape}` : ''}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">Size / Fit:</span>
                  <p className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                    {project.ringOrWristSize || 'Standard Fitting'}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">Laser Engraving:</span>
                  <p className="font-mono font-bold text-gold-700 dark:text-gold-400 mt-0.5">
                    {project.engravingText ? `"${project.engravingText}"` : 'None Requested'}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-ivory-200 dark:border-obsidian-800">
                <span className="text-slate-400 block font-bold mb-1">Client Design Brief:</span>
                <p className="text-slate-700 dark:text-slate-300 italic bg-ivory-50 dark:bg-obsidian-950 p-3 rounded-xl border border-ivory-200 dark:border-obsidian-800">
                  "{project.designBrief}"
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Workshop Quotation & Goldsmith Bench Controls */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm space-y-4">
              <h3 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2 border-b border-ivory-300 dark:border-obsidian-800 pb-3">
                <Palette className="h-4 w-4 text-gold-500" />
                <span>Atelier Goldsmith & Quotation Controls</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Atelier Stage Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as BespokeStatus })}
                    className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs font-bold text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                  >
                    {BESPOKE_STAGES.map((s) => (
                      <option key={s} value={s}>
                        {s.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Assigned Master Goldsmith / Atelier Bench
                  </label>
                  <select
                    value={form.assignedGoldsmith}
                    onChange={(e) => setForm({ ...form, assignedGoldsmith: e.target.value })}
                    className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs font-bold text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                  >
                    <option value="">Select Master Goldsmith</option>
                    {GOLDSMITHS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Formal Atelier Quote ($ USD)
                    </label>
                    <input
                      type="number"
                      value={form.quotedAmountUsd || ''}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          quotedAmountUsd: e.target.value ? parseFloat(e.target.value) : undefined,
                        })
                      }
                      className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 font-mono text-xs font-bold text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                      placeholder="e.g. 78500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Crafting Timeline (Weeks)
                    </label>
                    <input
                      type="number"
                      value={form.estimatedCompletionWeeks || ''}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          estimatedCompletionWeeks: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                      }
                      className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 font-mono text-xs font-bold text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                      placeholder="e.g. 6"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Atelier Bench Notes & Client Dossier
                  </label>
                  <textarea
                    rows={4}
                    value={form.atelierNotes}
                    onChange={(e) => setForm({ ...form, atelierNotes: e.target.value })}
                    className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                    placeholder="Log casting progress, gem setting notes, hallmark serial verification..."
                  />
                </div>
              </div>
            </div>

            {/* Client Profile Card */}
            <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-ivory-300 dark:border-obsidian-800 pb-3">
                <h4 className="font-serif text-sm font-bold text-slate-900 dark:text-slate-100">
                  Client Profile
                </h4>
                {project.vipTier && (
                  <span className="rounded-full bg-gold-500/20 px-2 py-0.5 text-[9px] font-bold text-gold-800 dark:text-gold-300">
                    {project.vipTier.replace('_', ' ')}
                  </span>
                )}
              </div>
              <p className="font-serif font-bold text-slate-900 dark:text-slate-100 text-sm">
                {project.clientName}
              </p>
              <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span>{project.clientEmail}</span>
              </div>
              {project.clientPhone && (
                <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{project.clientPhone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
