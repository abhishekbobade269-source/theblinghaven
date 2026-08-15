'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUserAuth } from '@/context/UserAuthContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/context/CartContext';
import { apiRequest } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import { ProductDto } from '@theblinghaven/shared';
import {
  User,
  Lock,
  Package,
  Heart,
  Tag,
  ShieldCheck,
  Crown,
  Sparkles,
  Truck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  LogOut,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  KeyRound,
  ShoppingBag,
  Coins,
  Settings,
} from 'lucide-react';

export default function AccountProfilePage() {
  const {
    user,
    isLoading,
    openAuthModal,
    logout,
    updateProfile,
    changePassword,
    toggleWishlist,
    isWishlisted,
  } = useUserAuth();

  const { formatPrice, currentCurrency, setCurrency, rates } = useCurrency();
  const { addItem } = useCart();

  const [activeTab, setActiveTab] = useState<'PROFILE' | 'ORDERS' | 'WISHLIST' | 'COUPONS' | 'DOSSIERS'>('PROFILE');

  // Profile Edit State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [preferredCurrency, setPreferredCurrency] = useState('CAD');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState<string | null>(null);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState<string | null>(null);

  // Orders, Wishlist & Coupons Data
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<ProductDto[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(false);

  // Sync user state to form
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setPhone(user.phone || '');
      setCountry(user.country || 'India');
      setCity(user.city || '');
      setPreferredCurrency(user.preferredCurrency || 'INR');
    }
  }, [user]);

  // Fetch orders, wishlist products, and coupons
  useEffect(() => {
    if (!user) return;
    let isMounted = true;
    const fetchUserData = async () => {
      setIsDataLoading(true);
      try {
        const [ordersRes, couponsRes, catRes] = await Promise.all([
          apiRequest<any>('/storefront/customer/orders', {
            headers: { 'x-customer-email': user.email },
          }),
          apiRequest<any>('/storefront/customer/coupons', {
            headers: { 'x-customer-email': user.email },
          }),
          apiRequest<any>('/catalog/products?limit=50'),
        ]);

        if (!isMounted) return;

        const ordList = Array.isArray(ordersRes) ? ordersRes : ordersRes?.data || [];
        setOrders(ordList);

        const cpnList = Array.isArray(couponsRes) ? couponsRes : couponsRes?.data || [];
        setCoupons(cpnList);

        const allProds: ProductDto[] = Array.isArray(catRes) ? catRes : catRes?.data || [];
        if (user.wishlist && user.wishlist.length > 0) {
          const wished = allProds.filter((p) => user.wishlist.includes(p.id));
          setWishlistProducts(wished);
        } else {
          setWishlistProducts([]);
        }
      } catch (e) {
        console.error('Failed to load user account data:', e);
      } finally {
        if (isMounted) setIsDataLoading(false);
      }
    };

    fetchUserData();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Update profile handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileSuccessMsg(null);
    try {
      await updateProfile({
        firstName,
        lastName,
        phone,
        country,
        city,
        preferredCurrency,
      });
      setCurrency(preferredCurrency);
      setProfileSuccessMsg('Profile details successfully updated.');
      setTimeout(() => setProfileSuccessMsg(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to update profile.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Change password handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccessMsg(null);
    setPasswordErrorMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordErrorMsg('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await changePassword(currentPassword, newPassword);
      setPasswordSuccessMsg(res.message || 'Password successfully updated.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccessMsg(null), 5000);
    } catch (err: any) {
      setPasswordErrorMsg(err.message || 'Failed to update password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  // If user is not logged in, show clear friendly login screen
  if (!user && !isLoading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 sm:py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-gold-500/10 border border-gold-500/30 p-4 text-gold-700 dark:text-gold-400 mx-auto flex items-center justify-center shadow-lg">
          <User className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1 text-xs font-mono tracking-widest text-gold-700 dark:text-gold-400 uppercase font-bold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>My Account & Profile</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
            Sign In to Your Account
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            Manage your personal profile, track orders, view your saved wishlist items, and access discount coupons.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2 font-mono">
          <button
            onClick={() => openAuthModal('LOGIN')}
            className="rounded-2xl bg-gold-500 hover:bg-gold-400 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-obsidian-950 transition shadow-xl"
          >
            Sign In
          </button>

          <button
            onClick={() => openAuthModal('REGISTER')}
            className="rounded-2xl border border-slate-300 dark:border-gold-500/30 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 transition"
          >
            Visiting first time? Sign up first
          </button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-10">
      {/* 1. Profile Header Banner */}
      <div className="rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-[#0E0E14] p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
          <div className="flex items-center space-x-4 sm:space-x-5">
            <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-2xl overflow-hidden border-2 border-gold-500/50 shadow-md bg-gold-500/10 shrink-0">
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {user.fullName}
                </h1>
                <span className="rounded-full bg-gold-500/20 border border-gold-500/40 px-3 py-0.5 text-[10px] font-mono font-bold text-gold-700 dark:text-gold-400 uppercase">
                  Member
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400">
                <span className="flex items-center space-x-1">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span>{user.email}</span>
                </span>
                {user.phone && (
                  <span className="flex items-center space-x-1">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span>{user.phone}</span>
                  </span>
                )}
                {user.country && (
                  <span className="flex items-center space-x-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span>{user.country}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={logout}
              className="flex items-center space-x-1.5 rounded-xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-white/5 px-4 py-2 text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-rose-500 transition"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-100 dark:border-white/10 text-xs font-mono">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-white/5 space-y-0.5">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Total Purchases</span>
            <p className="font-bold text-gold-700 dark:text-gold-400 text-sm sm:text-base">
              {formatPrice(user.totalSpendUsd || 0)}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-white/5 space-y-0.5">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Orders Placed</span>
            <p className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
              {orders.length} Orders
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-white/5 space-y-0.5">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Saved Wishlist</span>
            <p className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
              {user.wishlist?.length || 0} Items
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-white/5 space-y-0.5">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Discount Coupons</span>
            <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm sm:text-base">
              {coupons.length} Active Offers
            </p>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-gold-500/20 overflow-x-auto pb-2 text-xs font-mono font-bold no-scrollbar">
        {[
          { id: 'PROFILE', label: 'Profile Details & Security', icon: User },
          { id: 'ORDERS', label: `My Orders (${orders.length})`, icon: Package },
          { id: 'WISHLIST', label: `My Wishlist (${user.wishlist?.length || 0})`, icon: Heart },
          { id: 'COUPONS', label: `Discount Coupons (${coupons.length})`, icon: Tag },
          { id: 'DOSSIERS', label: 'Custom Designs & Support', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl transition shrink-0 ${
                isActive
                  ? 'bg-gold-500 text-obsidian-950 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-obsidian-900 border border-slate-200 dark:border-white/5'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Tab Contents */}

      {/* TAB 1: PERSONAL PROFILE & SECURITY */}
      {activeTab === 'PROFILE' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left 7 cols: Edit Details Form */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-[#0E0E14] p-6 sm:p-8 shadow-xl space-y-6">
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                Personal Details & Contact
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Update your name, mobile number, and address for order deliveries.
              </p>
            </div>

            {profileSuccessMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-mono flex items-center space-x-2 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{profileSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Preferred Currency
                  </label>
                  <select
                    value={preferredCurrency}
                    onChange={(e) => setPreferredCurrency(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none cursor-pointer font-bold font-sans"
                  >
                    {rates.map((r) => (
                      <option key={r.currencyCode} value={r.currencyCode}>
                        {r.currencyCode} ({r.symbol}) - {r.currencyName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="India"
                    className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">
                    City / State
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Mumbai, Maharashtra"
                    className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none font-sans"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="rounded-2xl bg-gold-500 hover:bg-gold-400 px-8 py-3 text-xs font-bold uppercase tracking-wider text-obsidian-950 transition shadow-md flex items-center space-x-2"
                >
                  <span>{isUpdatingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          </div>

          {/* Right 5 cols: Change Password */}
          <div className="lg:col-span-5 rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-[#0E0E14] p-6 sm:p-8 shadow-xl space-y-6">
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                Change Password
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Update your account password to keep your account safe.
              </p>
            </div>

            {passwordSuccessMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-mono flex items-center space-x-2 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{passwordSuccessMsg}</span>
              </div>
            )}

            {passwordErrorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-mono flex items-center space-x-2 animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{passwordErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none font-sans"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">
                  New Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none font-sans"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none font-sans"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="w-full rounded-2xl border border-slate-300 dark:border-gold-500/40 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 py-3 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-gold-400 transition"
                >
                  {isChangingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: MY ORDERS & TRACKING */}
      {activeTab === 'ORDERS' && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-[#0E0E14] p-12 text-center space-y-4 shadow-xl">
              <Package className="h-12 w-12 text-gold-500 mx-auto" />
              <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-slate-100">
                No Orders Placed Yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore our latest jewellery collections and place your first order.
              </p>
              <Link
                href="/catalog"
                className="inline-flex items-center space-x-2 rounded-2xl bg-gold-500 px-6 py-3 text-xs font-bold uppercase tracking-wider text-obsidian-950 shadow-md font-mono"
              >
                <span>Browse Jewellery</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-[#0E0E14] p-6 sm:p-8 shadow-xl space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-4">
                  <div className="space-y-1 font-mono">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-gold-700 dark:text-gold-400">
                        Order #{order.orderNumber}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="font-serif text-base font-bold text-slate-900 dark:text-slate-100">
                      Total: {formatPrice(order.totalAmountUsd || 0)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="rounded-full bg-gold-500/20 border border-gold-500/40 px-3 py-1 font-mono text-xs font-bold text-gold-700 dark:text-gold-400">
                      {order.status ? order.status.replace(/_/g, ' ') : 'PROCESSING'}
                    </span>

                    <Link
                      href={`/track?order=${encodeURIComponent(order.orderNumber)}`}
                      className="flex items-center space-x-1.5 rounded-xl bg-gold-500 hover:bg-gold-400 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-obsidian-950 transition shadow-sm"
                    >
                      <Truck className="h-3.5 w-3.5" />
                      <span>Track Delivery</span>
                    </Link>
                  </div>
                </div>

                {/* Items in order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {order.items?.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-white/5"
                    >
                      <img
                        src={item.primaryImageUrl}
                        alt={item.title}
                        className="h-14 w-14 rounded-xl object-cover border border-gold-500/30 shrink-0"
                      />
                      <div className="min-w-0 flex-1 text-xs">
                        <h5 className="font-serif font-bold text-slate-900 dark:text-slate-100 truncate">
                          {item.title}
                        </h5>
                        <p className="font-mono text-[10px] text-slate-500">
                          Qty: {item.quantity} • {formatPrice(item.unitPriceUsd)}
                        </p>
                        {item.selectedRingSize && (
                          <span className="font-mono text-[10px] text-gold-600 dark:text-gold-400 font-bold block">
                            Size: {item.selectedRingSize}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: MY WISHLIST & FAVOURITES */}
      {activeTab === 'WISHLIST' && (
        <div className="space-y-6">
          {wishlistProducts.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-[#0E0E14] p-12 text-center space-y-4 shadow-xl">
              <Heart className="h-12 w-12 text-gold-500 mx-auto" />
              <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-slate-100">
                Your Wishlist is Empty
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Tap the heart icon on any jewellery piece to save it to your wishlist.
              </p>
              <Link
                href="/catalog"
                className="inline-flex items-center space-x-2 rounded-2xl bg-gold-500 px-6 py-3 text-xs font-bold uppercase tracking-wider text-obsidian-950 shadow-md font-mono"
              >
                <span>Browse Jewellery</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {wishlistProducts.map((prod) => (
                <div key={prod.id} className="relative group">
                  <ProductCard product={prod} />
                  <button
                    onClick={() => toggleWishlist(prod.id)}
                    className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 dark:bg-black/80 text-rose-500 shadow-md hover:scale-110 transition"
                    title="Remove from Wishlist"
                  >
                    <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: DISCOUNT COUPONS & OFFERS */}
      {activeTab === 'COUPONS' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((c) => {
            const isCopied = copiedCoupon === c.code;
            return (
              <div
                key={c.id}
                className="rounded-3xl border-2 border-dashed border-gold-500/40 bg-white dark:bg-[#0E0E14] p-6 shadow-xl space-y-4 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center space-x-1.5 rounded-full bg-gold-500/15 border border-gold-500/30 px-3 py-1 font-mono text-[10px] font-bold text-gold-700 dark:text-gold-400 uppercase">
                    <Tag className="h-3 w-3" />
                    <span>{c.type === 'PERCENTAGE' ? `${c.value}% OFF` : `$${c.value} OFF`}</span>
                  </span>

                  <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                    ✓ Active Offer
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">
                    {c.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {c.description || 'Apply this coupon code at checkout to get special discount.'}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-white/10 flex items-center justify-between font-mono text-xs">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-gold-500/20 text-gold-700 dark:text-gold-400 font-bold tracking-widest">
                    {c.code}
                  </div>

                  <button
                    onClick={() => copyCouponCode(c.code)}
                    className="flex items-center space-x-1.5 rounded-xl bg-gold-500 hover:bg-gold-400 px-4 py-2 text-xs font-bold text-obsidian-950 uppercase tracking-wider transition shadow-sm"
                  >
                    {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{isCopied ? 'Copied' : 'Copy Code'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 5: CUSTOM DESIGNS & SUPPORT */}
      {activeTab === 'DOSSIERS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-[#0E0E14] p-6 shadow-xl space-y-4">
            <div className="p-3 rounded-2xl bg-gold-500/10 text-gold-600 dark:text-gold-400 w-fit">
              <Sparkles className="h-6 w-6" />
            </div>
            <h4 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">
              Custom 3D Jewellery Studio
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Design custom rings, bridal necklaces, and bangles with 3D CAD design assistance.
            </p>
            <Link
              href="/bespoke"
              className="inline-flex items-center space-x-1.5 text-xs font-mono font-bold text-gold-700 dark:text-gold-400 hover:underline"
            >
              <span>Open Custom Studio</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-[#0E0E14] p-6 shadow-xl space-y-4">
            <div className="p-3 rounded-2xl bg-gold-500/10 text-gold-600 dark:text-gold-400 w-fit">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h4 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">
              Certificate Verification
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Verify GIA, IGI, and hallmark certificates for your jewellery purchases.
            </p>
            <Link
              href="/verify"
              className="inline-flex items-center space-x-1.5 text-xs font-mono font-bold text-gold-700 dark:text-gold-400 hover:underline"
            >
              <span>Verify Certificate</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-[#0E0E14] p-6 shadow-xl space-y-4">
            <div className="p-3 rounded-2xl bg-gold-500/10 text-gold-600 dark:text-gold-400 w-fit">
              <Mail className="h-6 w-6" />
            </div>
            <h4 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">
              Customer Help & Inquiries
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Track open support tickets or get in touch with our jewellery advisory team.
            </p>
            <Link
              href="/support"
              className="inline-flex items-center space-x-1.5 text-xs font-mono font-bold text-gold-700 dark:text-gold-400 hover:underline"
            >
              <span>Open Support Desk</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
