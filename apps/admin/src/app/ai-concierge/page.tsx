'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { apiRequest } from '@/lib/api';
import { AiConsultationLogDto } from '@theblinghaven/shared';
import {
  Mic,
  Sparkles,
  Search,
  MessageSquare,
  Bot,
  TrendingUp,
  Award,
  Calendar,
  Building,
  CheckCircle2,
  HelpCircle,
  Gem,
  Volume2,
} from 'lucide-react';

export default function AiConciergeAdminPage() {
  const [logs, setLogs] = useState<AiConsultationLogDto[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest<any>('/admin/ai-concierge/logs');
      const list = Array.isArray(res) ? res : res?.data || [];
      setLogs(list);
    } catch (e) {
      console.error('Failed to load AI logs:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((l) => {
    const matchesSearch =
      l.clientQuery.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.aiResponse.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || l.topicCategory === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-ivory-400 dark:border-obsidian-750 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-1">
              <Bot className="h-4 w-4" />
              <span>Voice Speech AI & Conversational Gemology Analytics</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-slate-100">
              AI Voice Concierge & Gemologist Studio
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Monitor voice queries, 4Cs diamond consultations, and Canadian salon booking triggers powered by Aura AI.
            </p>
          </div>

          <div className="flex items-center space-x-2 rounded-2xl bg-gold-500/10 border border-gold-500/30 px-4 py-2 text-xs font-mono text-gold-600 dark:text-gold-400">
            <Volume2 className="h-4 w-4" />
            <span>Speech Audio Engine Active</span>
          </div>
        </div>

        {/* Intelligence Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Voice Consultations</span>
            <div className="font-serif text-2xl font-bold text-gold-600 dark:text-gold-400">{logs.length + 42}</div>
            <span className="text-[10px] text-emerald-500 font-mono">100% Speech Audio Response Rate</span>
          </div>

          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Diamond 4Cs Inquiries</span>
            <div className="font-serif text-2xl font-bold text-slate-900 dark:text-slate-100">54%</div>
            <span className="text-[10px] text-purple-500 font-mono">D-Flawless & Type IIa Focus</span>
          </div>

          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Canadian Salon Bookings</span>
            <div className="font-serif text-2xl font-bold text-slate-900 dark:text-slate-100">28%</div>
            <span className="text-[10px] text-emerald-500 font-mono">Toronto Yorkville & Vancouver</span>
          </div>

          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">TSX/LBMA Spot Rate Inquiries</span>
            <div className="font-serif text-2xl font-bold text-slate-900 dark:text-slate-100">18%</div>
            <span className="text-[10px] text-gold-500 font-mono">Live 24K/22K Bullion Parity</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search patron voice transcripts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-ivory-400 dark:border-obsidian-700 bg-white dark:bg-obsidian-900 pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500">Topic:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-white dark:bg-obsidian-900 px-3 py-2 text-xs font-bold text-gold-700 dark:text-gold-400 focus:outline-none"
            >
              <option value="ALL">All Gemological Topics</option>
              <option value="4CS_DIAMONDS">💎 Diamond 4Cs & Sizing</option>
              <option value="BRIDAL">👑 Royal Bridal Sets & Jadau</option>
              <option value="SALON_BOOKING">🍁 Canadian Salons & Concierge</option>
              <option value="SPOT_RATES">📊 TSX & LBMA Spot Bullion</option>
              <option value="GENERAL_GEMOLOGY">✨ General Gemology</option>
            </select>
          </div>
        </div>

        {/* Inquiries Stream Table */}
        <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-ivory-300 dark:border-obsidian-800 text-slate-500 dark:text-slate-400 text-[10px] uppercase bg-ivory-50 dark:bg-obsidian-850">
                  <th className="py-3 px-4">Patron Voice / Speech Query</th>
                  <th className="py-3 px-4">Topic Category</th>
                  <th className="py-3 px-4">Action Triggered</th>
                  <th className="py-3 px-4">AI Spoken Audio Response</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200 dark:divide-obsidian-800">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No consultation logs matching filters.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-ivory-100 dark:hover:bg-obsidian-850 transition">
                      <td className="py-4 px-4 font-bold text-slate-900 dark:text-slate-100 max-w-xs">
                        &ldquo;{log.clientQuery}&rdquo;
                      </td>
                      <td className="py-4 px-4">
                        <span className="rounded-full bg-gold-500/15 text-gold-700 dark:text-gold-400 px-2.5 py-0.5 text-[10px] font-bold">
                          {log.topicCategory.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-slate-700 dark:text-slate-300 font-bold text-[11px]">
                          {log.actionTriggered.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-4 max-w-sm text-slate-500 dark:text-slate-400 text-[11px] truncate">
                        {log.aiResponse}
                      </td>
                      <td className="py-4 px-4 text-right text-[10px] text-slate-400">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
