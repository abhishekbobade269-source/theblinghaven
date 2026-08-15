'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { apiRequest } from '@/lib/api';
import {
  ConciergeInquiryDto,
  InquiryType,
  InquiryStatus,
} from '@theblinghaven/shared';
import {
  Sparkles,
  Crown,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Search,
  RefreshCw,
  Clock,
  UserCheck,
  CheckCircle2,
  X,
  MessageSquare,
  Building,
  Gem,
  Trash2,
} from 'lucide-react';

const INQUIRY_TYPES: { key: string; label: string }[] = [
  { key: 'ALL', label: 'All Requests' },
  { key: 'PRIVATE_SALON_APPOINTMENT', label: 'VIP Salon Appointments' },
  { key: 'GEMSTONE_SOURCING_INQUIRY', label: 'Rare Gemstone Sourcing' },
  { key: 'BESPOKE_CUSTOM_CREATION', label: 'Bespoke Inquiries' },
  { key: 'APPRAISAL_CERTIFICATION_REQUEST', label: 'Appraisals & Heritage' },
];

const STATUS_OPTIONS: InquiryStatus[] = [
  'NEW',
  'IN_REVIEW_BY_GEMOLOGIST',
  'APPOINTMENT_SCHEDULED',
  'QUOTATION_DISPATCHED',
  'RESOLVED',
  'CLOSED',
];

export default function ConciergePage() {
  const [inquiries, setInquiries] = useState<ConciergeInquiryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  // Selected Inquiry for Management
  const [selectedInquiry, setSelectedInquiry] = useState<ConciergeInquiryDto | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusForm, setStatusForm] = useState<{
    status: InquiryStatus;
    assignedAdvisor: string;
    internalNotes: string;
    preferredAppointmentDate: string;
  }>({
    status: 'NEW',
    assignedAdvisor: '',
    internalNotes: '',
    preferredAppointmentDate: '',
  });

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const q = new URLSearchParams();
      if (typeFilter !== 'ALL') q.set('type', typeFilter);
      const res = await apiRequest<any>(`/admin/concierge?${q.toString()}`);
      setInquiries(Array.isArray(res) ? res : res?.data || []);
    } catch (e) {
      console.error('Failed to load inquiries:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [typeFilter]);

  const openManageModal = (inq: ConciergeInquiryDto) => {
    setSelectedInquiry(inq);
    setStatusForm({
      status: inq.status,
      assignedAdvisor: inq.assignedAdvisor || '',
      internalNotes: inq.internalNotes || '',
      preferredAppointmentDate: inq.preferredAppointmentDate
        ? inq.preferredAppointmentDate.slice(0, 16)
        : '',
    });
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry) return;

    setIsUpdating(true);
    try {
      await apiRequest(`/admin/concierge/${selectedInquiry.id}`, {
        method: 'PUT',
        data: {
          status: statusForm.status,
          assignedAdvisor: statusForm.assignedAdvisor || undefined,
          internalNotes: statusForm.internalNotes || undefined,
          preferredAppointmentDate: statusForm.preferredAppointmentDate || undefined,
        },
      });
      alert('Concierge record and VIP appointment schedule updated.');
      setSelectedInquiry(null);
      fetchInquiries();
    } catch (e: any) {
      alert(e.message || 'Failed to update concierge inquiry.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteInquiry = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete inquiry from ${name}?`)) return;
    try {
      await apiRequest(`/admin/concierge/${id}`, { method: 'DELETE' });
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
      fetchInquiries();
    } catch (e: any) {
      alert(e.message || 'Failed to delete inquiry.');
    }
  };

  const filtered = inquiries.filter(
    (i) =>
      i.fullName.toLowerCase().includes(search.toLowerCase()) ||
      i.email.toLowerCase().includes(search.toLowerCase()) ||
      i.subject.toLowerCase().includes(search.toLowerCase()),
  );

  const totalAppointments = inquiries.filter((i) => i.type === 'PRIVATE_SALON_APPOINTMENT').length;
  const royalCount = inquiries.filter((i) => i.vipTier === 'ROYAL_CONCIERGE').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-ivory-400 dark:border-obsidian-750 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-1">
              <Crown className="h-4 w-4" />
              <span>Private Client Concierge & Salon Appointments</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-slate-100">
              White-Glove Concierge Desk
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Manage VIP private salon viewings in London, Dubai, and virtual salons, rare gemstone sourcing, and consultations.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchInquiries}
              className="rounded-lg border border-ivory-400 dark:border-obsidian-700 bg-white dark:bg-obsidian-850 p-2.5 text-slate-600 dark:text-slate-300 hover:bg-ivory-100 dark:hover:bg-obsidian-800"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Private Salon Appointments
            </span>
            <p className="mt-2 text-2xl font-bold text-gold-700 dark:text-gold-400 font-serif">
              {totalAppointments} Scheduled
            </p>
            <p className="mt-1 text-xs text-slate-400">London Mayfair & Dubai DIFC Salons</p>
          </div>

          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Royal Concierge Inquiries
            </span>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif">
              {royalCount} HNW Requests
            </p>
            <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              High-priority gemologist routing
            </p>
          </div>

          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Concierge Leads
            </span>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif">
              {inquiries.length} Active
            </p>
            <p className="mt-1 text-xs text-slate-400">Across global luxury client pipeline</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {INQUIRY_TYPES.map((t) => (
              <button
                key={t.key}
                onClick={() => setTypeFilter(t.key)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                  typeFilter === t.key
                    ? 'bg-gold-500 text-obsidian-950 shadow-md'
                    : 'bg-white dark:bg-obsidian-900 text-slate-700 dark:text-slate-300 border border-ivory-300 dark:border-obsidian-750'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by client name, email, or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 py-2 pl-9 pr-4 text-xs text-slate-800 dark:text-slate-200 focus:border-gold-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Inquiries Table */}
        <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[950px]">
            <thead>
              <tr className="border-b border-ivory-300 dark:border-obsidian-800 text-slate-500 dark:text-slate-400">
                <th className="pb-3 font-bold uppercase tracking-wider">Client & Tier</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Inquiry Type</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Salon / Date</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Subject & Request Brief</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Assigned Advisor</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Status</th>
                <th className="pb-3 font-bold uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-300 dark:divide-obsidian-800 text-slate-700 dark:text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
                      <span>Loading concierge appointments...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No concierge inquiries found matching filter.
                  </td>
                </tr>
              ) : (
                filtered.map((inq) => (
                  <tr
                    key={inq.id}
                    className="hover:bg-ivory-100 dark:hover:bg-obsidian-850/50 transition"
                  >
                    <td className="py-3.5">
                      <p className="font-serif font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {inq.fullName}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{inq.email}</p>
                      {inq.vipTier && (
                        <span className="inline-flex items-center space-x-1 rounded-full bg-gold-500/20 px-2 py-0.5 text-[9px] font-bold text-gold-800 dark:text-gold-300 mt-1">
                          <Crown className="h-2.5 w-2.5" />
                          <span>{inq.vipTier.replace('_', ' ')}</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5">
                      <span className="font-medium text-xs text-slate-800 dark:text-slate-200">
                        {inq.type.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3.5">
                      <p className="font-bold text-slate-900 dark:text-slate-100">
                        {inq.preferredSalonLocation || 'Online Concierge'}
                      </p>
                      {inq.preferredAppointmentDate && (
                        <p className="text-[10px] text-gold-700 dark:text-gold-400 font-mono mt-0.5">
                          📅 {new Date(inq.preferredAppointmentDate).toLocaleString()}
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 max-w-xs">
                      <p className="font-serif font-bold text-slate-900 dark:text-slate-100 truncate">
                        {inq.subject}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{inq.message}</p>
                    </td>

                    <td className="py-3.5 text-[11px] text-slate-600 dark:text-slate-400">
                      {inq.assignedAdvisor || 'Atelier Concierge Desk'}
                    </td>

                    <td className="py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          inq.status === 'APPOINTMENT_SCHEDULED'
                            ? 'bg-gold-500/20 text-gold-800 dark:text-gold-300 border border-gold-500/40'
                            : inq.status === 'RESOLVED'
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                        }`}
                      >
                        {inq.status.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 text-right space-x-2">
                      <button
                        onClick={() => openManageModal(inq)}
                        className="inline-flex items-center space-x-1 rounded-xl border border-ivory-300 dark:border-obsidian-750 bg-ivory-100 dark:bg-obsidian-800 px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-gold-600 dark:hover:text-gold-400 transition"
                      >
                        <UserCheck className="h-3.5 w-3.5" />
                        <span>Manage</span>
                      </button>

                      <button
                        onClick={() => handleDeleteInquiry(inq.id, inq.fullName)}
                        className="inline-flex items-center rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 p-1.5 text-rose-500 transition"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Manage Inquiry Modal */}
        {selectedInquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
            <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-ivory-300 dark:border-obsidian-800 pb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">
                    Manage Concierge Inquiry
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Client: {selectedInquiry.fullName} ({selectedInquiry.email})
                  </p>
                </div>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="rounded-full p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="rounded-2xl bg-ivory-50 dark:bg-obsidian-950 p-4 border border-ivory-200 dark:border-obsidian-800 text-xs space-y-1">
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  Subject: {selectedInquiry.subject}
                </p>
                <p className="text-slate-600 dark:text-slate-300 italic">
                  "{selectedInquiry.message}"
                </p>
                {selectedInquiry.preferredSalonLocation && (
                  <p className="text-gold-700 dark:text-gold-400 font-bold pt-1">
                    Salon: {selectedInquiry.preferredSalonLocation}
                  </p>
                )}
              </div>

              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Inquiry / Appointment Status
                  </label>
                  <select
                    value={statusForm.status}
                    onChange={(e) =>
                      setStatusForm({ ...statusForm, status: e.target.value as InquiryStatus })
                    }
                    className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs font-bold text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Assigned High-Jewelry Advisor
                  </label>
                  <input
                    type="text"
                    value={statusForm.assignedAdvisor}
                    onChange={(e) =>
                      setStatusForm({ ...statusForm, assignedAdvisor: e.target.value })
                    }
                    className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                    placeholder="e.g. Madame Celine Laurent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Confirmed Salon Appointment Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={statusForm.preferredAppointmentDate}
                    onChange={(e) =>
                      setStatusForm({ ...statusForm, preferredAppointmentDate: e.target.value })
                    }
                    className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Internal Concierge & Gemologist Notes
                  </label>
                  <textarea
                    rows={2}
                    value={statusForm.internalNotes}
                    onChange={(e) =>
                      setStatusForm({ ...statusForm, internalNotes: e.target.value })
                    }
                    className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                    placeholder="Record salon arrangements, champagne reservations, or gem sourcing notes..."
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-ivory-300 dark:border-obsidian-800">
                  <button
                    type="button"
                    onClick={() => setSelectedInquiry(null)}
                    className="rounded-xl border border-ivory-300 dark:border-obsidian-750 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-ivory-100 dark:hover:bg-obsidian-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="rounded-xl border border-gold-500/60 bg-gradient-to-r from-gold-600 to-gold-500 px-5 py-2 text-xs font-bold uppercase tracking-wider text-obsidian-950 shadow-md hover:from-gold-500 hover:to-gold-400 transition disabled:opacity-50"
                  >
                    {isUpdating ? 'Saving...' : 'Update Concierge Record'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
