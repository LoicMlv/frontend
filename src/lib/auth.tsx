import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';

export type AuthUser = {
  userId: string;
  name: string;
  email: string;
  createdAt: string;
};

type AuthContextType = {
  user: AuthUser | null;
  setUser: (u: AuthUser | null) => void;
};

const AUTH_KEY = "jdr.auth.v1";

export function loadAuth(): AuthUser | null {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as AuthUser; } catch { return null; }
}

export function saveAuth(user: AuthUser) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
}

// Essayez cette façon de déclarer le contexte
const AuthCtx = React.createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => { 
    setUser(loadAuth()); 
  }, []);

  const value = useMemo(() => ({ user, setUser }), [user]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}