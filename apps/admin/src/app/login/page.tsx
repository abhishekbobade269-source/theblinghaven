'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ShieldCheck, Lock, Mail, AlertTriangle, ArrowRight } from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function LoginPage() {
  const router = useRouter();
  const { loginSuccess } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await apiRequest('/admin/auth/login', {
        method: 'POST',
        data: { email, password },
      });

      if (response.requireMfa && response.mfaToken) {
        sessionStorage.setItem('tbh_mfa_token', response.mfaToken);
        sessionStorage.setItem('tbh_mfa_email', email);
        router.push('/mfa-verify');
      } else if (response.accessToken && response.user) {
        loginSuccess(response.user, response.accessToken);
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Authentication failed. Please check your credentials.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory-200 dark:bg-obsidian-950 px-4 py-12 transition-colors relative">
      {/* Top Theme Switcher */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Ambient Gold Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold-500/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Banner Graphic */}
        <div className="mb-4 overflow-hidden rounded-2xl border border-ivory-400 dark:border-obsidian-750 shadow-xl bg-white dark:bg-obsidian-900">
          <img
            src="/images/banner.jpg"
            alt="The Bling Haven Luxury Collection Banner"
            className="w-full h-36 object-cover object-center"
          />
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-ivory-400 dark:border-obsidian-700 bg-white/95 dark:bg-obsidian-900/90 p-8 shadow-2xl backdrop-blur-xl">
          {/* Header Branding with Official Logo */}
          <div className="text-center mb-6">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl border border-gold-500/30 bg-white p-2 shadow-lg mb-3">
              <img
                src="/images/logo.png"
                alt="The Bling Haven Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-wider text-slate-900 dark:text-slate-100">
              THE BLING HAVEN
            </h1>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400">
              SECURE COMMERCE ADMINISTRATION
            </p>
          </div>

          <div className="mb-6 flex items-center justify-between border-b border-ivory-300 dark:border-obsidian-800 pb-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4 text-gold-600 dark:text-gold-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Privileged Access
              </span>
            </div>
            <span className="rounded bg-ivory-200 dark:bg-obsidian-800 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-400">
              M01 Baseline
            </span>
          </div>

          {errorMessage && (
            <div className="mb-6 flex items-start space-x-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-700 dark:text-red-300">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-400 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@theblinghaven.shop"
                  className="w-full rounded-lg border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:border-gold-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-400">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-gold-600 dark:text-gold-400 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-lg border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 py-2.5 pl-10 pr-10 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:border-gold-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 flex w-full items-center justify-center space-x-2 rounded-lg border border-gold-500/60 bg-gradient-to-r from-gold-600 to-gold-500 py-3 text-xs font-bold uppercase tracking-widest text-obsidian-950 shadow-lg shadow-gold-500/20 transition hover:from-gold-500 hover:to-gold-400 active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-obsidian-950 border-t-transparent" />
              ) : (
                <>
                  <span>Authenticate & Enter</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="mt-8 border-t border-ivory-300 dark:border-obsidian-800 pt-5">
            <p className="text-center text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
              Quick Test Seed Roles
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => { setEmail('admin@theblinghaven.shop'); setPassword('Admin@BlingHaven2026!'); }}
                className="rounded-lg border border-ivory-400 dark:border-obsidian-750 bg-ivory-100 dark:bg-obsidian-850 p-2 text-left hover:border-gold-500 transition"
              >
                <p className="font-semibold text-gold-700 dark:text-gold-300">Super Admin</p>
                <p className="text-[10px] text-slate-500 truncate">admin@theblinghaven...</p>
              </button>
              <button
                type="button"
                onClick={() => { setEmail('catalog@theblinghaven.shop'); setPassword('Manager@BlingHaven2026!'); }}
                className="rounded-lg border border-ivory-400 dark:border-obsidian-750 bg-ivory-100 dark:bg-obsidian-850 p-2 text-left hover:border-gold-500 transition"
              >
                <p className="font-semibold text-slate-700 dark:text-slate-300">Catalog Manager</p>
                <p className="text-[10px] text-slate-500 truncate">catalog@theblinghaven...</p>
              </button>
              <button
                type="button"
                onClick={() => { setEmail('orders@theblinghaven.shop'); setPassword('Manager@BlingHaven2026!'); }}
                className="rounded-lg border border-ivory-400 dark:border-obsidian-750 bg-ivory-100 dark:bg-obsidian-850 p-2 text-left hover:border-gold-500 transition"
              >
                <p className="font-semibold text-slate-700 dark:text-slate-300">Order Manager</p>
                <p className="text-[10px] text-slate-500 truncate">orders@theblinghaven...</p>
              </button>
              <button
                type="button"
                onClick={() => { setEmail('security@theblinghaven.shop'); setPassword('Manager@BlingHaven2026!'); }}
                className="rounded-lg border border-ivory-400 dark:border-obsidian-750 bg-ivory-100 dark:bg-obsidian-850 p-2 text-left hover:border-gold-500 transition"
              >
                <p className="font-semibold text-slate-700 dark:text-slate-300">Security Admin</p>
                <p className="text-[10px] text-slate-500 truncate">security@theblinghaven...</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
