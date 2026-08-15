'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { apiRequest } from '@/lib/api';
import {
  LuxuryVaultDto,
  ArmoredTransferDto,
  ArmoredCarrier,
  ArmoredTransferStatus,
} from '@theblinghaven/shared';
import {
  Building,
  ShieldCheck,
  Truck,
  Plus,
  ArrowRight,
  Globe2,
  Lock,
  Coins,
  Gem,
  CheckCircle2,
  Clock,
  FileCheck,
  AlertTriangle,
  Plane,
  X,
  TrendingUp,
  Trash2,
} from 'lucide-react';

export default function VaultsAdminPage() {
  const [vaults, setVaults] = useState<LuxuryVaultDto[]>([]);
  const [transfers, setTransfers] = useState<ArmoredTransferDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dispatch Transfer Modal State
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [originVaultId, setOriginVaultId] = useState('');
  const [destinationVaultId, setDestinationVaultId] = useState('');
  const [carrierName, setCarrierName] = useState<ArmoredCarrier>('BRINKS_GLOBAL_SERVICES');
  const [insuredValueCad, setInsuredValueCad] = useState<number>(1500000);
  const [itemsCount, setItemsCount] = useState<number>(4);
  const [itemsSummary, setItemsSummary] = useState('2x 1kg LBMA 999.9 Gold Bars + 2x 4ct D-Flawless Cushion Solitaires');
  const [courierBadgeId, setCourierBadgeId] = useState('BRINKS-CAN-99104');
  const [notes, setNotes] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);

  const fetchVaultData = async () => {
    setIsLoading(true);
    try {
      const [vRes, tRes] = await Promise.all([
        apiRequest<any>('/admin/vaults'),
        apiRequest<any>('/admin/vaults/transfers'),
      ]);
      const vList = Array.isArray(vRes) ? vRes : vRes?.data || [];
      const tList = Array.isArray(tRes) ? tRes : tRes?.data || [];
      setVaults(vList);
      setTransfers(tList);
      if (vList.length >= 2) {
        setOriginVaultId(vList[0].id);
        setDestinationVaultId(vList[1].id);
      }
    } catch (e) {
      console.error('Failed to load Vault data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVaultData();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: ArmoredTransferStatus, waypoint?: string) => {
    try {
      await apiRequest<any>(`/admin/vaults/transfers/${id}/status`, {
        method: 'PUT',
        data: { transferStatus: newStatus, currentWaypoint: waypoint },
      });
      fetchVaultData();
    } catch (e: any) {
      alert(e.message || 'Status update failed.');
    }
  };

  const handleDispatchTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (originVaultId === destinationVaultId) {
      alert('Origin and destination vaults cannot be the same.');
      return;
    }

    setIsDispatching(true);
    try {
      await apiRequest<any>('/admin/vaults/transfers', {
        method: 'POST',
        data: {
          originVaultId,
          destinationVaultId,
          carrierName,
          courierBadgeId,
          insuredValueCad,
          itemsCount,
          itemsSummary,
          notes,
        },
      });
      alert('Armored transfer manifest created and security escort dispatched!');
      setIsDispatchModalOpen(false);
      fetchVaultData();
    } catch (e: any) {
      alert(e.message || 'Failed to dispatch armored transfer.');
    } finally {
      setIsDispatching(false);
    }
  };

  const handleDeleteTransfer = async (id: string, manifestNum: string) => {
    if (!confirm(`Are you sure you want to cancel / delete Armored Transfer #${manifestNum}?`)) return;
    try {
      await apiRequest(`/admin/vaults/transfers/${id}`, { method: 'DELETE' });
      fetchVaultData();
    } catch (e: any) {
      alert(e.message || 'Failed to delete transfer.');
    }
  };

  const totalGlobalAssetCad = vaults.reduce((sum, v) => sum + v.totalAssetValueCad, 0);
  const totalGlobalGoldKg = vaults.reduce((sum, v) => sum + v.goldBullionKg, 0);
  const totalGlobalDiamondsCt = vaults.reduce((sum, v) => sum + v.looseDiamondCarats, 0);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-ivory-400 dark:border-obsidian-750 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-1">
              <Building className="h-4 w-4" />
              <span>International Safe Deposit Depository & Bullion Hubs</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-slate-100">
              Multi-Vault Armored Freight Network
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Cross-border vault balances across Toronto, Vancouver, London, Dubai & Zurich with Lloyd’s insured armored transit.
            </p>
          </div>

          <button
            onClick={() => setIsDispatchModalOpen(true)}
            className="flex items-center space-x-2 rounded-xl bg-gold-500 hover:bg-gold-400 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-obsidian-950 transition shadow-sm"
          >
            <Truck className="h-4 w-4" />
            <span>Dispatch Armored Transfer</span>
          </button>
        </div>

        {/* Global Depository Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">Total Global Vault Reserves</span>
            <div className="font-serif text-2xl font-bold text-gold-600 dark:text-gold-400">
              CAD ${totalGlobalAssetCad.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-500 font-mono">5 Secured Military-Grade Vaults</span>
          </div>

          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">Physical LBMA 999.9 Gold Bullion</span>
            <div className="font-serif text-2xl font-bold text-slate-900 dark:text-slate-100">
              {totalGlobalGoldKg.toLocaleString()} Kilograms
            </div>
            <span className="text-[10px] text-gold-500 font-mono">{(totalGlobalGoldKg * 32.1507).toFixed(0)} Troy Ounces</span>
          </div>

          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">Loose Certified Diamonds in Safe</span>
            <div className="font-serif text-2xl font-bold text-slate-900 dark:text-slate-100">
              {totalGlobalDiamondsCt.toLocaleString()} Carats
            </div>
            <span className="text-[10px] text-purple-500 font-mono">GIA & IGI Master Inventory</span>
          </div>
        </div>

        {/* International Vaults Matrix */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Globe2 className="h-5 w-5 text-gold-500" />
            <span>Active International Vault Safe Deposits</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vaults.map((v) => (
              <div
                key={v.id}
                className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm space-y-4 text-xs"
              >
                <div className="flex items-center justify-between border-b border-ivory-300 dark:border-obsidian-800 pb-3">
                  <div>
                    <span className="font-serif font-bold text-sm text-slate-900 dark:text-slate-100 block">
                      {v.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      📍 {v.city}, {v.country} ({v.currencyCode})
                    </span>
                  </div>
                  {v.isMasterVault && (
                    <span className="rounded-full bg-gold-500 text-obsidian-950 px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase">
                      Master Vault (CAD)
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono text-[11px] p-3 rounded-2xl bg-ivory-50 dark:bg-obsidian-850 border border-ivory-300 dark:border-obsidian-800">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Stored Asset Value</span>
                    <strong className="text-gold-600 dark:text-gold-400">CAD ${v.totalAssetValueCad.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Gold Bullion</span>
                    <strong className="text-slate-800 dark:text-slate-200">{v.goldBullionKg} kg</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Loose Diamonds</span>
                    <strong className="text-slate-800 dark:text-slate-200">{v.looseDiamondCarats} ct</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Active Transfers</span>
                    <strong className="text-emerald-500">{v.activeTransfersCount} in transit</strong>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 font-mono line-clamp-1">
                  🔒 {v.address}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Live Armored Freight Radar & Manifests */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Truck className="h-5 w-5 text-gold-500" />
            <span>Armored Inter-Vault Transit Manifests (Lloyd’s Insured)</span>
          </h3>

          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-ivory-300 dark:border-obsidian-800 text-slate-500 dark:text-slate-400 text-[10px] uppercase bg-ivory-50 dark:bg-obsidian-850">
                    <th className="py-3 px-4">Manifest #</th>
                    <th className="py-3 px-4">Route (Origin → Destination)</th>
                    <th className="py-3 px-4">Carrier & Escort</th>
                    <th className="py-3 px-4">Insured Value (CAD)</th>
                    <th className="py-3 px-4">Transit Status & GPS Waypoint</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-200 dark:divide-obsidian-800">
                  {transfers.map((t) => (
                    <tr key={t.id} className="hover:bg-ivory-100 dark:hover:bg-obsidian-850 transition">
                      <td className="py-4 px-4 font-bold text-gold-600 dark:text-gold-400">
                        {t.manifestNumber}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-1.5 font-bold text-slate-800 dark:text-slate-200">
                          <span>{t.originVaultName.split(' ')[0]}</span>
                          <ArrowRight className="h-3 w-3 text-gold-500" />
                          <span>{t.destinationVaultName.split(' ')[0]}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block">{t.itemsCount} items: {t.itemsSummary.slice(0, 30)}...</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">
                          {t.carrierName.replace(/_/g, ' ')}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Badge: {t.courierBadgeId}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          CAD ${t.insuredValueCad.toLocaleString()}
                        </span>
                        <span className="text-[9px] text-slate-400 block">{t.insurancePolicyNumber}</span>
                      </td>
                      <td className="py-4 px-4 max-w-xs">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[9px] font-bold mb-1 ${
                            t.transferStatus === 'ARRIVED_SECURE'
                              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                              : t.transferStatus === 'CUSTOMS_PORT_INSPECTION'
                              ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                              : 'bg-gold-500/20 text-gold-700 dark:text-gold-400'
                          }`}
                        >
                          {t.transferStatus.replace(/_/g, ' ')}
                        </span>
                        <p className="text-[10px] text-slate-500 truncate">{t.currentWaypoint}</p>
                      </td>
                      <td className="py-4 px-4 text-right space-x-2">
                        <select
                          value={t.transferStatus}
                          onChange={(e) => handleUpdateStatus(t.id, e.target.value as ArmoredTransferStatus)}
                          className="rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-50 dark:bg-obsidian-800 px-2.5 py-1 text-[10px] font-bold text-gold-700 dark:text-gold-400 focus:outline-none"
                        >
                          <option value="DISPATCH_SCHEDULED">Scheduled</option>
                          <option value="ARMORED_TRANSIT">In Transit</option>
                          <option value="CUSTOMS_PORT_INSPECTION">Customs Inspection</option>
                          <option value="ARRIVED_SECURE">Arrived Secure</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>

                        <button
                          onClick={() => handleDeleteTransfer(t.id, t.manifestNumber)}
                          className="rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 p-1 text-rose-500 transition inline-flex items-center"
                          title="Delete Transfer Manifest"
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
        </div>

        {/* Dispatch Modal */}
        {isDispatchModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
            <div className="w-full max-w-xl rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-ivory-300 dark:border-obsidian-800 pb-3">
                <h3 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                  <Truck className="h-4 w-4 text-gold-500" />
                  <span>Dispatch New Armored Inter-Vault Transfer</span>
                </h3>
                <button onClick={() => setIsDispatchModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleDispatchTransfer} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">Origin Vault</label>
                    <select
                      value={originVaultId}
                      onChange={(e) => setOriginVaultId(e.target.value)}
                      className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-50 dark:bg-obsidian-850 p-2 text-slate-900 dark:text-slate-100 focus:outline-none"
                    >
                      {vaults.map((v) => (
                        <option key={v.id} value={v.id}>{v.city}: {v.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">Destination Vault</label>
                    <select
                      value={destinationVaultId}
                      onChange={(e) => setDestinationVaultId(e.target.value)}
                      className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-50 dark:bg-obsidian-850 p-2 text-slate-900 dark:text-slate-100 focus:outline-none"
                    >
                      {vaults.map((v) => (
                        <option key={v.id} value={v.id}>{v.city}: {v.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">Armored Carrier</label>
                    <select
                      value={carrierName}
                      onChange={(e) => setCarrierName(e.target.value as ArmoredCarrier)}
                      className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-50 dark:bg-obsidian-850 p-2 text-slate-900 dark:text-slate-100 focus:outline-none"
                    >
                      <option value="BRINKS_GLOBAL_SERVICES">Brinks Global Services</option>
                      <option value="MALCA_AMIT_SECURITY">Malca-Amit High-Security</option>
                      <option value="FERRARI_GROUP_ARMORED">Ferrari Group Armored</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">Insured Value (CAD)</label>
                    <input
                      type="number"
                      required
                      value={insuredValueCad}
                      onChange={(e) => setInsuredValueCad(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-50 dark:bg-obsidian-850 p-2 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">Declared High-Value Items Summary</label>
                  <input
                    type="text"
                    required
                    value={itemsSummary}
                    onChange={(e) => setItemsSummary(e.target.value)}
                    className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-ivory-50 dark:bg-obsidian-850 p-2 font-mono"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t border-ivory-300 dark:border-obsidian-800">
                  <button type="button" onClick={() => setIsDispatchModalOpen(false)} className="rounded-xl border border-ivory-300 dark:border-obsidian-700 px-4 py-2 text-slate-600">Cancel</button>
                  <button type="submit" disabled={isDispatching} className="rounded-xl bg-gold-500 px-6 py-2 font-bold uppercase tracking-wider text-obsidian-950 hover:bg-gold-400 transition">{isDispatching ? 'Authorizing Lloyd’s Binder...' : 'Authorize Armored Dispatch'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
