'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Eye, EyeOff, CheckCircle2, AlertTriangle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { apiRequest } from '@/lib/api';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const queryToken = searchParams.get('token');
    if (queryToken) {
      setToken(queryToken);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await apiRequest('/admin/auth/password/reset', {
        method: 'POST',
        data: { token, newPassword },
      });
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Invalid or expired token. Please request a new link.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-obsidian-700 bg-obsidian-900/90 p-8 shadow-2xl backdrop-blur-xl">
      {isSuccess ? (
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100">
              Password Updated Successfully
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              All previous sessions have been revoked for your security.
            </p>
          </div>

          <Link
            href="/login"
            className="flex w-full items-center justify-center space-x-2 rounded-lg border border-gold-500/60 bg-gradient-to-r from-gold-600 to-gold-500 py-3 text-xs font-bold uppercase tracking-widest text-obsidian-950 shadow-lg shadow-gold-500/20 hover:from-gold-500 hover:to-gold-400"
          >
            <span>Proceed to Login</span>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="mb-4 flex items-start space-x-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
              Reset Token
            </label>
            <input
              type="text"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste your reset token here"
              className="w-full rounded-lg border border-obsidian-750 bg-obsidian-950 py-2.5 px-3 font-mono text-xs text-slate-100 placeholder-slate-600 focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-lg border border-obsidian-750 bg-obsidian-950 py-2.5 pl-10 pr-10 text-sm text-slate-100 placeholder-slate-600 focus:border-gold-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-lg border border-obsidian-750 bg-obsidian-950 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-600 focus:border-gold-500 focus:outline-none"
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
              <span>Commit Password Change</span>
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
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-obsidian-950 px-4 py-12">
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-gold-500/30 bg-gold-500/10 shadow-xl shadow-gold-500/10 mb-4">
            <ShieldCheck className="h-8 w-8 text-gold-400" />
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-wider text-slate-100">
            UPDATE CREDENTIALS
          </h1>
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-gold-400">
            SET NEW SECURE PASSWORD
          </p>
        </div>

        <Suspense fallback={
          <div className="p-8 text-center text-gold-300">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-500 border-t-transparent mx-auto" />
            <p className="mt-2 text-xs">Loading recovery session...</p>
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
