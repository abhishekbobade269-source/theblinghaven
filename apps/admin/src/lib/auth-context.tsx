'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminUserDto, AdminRole, Permission } from '@theblinghaven/shared';
import { apiRequest } from './api';

interface AuthContextType {
  user: AdminUserDto | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginSuccess: (user: AdminUserDto, token?: string) => void;
  logout: () => Promise<void>;
  hasRole: (role: AdminRole) => boolean;
  hasPermission: (permission: Permission) => boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUserDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  const publicRoutes = ['/login', '/mfa-verify', '/forgot-password', '/reset-password'];

  useEffect(() => {
    async function loadInitialUser() {
      const storedToken = localStorage.getItem('tbh_admin_access_token');
      const storedUser = localStorage.getItem('tbh_admin_user');

      if (storedUser && storedToken) {
        try {
          setUser(JSON.parse(storedUser));
          // Verify with backend
          const freshUser = await apiRequest<AdminUserDto>('/admin/auth/me');
          setUser(freshUser);
          localStorage.setItem('tbh_admin_user', JSON.stringify(freshUser));
        } catch (err) {
          localStorage.removeItem('tbh_admin_access_token');
          localStorage.removeItem('tbh_admin_user');
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    }

    loadInitialUser();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const isPublic = publicRoutes.some((route) => pathname?.startsWith(route));
      if (!user && !isPublic) {
        router.push('/login');
      } else if (user && pathname === '/login') {
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, pathname, router]);

  const loginSuccess = (userData: AdminUserDto, token?: string) => {
    if (token) {
      localStorage.setItem('tbh_admin_access_token', token);
    }
    localStorage.setItem('tbh_admin_user', JSON.stringify(userData));
    setUser(userData);
    router.push('/dashboard');
  };

  const logout = async () => {
    try {
      await apiRequest('/admin/auth/logout', { method: 'POST' });
    } catch (e) {
      // Ignore network errors during logout
    } finally {
      localStorage.removeItem('tbh_admin_access_token');
      localStorage.removeItem('tbh_admin_user');
      setUser(null);
      router.push('/login');
    }
  };

  const refreshUser = async () => {
    try {
      const freshUser = await apiRequest<AdminUserDto>('/admin/auth/me');
      setUser(freshUser);
      localStorage.setItem('tbh_admin_user', JSON.stringify(freshUser));
    } catch (e) {
      //
    }
  };

  const hasRole = (role: AdminRole): boolean => {
    if (!user) return false;
    return user.role === AdminRole.SUPER_ADMIN || user.role === role;
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    if (user.role === AdminRole.SUPER_ADMIN) return true;
    return user.permissions?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        loginSuccess,
        logout,
        hasRole,
        hasPermission,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
