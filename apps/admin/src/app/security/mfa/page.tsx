'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { useAuth } from '@/lib/auth-context';
import { apiRequest } from '@/lib/api';
import { ShieldCheck, QrCode, KeyRound, CheckCircle2, AlertTriangle, Copy, Check } from 'lucide-react';
import { MfaSetupResponseDto } from '@theblinghaven/shared';

export default function MfaSetupPage() {
  const { user, refreshUser } = useAuth();
  const [setupData, setSetupData] = useState<MfaSetupResponseDto | null>(null);
  const [verifyCode, setVerifyCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const startSetup = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const data = await apiRequest<MfaSetupResponseDto>('/admin/auth/mfa/setup', {
        method: 'POST',
      });
      setSetupData(data);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to initiate 2FA setup.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnableMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);
    try {
      await apiRequest('/admin/auth/mfa/enable', {
        method: 'POST',
        data: { code: verifyCode },
      });
      setStatusMessage({ type: 'success', text: 'Two-Factor Authentication is now active on your account!' });
      setSetupData(null);
      await refreshUser();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Invalid code. Could not verify authenticator.' });
    } finally {
      setIsLoading(false);
    }
  };

  const copySecret = () => {
    if (setupData?.secret) {
      navigator.clipboard.writeText(setupData.secret);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="border-b border-ivory-400 dark:border-obsidian-750 pb-6">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-1">
            <ShieldCheck className="h-4 w-4" />
            <span>Identity & Access Defense</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-slate-100">
            Two-Factor Authentication (2FA)
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Enforce mandatory time-based one-time password (TOTP) step-up for privileged admin access.
          </p>
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
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Current 2FA Status Card */}
        <div className="rounded-2xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3">
                <div
                  className={`h-3 w-3 rounded-full ${
                    user?.mfaEnabled ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                  }`}
                />
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {user?.mfaEnabled
                    ? 'Two-Factor Authentication is Enabled'
                    : 'Two-Factor Authentication is Not Enabled'}
                </h2>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {user?.mfaEnabled
                  ? 'Your account requires an authenticator passcode on every sign-in attempt.'
                  : 'Protect your account against phishing and credential stuffing attacks by linking an authenticator app (Google Authenticator, 1Password, Authy).'}
              </p>
            </div>

            {!user?.mfaEnabled && !setupData && (
              <button
                onClick={startSetup}
                disabled={isLoading}
                className="flex items-center space-x-2 rounded-lg border border-gold-500/60 bg-gradient-to-r from-gold-600 to-gold-500 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-obsidian-950 shadow-lg shadow-gold-500/20 hover:from-gold-500 hover:to-gold-400"
              >
                <QrCode className="h-4 w-4" />
                <span>Configure 2FA Now</span>
              </button>
            )}
          </div>
        </div>

        {/* Setup Workflow */}
        {setupData && (
          <div className="rounded-2xl border border-gold-500/40 bg-white dark:bg-obsidian-900 p-8 shadow-xl space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gold-700 dark:text-gold-300">
              Step 1: Scan QR Code with Authenticator App
            </h3>

            <div className="flex flex-col md:flex-row items-center gap-8 bg-ivory-100 dark:bg-obsidian-950 p-6 rounded-xl border border-ivory-300 dark:border-obsidian-800">
              <div className="bg-white p-3 rounded-xl shadow-lg shrink-0 border border-ivory-300">
                <img
                  src={setupData.qrCodeUrl}
                  alt="2FA Setup QR Code"
                  className="w-48 h-48"
                />
              </div>

              <div className="space-y-3">
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  Scan the QR code with Google Authenticator, 1Password, or Microsoft Authenticator.
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Or enter the secret key manually:
                </p>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-gold-800 dark:text-gold-300 bg-white dark:bg-obsidian-900 px-3 py-1.5 rounded border border-ivory-400 dark:border-obsidian-750">
                    {setupData.secret}
                  </span>
                  <button
                    onClick={copySecret}
                    className="p-1.5 rounded border border-ivory-400 dark:border-obsidian-700 bg-white dark:bg-obsidian-850 text-slate-700 dark:text-slate-300 hover:bg-ivory-200"
                  >
                    {isCopied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <h3 className="text-sm font-bold uppercase tracking-wider text-gold-700 dark:text-gold-300 pt-4">
              Step 2: Enter Verification Code to Activate
            </h3>

            <form onSubmit={handleEnableMfa} className="space-y-4 max-w-md">
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000 000"
                  className="w-full rounded-lg border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 py-3 pl-12 pr-4 text-center font-mono text-xl tracking-[0.3em] text-gold-800 dark:text-gold-300 placeholder-slate-400 focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="submit"
                  disabled={isLoading || verifyCode.length < 6}
                  className="flex-1 rounded-lg border border-gold-500/60 bg-gradient-to-r from-gold-600 to-gold-500 py-3 text-xs font-bold uppercase tracking-widest text-obsidian-950 shadow-lg shadow-gold-500/20 hover:from-gold-500 hover:to-gold-400 disabled:opacity-50"
                >
                  Verify & Activate
                </button>
                <button
                  type="button"
                  onClick={() => setSetupData(null)}
                  className="rounded-lg border border-ivory-400 dark:border-obsidian-750 bg-ivory-100 dark:bg-obsidian-850 px-4 py-3 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
