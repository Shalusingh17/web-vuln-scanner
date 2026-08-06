"use client";

import { createContext, useContext, ReactNode, useCallback } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  const user = session?.user
    ? {
        _id: (session.user as any).id || "",
        name: session.user.name || "",
        email: session.user.email || "",
        role: "user" as const,
      }
    : null;

  const token = (session as any)?.backendToken || null;

  const isLoading = status === "loading";

  const login = useCallback(async (email: string, password: string) => {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.error) {
      throw new Error("Invalid email or password.");
    }
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const parsed = await res.json().catch(() => ({}));
        throw new Error(parsed.message || "Registration failed");
      }
      // After registration, auto login via NextAuth
      await login(email, password);
    },
    [login]
  );

  const logout = useCallback(() => {
    signOut({ callbackUrl: "/auth/login" });
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

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}