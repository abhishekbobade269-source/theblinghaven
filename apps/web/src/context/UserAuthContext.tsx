'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';

export interface CustomerUser {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  vipTier: 'STANDARD' | 'SILVER' | 'GOLD_PATRON' | 'ROYAL_CONCIERGE';
  totalSpendUsd: number;
  totalOrdersCount: number;
  avatarUrl: string;
  preferredCurrency: string;
  wishlist: string[];
  defaultAddress?: any;
  oauthProvider?: 'google' | 'microsoft' | null;
  orders?: any[];
  createdAt?: string;
}

interface UserAuthContextType {
  user: CustomerUser | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: 'LOGIN' | 'REGISTER') => void;
  closeAuthModal: () => void;
  authModalMode: 'LOGIN' | 'REGISTER';
  setAuthModalMode: (mode: 'LOGIN' | 'REGISTER') => void;
  login: (email: string, password?: string) => Promise<void>;
  loginWithOAuth: (provider: 'google' | 'microsoft', simulatedProfile?: { name: string; email: string; avatarUrl?: string; providerId?: string }) => Promise<void>;
  register: (data: { firstName: string; lastName: string; email: string; password?: string; phone?: string; country?: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<CustomerUser>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  toggleWishlist: (productId: string) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
  wishlistCount: number;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export function UserAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Load user session from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('theblinghaven_customer_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        setUser(parsed);
        // Refresh profile in background
        if (parsed.email) {
          apiRequest<any>('/storefront/customer/profile', {
            headers: { 'x-customer-email': parsed.email },
          })
            .then((fresh) => {
              if (fresh) {
                setUser(fresh);
                localStorage.setItem('theblinghaven_customer_session', JSON.stringify(fresh));
              }
            })
            .catch(() => {});
        }
      }
    } catch {} finally {
      setIsLoading(false);
    }
  }, []);

  const openAuthModal = (mode: 'LOGIN' | 'REGISTER' = 'LOGIN') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const res = await apiRequest<any>('/storefront/customer/login', {
        method: 'POST',
        data: { email, password },
      });
      const customer = res.data?.customer || res.customer;
      const token = res.data?.token || res.token;
      setUser(customer);
      localStorage.setItem('theblinghaven_customer_session', JSON.stringify(customer));
      if (token) {
        localStorage.setItem('theblinghaven_customer_token', token);
      }
      setIsAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithOAuth = async (
    provider: 'google' | 'microsoft',
    simulatedProfile?: { name: string; email: string; avatarUrl?: string }
  ) => {
    setIsLoading(true);
    try {
      const payload = simulatedProfile || {
        provider,
        email: provider === 'google' ? 'abhishekbobade269@gmail.com' : 'patron.microsoft@outlook.com',
        name: provider === 'google' ? 'Abhishek Bobade' : 'Victoria Stirling (Microsoft)',
        avatarUrl:
          provider === 'google'
            ? 'https://ui-avatars.com/api/?name=Abhishek+Bobade&background=f43f5e&color=fff&bold=true'
            : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        providerId: `${provider}_${Date.now()}`,
      };

      const res = await apiRequest<any>('/storefront/customer/oauth', {
        method: 'POST',
        data: {
          provider,
          ...payload,
        },
      });

      const customer = res.data?.customer || res.customer;
      const token = res.data?.token || res.token;
      setUser(customer);
      localStorage.setItem('theblinghaven_customer_session', JSON.stringify(customer));
      if (token) {
        localStorage.setItem('theblinghaven_customer_token', token);
      }
      setIsAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    phone?: string;
    country?: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await apiRequest<any>('/storefront/customer/register', {
        method: 'POST',
        data,
      });
      const customer = res.data?.customer || res.customer;
      const token = res.data?.token || res.token;
      setUser(customer);
      localStorage.setItem('theblinghaven_customer_session', JSON.stringify(customer));
      if (token) {
        localStorage.setItem('theblinghaven_customer_token', token);
      }
      setIsAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('theblinghaven_customer_session');
    localStorage.removeItem('theblinghaven_customer_token');
  };

  const updateProfile = async (data: Partial<CustomerUser>) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const updated = await apiRequest<any>('/storefront/customer/profile', {
        method: 'PUT',
        data: {
          email: user.email,
          ...data,
        },
      });
      setUser(updated);
      localStorage.setItem('theblinghaven_customer_session', JSON.stringify(updated));
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) throw new Error('Not logged in');
    const res = await apiRequest<any>('/storefront/customer/password', {
      method: 'PUT',
      data: {
        email: user.email,
        currentPassword,
        newPassword,
      },
    });
    return res;
  };

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      openAuthModal('LOGIN');
      return;
    }

    try {
      const res = await apiRequest<any>('/storefront/customer/wishlist/toggle', {
        method: 'POST',
        data: {
          email: user.email,
          productId,
        },
      });

      const updatedUser = {
        ...user,
        wishlist: res.wishlistIds || [],
      };
      setUser(updatedUser);
      localStorage.setItem('theblinghaven_customer_session', JSON.stringify(updatedUser));
    } catch (e) {
      console.error('Failed to toggle wishlist:', e);
    }
  };

  const isWishlisted = (productId: string) => {
    return !!user?.wishlist?.includes(productId);
  };

  const wishlistCount = user?.wishlist?.length || 0;

  return (
    <UserAuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalMode,
        setAuthModalMode,
        login,
        loginWithOAuth,
        register,
        logout,
        updateProfile,
        changePassword,
        toggleWishlist,
        isWishlisted,
        wishlistCount,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
}
