'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { apiRequest } from '@/lib/api';
import { AdminSessionDto } from '@theblinghaven/shared';
import { KeyRound, Monitor, Smartphone, Tablet, Trash2, ShieldAlert, CheckCircle2, RefreshCw } from 'lucide-react';

export default function SessionsPage() {
  const [sessions, setSessions] = useState<AdminSessionDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const data = await apiRequest<any>('/admin/auth/sessions');
      setSessions(Array.isArray(data) ? data : data?.data || []);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to load active sessions.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const revokeSession = async (sessionId: string) => {
    try {
      await apiRequest(`/admin/auth/sessions/${sessionId}`, { method: 'DELETE' });
      setStatusMessage({ type: 'success', text: 'Session successfully revoked.' });
      fetchSessions();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to revoke session.' });
    }
  };

  const revokeAllOthers = async () => {
    if (!confirm('Are you sure you want to terminate all other active sessions?')) return;
    try {
      await apiRequest('/admin/auth/sessions/revoke-others', { method: 'POST' });
      setStatusMessage({ type: 'success', text: 'All other active sessions have been terminated.' });
      fetchSessions();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to revoke other sessions.' });
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    if (deviceType === 'Mobile') return <Smartphone className="h-5 w-5 text-gold-600 dark:text-gold-400" />;
    if (deviceType === 'Tablet') return <Tablet className="h-5 w-5 text-gold-600 dark:text-gold-400" />;
    return <Monitor className="h-5 w-5 text-gold-600 dark:text-gold-400" />;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-ivory-400 dark:border-obsidian-750 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-1">
              <KeyRound className="h-4 w-4" />
              <span>Security & Identity Defense</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-slate-100">
              Active Admin Sessions
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Review and revoke concurrent privileged sessions across devices.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchSessions}
              className="flex items-center space-x-2 rounded-lg border border-ivory-400 dark:border-obsidian-700 bg-white dark:bg-obsidian-850 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-ivory-100 dark:hover:bg-obsidian-800 transition"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Refresh</span>
            </button>
            <button
              onClick={revokeAllOthers}
              className="flex items-center space-x-2 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-500/20 transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Terminate All Other Sessions</span>
            </button>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`flex items-start space-x-3 rounded-lg border p-4 text-xs ${
              statusMessage.type === 'success'
                ? 'border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                : 'border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
            ) : (
              <ShieldAlert className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="rounded-2xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm">
          <div className="space-y-4">
            {isLoading ? (
              <div className="py-8 text-center text-slate-400">Loading active sessions...</div>
            ) : sessions.length === 0 ? (
              <div className="py-8 text-center text-slate-400">No active sessions found.</div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border p-4 transition ${
                    session.isCurrent
                      ? 'border-gold-500/50 bg-gold-500/5 dark:bg-gold-500/5'
                      : 'border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-850'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="rounded-lg border border-ivory-400 dark:border-obsidian-700 bg-white dark:bg-obsidian-900 p-2.5">
                      {getDeviceIcon(session.deviceType)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {session.deviceType} Device
                        </p>
                        {session.isCurrent && (
                          <span className="rounded-full border border-gold-500/40 bg-gold-500/20 px-2 py-0.5 text-[10px] font-bold text-gold-800 dark:text-gold-300">
                            Current Session
                          </span>
                        )}
                      </div>
                      <p className="mt-1 font-mono text-xs text-slate-500 dark:text-slate-400">
                        IP: {session.ipAddress} • Created: {new Date(session.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-md">
                        {session.userAgent}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                    <div className="text-right text-xs">
                      <p className="text-slate-400">Last Active</p>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {new Date(session.lastActiveAt).toLocaleTimeString()}
                      </p>
                    </div>

                    {!session.isCurrent && (
                      <button
                        onClick={() => revokeSession(session.id)}
                        className="rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition"
                        title="Revoke session"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
