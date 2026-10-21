import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { apiRequest } from '../api/client';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (formData: FormData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  expireSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const expireSession = async () => {
    sessionStorage.setItem('vanseva_session_expired', 'true');
    sessionStorage.removeItem('vanseva_auth_active');

    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/auth/logout');
      } else {
        await fetch('/api/auth/logout', { method: 'POST', credentials: 'include', keepalive: true });
      }
    } catch {
      try {
        await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      } catch {}
    } finally {
      setUser(null);
    }
  };

  const refreshUser = async () => {
    // If the session was marked as expired because the user went back from the site
    if (sessionStorage.getItem('vanseva_session_expired') === 'true') {
      try {
        await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      } catch {}
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const data = await apiRequest<User>('/api/auth/me');
      setUser(data);
      sessionStorage.setItem('vanseva_auth_active', 'true');
    } catch {
      setUser(null);
      sessionStorage.removeItem('vanseva_auth_active');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();

    // Triggered when user navigates back away from the site, or leaves/closes the tab
    const handlePageHide = () => {
      if (sessionStorage.getItem('vanseva_auth_active') === 'true') {
        sessionStorage.setItem('vanseva_session_expired', 'true');
        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/auth/logout');
        }
      }
    };

    // Triggered if the browser attempts to restore the page from Back-Forward Cache (bfcache)
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted || sessionStorage.getItem('vanseva_session_expired') === 'true') {
        expireSession();
      }
    };

    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  const login = async (username: string, password: string) => {
    sessionStorage.removeItem('vanseva_session_expired');
    const data = await apiRequest<User>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    setUser(data);
    sessionStorage.setItem('vanseva_auth_active', 'true');
  };

  const register = async (formData: FormData) => {
    sessionStorage.removeItem('vanseva_session_expired');
    const data = await apiRequest<User>('/api/auth/register', {
      method: 'POST',
      body: formData,
    });
    setUser(data);
    sessionStorage.setItem('vanseva_auth_active', 'true');
  };

  const logout = async () => {
    await expireSession();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser, expireSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

