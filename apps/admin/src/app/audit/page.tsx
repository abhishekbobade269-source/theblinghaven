'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { apiRequest } from '@/lib/api';
import { AuditLogDto, AuditEventType } from '@theblinghaven/shared';
import { History, Search, RefreshCw, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLogDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [eventTypeFilter, setEventTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchAuditLogs = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams();
      query.set('page', page.toString());
      query.set('limit', '15');
      if (eventTypeFilter) query.set('eventType', eventTypeFilter);

      const res = await apiRequest<any>(`/admin/audit?${query.toString()}`);
      if (Array.isArray(res)) {
        setLogs(res);
        setTotalPages(1);
        setTotalCount(res.length);
      } else if (res && Array.isArray(res.data)) {
        setLogs(res.data);
        setTotalPages(res.meta?.totalPages || 1);
        setTotalCount(res.meta?.total || res.data.length);
      } else {
        setLogs([]);
      }
    } catch (e) {
      console.error('Failed to load audit logs:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [page, eventTypeFilter]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-ivory-400 dark:border-obsidian-750 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-1">
              <ShieldCheck className="h-4 w-4" />
              <span>Immutable Forensics & Compliance</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-slate-100">
              Security & Audit Trail
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Append-only ledger of privileged activities, authentication outcomes, and role changes.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="rounded-lg border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 px-3 py-2 text-xs font-mono text-slate-700 dark:text-slate-300">
              Total Records: {totalCount}
            </span>
            <button
              onClick={fetchAuditLogs}
              className="flex items-center space-x-2 rounded-lg border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-850 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-ivory-100 dark:hover:bg-obsidian-800 transition"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={eventTypeFilter}
            onChange={(e) => {
              setEventTypeFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:border-gold-500 focus:outline-none"
          >
            <option value="">All Event Categories</option>
            {Object.values(AuditEventType).map((evt) => (
              <option key={evt} value={evt}>
                {evt}
              </option>
            ))}
          </select>
        </div>

        {/* Audit Log Table */}
        <div className="rounded-2xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-ivory-300 dark:border-obsidian-800 text-slate-500 dark:text-slate-400">
                <th className="pb-3 font-bold uppercase tracking-wider">Event</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Actor</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Role</th>
                <th className="pb-3 font-bold uppercase tracking-wider">IP / Client</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Details / Metadata</th>
                <th className="pb-3 font-bold uppercase tracking-wider text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-300 dark:divide-obsidian-800 text-slate-700 dark:text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gold-500 border-t-transparent"></div>
                      <span>Loading audit logs...</span>
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No audit records match the selected criteria.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-ivory-100 dark:hover:bg-obsidian-850/50 transition">
                    <td className="py-3">
                      <span className="inline-flex items-center rounded-md bg-gold-500/10 px-2 py-0.5 font-mono text-[11px] font-bold text-gold-800 dark:text-gold-300 border border-gold-500/20">
                        {log.eventType}
                      </span>
                    </td>
                    <td className="py-3 font-semibold text-slate-900 dark:text-slate-200">
                      {log.userEmail || 'System'}
                    </td>
                    <td className="py-3 text-[11px] text-slate-500 dark:text-slate-400">
                      {log.userRole?.replace('_', ' ') || 'SYSTEM'}
                    </td>
                    <td className="py-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      {log.ipAddress || 'internal'}
                    </td>
                    <td className="py-3 max-w-xs truncate font-mono text-[10px] text-slate-500 dark:text-slate-400">
                      {log.metadata ? JSON.stringify(log.metadata) : '—'}
                    </td>
                    <td className="py-3 text-right text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-ivory-300 dark:border-obsidian-800 pt-4 mt-4 text-xs text-slate-500 dark:text-slate-400">
            <p>
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center space-x-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="rounded border border-ivory-400 dark:border-obsidian-750 p-1.5 hover:bg-ivory-200 dark:hover:bg-obsidian-800 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="rounded border border-ivory-400 dark:border-obsidian-750 p-1.5 hover:bg-ivory-200 dark:hover:bg-obsidian-800 disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
