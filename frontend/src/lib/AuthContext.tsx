"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { parseResponseJson } from "@/lib/parseResponseJson";

// ── Types ────────────────────────────────────────────
interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// ── Context ──────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Provider ─────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On app load, restore session
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        try {
          const res = await fetch("/api/auth/me", {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          });

          const parsed = await parseResponseJson<{ user?: User }>(res);
          if (res.ok && parsed.ok && parsed.data?.user && !cancelled) {
            setUser(parsed.data.user);
          } else if (!cancelled) {
            setUser(null);
          }
        } catch {
          // Not logged in
          if (!cancelled) setUser(null);
        }

        // Token is stored in HttpOnly cookie
        if (!cancelled) setToken(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void init();

    return () => {
      cancelled = true;
    };
  }, []);

  // ── Login ─────────────────────────────────────────
  const login = useCallback(
    async (email: string, password: string) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const loginParsed = await parseResponseJson<{ message?: string }>(res);
      if (!res.ok) {
        const msg = loginParsed.ok
          ? (loginParsed.data.message ?? "Login failed")
          : loginParsed.message;
        throw new Error(msg);
      }

      // Fetch user profile
      const meRes = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const meParsed = await parseResponseJson<{ user?: User }>(meRes);
      if (meRes.ok && meParsed.ok && meParsed.data?.user) {
        setUser(meParsed.data.user);
      }
      setToken(null);
    },
    []
  );

  // ── Register ──────────────────────────────────────
  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const regParsed = await parseResponseJson<{ message?: string }>(res);
      if (!res.ok) {
        const msg = regParsed.ok
          ? (regParsed.data.message ?? "Registration failed")
          : regParsed.message;
        throw new Error(msg);
      }

      // Fetch user profile
      const meRes = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const meParsed = await parseResponseJson<{ user?: User }>(meRes);
      if (meRes.ok && meParsed.ok && meParsed.data?.user) {
        setUser(meParsed.data.user);
      }
      setToken(null);
    },
    []
  );

  // ── Logout ────────────────────────────────────────
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    try {
      document.cookie = "auth-token=; Max-Age=0; path=/";
    } catch {
      // ignore
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}