"use client";

import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ParticleBackground } from "@/components/ui/ParticleBackground";

/**
 * Shared layout for auth pages: matches marketing site (navbar, footer, cyan theme, particles).
 */
export function AuthPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-foreground flex flex-col overflow-x-hidden">
      <Navbar />

      <main className="relative flex-1 flex flex-col">
        <ParticleBackground
          particleCount={20}
          className="pointer-events-none opacity-50"
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0, 229, 255, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 255, 0.12) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div
          className="pointer-events-none absolute top-24 left-[10%] h-72 w-72 animate-pulse rounded-full bg-cyan-500/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-32 right-[10%] h-72 w-72 animate-pulse rounded-full bg-blue-600/20 blur-3xl [animation-delay:1s]"
          aria-hidden
        />

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-16 md:py-20">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
