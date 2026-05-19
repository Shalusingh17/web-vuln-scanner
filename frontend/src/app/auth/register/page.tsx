"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const validatePassword = (pwd: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/.test(pwd);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim() || name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!validateEmail(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!validatePassword(password)) {
      newErrors.password = "Password must have uppercase, lowercase, number, and special character (!@#$%^&*)";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data.message || "Registration failed";
        if (data.details?.errors) {
          const fieldErrors: Record<string, string> = {};
          data.details.errors.forEach((err: any) => {
            fieldErrors[err.field] = err.message;
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ general: errorMsg });
        }
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setErrors({ general: "Connection error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050a0e] flex items-center justify-center p-4 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,65,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {["top-5 left-5 border-t border-l","top-5 right-5 border-t border-r","bottom-5 left-5 border-b border-l","bottom-5 right-5 border-b border-r"].map((cls, i) => (
        <div key={i} className={`absolute w-16 h-16 border-[rgba(0,255,65,0.25)] pointer-events-none ${cls}`} />
      ))}

      <div className="relative w-full max-w-md bg-[rgba(8,18,24,0.95)] border border-[rgba(0,255,65,0.2)] rounded-sm p-10 backdrop-blur-md z-10">
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-sm bg-gradient-to-r from-transparent via-[#00ff41] to-transparent" />

        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 bg-[rgba(0,255,65,0.08)] border border-[rgba(0,255,65,0.3)] rounded flex items-center justify-center text-[#00ff41]">
            🛡
          </div>
          <span className="font-mono text-xl text-[#00ff41] tracking-widest uppercase">
            Vuln<span className="opacity-50">Scanner</span>
          </span>
        </div>
        <p className="font-mono text-[10px] text-[rgba(0,255,65,0.4)] tracking-[3px] uppercase mb-7 ml-12">
          Create Operator Profile
        </p>

        {errors.general && (
          <div className="mb-4 px-3 py-2 bg-[rgba(255,60,60,0.08)] border border-[rgba(255,60,60,0.3)] rounded-sm font-mono text-[11px] text-[rgba(255,100,100,0.9)] tracking-wider">
            ⚠ {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Name */}
          <div>
            <label className="block font-mono text-[11px] text-[rgba(0,255,65,0.5)] tracking-[2px] uppercase mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })); }}
              placeholder="John Doe"
              className={`w-full h-11 px-4 bg-[rgba(0,255,65,0.03)] border rounded-sm font-mono text-[13px] text-[#c8ffc8] placeholder-[rgba(0,255,65,0.18)] outline-none transition-all
                ${errors.name ? "border-[rgba(255,60,60,0.5)]" : "border-[rgba(0,255,65,0.15)] focus:border-[rgba(0,255,65,0.5)]"}`}
            />
            {errors.name && <p className="mt-1 font-mono text-[10px] text-[rgba(255,80,80,0.8)]">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block font-mono text-[11px] text-[rgba(0,255,65,0.5)] tracking-[2px] uppercase mb-1.5">
              Email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(0,255,65,0.35)] text-sm">@</span>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); }}
                placeholder="you@domain.com"
                autoComplete="email"
                className={`w-full h-11 pl-8 pr-4 bg-[rgba(0,255,65,0.03)] border rounded-sm font-mono text-[13px] text-[#c8ffc8] placeholder-[rgba(0,255,65,0.18)] outline-none transition-all
                  ${errors.email ? "border-[rgba(255,60,60,0.5)]" : "border-[rgba(0,255,65,0.15)] focus:border-[rgba(0,255,65,0.5)]"}`}
              />
            </div>
            {errors.email && <p className="mt-1 font-mono text-[10px] text-[rgba(255,80,80,0.8)]">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block font-mono text-[11px] text-[rgba(0,255,65,0.5)] tracking-[2px] uppercase mb-1.5">
              Access Key
            </label>
            <p className="text-[9px] text-[rgba(0,255,65,0.3)] mb-2">Min 8 chars: uppercase, lowercase, number, !@#$%^&*</p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(0,255,65,0.35)] text-sm">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
                placeholder="••••••••••••"
                autoComplete="new-password"
                className={`w-full h-11 pl-8 pr-10 bg-[rgba(0,255,65,0.03)] border rounded-sm font-mono text-[13px] text-[#c8ffc8] placeholder-[rgba(0,255,65,0.18)] outline-none transition-all
                  ${errors.password ? "border-[rgba(255,60,60,0.5)]" : "border-[rgba(0,255,65,0.15)] focus:border-[rgba(0,255,65,0.5)]"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(0,255,65,0.35)] hover:text-[rgba(0,255,65,0.7)] text-sm"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
            {errors.password && <p className="mt-1 font-mono text-[10px] text-[rgba(255,80,80,0.8)]">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block font-mono text-[11px] text-[rgba(0,255,65,0.5)] tracking-[2px] uppercase mb-1.5">
              Confirm Access Key
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(0,255,65,0.35)] text-sm">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setErrors(p => ({ ...p, confirmPassword: undefined })); }}
                placeholder="••••••••••••"
                autoComplete="new-password"
                className={`w-full h-11 pl-8 pr-4 bg-[rgba(0,255,65,0.03)] border rounded-sm font-mono text-[13px] text-[#c8ffc8] placeholder-[rgba(0,255,65,0.18)] outline-none transition-all
                  ${errors.confirmPassword ? "border-[rgba(255,60,60,0.5)]" : "border-[rgba(0,255,65,0.15)] focus:border-[rgba(0,255,65,0.5)]"}`}
              />
            </div>
            {errors.confirmPassword && <p className="mt-1 font-mono text-[10px] text-[rgba(255,80,80,0.8)]">{errors.confirmPassword}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 mt-6 bg-[rgba(0,255,65,0.08)] hover:bg-[rgba(0,255,65,0.14)] border border-[rgba(0,255,65,0.35)] hover:border-[rgba(0,255,65,0.65)] rounded-sm text-[#00ff41] font-mono text-sm tracking-[3px] uppercase transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "▶ Create Account"
            )}
          </button>
        </form>

        <div className="mt-5 pt-5 border-t border-[rgba(0,255,65,0.07)] text-center">
          <span className="text-xs text-[rgba(150,200,150,0.45)]">Have account? </span>
          <Link href="/auth/login" className="font-mono text-xs text-[rgba(0,255,65,0.55)] hover:text-[#00ff41] transition-colors tracking-wider">
            Login →
          </Link>
        </div>
      </div>
    </main>
  );
}