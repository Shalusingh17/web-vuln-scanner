"use client";

import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ParticleBackground } from "@/components/ui/ParticleBackground";

/**
 * Shared layout for auth pages: matches marketing site (navbar, footer, cyan theme, particles).
 */
export function AuthPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden font-sans">
      <Navbar />

      <main className="relative flex-1 flex flex-col lg:flex-row">
        {/* Left Side: Visual / Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center items-center overflow-hidden border-r border-slate-800/60 bg-card/30 bg-grid-pattern">
          
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 to-emerald-900/10 pointer-events-none" />
          
          <ParticleBackground
            particleCount={30}
            className="pointer-events-none opacity-40"
          />

          {/* Central Animated Graphic */}
          <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
            <div className="relative flex h-48 w-48 items-center justify-center rounded-full border border-cyan-500/20 bg-slate-900/50 shadow-[0_0_50px_-10px_rgba(0,229,255,0.4)] backdrop-blur-xl pulse-green">
              <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-[spin_10s_linear_infinite]" />
              <div className="absolute inset-4 rounded-full border border-cyan-500/40 border-dashed animate-[spin_15s_linear_infinite_reverse]" />
              
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-cyan-500/10 to-transparent animate-[shimmer-cyber_3s_infinite]" />
              
              <div className="z-20 text-cyan-400">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
            </div>

            <div className="text-center space-y-2 max-w-sm glass p-6 rounded-xl border border-cyan-500/20 cyber-border-glow">
              <h2 className="text-2xl font-bold tracking-tight text-white uppercase font-mono">
                System Access
              </h2>
              <p className="text-sm text-cyan-400/80 font-mono">
                &gt; Secure channel established.<br/>
                &gt; Awaiting authentication...
              </p>
            </div>
          </div>
          
          {/* Decorative glowing orbs */}
          <div className="pointer-events-none absolute top-20 left-20 h-64 w-64 animate-pulse rounded-full bg-cyan-600/10 blur-[80px]" />
          <div className="pointer-events-none absolute bottom-20 right-20 h-64 w-64 animate-pulse rounded-full bg-emerald-600/10 blur-[80px] [animation-delay:2s]" />
        </div>

        {/* Right Side: Auth Form Container */}
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 md:py-20 lg:w-1/2 relative bg-slate-950">
          
          {/* Subtle mobile background */}
          <div className="absolute inset-0 bg-grid-pattern opacity-30 lg:hidden pointer-events-none" />
          <div className="pointer-events-none absolute top-24 left-[10%] h-72 w-72 animate-pulse rounded-full bg-cyan-500/10 blur-3xl lg:hidden" />
          
          <div className="relative z-10 w-full max-w-md">
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
