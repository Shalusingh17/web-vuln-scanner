"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Valid email required";
    }
    if (!password) {
      newErrors.password = "Password required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ general: data.message || "Authentication failed" });
        return;
      }

      router.push("/dashboard");
    } catch {
      setErrors({ general: "Connection error. Try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050a0e] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Cyber grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,65,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Corner decorations */}
      {["top-5 left-5 border-t border-l","top-5 right-5 border-t border-r","bottom-5 left-5 border-b border-l","bottom-5 right-5 border-b border-r"].map((cls, i) => (
        <div key={i} className={`absolute w-16 h-16 border-[rgba(0,255,65,0.25)] pointer-events-none ${cls}`} />
      ))}

      {/* Login card */}
      <div className="relative w-full max-w-md bg-[rgba(8,18,24,0.95)] border border-[rgba(0,255,65,0.2)] rounded-sm p-10 backdrop-blur-md z-10">
        {/* Top glow bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-sm bg-gradient-to-r from-transparent via-[#00ff41] to-transparent" />

        {/* Brand */}
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 bg-[rgba(0,255,65,0.08)] border border-[rgba(0,255,65,0.3)] rounded flex items-center justify-center text-[#00ff41]">
            🛡
          </div>
          <span className="font-mono text-xl text-[#00ff41] tracking-widest uppercase">
            Vuln<span className="opacity-50">Scanner</span>
          </span>
        </div>
        <p className="font-mono text-[10px] text-[rgba(0,255,65,0.4)] tracking-[3px] uppercase mb-7 ml-12">
          Secure Authentication Portal
        </p>

        {/* Status bar */}
        <div className="flex items-center gap-2 mb-6 px-3 py-2 bg-[rgba(0,255,65,0.03)] border border-[rgba(0,255,65,0.1)] rounded-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00ff41] animate-pulse" />
          <span className="font-mono text-[10px] text-[rgba(0,255,65,0.5)] tracking-widest uppercase">
            TLS 1.3 — AES-256 — Endpoint Secure
          </span>
        </div>

        {errors.general && (
          <div className="mb-4 px-3 py-2 bg-[rgba(255,60,60,0.08)] border border-[rgba(255,60,60,0.3)] rounded-sm font-mono text-[11px] text-[rgba(255,100,100,0.9)] tracking-wider">
            ⚠ {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="mb-4">
            <label className="block font-mono text-[11px] text-[rgba(0,255,65,0.5)] tracking-[2px] uppercase mb-1.5">
              Operator ID / Email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(0,255,65,0.35)] text-sm">@</span>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); }}
                placeholder="user@domain.com"
                autoComplete="email"
                className={`w-full h-11 pl-8 pr-4 bg-[rgba(0,255,65,0.03)] border rounded-sm font-mono text-[13px] text-[#c8ffc8] placeholder-[rgba(0,255,65,0.18)] outline-none transition-all
                  ${errors.email ? "border-[rgba(255,60,60,0.5)] focus:border-[rgba(255,60,60,0.8)]" : "border-[rgba(0,255,65,0.15)] focus:border-[rgba(0,255,65,0.5)] focus:bg-[rgba(0,255,65,0.05)]"}`}
              />
            </div>
            {errors.email && <p className="mt-1 font-mono text-[10px] text-[rgba(255,80,80,0.8)]">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="block font-mono text-[11px] text-[rgba(0,255,65,0.5)] tracking-[2px] uppercase mb-1.5">
              Access Key
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(0,255,65,0.35)] text-sm">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
                placeholder="••••••••••••"
                autoComplete="current-password"
                className={`w-full h-11 pl-8 pr-10 bg-[rgba(0,255,65,0.03)] border rounded-sm font-mono text-[13px] text-[#c8ffc8] placeholder-[rgba(0,255,65,0.18)] outline-none transition-all
                  ${errors.password ? "border-[rgba(255,60,60,0.5)]" : "border-[rgba(0,255,65,0.15)] focus:border-[rgba(0,255,65,0.5)] focus:bg-[rgba(0,255,65,0.05)]"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(0,255,65,0.35)] hover:text-[rgba(0,255,65,0.7)] transition-colors text-sm"
                aria-label="Toggle password"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
            {errors.password && <p className="mt-1 font-mono text-[10px] text-[rgba(255,80,80,0.8)]">{errors.password}</p>}
          </div>

          {/* Remember / Forgot */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[rgba(180,220,180,0.6)]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-[#00ff41] w-3.5 h-3.5"
              />
              Keep session active
            </label>
            <Link href="/auth/forgot-password" className="font-mono text-[11px] text-[rgba(0,255,65,0.4)] hover:text-[rgba(0,255,65,0.8)] transition-colors tracking-wider uppercase">
              Recover Access
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-[rgba(0,255,65,0.08)] hover:bg-[rgba(0,255,65,0.14)] border border-[rgba(0,255,65,0.35)] hover:border-[rgba(0,255,65,0.65)] rounded-sm text-[#00ff41] font-mono text-sm tracking-[3px] uppercase transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border border-[rgba(0,255,65,0.3)] border-t-[#00ff41] rounded-full animate-spin" />
                Authenticating...
              </>
            ) : (
              "▶ Authenticate"
            )}
          </button>
        </form>

        {/* Register */}
        <div className="mt-5 pt-5 border-t border-[rgba(0,255,65,0.07)] text-center">
          <span className="text-xs text-[rgba(150,200,150,0.45)]">No account? </span>
          <Link href="/auth/register" className="font-mono text-xs text-[rgba(0,255,65,0.55)] hover:text-[#00ff41] transition-colors tracking-wider">
            Create Operator Profile →
          </Link>
        </div>

        {/* Security badges */}
        <div className="flex justify-center gap-6 mt-5">
          {["End-to-End Encrypted", "SOC2 Compliant", "Zero Logging"].map((badge) => (
            <span key={badge} className="font-mono text-[9px] text-[rgba(0,255,65,0.22)] tracking-wider uppercase">{badge}</span>
          ))}
        </div>
      </div>
    </main>
  );
}