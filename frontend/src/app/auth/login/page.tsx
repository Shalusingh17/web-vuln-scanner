"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Shield, Eye, EyeOff } from "lucide-react";
import { AuthPageShell } from "@/components/AuthPageShell";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseResponseJson } from "@/lib/parseResponseJson";



export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
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

      const parsed = await parseResponseJson<{ message?: string }>(res);

      if (!res.ok) {
        const general = parsed.ok
          ? parsed.data.message ?? "Sign in failed. Try again."
          : parsed.message;

        setErrors({ general });
        toast.error(general);
        return;
      }

      toast.success("Signed in successfully");
      router.push("/dashboard");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Connection error. Please try again.";
      setErrors({ general: message });
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthPageShell>
      <div className="w-full max-w-md">
        <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-8 shadow-[0_0_40px_-10px_rgba(0,229,255,0.35)] backdrop-blur-xl md:p-10">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/30">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Sign in to <span className="text-cyan-400">VulnScanner</span> to
              continue to your dashboard.
            </p>
          </div>

          {errors.general && (
            <div
              role="alert"
              className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
            >
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((p) => ({ ...p, email: undefined }));
                }}
                className="h-11 border-cyan-500/20 bg-slate-950/50 px-3 text-white placeholder:text-gray-500 focus-visible:border-cyan-500/50"
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((p) => ({ ...p, password: undefined }));
                  }}
                  className="h-11 border-cyan-500/20 bg-slate-950/50 pr-11 pl-3 text-white placeholder:text-gray-500 focus-visible:border-cyan-500/50"
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500 transition-colors hover:bg-cyan-500/10 hover:text-cyan-400"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400">{errors.password}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-gray-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-cyan-500/40 bg-slate-950 text-cyan-500 focus:ring-cyan-500/30"
                />
                Remember me
              </label>
              <Link
                href="/docs#auth"
                className="text-cyan-400/90 transition-colors hover:text-cyan-300"
              >
                Account help
              </Link>
            </div>

            <AnimatedButton
              type="submit"
              loading={isLoading}
              size="lg"
              variant="primary"
              glowing
              className="w-full"
            >
              Sign in
            </AnimatedButton>
          </form>

          <p className="mt-8 border-t border-cyan-500/10 pt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </AuthPageShell>
  );
}
