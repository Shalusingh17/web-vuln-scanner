"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield, Zap, Database, Code, Lock, Globe, Search,
  FileText, ChevronRight, CheckCircle, Terminal,
  AlertTriangle, XCircle, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";

const features = [
  { icon: Database, label: "SQL injection", desc: "Detect all SQLi variants including blind and time-based", color: "text-red-400", bg: "bg-red-500/10" },
  { icon: Code, label: "XSS scanner", desc: "Reflected, stored, and DOM-based XSS detection", color: "text-orange-400", bg: "bg-orange-500/10" },
  { icon: Lock, label: "SSL/TLS checker", desc: "Certificate validity, cipher suite and protocol checks", color: "text-blue-400", bg: "bg-blue-500/10" },
  { icon: Shield, label: "Security headers", desc: "CSP, HSTS, X-Frame-Options and 12 more headers", color: "text-green-400", bg: "bg-green-500/10" },
  { icon: Globe, label: "CORS scanner", desc: "Detect dangerous cross-origin policy misconfigurations", color: "text-purple-400", bg: "bg-purple-500/10" },
  { icon: Search, label: "Subdomain finder", desc: "Enumerate all subdomains and check their security", color: "text-yellow-400", bg: "bg-yellow-500/10" },
  { icon: FileText, label: "PDF reports", desc: "Download full vulnerability reports in PDF format", color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { icon: Zap, label: "AI fix suggestions", desc: "GPT-powered remediation for every vulnerability found", color: "text-pink-400", bg: "bg-pink-500/10" },
];

const terminalLines = [
  { time: "00:01", type: "info", text: "Starting scan → target: example.com" },
  { time: "00:02", type: "success", text: "SSL certificate valid · expires 2026-08-10" },
  { time: "00:04", type: "warning", text: "Missing header: Content-Security-Policy" },
  { time: "00:06", type: "warning", text: "Missing header: X-Frame-Options" },
  { time: "00:08", type: "critical", text: "SQL injection found → /login?id=1'" },
  { time: "00:10", type: "high", text: "Reflected XSS → /search?q=<script>" },
  { time: "00:12", type: "success", text: "No open redirects detected" },
  { time: "00:14", type: "info", text: "Generating AI fix suggestions..." },
];

const typeColors: Record<string, string> = {
  info: "text-blue-400",
  success: "text-green-400",
  warning: "text-yellow-400",
  critical: "text-red-400",
  high: "text-orange-400",
};

const typeIcons: Record<string, React.ReactNode> = {
  info: <Info className="h-3 w-3" />,
  success: <CheckCircle className="h-3 w-3" />,
  warning: <AlertTriangle className="h-3 w-3" />,
  critical: <XCircle className="h-3 w-3" />,
  high: <AlertTriangle className="h-3 w-3" />,
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" },
  }),
};

export default function LandingPage() {
  const [url, setUrl] = useState("");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-24 px-4">
        {/* Background grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Badge
              variant="outline"
              className="mb-6 border-primary/30 bg-primary/5 text-primary px-4 py-1.5 text-sm"
            >
              <Zap className="mr-2 h-3.5 w-3.5" />
              OWASP Top 10 · 30+ scanner modules · AI-powered fixes
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight"
          >
            Find vulnerabilities{" "}
            <span className="text-primary">before attackers do</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Enterprise-grade web security scanning with AI-powered fix
            recommendations. Detect SQL injection, XSS, CSRF, misconfigurations
            and more — completely free.
          </motion.p>

          {/* Scan input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8"
          >
            <Input
              type="url"
              placeholder="https://yourwebsite.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-12 bg-card border-border text-base"
            />
            <Link href={url ? `/dashboard/scan?url=${encodeURIComponent(url)}` : "/auth/register"}>
              <Button
                size="lg"
                className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 whitespace-nowrap w-full sm:w-auto"
              >
                <Shield className="mr-2 h-4 w-4" />
                Scan now — free
              </Button>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="text-xs text-muted-foreground"
          >
            No credit card required · Only scan sites you own or have permission to test
          </motion.p>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────── */}
      <section className="border-y border-border bg-card/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {[
              { num: "30+", label: "Scanner modules" },
              { num: "OWASP", label: "Top 10 coverage" },
              { num: "AI", label: "Fix suggestions" },
              { num: "Free", label: "No credit card" },
            ].map((stat, i) => (
              <div key={i} className="py-6 px-8 text-center">
                <div className="text-2xl font-bold text-primary">{stat.num}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section id="features" className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Comprehensive vulnerability coverage
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Every scan checks across all OWASP Top 10 categories and beyond.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Card className="h-full bg-card border-border hover:border-primary/40 transition-colors group cursor-default">
                  <CardContent className="p-6">
                    <div className={`inline-flex p-2.5 rounded-lg ${f.bg} mb-4 group-hover:scale-110 transition-transform`}>
                      <f.icon className={`h-5 w-5 ${f.color}`} />
                    </div>
                    <h3 className="font-semibold mb-2">{f.label}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE TERMINAL ─────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-4 bg-card/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Watch it work in real time</h2>
            <p className="text-muted-foreground text-lg">
              Every scan streams live results directly to your browser.
            </p>
          </div>

          <Card className="bg-zinc-950 border-zinc-800 overflow-hidden">
            {/* Terminal header bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-900">
              <div className="h-3 w-3 rounded-full bg-red-500/70" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
              <div className="h-3 w-3 rounded-full bg-green-500/70" />
              <span className="ml-3 text-xs text-zinc-500 font-mono">
                vulnscanner — scan: example.com
              </span>
            </div>

            <CardContent className="p-6 font-mono text-sm space-y-2">
              {terminalLines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-zinc-600 text-xs w-12 shrink-0">[{line.time}]</span>
                  <span className={`shrink-0 ${typeColors[line.type]}`}>
                    {typeIcons[line.type]}
                  </span>
                  <span className={typeColors[line.type]}>{line.text}</span>
                </motion.div>
              ))}
              {/* Blinking cursor */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-zinc-600 text-xs w-12 shrink-0">[00:15]</span>
                <span className="inline-block w-2 h-4 bg-primary animate-pulse" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to secure your application?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join thousands of developers scanning their apps with VulnScanner.
            No credit card. No limits on free tier.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="px-10 bg-primary text-primary-foreground hover:bg-primary/90">
                Get started free
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="px-10">
                Log in
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="border-t border-border py-10 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span>VulnScanner · Open source security tool</span>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/docs" className="hover:text-foreground transition-colors">Docs</Link>
            <a href="https://github.com" className="hover:text-foreground transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}