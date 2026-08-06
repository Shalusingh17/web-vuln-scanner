"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Shield, Eye, EyeOff } from "lucide-react";
import { AuthPageShell } from "@/components/AuthPageShell";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseResponseJson } from "@/lib/parseResponseJson";


export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (value: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(value);
  };

  const validatePassword = (pwd: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/.test(
      pwd
    );
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
      newErrors.password =
        "Use 8+ chars with upper, lower, number, and !@#$%^&*";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      type RegisterErrorBody = {
        message?: string;
        details?: { errors?: Array<{ field: string; message: string }> };
      };
      const parsed = await parseResponseJson<RegisterErrorBody>(res);

      if (!res.ok) {
        if (parsed.ok && parsed.data.details?.errors) {
          const fieldErrors: Record<string, string> = {};
          parsed.data.details.errors.forEach((err) => {
            fieldErrors[err.field] = err.message;
          });
          setErrors(fieldErrors);
          toast.error("Registration failed");
        } else if (parsed.ok) {
          const message = parsed.data.message || "Registration failed";
          setErrors({ general: message });
          toast.error(message);
        } else {
          setErrors({ general: parsed.message });
          toast.error(parsed.message);
        }
        return;
      }

      toast.success("Account created successfully");
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

  const inputClass =
    "h-11 border-cyan-500/20 bg-slate-950/50 px-3 text-white placeholder:text-gray-500 focus-visible:border-cyan-500/50";

  return (
    <AuthPageShell>
      
      <div className="w-full max-w-md">
        <div className="relative overflow-hidden rounded-2xl glass-lg p-8 cyber-border-glow md:p-10">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-950 to-emerald-950 border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Start scanning with{" "}
              <span className="text-cyan-400">VulnScanner</span> in minutes.
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

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">
                Full name
              </Label>
              <Input
                id="name"
                autoComplete="name"
                placeholder="Jordan Lee"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((p) => {
                    const { name: _n, ...rest } = p;
                    return rest;
                  });
                }}
                className={inputClass}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-xs text-red-400">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="reg-email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((p) => {
                    const { email: _e, ...rest } = p;
                    return rest;
                  });
                }}
                className={inputClass}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-password" className="text-gray-300">
                Password
              </Label>
              <p className="text-xs text-gray-500">
                8+ characters, upper & lower case, number, and{" "}
                <span className="font-mono text-gray-400">!@#$%^&*</span>
              </p>
              <div className="relative">
                <Input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((p) => {
                      const { password: _p, ...rest } = p;
                      return rest;
                    });
                  }}
                  className={`${inputClass} pr-11`}
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

            <div className="space-y-2">
              <Label htmlFor="confirm" className="text-gray-300">
                Confirm password
              </Label>
              <Input
                id="confirm"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors((p) => {
                    const { confirmPassword: _c, ...rest } = p;
                    return rest;
                  });
                }}
                className={inputClass}
                aria-invalid={!!errors.confirmPassword}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            <AnimatedButton
              type="submit"
              loading={isLoading}
              size="lg"
              variant="primary"
              glowing
              className="mt-2 w-full"
            >
              Create account
            </AnimatedButton>
          </form>

          <p className="mt-8 border-t border-cyan-500/10 pt-6 text-center text-sm text-gray-500">
            Already registered?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </AuthPageShell>
  );
}
