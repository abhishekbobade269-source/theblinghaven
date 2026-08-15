'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { apiRequest } from '@/lib/api';
import {
  VipMemberDto,
  SecretVaultDropDto,
  VipChatMessageDto,
} from '@theblinghaven/shared';
import {
  Crown,
  Lock,
  Sparkles,
  Search,
  Plus,
  Send,
  UserCheck,
  Building,
  KeyRound,
  DollarSign,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Gem,
  MessageSquare,
  ChevronRight,
  Trash2,
  X,
} from 'lucide-react';

export default function VipAdminPage() {
  const [members, setMembers] = useState<VipMemberDto[]>([]);
  const [drops, setDrops] = useState<SecretVaultDropDto[]>([]);
  const [activeTab, setActiveTab] = useState<'MEMBERS' | 'DROPS' | 'CHAT'>('MEMBERS');
  const [isLoading, setIsLoading] = useState(true);

  // Chat State
  const [selectedClientEmail, setSelectedClientEmail] = useState<string>('c.rothschild@toronto-estates.ca');
  const [chatMessages, setChatMessages] = useState<VipChatMessageDto[]>([]);
  const [replyText, setReplyText] = useState('');
  const [advisorName, setAdvisorName] = useState('Lord Alistair Sterling (Senior Director)');
  const [isSendingReply, setIsSendingReply] = useState(false);

  // Mint Drop Modal
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [dropSku, setDropSku] = useState('');
  const [dropTitle, setDropTitle] = useState('');
  const [dropTagline, setDropTagline] = useState('1-OF-1 MAISON RESERVE VAULT PIECE');
  const [dropDescription, setDropDescription] = useState('');
  const [dropGemstones, setDropGemstones] = useState('');
  const [dropMetals, setDropMetals] = useState('');
  const [dropPriceCad, setDropPriceCad] = useState<number>(350000);
  const [dropLocation, setDropLocation] = useState('Toronto Reserve Vault (Safe Room 4)');
  const [dropTier, setDropTier] = useState('BLACK_TIER_INNER_CIRCLE');
  const [dropImageUrl, setDropImageUrl] = useState('https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80');
  const [isMinting, setIsMinting] = useState(false);

  const fetchVipData = async () => {
    setIsLoading(true);
    try {
      const [mRes, dRes] = await Promise.all([
        apiRequest<any>('/admin/vip/members'),
        apiRequest<any>('/vip/secret-drops'),
      ]);
      const mList = Array.isArray(mRes) ? mRes : mRes?.data || [];
      const dList = Array.isArray(dRes) ? dRes : dRes?.data || [];
      setMembers(mList);
      setDrops(dList);
    } catch (e) {
      console.error('Failed to load VIP data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChat = async (email: string) => {
    try {
      const res = await apiRequest<any>(`/vip/chat/history/${encodeURIComponent(email)}`);
      const list = Array.isArray(res) ? res : res?.data || [];
      setChatMessages(list);
    } catch (e) {
      console.error('Failed to load chat history:', e);
    }
  };

  useEffect(() => {
    fetchVipData();
  }, []);

  useEffect(() => {
    if (selectedClientEmail) {
      fetchChat(selectedClientEmail);
    }
  }, [selectedClientEmail]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setIsSendingReply(true);
    try {
      await apiRequest<any>('/admin/vip/chat/reply', {
        method: 'POST',
        data: {
          clientEmail: selectedClientEmail,
          advisorName,
          message: replyText.trim(),
        },
      });
      setReplyText('');
      fetchChat(selectedClientEmail);
    } catch (e: any) {
      alert(e.message || 'Failed to dispatch advisor message.');
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleMintDrop = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsMinting(true);
    try {
      await apiRequest<any>('/admin/vip/secret-drops', {
        method: 'POST',
        data: {
          sku: dropSku,
          title: dropTitle,
          tagline: dropTagline,
          description: dropDescription,
          gemstoneDetails: dropGemstones,
          metalDetails: dropMetals,
          priceCad: dropPriceCad,
          vaultLocation: dropLocation,
          accessTierRequired: dropTier,
          primaryImageUrl: dropImageUrl,
        },
      });
      alert('Secret Vault 1-of-1 Drop scheduled and released to VIP Lounge!');
      setIsMintModalOpen(false);
      fetchVipData();
    } catch (e: any) {
      alert(e.message || 'Failed to mint secret drop.');
    } finally {
      setIsMinting(false);
    }
  };

  const handleDeleteMember = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove VIP Member ${name}?`)) return;
    try {
      await apiRequest<any>(`/admin/vip/members/${id}`, { method: 'DELETE' });
      fetchVipData();
    } catch (e: any) {
      alert(e.message || 'Failed to delete member.');
    }
  };

  const handleDeleteDrop = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete Secret Drop ${title}?`)) return;
    try {
      await apiRequest<any>(`/admin/vip/secret-drops/${id}`, { method: 'DELETE' });
      fetchVipData();
    } catch (e: any) {
      alert(e.message || 'Failed to delete secret drop.');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-ivory-400 dark:border-obsidian-750 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-1">
              <Crown className="h-4 w-4" />
              <span>High-Net-Worth Clienteling & Secret Vault Allocations</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-slate-100">
              VIP Member Lounge & Secret Drops Desk
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Oversee Black Tier patron accounts, release unlisted 1-of-1 vault creations, and communicate via private direct channels.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMintModalOpen(true)}
              className="flex items-center space-x-2 rounded-xl bg-gold-500 hover:bg-gold-400 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-obsidian-950 transition shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Release Secret Vault Drop</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-2xl border border-ivory-400 dark:border-obsidian-700 bg-white dark:bg-obsidian-900 p-1 w-fit">
          <button
            onClick={() => setActiveTab('MEMBERS')}
            className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'MEMBERS'
                ? 'bg-gold-500 text-obsidian-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-gold-400'
            }`}
          >
            <UserCheck className="h-4 w-4" />
            <span>VIP Members & Spending Tiers ({members.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('DROPS')}
            className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'DROPS'
                ? 'bg-gold-500 text-obsidian-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-gold-400'
            }`}
          >
            <Lock className="h-4 w-4" />
            <span>Secret Vault Drops ({drops.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('CHAT')}
            className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'CHAT'
                ? 'bg-gold-500 text-obsidian-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-gold-400'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Private Advisor Chat Channel</span>
          </button>
        </div>

        {/* TAB 1: VIP Members Directory */}
        {activeTab === 'MEMBERS' && (
          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-ivory-300 dark:border-obsidian-800 text-slate-500 dark:text-slate-400 text-[10px] uppercase bg-ivory-50 dark:bg-obsidian-850">
                    <th className="py-3 px-4">Patron Name & Contact</th>
                    <th className="py-3 px-4">Invitation Passcode Key</th>
                    <th className="py-3 px-4">Patron Tier</th>
                    <th className="py-3 px-4">Lifetime Spend (CAD)</th>
                    <th className="py-3 px-4">Assigned Director & Salon</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-200 dark:divide-obsidian-800">
                  {members.map((m) => (
                    <tr key={m.id} className="hover:bg-ivory-100 dark:hover:bg-obsidian-850 transition">
                      <td className="py-4 px-4">
                        <span className="font-serif font-bold text-slate-900 dark:text-slate-100 block">
                          {m.name}
                        </span>
                        <span className="text-[10px] text-slate-400">{m.email}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-gold-500/10 border border-gold-500/30 text-gold-700 dark:text-gold-400 px-2.5 py-1 rounded-lg font-bold text-[11px]">
                          {m.invitationKey}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            m.tier === 'BLACK_TIER_INNER_CIRCLE'
                              ? 'bg-slate-900 text-gold-400 border border-gold-500/40'
                              : m.tier === 'ROYAL_TIER'
                              ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300'
                              : 'bg-gold-500/20 text-gold-700 dark:text-gold-400'
                          }`}
                        >
                          {m.tier.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-900 dark:text-slate-100">
                        CAD ${m.totalSpendCad.toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-serif text-slate-800 dark:text-slate-200 block truncate max-w-[220px]">
                          {m.assignedAdvisor}
                        </span>
                        <span className="text-[10px] text-slate-400 block">{m.preferredSalon}</span>
                      </td>
                      <td className="py-4 px-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedClientEmail(m.email);
                            setActiveTab('CHAT');
                          }}
                          className="rounded-lg bg-gold-500 text-obsidian-950 px-3 py-1 text-[11px] font-bold hover:bg-gold-400 transition"
                        >
                          Open Channel
                        </button>
                        <button
                          onClick={() => handleDeleteMember(m.id, m.name)}
                          className="rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 p-1.5 text-rose-500 transition inline-flex items-center"
                          title="Delete Member"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Secret Vault Drops */}
        {activeTab === 'DROPS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drops.map((d) => (
              <div
                key={d.id}
                className="rounded-3xl border-2 border-gold-500/30 bg-white dark:bg-obsidian-900 p-6 shadow-xl space-y-4 text-xs"
              >
                <div className="relative h-56 rounded-2xl bg-obsidian-950 overflow-hidden border border-ivory-300 dark:border-obsidian-800">
                  <img
                    src={d.primaryImageUrl}
                    alt={d.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="rounded-full bg-black/75 backdrop-blur-md border border-gold-500/40 px-2.5 py-0.5 font-mono text-[10px] font-bold text-gold-400">
                      {d.tagline}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold ${
                        d.allocationStatus === 'AVAILABLE'
                          ? 'bg-emerald-500/80 text-white'
                          : 'bg-gold-500 text-obsidian-950'
                      }`}
                    >
                      {d.allocationStatus.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
                    {d.title}
                  </h3>
                  <p className="font-mono text-sm font-bold text-gold-600 dark:text-gold-400 mt-1">
                    CAD ${d.priceCad.toLocaleString()}
                  </p>
                </div>

                <div className="space-y-1.5 p-3 rounded-2xl bg-ivory-100 dark:bg-obsidian-850 font-mono text-[11px] border border-ivory-300 dark:border-obsidian-800">
                  <div className="text-slate-600 dark:text-slate-300">
                    <strong className="text-gold-600 dark:text-gold-400">Gemstone:</strong> {d.gemstoneDetails}
                  </div>
                  <div className="text-slate-600 dark:text-slate-300">
                    <strong className="text-gold-600 dark:text-gold-400">Vault:</strong> {d.vaultLocation}
                  </div>
                  <div className="text-slate-600 dark:text-slate-300">
                    <strong className="text-gold-600 dark:text-gold-400">Required Tier:</strong> {d.accessTierRequired.replace(/_/g, ' ')}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => handleDeleteDrop(d.id, d.title)}
                    className="flex items-center space-x-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 text-xs font-bold text-rose-500 transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete Drop</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: 1-on-1 Private Advisor Live Chat Console */}
        {activeTab === 'CHAT' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm">
            {/* Left Column: Client Selector */}
            <div className="lg:col-span-4 border-r border-ivory-300 dark:border-obsidian-800 pr-4 space-y-2">
              <h3 className="font-serif text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
                VIP Private Channels
              </h3>
              <div className="space-y-2">
                {members.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedClientEmail(m.email)}
                    className={`w-full p-3 rounded-2xl text-left transition flex items-center justify-between ${
                      selectedClientEmail === m.email
                        ? 'bg-gold-500/15 border border-gold-500 text-slate-900 dark:text-slate-100'
                        : 'border border-transparent hover:bg-ivory-100 dark:hover:bg-obsidian-850'
                    }`}
                  >
                    <div>
                      <span className="font-serif font-bold text-xs block">{m.name}</span>
                      <span className="font-mono text-[10px] text-slate-400">{m.email}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Chat History & Reply Composer */}
            <div className="lg:col-span-8 space-y-4 flex flex-col justify-between">
              <div className="border-b border-ivory-300 dark:border-obsidian-800 pb-3 flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-sm font-bold text-slate-900 dark:text-slate-100">
                    Direct Consultation Channel: {selectedClientEmail}
                  </h4>
                  <span className="text-[10px] font-mono text-gold-600 dark:text-gold-400">
                    Active Director: {advisorName}
                  </span>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="h-80 overflow-y-auto space-y-3 p-4 rounded-2xl bg-ivory-50 dark:bg-obsidian-950 border border-ivory-300 dark:border-obsidian-800">
                {chatMessages.length === 0 ? (
                  <p className="text-center text-xs text-slate-400 py-12">No messages in this channel yet.</p>
                ) : (
                  chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.senderRole === 'ADVISOR' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-lg rounded-2xl p-3 text-xs space-y-1 ${
                          msg.senderRole === 'ADVISOR'
                            ? 'bg-gold-500 text-obsidian-950 font-medium'
                            : 'bg-white dark:bg-obsidian-850 border border-ivory-300 dark:border-obsidian-750 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <div className="flex justify-between items-center text-[9px] font-mono opacity-80 gap-3">
                          <strong className="uppercase">{msg.senderName}</strong>
                          <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="leading-relaxed">{msg.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Reply Input Form */}
              <form onSubmit={handleSendReply} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Type official director response with viewing availability..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 rounded-2xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-50 dark:bg-obsidian-850 px-4 py-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isSendingReply}
                  className="rounded-2xl bg-gold-500 hover:bg-gold-400 px-6 py-3 text-xs font-bold uppercase tracking-wider text-obsidian-950 transition flex items-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mint Secret Drop Modal */}
        {isMintModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
            <div className="w-full max-w-xl rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-ivory-300 dark:border-obsidian-800 pb-3">
                <h3 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-gold-500" />
                  <span>Release Secret Vault 1-of-1 Drop</span>
                </h3>
                <button onClick={() => setIsMintModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleMintDrop} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">Vault SKU</label>
                    <input type="text" required placeholder="TBH-VAULT-004" value={dropSku} onChange={(e) => setDropSku(e.target.value)} className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-50 dark:bg-obsidian-850 p-2 font-mono" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">Masterpiece Title</label>
                    <input type="text" required placeholder="The Royal Golconda Solitaire" value={dropTitle} onChange={(e) => setDropTitle(e.target.value)} className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-50 dark:bg-obsidian-850 p-2" />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">Curator Description</label>
                  <textarea rows={2} required placeholder="Historical provenance and gemstone details..." value={dropDescription} onChange={(e) => setDropDescription(e.target.value)} className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-50 dark:bg-obsidian-850 p-2" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">Gemstone Breakdown</label>
                    <input type="text" required placeholder="10.5ct D-FL Golconda Type IIa" value={dropGemstones} onChange={(e) => setDropGemstones(e.target.value)} className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-50 dark:bg-obsidian-850 p-2 font-mono" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">Price (CAD)</label>
                    <input type="number" required value={dropPriceCad} onChange={(e) => setDropPriceCad(parseFloat(e.target.value) || 0)} className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-50 dark:bg-obsidian-850 p-2 font-mono" />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t border-ivory-300 dark:border-obsidian-800">
                  <button type="button" onClick={() => setIsMintModalOpen(false)} className="rounded-xl border border-ivory-300 dark:border-obsidian-700 px-4 py-2 text-slate-600">Cancel</button>
                  <button type="submit" disabled={isMinting} className="rounded-xl bg-gold-500 px-6 py-2 font-bold uppercase tracking-wider text-obsidian-950 hover:bg-gold-400 transition">{isMinting ? 'Releasing...' : 'Release Drop'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
