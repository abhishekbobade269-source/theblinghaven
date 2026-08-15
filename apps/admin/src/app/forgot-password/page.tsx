'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { KeyRound, ArrowLeft, Mail, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [previewToken, setPreviewToken] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await apiRequest('/admin/auth/password/request-reset', {
        method: 'POST',
        data: { email },
      });

      setSuccessMessage(
        response.message ||
          'If an active account exists with that email, a password reset link has been dispatched.',
      );

      if (response.previewToken) {
        setPreviewToken(response.previewToken);
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Unable to process password reset request at this time.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-obsidian-950 px-4 py-12">
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-gold-500/30 bg-gold-500/10 shadow-xl shadow-gold-500/10 mb-4">
            <KeyRound className="h-8 w-8 text-gold-400" />
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-wider text-slate-100">
            RESET CREDENTIALS
          </h1>
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-gold-400">
            SECURE ACCOUNT RECOVERY
          </p>
        </div>

        <div className="rounded-2xl border border-obsidian-700 bg-obsidian-900/90 p-8 shadow-2xl backdrop-blur-xl">
          {successMessage ? (
            <div className="space-y-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {successMessage}
              </p>

              {previewToken && (
                <div className="rounded-lg border border-gold-500/30 bg-gold-500/10 p-4 text-left">
                  <p className="text-[11px] font-semibold text-gold-300 uppercase tracking-wider mb-1">
                    Development Fast-Track Token:
                  </p>
                  <p className="font-mono text-xs text-slate-300 break-all bg-obsidian-950 p-2 rounded border border-obsidian-800">
                    {previewToken}
                  </p>
                  <Link
                    href={`/reset-password?token=${previewToken}`}
                    className="mt-3 inline-flex items-center space-x-2 text-xs font-bold text-gold-400 hover:text-gold-300"
                  >
                    <span>Proceed to Reset Password</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}

              <Link
                href="/login"
                className="inline-flex items-center space-x-2 text-xs text-slate-400 hover:text-slate-200 transition"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Login</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Enter your verified admin email. A single-use, 30-minute expiring recovery token will be generated.
              </p>

              {errorMessage && (
                <div className="mb-4 flex items-start space-x-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@theblinghaven.shop"
                    className="w-full rounded-lg border border-obsidian-750 bg-obsidian-950 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-600 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500/40"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-6 flex w-full items-center justify-center space-x-2 rounded-lg border border-gold-500/60 bg-gradient-to-r from-gold-600 to-gold-500 py-3 text-xs font-bold uppercase tracking-widest text-obsidian-950 shadow-lg shadow-gold-500/20 transition hover:from-gold-500 hover:to-gold-400 active:scale-[0.99] disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-obsidian-950 border-t-transparent" />
                ) : (
                  <span>Send Recovery Token</span>
                )}
              </button>

              <div className="mt-4 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center space-x-2 text-xs text-slate-400 hover:text-slate-200 transition"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Login</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
