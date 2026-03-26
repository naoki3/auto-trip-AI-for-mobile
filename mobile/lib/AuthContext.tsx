import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadAuth, saveAuth, clearAuth, AuthState } from './auth';

interface AuthContextValue {
  auth: AuthState | null;
  isLoading: boolean;
  signIn: (auth: AuthState) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAuth().then((stored) => {
      setAuth(stored);
      setIsLoading(false);
    });
  }, []);

  async function signIn(newAuth: AuthState) {
    await saveAuth(newAuth);
    setAuth(newAuth);
  }

  async function signOut() {
    await clearAuth();
    setAuth(null);
  }

  return (
    <AuthContext.Provider value={{ auth, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
