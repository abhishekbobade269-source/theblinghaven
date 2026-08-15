'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import {
  SupportTicketDto,
  TicketCategory,
  TicketPriority,
} from '@theblinghaven/shared';
import {
  LifeBuoy,
  Search,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Package,
  Sparkles,
  User,
  Mail,
  Phone,
  ArrowRight,
  Headphones,
  Building,
  HelpCircle,
  Copy,
  Check,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';

export default function SupportDeskPage() {
  const [activeTab, setActiveTab] = useState<'RAISE' | 'TRACK'>('RAISE');

  // Submit Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [category, setCategory] = useState<TicketCategory>('PRODUCT_INQUIRY');
  const [priority, setPriority] = useState<TicketPriority>('STANDARD');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [relatedProductSku, setRelatedProductSku] = useState('');
  const [relatedOrderNumber, setRelatedOrderNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<SupportTicketDto | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Track State
  const [lookupTicketNumber, setLookupTicketNumber] = useState('');
  const [trackedTicket, setTrackedTicket] = useState<SupportTicketDto | null>(null);
  const [clientReply, setClientReply] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Auto-populate SKU from URL if ?sku=TBH-RNG-001
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const sku = params.get('sku');
      const order = params.get('order');
      const tkt = params.get('ticketNumber');
      if (sku) {
        setRelatedProductSku(sku);
        setSubject(`Inquiry regarding creation SKU: ${sku}`);
      }
      if (order) {
        setRelatedOrderNumber(order);
        setCategory('ORDER_SHIPMENT');
        setSubject(`Inquiry on Insured Order #${order}`);
      }
      if (tkt) {
        setActiveTab('TRACK');
        setLookupTicketNumber(tkt);
        handleLookupTicket(tkt);
      }
    }
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await apiRequest<any>('/support/tickets', {
        method: 'POST',
        data: {
          customerName,
          customerEmail,
          customerPhone: customerPhone || undefined,
          category,
          priority,
          subject,
          description,
          relatedProductSku: relatedProductSku || undefined,
          relatedOrderNumber: relatedOrderNumber || undefined,
        },
      });
      const data = res?.data || res;
      setCreatedTicket(data);
    } catch (e: any) {
      setSubmitError(typeof e === 'string' ? e : e?.message || 'Failed to submit support ticket.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLookupTicket = async (overrideNumber?: string) => {
    const num = overrideNumber || lookupTicketNumber;
    if (!num.trim()) return;

    setIsSearching(true);
    setLookupError(null);
    try {
      const res = await apiRequest<any>(`/support/tickets/track/${encodeURIComponent(num.trim())}`);
      const data = res?.data || res;
      setTrackedTicket(data);
    } catch (e: any) {
      setLookupError(typeof e === 'string' ? e : e?.message || 'Ticket not found. Please verify the ticket number.');
      setTrackedTicket(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendClientReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackedTicket || !clientReply.trim()) return;

    setIsReplying(true);
    try {
      const res = await apiRequest<any>(`/support/tickets/${trackedTicket.ticketNumber}/reply`, {
        method: 'POST',
        data: {
          senderRole: 'CLIENT',
          senderName: trackedTicket.customerName,
          message: clientReply,
        },
      });
      const updated = res?.data || res;
      setTrackedTicket(updated);
      setClientReply('');
    } catch (e: any) {
      alert(typeof e === 'string' ? e : e?.message || 'Failed to send reply.');
    } finally {
      setIsReplying(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-10 sm:py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2.5">
          <div className="inline-flex items-center space-x-2 rounded-full bg-gold-500/10 border border-gold-500/30 px-4 py-1.5 text-xs font-mono font-bold text-gold-700 dark:text-gold-400">
            <LifeBuoy className="h-4 w-4" />
            <span>The Bling Haven • Customer Support Desk</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
            Customer Help & Support
          </h1>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Get help with your jewellery orders, tracking, ring sizing, certificates, or custom designs.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center">
          <div className="inline-flex rounded-2xl bg-white dark:bg-[#0E0E14] p-1.5 border border-slate-200 dark:border-gold-500/20 shadow-sm font-mono">
            <button
              onClick={() => setActiveTab('RAISE')}
              className={`rounded-xl px-6 py-2.5 text-xs font-bold transition flex items-center space-x-2 ${
                activeTab === 'RAISE'
                  ? 'bg-gold-500 text-obsidian-950 shadow-md'
                  : 'text-slate-700 dark:text-slate-400 hover:text-gold-600'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>Submit New Ticket</span>
            </button>

            <button
              onClick={() => setActiveTab('TRACK')}
              className={`rounded-xl px-6 py-2.5 text-xs font-bold transition flex items-center space-x-2 ${
                activeTab === 'TRACK'
                  ? 'bg-gold-500 text-obsidian-950 shadow-md'
                  : 'text-slate-700 dark:text-slate-400 hover:text-gold-600'
              }`}
            >
              <Search className="h-4 w-4" />
              <span>Track Existing Ticket</span>
            </button>
          </div>
        </div>

        {/* TAB 1: RAISE A TICKET */}
        {activeTab === 'RAISE' && (
          <div>
            {createdTicket ? (
              <div className="rounded-3xl border border-gold-500/40 bg-white dark:bg-[#0E0E14] p-8 sm:p-12 text-center space-y-5 shadow-2xl animate-in zoom-in-95">
                <div className="h-16 w-16 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold uppercase text-gold-700 dark:text-gold-400">
                    Ticket Successfully Created
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                    #{createdTicket.ticketNumber}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                    We have received your support inquiry. Our team will review and reply within 4 hours.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-gold-500/30 max-w-md mx-auto text-left space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Subject:</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{createdTicket.subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status:</span>
                    <span className="font-bold text-gold-700 dark:text-gold-400">{createdTicket.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Contact:</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{createdTicket.customerEmail}</span>
                  </div>
                </div>

                <div className="flex justify-center gap-3 pt-2 font-mono">
                  <button
                    onClick={() => {
                      setLookupTicketNumber(createdTicket.ticketNumber);
                      setTrackedTicket(createdTicket);
                      setActiveTab('TRACK');
                    }}
                    className="rounded-2xl bg-gold-500 hover:bg-gold-400 px-6 py-3 text-xs font-bold text-obsidian-950 uppercase tracking-wider transition shadow-md"
                  >
                    Track This Ticket
                  </button>

                  <button
                    onClick={() => {
                      setCreatedTicket(null);
                      setSubject('');
                      setDescription('');
                    }}
                    className="rounded-2xl border border-slate-300 dark:border-gold-500/30 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 px-6 py-3 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider transition"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-[#0E0E14] p-6 sm:p-10 shadow-xl space-y-6">
                <div className="border-b border-slate-100 dark:border-white/10 pb-4">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Submit a Support Request
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Please provide details regarding your inquiry for prompt assistance.
                  </p>
                </div>

                {submitError && (
                  <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-mono flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <form onSubmit={handleCreateTicket} className="space-y-4 text-xs font-mono">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Priya Sharma"
                        className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="youremail@example.com"
                        className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">
                        Inquiry Category *
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none cursor-pointer font-sans"
                      >
                        <option value="PRODUCT_INQUIRY">Jewellery Product & Sizing</option>
                        <option value="ORDER_SHIPMENT">Order Tracking & Delivery</option>
                        <option value="BESPOKE_COMMISSION">Custom Design Request</option>
                        <option value="AUTHENTICITY_VERIFICATION">Hallmark & Certificate</option>
                        <option value="RETURNS_REFUNDS">Returns & Exchange</option>
                        <option value="OTHER">General Support</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">
                        Priority Level
                      </label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as any)}
                        className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none cursor-pointer font-sans"
                      >
                        <option value="STANDARD">Standard</option>
                        <option value="HIGH">High Priority</option>
                        <option value="VIP_URGENT">Urgent Bridal / Event</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Question about Kundan Choker necklace size"
                      className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">
                      Detailed Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Please provide any relevant details, order numbers, or questions..."
                      className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none font-sans"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-2xl bg-gold-500 hover:bg-gold-400 px-8 py-3 text-xs font-bold uppercase tracking-wider text-obsidian-950 transition shadow-md flex items-center space-x-2 font-mono"
                    >
                      <span>{isSubmitting ? 'Submitting...' : 'Submit Support Ticket'}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TRACK EXISTING TICKET */}
        {activeTab === 'TRACK' && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-[#0E0E14] p-6 sm:p-8 shadow-xl space-y-4">
              <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-slate-100">
                Track Ticket Status
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enter your ticket reference number (e.g. TBH-TKT-2026-4572) to view updates.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={lookupTicketNumber}
                    onChange={(e) => setLookupTicketNumber(e.target.value)}
                    placeholder="e.g. TBH-TKT-2026-4572"
                    className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-obsidian-950 py-3 pl-10 pr-3 text-xs font-mono text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none uppercase font-bold"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleLookupTicket()}
                  disabled={isSearching || !lookupTicketNumber.trim()}
                  className="rounded-2xl bg-gold-500 hover:bg-gold-400 px-8 py-3 text-xs font-mono font-bold uppercase tracking-wider text-obsidian-950 transition shadow-md shrink-0"
                >
                  {isSearching ? 'Searching...' : 'Track Ticket'}
                </button>
              </div>

              {lookupError && (
                <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-mono flex items-center space-x-2 animate-in fade-in">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{lookupError}</span>
                </div>
              )}
            </div>

            {/* Tracked Ticket Details & Conversation */}
            {trackedTicket && (
              <div className="rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-[#0E0E14] p-6 sm:p-8 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-4 font-mono">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-serif text-xl font-bold text-slate-900 dark:text-slate-100">
                        #{trackedTicket.ticketNumber}
                      </h4>
                      <span className="rounded-full bg-gold-500/20 border border-gold-500/40 px-3 py-0.5 text-[10px] font-bold text-gold-700 dark:text-gold-400">
                        {trackedTicket.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{trackedTicket.subject}</p>
                  </div>

                  <div className="text-right text-xs text-slate-400">
                    <p>Created: {new Date(trackedTicket.createdAt).toLocaleDateString()}</p>
                    <p>Priority: <span className="font-bold text-gold-600">{trackedTicket.priority}</span></p>
                  </div>
                </div>

                {/* Initial Description */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-white/5 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                    Original Inquiry:
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                    {trackedTicket.description}
                  </p>
                </div>

                {/* Conversation Thread */}
                <div className="space-y-3">
                  <span className="text-xs font-mono uppercase font-bold text-gold-700 dark:text-gold-400 block">
                    Conversation Timeline ({trackedTicket.responses?.length || 0} messages)
                  </span>

                  {trackedTicket.responses && trackedTicket.responses.length > 0 ? (
                    <div className="space-y-3">
                      {trackedTicket.responses.map((resp) => (
                        <div
                          key={resp.id}
                          className={`p-4 rounded-2xl border text-xs space-y-1 ${
                            resp.senderRole === 'SUPPORT_AGENT'
                              ? 'bg-gold-500/10 border-gold-500/30 ml-4'
                              : 'bg-slate-50 dark:bg-obsidian-950 border-slate-200 dark:border-white/10 mr-4'
                          }`}
                        >
                          <div className="flex items-center justify-between font-mono text-[10px]">
                            <span className="font-bold text-gold-700 dark:text-gold-400">
                              {resp.senderRole === 'SUPPORT_AGENT' ? `🛡️ ${resp.senderName} (Support Director)` : `👤 ${resp.senderName}`}
                            </span>
                            <span className="text-slate-400">{new Date(resp.timestamp).toLocaleString()}</span>
                          </div>
                          <p className="text-slate-800 dark:text-slate-200 font-sans leading-relaxed">
                            {resp.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-mono text-slate-400 p-4 rounded-2xl bg-slate-50 dark:bg-obsidian-950">
                      No agent replies yet. Our advisory team will respond shortly.
                    </p>
                  )}
                </div>

                {/* Reply Form */}
                <form onSubmit={handleSendClientReply} className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/10 font-mono text-xs">
                  <label className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                    Add Reply to Ticket:
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={clientReply}
                    onChange={(e) => setClientReply(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none font-sans"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isReplying || !clientReply.trim()}
                      className="rounded-2xl bg-gold-500 hover:bg-gold-400 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-obsidian-950 transition shadow-md"
                    >
                      {isReplying ? 'Sending...' : 'Send Reply'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
