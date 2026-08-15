'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { apiRequest } from '@/lib/api';
import {
  TryOnOverlayDto,
  TryOnConsultationDto,
} from '@theblinghaven/shared';
import {
  Camera,
  Sparkles,
  Search,
  UserCheck,
  Calendar,
  Layers,
  CheckCircle2,
  ExternalLink,
  Eye,
  Sliders,
  Maximize2,
  RotateCw,
  Clock,
  Mail,
  Phone,
  Building,
} from 'lucide-react';

export default function TryOnAdminPage() {
  const [overlays, setOverlays] = useState<TryOnOverlayDto[]>([]);
  const [consultations, setConsultations] = useState<TryOnConsultationDto[]>([]);
  const [activeTab, setActiveTab] = useState<'CONSULTATIONS' | 'OVERLAYS'>('CONSULTATIONS');
  const [isLoading, setIsLoading] = useState(true);

  const fetchTryOnData = async () => {
    setIsLoading(true);
    try {
      const [overRes, conRes] = await Promise.all([
        apiRequest<any>('/try-on/overlays'),
        apiRequest<any>('/admin/try-on/consultations'),
      ]);
      const oList = Array.isArray(overRes) ? overRes : overRes?.data || [];
      const cList = Array.isArray(conRes) ? conRes : conRes?.data || [];
      setOverlays(oList);
      setConsultations(cList);
    } catch (e) {
      console.error('Failed to load Try-On data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTryOnData();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await apiRequest<any>(`/admin/try-on/consultations/${id}/status`, {
        method: 'PUT',
        data: { status: newStatus },
      });
      fetchTryOnData();
    } catch (e: any) {
      alert(e.message || 'Status update failed.');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-ivory-400 dark:border-obsidian-750 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-1">
              <Camera className="h-4 w-4" />
              <span>Augmented Reality Visualizer & Look Consultations</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-slate-100">
              Virtual Try-On Management Studio
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Manage transparent jewelry 3D overlays, anchor points, and review VIP client-submitted virtual looks.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex rounded-2xl border border-ivory-400 dark:border-obsidian-700 bg-white dark:bg-obsidian-900 p-1">
            <button
              onClick={() => setActiveTab('CONSULTATIONS')}
              className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === 'CONSULTATIONS'
                  ? 'bg-gold-500 text-obsidian-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-gold-400'
              }`}
            >
              <UserCheck className="h-4 w-4" />
              <span>Client Look Inquiries ({consultations.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('OVERLAYS')}
              className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === 'OVERLAYS'
                  ? 'bg-gold-500 text-obsidian-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-gold-400'
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>Overlay Asset Library ({overlays.length})</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Client Look Consultations */}
        {activeTab === 'CONSULTATIONS' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {consultations.map((c) => (
                <div
                  key={c.id}
                  className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm space-y-4 text-xs"
                >
                  <div className="flex items-center justify-between border-b border-ivory-300 dark:border-obsidian-800 pb-3">
                    <span className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
                      {c.clientName}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold ${
                        c.status === 'APPOINTMENT_SCHEDULED'
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : c.status === 'CONTACTED'
                          ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                          : 'bg-gold-500/20 text-gold-700 dark:text-gold-400'
                      }`}
                    >
                      {c.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="space-y-2 font-mono text-[11px]">
                    <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
                      <Mail className="h-3.5 w-3.5 text-gold-500" />
                      <span>{c.clientEmail}</span>
                    </div>
                    {c.clientPhone && (
                      <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
                        <Phone className="h-3.5 w-3.5 text-gold-500" />
                        <span>{c.clientPhone}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
                      <Building className="h-3.5 w-3.5 text-gold-500" />
                      <span>{c.preferredSalon}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-ivory-100 dark:bg-obsidian-850 border border-ivory-300 dark:border-obsidian-800 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-gold-600 dark:text-gold-400">
                      Virtual Fitting Parameters
                    </span>
                    <p className="font-serif font-bold text-slate-800 dark:text-slate-200">
                      {c.productTitle}
                    </p>
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-1">
                      <span>Scale: {c.scaleApplied}x</span>
                      <span>Rotation: {c.rotationApplied}°</span>
                      <span>Skin: {c.skinToneSelected}</span>
                    </div>
                  </div>

                  {c.notes && (
                    <p className="text-[11px] text-slate-500 italic border-l-2 border-gold-500 pl-2">
                      &ldquo;{c.notes}&rdquo;
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-ivory-200 dark:border-obsidian-800">
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>

                    <select
                      value={c.status}
                      onChange={(e) => handleUpdateStatus(c.id, e.target.value)}
                      className="rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-50 dark:bg-obsidian-800 px-2.5 py-1 text-[11px] font-bold text-gold-700 dark:text-gold-400 focus:outline-none"
                    >
                      <option value="PENDING_ADVISOR_REVIEW">Pending Review</option>
                      <option value="CONTACTED">Client Contacted</option>
                      <option value="APPOINTMENT_SCHEDULED">Salon Appointment Booked</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Overlay Asset Library */}
        {activeTab === 'OVERLAYS' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {overlays.map((o) => (
              <div
                key={o.id}
                className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm space-y-4"
              >
                <div className="relative h-48 rounded-2xl bg-obsidian-950 overflow-hidden flex items-center justify-center p-4 border border-ivory-300 dark:border-obsidian-800">
                  <img
                    src={o.overlayImageUrl}
                    alt={o.title}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80';
                    }}
                    className="max-h-full max-w-full object-contain filter drop-shadow-2xl"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-gold-500/20 backdrop-blur-md border border-gold-500/40 px-2.5 py-0.5 font-mono text-[10px] font-bold text-gold-400">
                    {o.category}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-slate-100">
                    {o.title}
                  </h3>
                  <span className="font-mono text-xs text-gold-600 dark:text-gold-400 font-bold">
                    CAD ${o.basePriceCad.toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-600 dark:text-slate-400 pt-2 border-t border-ivory-200 dark:border-obsidian-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Anchor Location</span>
                    <strong className="text-slate-800 dark:text-slate-200">{o.anchorType}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Default Scale</span>
                    <strong className="text-slate-800 dark:text-slate-200">{o.defaultScale}x</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
