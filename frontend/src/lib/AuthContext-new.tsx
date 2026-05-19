"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

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
          
          if (res.ok) {
            const data = await res.json();
            if (data?.user && !cancelled) {
              setUser(data.user);
            }
          } else {
            if (!cancelled) setUser(null);
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

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Login failed");
      }

      // Fetch user profile
      const meRes = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (meRes.ok) {
        const data = await meRes.json();
        setUser(data?.user ?? null);
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

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Registration failed");
      }

      // Fetch user profile
      const meRes = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (meRes.ok) {
        const data = await meRes.json();
        setUser(data?.user ?? null);
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
