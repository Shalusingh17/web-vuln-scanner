"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
  const timer = setTimeout(() => {
    setHasMounted(true);
  }, 0);

  return () => clearTimeout(timer);
}, []);

  useEffect(() => {
    if (!hasMounted) return;
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router, hasMounted]);

  // Show loading state while checking auth
  if (!hasMounted || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-foreground">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-cyan-500/20 border-t-cyan-400" />
          <p className="text-sm text-gray-400">Loading…</p>
        </div>
      </div>
    );
  }

  // Redirect will happen in useEffect, this prevents flash of content
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}