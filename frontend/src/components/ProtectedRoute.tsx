"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
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
      <div className="min-h-screen bg-gradient-to-b from-[#050a0e] to-[#0a0f15] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[rgba(0,255,65,0.3)] border-t-[#00ff41] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[rgba(0,255,65,0.5)] font-mono">Loading...</p>
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