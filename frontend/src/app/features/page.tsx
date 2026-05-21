"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Shield,
  Wrench,
  Activity,
  Cpu,
  Search,
  Zap,
  Lock,
  Gauge,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import type { ReactNode } from "react";

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1 text-xs font-semibold tracking-wide text-cyan-300">
        <Sparkles className="h-3.5 w-3.5" />
        {eyebrow}
      </div>
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, delay }}
    >
      {children}
    </motion.div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  bullets,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  bullets: string[];
}) {
  return (
    <Card className="relative overflow-hidden border-cyan-500/20 bg-gradient-to-b from-slate-900/80 to-slate-950/40 p-6 shadow-[0_0_60px_-20px_rgba(34,211,238,0.25)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_circle_at_20%_0%,rgba(34,211,238,0.18),transparent_40%)]" />
      <div className="relative">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/5 text-cyan-300 shadow-[0_0_25px_-5px_rgba(34,211,238,0.35)]">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-gray-200">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2">
              <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-cyan-400/90 shadow-[0_0_18px_rgba(34,211,238,0.7)]" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

export default function FeaturesPage() {
  const pathname = usePathname();

  const activeSubtab = pathname?.startsWith("/features") ? "features" : "";

  const tabs = [
    { id: "features", label: "Detection" },
    { id: "recommendations", label: "AI Fixes" },
    { id: "dashboard", label: "Dashboard" },
  ] as const;

  const cards = [
    {
      icon: <Search className="h-5 w-5" />,
      title: "Continuous Vulnerability Detection",
      description:
        "Automated scans find real-world web issues—misconfigurations, injection vectors, and auth gaps.",
      bullets: [
        "OWASP-inspired scan paths",
        "Context-aware checks (less false positives)",
        "Severity scoring you can trust",
      ],
    },
    {
      icon: <Lock className="h-5 w-5" />,
      title: "Cybersecurity-First Reporting",
      description:
        "Clear, developer-friendly reports with remediation-ready evidence.",
      bullets: [
        "Repro steps & affected endpoints",
        "Risk summaries with impact analysis",
        "Audit-ready exports",
      ],
    },
    {
      icon: <Cpu className="h-5 w-5" />,
      title: "Fast & Repeatable Scans",
      description:
        "Run scans on demand or integrate into CI—so security stays current, not seasonal.",
      bullets: [
        "Smarter crawling & targeted payloads",
        "Detections organized by exploitability",
        "Actionable diffs between runs",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <ParticleBackground />

      {/* Navbar */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* Hero */}
      <header className="relative z-10 pt-16 sm:pt-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <FadeUp delay={0.05}>
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-2 text-xs font-semibold tracking-wide text-cyan-200 shadow-[0_0_35px_-10px_rgba(34,211,238,0.35)]">
                  <Shield className="h-4 w-4" />
                  Premium Security Features for Modern Teams
                </div>
              </FadeUp>

              <FadeUp delay={0.12}>
                <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
                  Find vulnerabilities.
                  <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Fix them faster with AI.
                  </span>
                </h1>
              </FadeUp>

              <FadeUp delay={0.2}>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  VULN Scanner gives you a cybersecurity-grade detection pipeline and
                  AI-driven remediation guidance—designed for developers, not just reports.
                </p>
              </FadeUp>

              <FadeUp delay={0.28}>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button
                    asChild
                    className="bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                  >
                    <Link href="/auth/register">
                      Start scanning <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="border-cyan-500/30 text-cyan-100">
                    <Link href="/docs">
                      View documentation
                    </Link>
                  </Button>
                </div>
              </FadeUp>

              <FadeUp delay={0.34}>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {[
                    { k: "0→Action", v: "AI-ready fixes" },
                    { k: "Low noise", v: "Smart detection" },
                    { k: "CI friendly", v: "Repeatable scans" },
                  ].map((s) => (
                    <div
                      key={s.k}
                      className="rounded-2xl border border-cyan-500/15 bg-slate-900/40 p-4 shadow-[0_0_45px_-30px_rgba(34,211,238,0.3)]"
                    >
                      <div className="text-xs font-semibold tracking-wide text-cyan-300">
                        {s.k}
                      </div>
                      <div className="mt-2 text-sm text-gray-200">{s.v}</div>
                    </div>
                  ))}
                </div>
              </FadeUp>
            </div>

            <FadeUp delay={0.35}>
              <div className="relative">
                <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-b from-cyan-500/20 to-transparent blur-2xl" />
                <div className="relative rounded-[2rem] border border-cyan-500/20 bg-slate-900/40 p-5 shadow-[0_0_90px_-40px_rgba(34,211,238,0.4)]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.8)]" />
                      <span className="text-xs font-semibold text-cyan-200">
                        Live Scan Simulation
                      </span>
                    </div>
                    <Badge className="border border-cyan-500/20 bg-cyan-500/10 text-cyan-200">
                      Cybersecurity Mode
                    </Badge>
                  </div>

                  <div className="mt-5 space-y-3">
                    {[
                      { label: "XSS vectors detected", icon: <Zap className="h-4 w-4" /> },
                      { label: "SQLi patterns clustered", icon: <Activity className="h-4 w-4" /> },
                      { label: "SSRF sink mapping complete", icon: <Gauge className="h-4 w-4" /> },
                    ].map((row, idx) => (
                      <motion.div
                        key={row.label}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.05 + idx * 0.08 }}
                        className="flex items-center justify-between rounded-xl border border-cyan-500/15 bg-slate-950/40 px-4 py-3"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-300">{row.icon}</span>
                          <span className="text-sm text-gray-200">{row.label}</span>
                        </div>
                        <span className="text-xs font-semibold text-cyan-200">
                          Verified
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  <Separator className="my-5 bg-cyan-500/15" />

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-cyan-500/15 bg-slate-950/30 p-4">
                      <div className="text-xs font-semibold text-cyan-300">Risk Focus</div>
                      <div className="mt-2 text-sm text-gray-200">Injection + Auth Bypass</div>
                    </div>
                    <div className="rounded-xl border border-cyan-500/15 bg-slate-950/30 p-4">
                      <div className="text-xs font-semibold text-cyan-300">Recommendation</div>
                      <div className="mt-2 text-sm text-gray-200">AI Patch Plan Ready</div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </header>

      {/* Feature cards */}
      <main className="relative z-10">
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <SectionTitle
              eyebrow="What you get"
              title="Built for real-world security teams"
              description="A cybersecurity-grade platform experience: detections you can explain, and fixes you can ship."
            />

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {cards.map((c, i) => (
                <FadeUp key={c.title} delay={i * 0.08}>
                  <FeatureCard
                    icon={c.icon}
                    title={c.title}
                    description={c.description}
                    bullets={c.bullets}
                  />
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* Vulnerability detection showcase */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <SectionTitle
              eyebrow="Detection Showcase"
              title="See vulnerabilities as structured intelligence"
              description="Not a wall of alerts—ranked evidence, reproducible steps, and severity you can use."
            />

            <div className="mt-10 grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <FadeUp>
                  <Card className="relative overflow-hidden border-cyan-500/20 bg-gradient-to-b from-slate-900/80 to-slate-950/30 p-6">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_10%_0%,rgba(34,211,238,0.18),transparent_42%)]" />
                    <div className="relative">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="text-xs font-semibold tracking-wide text-cyan-300">
                            Vulnerability Timeline
                          </div>
                          <h3 className="mt-2 text-lg font-semibold text-white">
                            Prioritize the right fixes first
                          </h3>
                        </div>
                        <Badge className="border border-cyan-500/20 bg-cyan-500/10 text-cyan-200">
                          High-signal mode
                        </Badge>
                      </div>

                      <div className="mt-5 space-y-4">
                        {[
                          {
                            severity: "Critical",
                            label: "Reflected XSS in search parameter",
                            detail:
                              "Payload execution confirmed with contextual escaping checks.",
                          },
                          {
                            severity: "High",
                            label: "SQLi in login query path",
                            detail:
                              "Detected injection reachability and consistent error fingerprints.",
                          },
                          {
                            severity: "Medium",
                            label: "SSRF sink exposure via URL fetcher",
                            detail:
                              "Validated allowlist bypass attempt and internal metadata leak risk.",
                          },
                        ].map((it, idx) => (
                          <motion.div
                            key={it.label}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.35, delay: idx * 0.06 }}
                            className="rounded-2xl border border-cyan-500/15 bg-slate-950/40 p-4"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <div className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                                  {it.severity}
                                </div>
                                <div className="mt-1 text-sm font-semibold text-white">
                                  {it.label}
                                </div>
                                <div className="mt-2 text-sm text-muted-foreground">
                                  {it.detail}
                                </div>
                              </div>
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/5 text-cyan-200">
                                {idx === 0 ? (
                                  <Zap className="h-5 w-5" />
                                ) : idx === 1 ? (
                                  <Cpu className="h-5 w-5" />
                                ) : (
                                  <Shield className="h-5 w-5" />
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm text-muted-foreground">
                          Evidence is normalized to developer-friendly remediation steps.
                        </div>
                        <Button asChild variant="outline" className="border-cyan-500/30 text-cyan-100">
                          <Link href="/dashboard/scan">
                            Run a scan preview
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </FadeUp>
              </div>

              <div className="lg:col-span-5">
                <FadeUp delay={0.08}>
                  <Card className="border-cyan-500/20 bg-slate-900/30 p-6">
                    <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-cyan-300">
                      <Search className="h-4 w-4" />
                      Exploitability Lens
                    </div>
                    <h3 className="mt-2 text-lg font-semibold">What matters most?</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Our ranking emphasizes reachability, impact, and likelihood—so teams fix what’s truly exploitable.
                    </p>

                    <div className="mt-5 space-y-3">
                      {[
                        { label: "Reachability", v: 92 },
                        { label: "Impact", v: 84 },
                        { label: "Likelihood", v: 78 },
                      ].map((m) => (
                        <div key={m.label} className="rounded-xl border border-cyan-500/15 bg-slate-950/30 p-4">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-cyan-200">{m.label}</span>
                            <span className="text-muted-foreground">{m.v}%</span>
                          </div>
                          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-cyan-500/10">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${m.v}%` }}
                              viewport={{ once: true }}
transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_25px_-5px_rgba(34,211,238,0.5)]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-6 bg-cyan-500/15" />

                    <div className="rounded-2xl border border-cyan-500/15 bg-gradient-to-b from-cyan-500/10 to-transparent p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-cyan-200">
                        <Shield className="h-4 w-4" />
                        Cybersecurity-grade output
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        Evidence is phrased for remediation, not confusion.
                      </div>
                    </div>
                  </Card>
                </FadeUp>
              </div>
            </div>
          </div>
        </section>

        {/* AI fix recommendation section */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <SectionTitle
              eyebrow="AI Fix Recommendation"
              title="Turn detections into patch-ready guidance"
              description="Get concrete recommendations: what to change, where to change it, and why it fixes the issue."
            />

            <div className="mt-10 grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <FadeUp>
                  <Card className="border-cyan-500/20 bg-gradient-to-b from-slate-900/80 to-slate-950/30 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1 text-xs font-semibold text-cyan-200">
                          <Wrench className="h-3.5 w-3.5" />
                          AI Patch Plan
                        </div>
                        <h3 className="mt-3 text-xl font-semibold text-white">
                          Recommended remediation for high-risk findings
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Example outputs aligned to secure coding patterns and modern frameworks.
                        </p>
                      </div>
                      <Badge className="border border-cyan-500/20 bg-cyan-500/10 text-cyan-200">
                        Patch-first
                      </Badge>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      {[
                        {
                          title: "XSS: output encoding",
                          desc: "Escape HTML contextually, avoid raw insertion, and validate input boundaries.",
                          tag: "Prevention",
                          icon: <Zap className="h-5 w-5" />,
                        },
                        {
                          title: "SQLi: parameterized queries",
                          desc: "Use bound parameters and enforce strict query construction policies.",
                          tag: "Harden",
                          icon: <Cpu className="h-5 w-5" />,
                        },
                        {
                          title: "SSRF: strict URL allowlisting",
                          desc: "Block internal ranges and validate schemes + destinations before fetch.",
                          tag: "Control",
                          icon: <Lock className="h-5 w-5" />,
                        },
                        {
                          title: "Auth bypass: RBAC enforcement",
                          desc: "Harden middleware and ensure authorization checks occur server-side.",
                          tag: "Secure",
                          icon: <Shield className="h-5 w-5" />,
                        },
                      ].map((p) => (
                        <div
                          key={p.title}
                          className="rounded-2xl border border-cyan-500/15 bg-slate-950/40 p-4"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <span className="text-cyan-300">{p.icon}</span>
                              <div className="text-sm font-semibold text-white">{p.title}</div>
                            </div>
                            <Badge className="border border-cyan-500/20 bg-cyan-500/10 text-cyan-200">
                              {p.tag}
                            </Badge>
                          </div>
                          <div className="mt-3 text-sm text-muted-foreground">{p.desc}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 rounded-2xl border border-cyan-500/15 bg-slate-950/30 p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-cyan-200">
                        <Sparkles className="h-4 w-4" />
                        AI recommendation style
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        We generate practical patch guidance:
                        <span className="text-gray-200"> secure coding changes</span>,
                        <span className="text-gray-200"> confidence notes</span>,
                        and <span className="text-gray-200"> verification steps</span>.
                      </p>
                    </div>
                  </Card>
                </FadeUp>
              </div>

              <div className="lg:col-span-5">
                <FadeUp delay={0.08}>
                  <Card className="border-cyan-500/20 bg-slate-900/30 p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-sm font-semibold text-white">Interactive Preview</div>
                      <div className="text-xs font-semibold text-cyan-200">{activeSubtab}</div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {tabs.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          className={[
                            "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                            t.id === "features"
                              ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-200"
                              : "border-cyan-500/15 bg-slate-950/30 text-muted-foreground",
                          ].join(" ")}
                          onClick={() => {
                            // Keep it presentational; routing is handled by Navbar tabs.
                          }}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>

                    <Separator className="my-5 bg-cyan-500/15" />

                    <div className="space-y-4">
                      {[
                        {
                          title: "Before",
                          body: "Raw user input reaching a sensitive sink.",
                          tone: "text-amber-200",
                        },
                        {
                          title: "After",
                          body: "Validated + parameterized handling with output encoding.",
                          tone: "text-cyan-200",
                        },
                      ].map((block) => (
                        <div
                          key={block.title}
                          className="rounded-2xl border border-cyan-500/15 bg-slate-950/35 p-4"
                        >
                          <div className="text-xs font-semibold tracking-wide text-cyan-300">
                            {block.title}
                          </div>
                          <div className={`mt-2 text-sm font-semibold ${block.tone}`}>
                            {block.body}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <Button asChild className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 hover:from-cyan-400 hover:to-blue-400">
                        <Link href="/dashboard">
                          View security dashboard
                        </Link>
                      </Button>
                    </div>
                  </Card>
                </FadeUp>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard preview */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <SectionTitle
              eyebrow="Dashboard Preview"
              title="Security visibility your team will actually use"
              description="Track findings, prioritize by risk, and turn scan results into engineering momentum."
            />

            <div className="mt-10 grid gap-8 lg:grid-cols-12">
              <FadeUp className="lg:col-span-5" delay={0.05}>
                <Card className="border-cyan-500/20 bg-slate-900/30 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-sm font-semibold text-white">Risk Overview</div>
                    <Badge className="border border-cyan-500/20 bg-cyan-500/10 text-cyan-200">
                      Updated now
                    </Badge>
                  </div>
                  <div className="mt-5 space-y-3">
                    {[
                      { label: "Critical", v: 2 },
                      { label: "High", v: 5 },
                      { label: "Medium", v: 11 },
                      { label: "Low", v: 24 },
                    ].map((r, idx) => (
                      <div key={r.label} className="flex items-center justify-between rounded-xl border border-cyan-500/15 bg-slate-950/35 px-4 py-3">
                        <div className="text-sm text-muted-foreground">{r.label}</div>
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.35, delay: idx * 0.05 }}
                          className="text-sm font-semibold text-cyan-200"
                        >
                          {r.v}
                        </motion.div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-6 bg-cyan-500/15" />

                  <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-cyan-200">
                      <Gauge className="h-4 w-4" />
                      Sprint readiness
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Detections are grouped into fixable engineering work units.
                    </p>
                  </div>
                </Card>
              </FadeUp>

              <FadeUp className="lg:col-span-7" delay={0.12}>
                <Card className="relative overflow-hidden border-cyan-500/20 bg-gradient-to-b from-slate-900/80 to-slate-950/30 p-6">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_circle_at_100%_0%,rgba(34,211,238,0.18),transparent_42%)]" />
                  <div className="relative">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-xs font-semibold tracking-wide text-cyan-300">
                          Action Feed
                        </div>
                        <h3 className="mt-2 text-lg font-semibold">What your team should do next</h3>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Activity className="h-4 w-4 text-cyan-300" />
                        Live
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      {[
                        {
                          title: "Patch SQLi in login handler",
                          meta: "Owner: Backend • Due: Today",
                          icon: <Cpu className="h-4 w-4" />,
                        },
                        {
                          title: "Mitigate SSRF sink allowlist bypass",
                          meta: "Owner: Platform • Due: This week",
                          icon: <Shield className="h-4 w-4" />,
                        },
                        {
                          title: "Fix reflected XSS in search endpoint",
                          meta: "Owner: Web • Due: This week",
                          icon: <Zap className="h-4 w-4" />,
                        },
                      ].map((it, i) => (
                        <motion.div
                          key={it.title}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.35, delay: 0.02 + i * 0.06 }}
                          className="rounded-2xl border border-cyan-500/15 bg-slate-950/40 px-4 py-4"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/5 text-cyan-200">
                                {it.icon}
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-white">
                                  {it.title}
                                </div>
                                <div className="mt-1 text-sm text-muted-foreground">
                                  {it.meta}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              className="border-cyan-500/30 bg-slate-950/20 text-cyan-100"
                              asChild
                            >
                              <Link href="/dashboard/scan">Open</Link>
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Card>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* Cybersecurity theme callout */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden rounded-[2rem] border border-cyan-500/20 bg-gradient-to-r from-slate-900/60 via-slate-950/20 to-slate-900/60 p-8 shadow-[0_0_80px_-40px_rgba(34,211,238,0.45)]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_0%,rgba(34,211,238,0.18),transparent_45%)]" />
              <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-7">
                  <FadeUp>
                    <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                      Cybersecurity isn’t a one-time scan.
                      <span className="block text-cyan-200">
                        It’s an ongoing system.
                      </span>
                    </h3>
                    <p className="mt-3 text-muted-foreground">
                      VULN Scanner helps you keep security current with repeatable
                      workflows, explainable detection, and remediation plans that your
                      engineers can implement confidently.
                    </p>
                  </FadeUp>
                </div>
                <div className="lg:col-span-5">
                  <FadeUp delay={0.08}>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        { t: "Evidence", d: "Actionable, reproducible context" },
                        { t: "Fixes", d: "AI recommendations built for shipping" },
                        { t: "Visibility", d: "Dashboards that drive momentum" },
                        { t: "Velocity", d: "Fast scans that scale with your needs" },
                      ].map((x) => (
                        <div
                          key={x.t}
                          className="rounded-2xl border border-cyan-500/15 bg-slate-950/35 p-4"
                        >
                          <div className="text-sm font-semibold text-cyan-200">{x.t}</div>
                          <div className="mt-2 text-sm text-muted-foreground">{x.d}</div>
                        </div>
                      ))}
                    </div>
                  </FadeUp>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer spacing */}
      <footer className="pb-10" />
    </div>
  );
}
