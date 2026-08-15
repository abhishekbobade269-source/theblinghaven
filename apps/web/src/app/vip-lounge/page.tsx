'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import { useCurrency } from '@/context/CurrencyContext';
import {
  VipMemberDto,
  SecretVaultDropDto,
  VipChatMessageDto,
} from '@theblinghaven/shared';
import {
  Crown,
  Lock,
  KeyRound,
  Sparkles,
  ShieldCheck,
  Send,
  Building,
  CheckCircle2,
  Clock,
  Gem,
  Coins,
  MessageSquare,
  LogOut,
  ChevronRight,
  ArrowRight,
  PhoneCall,
  Flame,
  Award,
} from 'lucide-react';

const DEMO_KEYS = [
  { key: 'BLING-VIP-TORONTO-2026', label: 'Baroness Charlotte (Toronto Black Tier)', salon: 'Toronto' },
  { key: 'BLING-VIP-LONDON-2026', label: 'Lord Cavendish (London Royal Tier)', salon: 'London' },
  { key: 'BLING-VIP-DUBAI-2026', label: 'Princess Noor (Dubai Patron)', salon: 'Dubai' },
];

export default function VipLoungePage() {
  const { formatPrice } = useCurrency();

  const [invitationKey, setInvitationKey] = useState('');
  const [member, setMember] = useState<VipMemberDto | null>(null);
  const [drops, setDrops] = useState<SecretVaultDropDto[]>([]);
  const [chatMessages, setChatMessages] = useState<VipChatMessageDto[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState<string | null>(null);

  // Restore saved VIP session
  useEffect(() => {
    try {
      const saved = localStorage.getItem('theblinghaven_vip_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        setMember(parsed);
      }
    } catch {}
  }, []);

  // Fetch Secret Drops and Chat when member is logged in
  useEffect(() => {
    if (member) {
      fetchDrops();
      fetchChat(member.email);
      const interval = setInterval(() => fetchChat(member.email), 5000);
      return () => clearInterval(interval);
    }
  }, [member]);

  const fetchDrops = async () => {
    try {
      const res = await apiRequest<any>('/vip/secret-drops');
      const list = Array.isArray(res) ? res : res?.data || [];
      setDrops(list);
    } catch (e) {
      console.error('Failed to load secret drops:', e);
    }
  };

  const fetchChat = async (email: string) => {
    try {
      const res = await apiRequest<any>(`/vip/chat/history/${encodeURIComponent(email)}`);
      const list = Array.isArray(res) ? res : res?.data || [];
      setChatMessages(list);
    } catch (e) {
      console.error('Failed to load chat:', e);
    }
  };

  const handleAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitationKey.trim()) return;

    setIsLoading(true);
    try {
      const res = await apiRequest<any>('/vip/authenticate', {
        method: 'POST',
        data: { invitationKey: invitationKey.trim().toUpperCase() },
      });
      const data = res?.data || res;
      setMember(data);
      localStorage.setItem('theblinghaven_vip_session', JSON.stringify(data));
    } catch (e: any) {
      alert(e.message || 'Invalid or expired VIP invitation key.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setMember(null);
    localStorage.removeItem('theblinghaven_vip_session');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !member) return;

    setIsSending(true);
    try {
      await apiRequest<any>('/vip/chat/send', {
        method: 'POST',
        data: {
          clientEmail: member.email,
          clientName: member.name,
          message: messageInput.trim(),
          salonLocation: member.preferredSalon,
        },
      });
      setMessageInput('');
      fetchChat(member.email);
    } catch (e: any) {
      alert(e.message || 'Failed to dispatch message.');
    } finally {
      setIsSending(false);
    }
  };

  const handleReserveDrop = async (drop: SecretVaultDropDto) => {
    if (!member) return;
    try {
      await apiRequest<any>('/vip/reserve-drop', {
        method: 'POST',
        data: {
          clientEmail: member.email,
          clientName: member.name,
          dropId: drop.id,
          preferredSalon: member.preferredSalon,
        },
      });
      setReservationSuccess(drop.title);
      fetchDrops();
      fetchChat(member.email);
      setTimeout(() => setReservationSuccess(null), 5000);
    } catch (e: any) {
      alert(e.message || 'Failed to place vault reservation.');
    }
  };

  // -------------------------------------------------------------
  // VIEW 1: VIP SECURITY GATE
  // -------------------------------------------------------------
  if (!member) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 sm:py-20 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1 text-xs font-mono tracking-widest text-gold-700 dark:text-gold-400 uppercase font-bold">
            <Crown className="h-4 w-4" />
            <span>Private Members Inner Circle</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
            The Bling Haven VIP Member Lounge
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Access to our unreleased Secret Vault 1-of-1 masterworks and direct private director consultations is reserved for registered patrons.
          </p>
        </div>

        <form
          onSubmit={handleAuthenticate}
          className="rounded-3xl border border-slate-200 dark:border-gold-500/40 bg-white dark:bg-[#0E0E14] p-6 sm:p-8 shadow-2xl space-y-6 text-xs font-mono"
        >
          <div className="space-y-2">
            <label className="block font-serif text-sm font-bold text-slate-900 dark:text-slate-200">
              Enter Your Private VIP Invitation Passcode Key
            </label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gold-600 dark:text-gold-400" />
              <input
                type="text"
                required
                placeholder="BLING-VIP-TORONTO-2026"
                value={invitationKey}
                onChange={(e) => setInvitationKey(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 dark:border-gold-500/40 bg-slate-50 dark:bg-white/5 pl-11 pr-4 py-3 text-sm font-mono font-bold tracking-wider text-slate-900 dark:text-gold-300 placeholder-slate-400 focus:outline-none focus:border-gold-500 uppercase transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-2xl bg-gold-500 hover:bg-gold-400 py-3.5 text-xs font-bold uppercase tracking-widest text-obsidian-950 transition flex items-center justify-center space-x-2 shadow-xl"
          >
            <Lock className="h-4 w-4" />
            <span>{isLoading ? 'Authenticating Security Gate...' : 'Unlock Private Lounge'}</span>
          </button>

          {/* Demo Passcode Helper */}
          <div className="pt-4 border-t border-slate-200 dark:border-gold-500/20 space-y-2 text-center">
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block uppercase font-bold">
              Registered Demo Invitation Keys
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {DEMO_KEYS.map((d) => (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => setInvitationKey(d.key)}
                  className="rounded-xl border border-slate-200 dark:border-gold-500/30 bg-slate-50 dark:bg-white/5 px-2.5 py-1 text-[10px] font-mono text-gold-700 dark:text-gold-400 hover:bg-gold-500 hover:text-obsidian-950 transition font-bold"
                >
                  {d.label.split(' ')[0]} ({d.salon})
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: AUTHENTICATED VIP LOUNGE & SECRET VAULT
  // -------------------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-10 sm:space-y-12">
      {/* VIP Member Top Banner */}
      <div className="rounded-3xl border border-slate-200 dark:border-gold-500/40 bg-white dark:bg-[#0E0E14] p-6 sm:p-8 shadow-2xl relative overflow-hidden text-slate-900 dark:text-slate-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="rounded-full bg-gold-500 text-obsidian-950 px-3 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider">
                {member.tier.replace(/_/g, ' ')}
              </span>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">✓ Security Key Active</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-gold-300">
              Welcome, {member.name}
            </h1>
            <p className="font-mono text-xs text-slate-600 dark:text-slate-400">
              Dedicated Director: <strong className="text-slate-900 dark:text-slate-200">{member.assignedAdvisor}</strong> • {member.preferredSalon}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right font-mono text-xs hidden sm:block">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase block font-bold">Lifetime Acquisitions</span>
              <strong className="text-gold-700 dark:text-gold-400 text-base">CAD ${member.totalSpendCad.toLocaleString()}</strong>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 rounded-xl border border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 px-4 py-2 text-xs font-mono text-slate-700 dark:text-slate-300 transition"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Exit Lounge</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reservation Success Banner */}
      {reservationSuccess && (
        <div className="rounded-2xl border border-emerald-500/50 bg-emerald-50 dark:bg-emerald-950/40 p-4 text-emerald-800 dark:text-emerald-400 text-xs font-mono flex items-center space-x-3">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <div>
            <strong>Acquisition Hold Confirmed:</strong> You have placed a private allocation hold on &ldquo;{reservationSuccess}&rdquo;. Your advisor has received your request in the private channel.
          </div>
        </div>
      )}

      {/* Main Grid: Secret Vault Drops & 1-on-1 Live Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Secret Vault Drops Showcase */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-gold-500/20 pb-3">
            <div>
              <div className="flex items-center space-x-2 text-gold-700 dark:text-gold-400 font-mono text-xs uppercase font-bold">
                <Lock className="h-4 w-4" />
                <span>Secret Vault 1-of-1 Masterworks</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-slate-100">
                Unreleased Reserve Drops
              </h2>
            </div>
            <span className="rounded-full bg-gold-500/10 border border-gold-500/30 px-3 py-1 font-mono text-[10px] text-gold-700 dark:text-gold-400 font-bold">
              {drops.length} Creations Available
            </span>
          </div>

          <div className="space-y-6">
            {drops.map((drop) => (
              <div
                key={drop.id}
                className="rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-[#0E0E14] p-6 shadow-xl space-y-5 text-xs text-slate-900 dark:text-slate-100 relative overflow-hidden"
              >
                <div className="relative h-64 rounded-2xl bg-slate-100 dark:bg-obsidian-950 overflow-hidden border border-slate-200 dark:border-white/10">
                  <img
                    src={drop.primaryImageUrl}
                    alt={drop.title}
                    className="h-full w-full object-cover filter brightness-95 hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="rounded-full bg-black/80 backdrop-blur-md border border-gold-500/40 px-3 py-1 font-mono text-[10px] font-bold text-gold-400">
                      {drop.tagline}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span
                      className={`rounded-full px-3 py-1 font-mono text-[10px] font-bold ${
                        drop.allocationStatus === 'AVAILABLE'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gold-500 text-obsidian-950'
                      }`}
                    >
                      {drop.allocationStatus === 'AVAILABLE' ? '✓ Ready for Acquisition' : 'Reserved on Hold'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-gold-300">
                      {drop.title}
                    </h3>
                    <p className="font-mono text-lg font-bold text-gold-700 dark:text-gold-400">
                      {formatPrice(Math.round(drop.priceCad / 1.3872))}
                    </p>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light font-sans">
                    {drop.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-mono text-[11px]">
                  <div>
                    <span className="text-gold-700 dark:text-gold-400 font-bold block uppercase text-[10px]">Gemological Composition</span>
                    <span className="text-slate-700 dark:text-slate-300">{drop.gemstoneDetails}</span>
                  </div>
                  <div>
                    <span className="text-gold-700 dark:text-gold-400 font-bold block uppercase text-[10px]">Metallurgy & Hallmarking</span>
                    <span className="text-slate-700 dark:text-slate-300">{drop.metalDetails}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 flex items-center space-x-1.5 font-bold">
                    <Building className="h-3.5 w-3.5 text-gold-600" />
                    <span>Vault Location: {drop.vaultLocation}</span>
                  </span>

                  <button
                    onClick={() => handleReserveDrop(drop)}
                    disabled={drop.allocationStatus !== 'AVAILABLE'}
                    className={`w-full sm:w-auto px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition shadow-lg ${
                      drop.allocationStatus === 'AVAILABLE'
                        ? 'bg-gold-500 hover:bg-gold-400 text-obsidian-950'
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {drop.allocationStatus === 'AVAILABLE'
                      ? 'Place Acquisition Hold & Viewing'
                      : 'Allocation Reserved'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 1-on-1 Private Advisor Live Chat */}
        <div className="lg:col-span-5 space-y-4 sticky top-24">
          <div className="rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-[#0E0E14] p-6 shadow-xl space-y-4 text-xs">
            <div className="border-b border-slate-200 dark:border-gold-500/20 pb-3 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-1.5 text-gold-700 dark:text-gold-400 font-mono text-[10px] uppercase font-bold">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Direct Private Channel</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">
                  {member.assignedAdvisor}
                </h3>
              </div>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" title="Advisor Online" />
            </div>

            {/* Chat Message Stream */}
            <div className="h-80 overflow-y-auto space-y-3 p-3 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 font-mono">
              {chatMessages.length === 0 ? (
                <div className="text-center py-16 space-y-2">
                  <MessageSquare className="h-8 w-8 text-gold-500/40 mx-auto" />
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-light">
                    Start a private conversation with your dedicated jewelry director.
                  </p>
                </div>
              ) : (
                chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.senderRole === 'CLIENT' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 text-[11px] space-y-1 ${
                        msg.senderRole === 'CLIENT'
                          ? 'bg-gold-500 text-obsidian-950 font-medium'
                          : 'bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[9px] opacity-75 gap-2">
                        <strong className="uppercase">{msg.senderName}</strong>
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="leading-relaxed font-sans">{msg.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input Composer */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Inquire with your jewelry director..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 rounded-2xl border border-slate-300 dark:border-gold-500/30 bg-slate-50 dark:bg-white/5 px-4 py-3 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-gold-500"
              />
              <button
                type="submit"
                disabled={isSending}
                className="rounded-2xl bg-gold-500 hover:bg-gold-400 px-5 py-3 text-xs font-bold uppercase tracking-wider text-obsidian-950 transition flex items-center justify-center shadow-md"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

            <div className="p-3 rounded-2xl bg-gold-500/10 border border-gold-500/20 text-[10px] font-mono text-gold-800 dark:text-gold-300 space-y-1">
              <p>📍 Salon Suite: {member.preferredSalon}</p>
              <p>🔒 End-to-End Encrypted Private Consultation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
