'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { apiRequest } from '@/lib/api';
import {
  SupportTicketDto,
  TicketStatus,
  TicketPriority,
  TicketCategory,
} from '@theblinghaven/shared';
import {
  LifeBuoy,
  Search,
  Filter,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  ShieldCheck,
  Package,
  Sparkles,
  Send,
  X,
  Trash2,
  Mail,
  Phone,
  Tag,
} from 'lucide-react';

export default function SupportAdminPage() {
  const [tickets, setTickets] = useState<SupportTicketDto[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicketDto | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (statusFilter !== 'ALL') queryParams.append('status', statusFilter);
      if (priorityFilter !== 'ALL') queryParams.append('priority', priorityFilter);

      const url = `/admin/support/tickets${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const res = await apiRequest<any>(url);
      const list = Array.isArray(res) ? res : res?.data || [];
      setTickets(list);
      if (list.length > 0 && !selectedTicket) {
        setSelectedTicket(list[0]);
      }
    } catch (e) {
      console.error('Failed to load support tickets:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, priorityFilter]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;

    setIsReplying(true);
    try {
      const res = await apiRequest<any>(`/admin/support/tickets/${selectedTicket.id}/reply`, {
        method: 'POST',
        data: {
          message: replyMessage,
          senderName: 'Senior Client Support Director',
          senderRole: 'SUPPORT_AGENT',
          isInternalNote,
        },
      });
      const updated = res?.data || res;
      setSelectedTicket(updated);
      setReplyMessage('');
      fetchTickets();
    } catch (e: any) {
      alert(e.message || 'Failed to send reply.');
    } finally {
      setIsReplying(false);
    }
  };

  const handleUpdateStatus = async (ticketId: string, newStatus: TicketStatus) => {
    try {
      const res = await apiRequest<any>(`/admin/support/tickets/${ticketId}/status`, {
        method: 'PUT',
        data: { status: newStatus },
      });
      const updated = res?.data || res;
      setSelectedTicket(updated);
      fetchTickets();
    } catch (e: any) {
      alert(e.message || 'Failed to update status.');
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    if (!confirm('Are you sure you want to permanently delete this support ticket?')) return;
    try {
      await apiRequest<any>(`/admin/support/tickets/${ticketId}`, { method: 'DELETE' });
      setSelectedTicket(null);
      fetchTickets();
    } catch (e: any) {
      alert(e.message || 'Failed to delete ticket.');
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.ticketNumber.toLowerCase().includes(q) ||
      t.customerName.toLowerCase().includes(q) ||
      t.customerEmail.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q)
    );
  });

  const openCount = tickets.filter((t) => t.status === 'OPEN').length;
  const inReviewCount = tickets.filter((t) => t.status === 'IN_REVIEW' || t.status === 'WAITING_CLIENT').length;
  const resolvedCount = tickets.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED').length;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-ivory-400 dark:border-obsidian-750 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-1">
              <LifeBuoy className="h-4 w-4" />
              <span>High-Jewelry Customer Inquiries & Ticket Desk</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-slate-100">
              Customer Support & Ticket Desk
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Manage product inquiries, order tracking assistance, bespoke commissions, and VIP salon appointment tickets.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="rounded-full bg-gold-500/10 border border-gold-500/30 px-3.5 py-1.5 font-mono text-xs font-bold text-gold-600 dark:text-gold-400">
              {openCount} Tickets Requiring Action
            </span>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Active Inquiries</span>
            <div className="font-serif text-2xl font-bold text-slate-900 dark:text-slate-100">{tickets.length}</div>
            <span className="text-[10px] text-gold-500 font-mono">Multi-Channel Inquiries</span>
          </div>

          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Open Inquiries</span>
            <div className="font-serif text-2xl font-bold text-rose-500">{openCount}</div>
            <span className="text-[10px] text-rose-500 font-mono">SLA &lt; 2hr Response Time</span>
          </div>

          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">In Progress / Client Waiting</span>
            <div className="font-serif text-2xl font-bold text-amber-500">{inReviewCount}</div>
            <span className="text-[10px] text-amber-500 font-mono">Assigned to Directors</span>
          </div>

          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Resolved & Closed</span>
            <div className="font-serif text-2xl font-bold text-emerald-500">{resolvedCount}</div>
            <span className="text-[10px] text-emerald-500 font-mono">100% Client Satisfaction</span>
          </div>
        </div>

        {/* Master-Detail Ticket Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Tickets Inbox */}
          <div className="lg:col-span-5 space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by ticket #, customer, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-ivory-400 dark:border-obsidian-700 bg-white dark:bg-obsidian-900 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex-1 rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-white dark:bg-obsidian-900 p-2 text-xs font-bold text-gold-700 dark:text-gold-400 focus:outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="OPEN">Open</option>
                  <option value="IN_REVIEW">In Review</option>
                  <option value="WAITING_CLIENT">Waiting Client</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="flex-1 rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-white dark:bg-obsidian-900 p-2 text-xs font-bold text-gold-700 dark:text-gold-400 focus:outline-none"
                >
                  <option value="ALL">All Priorities</option>
                  <option value="URGENT_VIP">VIP Urgent</option>
                  <option value="PRIORITY">Priority</option>
                  <option value="STANDARD">Standard</option>
                </select>
              </div>
            </div>

            {/* Ticket Cards List */}
            <div className="space-y-3 max-h-[650px] overflow-y-auto pr-1">
              {filteredTickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className={`cursor-pointer rounded-2xl border p-4 transition space-y-2.5 text-xs shadow-sm ${
                    selectedTicket?.id === t.id
                      ? 'border-gold-500 bg-gold-500/10'
                      : 'border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 hover:border-gold-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-gold-600 dark:text-gold-400">
                      {t.ticketNumber}
                    </span>
                    <div className="flex items-center space-x-1.5">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                          t.priority === 'URGENT_VIP'
                            ? 'bg-rose-500/20 text-rose-600'
                            : t.priority === 'PRIORITY'
                            ? 'bg-amber-500/20 text-amber-600'
                            : 'bg-slate-500/20 text-slate-600'
                        }`}
                      >
                        {t.priority.replace(/_/g, ' ')}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                          t.status === 'RESOLVED'
                            ? 'bg-emerald-500/20 text-emerald-600'
                            : t.status === 'OPEN'
                            ? 'bg-rose-500/20 text-rose-600'
                            : 'bg-gold-500/20 text-gold-700'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                      {t.subject}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 line-clamp-2 text-[11px] mt-0.5">
                      {t.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-ivory-200 dark:border-obsidian-800">
                    <span>👤 {t.customerName}</span>
                    <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Ticket Conversation & Resolution Pane */}
          <div className="lg:col-span-7">
            {selectedTicket ? (
              <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm space-y-6 text-xs">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-ivory-200 dark:border-obsidian-800 pb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm font-bold text-gold-600 dark:text-gold-400">
                        {selectedTicket.ticketNumber}
                      </span>
                      <span className="rounded-full bg-ivory-200 dark:bg-obsidian-800 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                        {selectedTicket.category.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <h3 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                      {selectedTicket.subject}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Status Dropdown */}
                    <select
                      value={selectedTicket.status}
                      onChange={(e) => handleUpdateStatus(selectedTicket.id, e.target.value as TicketStatus)}
                      className="rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-50 dark:bg-obsidian-850 px-3 py-1.5 text-xs font-bold text-gold-700 dark:text-gold-400 focus:outline-none"
                    >
                      <option value="OPEN">Open</option>
                      <option value="IN_REVIEW">In Review</option>
                      <option value="WAITING_CLIENT">Waiting on Client</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="CLOSED">Closed</option>
                    </select>

                    <button
                      onClick={() => handleDeleteTicket(selectedTicket.id)}
                      className="rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 p-2 text-rose-500 transition"
                      title="Delete Ticket"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Customer Meta */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-ivory-50 dark:bg-obsidian-850 border border-ivory-300 dark:border-obsidian-800 text-[11px] font-mono">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Customer</span>
                    <strong className="text-slate-900 dark:text-slate-100">{selectedTicket.customerName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Email</span>
                    <span className="text-slate-700 dark:text-slate-300 truncate block">{selectedTicket.customerEmail}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Related Item</span>
                    <span className="text-gold-600 dark:text-gold-400">{selectedTicket.relatedProductSku || selectedTicket.relatedOrderNumber || 'General'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Assigned Advisor</span>
                    <span className="text-slate-700 dark:text-slate-300">{selectedTicket.assignedAgent || 'Unassigned'}</span>
                  </div>
                </div>

                {/* Initial Description */}
                <div className="p-4 rounded-2xl bg-ivory-100 dark:bg-obsidian-800 border border-ivory-300 dark:border-obsidian-700 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">Initial Inquiry Details:</span>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{selectedTicket.description}</p>
                </div>

                {/* Conversation Thread */}
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
                    Thread Responses ({selectedTicket.responses.length}):
                  </span>
                  {selectedTicket.responses.map((r) => (
                    <div
                      key={r.id}
                      className={`p-3.5 rounded-2xl space-y-1 leading-relaxed ${
                        r.isInternalNote
                          ? 'bg-amber-500/10 border border-amber-500/30'
                          : r.senderRole === 'CLIENT'
                          ? 'bg-ivory-100 dark:bg-obsidian-800 border border-ivory-300 dark:border-obsidian-700'
                          : 'bg-gold-500/15 border border-gold-500/30 ml-6'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className={r.isInternalNote ? 'text-amber-600' : r.senderRole === 'CLIENT' ? 'text-slate-700 dark:text-slate-300' : 'text-gold-700 dark:text-gold-400'}>
                          {r.isInternalNote ? '🔒 Internal Staff Note' : r.senderName}
                        </span>
                        <span className="text-slate-400 font-mono">{new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-slate-800 dark:text-slate-200 text-xs">{r.message}</p>
                    </div>
                  ))}
                </div>

                {/* Reply Composer */}
                <form onSubmit={handleSendReply} className="space-y-3 pt-3 border-t border-ivory-200 dark:border-obsidian-800">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Reply to Patron</span>
                    <label className="flex items-center space-x-1.5 cursor-pointer text-slate-500">
                      <input
                        type="checkbox"
                        checked={isInternalNote}
                        onChange={(e) => setIsInternalNote(e.target.checked)}
                        className="rounded text-gold-500 focus:ring-gold-500"
                      />
                      <span>Internal staff note only</span>
                    </label>
                  </div>

                  <textarea
                    rows={3}
                    required
                    placeholder={isInternalNote ? 'Write private staff note...' : 'Type response to client...'}
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="w-full rounded-2xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-50 dark:bg-obsidian-850 p-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-gold-500"
                  />

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isReplying || !replyMessage.trim()}
                      className="flex items-center space-x-2 rounded-xl bg-gold-500 hover:bg-gold-400 px-5 py-2 text-xs font-bold uppercase tracking-wider text-obsidian-950 transition disabled:opacity-50"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>{isReplying ? 'Sending...' : isInternalNote ? 'Save Internal Note' : 'Send Response'}</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-ivory-400 dark:border-obsidian-750 p-12 text-center text-slate-400">
                Select a ticket from the left to view the thread and respond.
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
