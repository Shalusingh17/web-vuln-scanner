"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield,
  Zap,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassmorphicCard } from "@/components/ui/GlassmorphicCard";
import { GradientText } from "@/components/ui/GradientText";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { GlowingBadge } from "@/components/ui/GlowingBadge";
import { FeatureModal } from "@/components/ui/FeatureModal";
import { FEATURES } from "@/lib/constants";
import {
  fadeUp,
  fadeInScale,
  containerVariants,
  itemVariants,
  floatingAnimation,
} from "@/lib/animations";

const stats = [
  { num: "30+", label: "Detection Modules" },
  { num: "OWASP", label: "Top 10 Coverage" },
  { num: "AI", label: "Powered Fixes" },
  { num: "Free", label: "No Credit Card" },
];

const terminalLines = [
  { time: "00:01", type: "info", text: "Starting scan → target: example.com" },
  {
    time: "00:02",
    type: "success",
    text: "SSL certificate valid · expires 2026-08-10",
  },
  {
    time: "00:04",
    type: "warning",
    text: "Missing header: Content-Security-Policy",
  },
  { time: "00:06", type: "warning", text: "Missing header: X-Frame-Options" },
  {
    time: "00:08",
    type: "critical",
    text: "SQL injection found → /login?id=1'",
  },
  {
    time: "00:10",
    type: "high",
    text: "Reflected XSS → /search?q=<script>",
  },
  { time: "00:12", type: "success", text: "No open redirects detected" },
  {
    time: "00:14",
    type: "info",
    text: "Generating AI fix suggestions...",
  },
];

const typeColors: Record<string, string> = {
  info: "text-blue-400",
  success: "text-green-400",
  warning: "text-yellow-400",
  critical: "text-red-400",
  high: "text-orange-400",
};

const typeIcons: Record<string, React.ReactNode> = {
  info: <AlertTriangle className="h-3 w-3" />,
  success: <CheckCircle2 className="h-3 w-3" />,
  warning: <AlertTriangle className="h-3 w-3" />,
  critical: <AlertTriangle className="h-3 w-3" />,
  high: <AlertTriangle className="h-3 w-3" />,
};

export default function LandingPage() {
  const [url, setUrl] = useState("");
  const [selectedFeature, setSelectedFeature] = useState<typeof FEATURES[0] | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-foreground overflow-hidden">
      <Navbar />

      {/* ──────────────────────────────────── HERO ──────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center py-24 px-4 overflow-hidden">
        {/* Animated background particles */}
        <ParticleBackground particleCount={25} className="opacity-60" />

        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(0deg, rgba(0, 229, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 255, 0.1) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* Glow orbs */}
        <motion.div
          className="absolute top-20 left-10 w-80 h-80 bg-cyan-500 rounded-full opacity-20 blur-3xl"
          animate={{
            y: [0, 50, 0],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500 rounded-full opacity-20 blur-3xl"
          animate={{
            y: [0, -50, 0],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="container mx-auto max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <GlowingBadge variant="primary" size="md">
              <Zap className="h-4 w-4" />
              <span>Enterprise Security for Developers</span>
            </GlowingBadge>
          </motion.div>

          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mb-8 flex w-full justify-center px-2 sm:px-4"
          >
            <div className="w-full max-w-4xl text-center">
              <h1 className="text-balance text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="block">Find vulnerabilities</span>
                <span className="mt-2 block sm:mt-3">
                  <GradientText animated className="inline-block font-bold">
                    before attackers do
                  </GradientText>
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-gray-400 sm:text-lg md:text-xl md:leading-relaxed">
                Enterprise-grade web security scanning with AI-powered fix
                recommendations. Detect SQL injection, XSS, CSRF, and more —
                completely free.
              </p>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link
              href={
                url
                  ? `/dashboard/scan?url=${encodeURIComponent(url)}`
                  : "/auth/register"
              }
            >
              <AnimatedButton
                size="lg"
                variant="primary"
                glowing
                className="whitespace-nowrap"
              >
                <Shield className="h-5 w-5" />
                Start Free Scan
              </AnimatedButton>
            </Link>

            <Link href="/#features">
              <AnimatedButton
                size="lg"
                variant="outline"
                className="whitespace-nowrap"
              >
                <ArrowRight className="h-5 w-5" />
                Explore Features
              </AnimatedButton>
            </Link>
          </motion.div>

          {/* URL Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-6"
          >
            <input
              type="url"
              placeholder="https://yourwebsite.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 px-6 py-3 bg-slate-900/50 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 hover:border-cyan-500/40 focus:outline-none focus:border-cyan-500/60 transition-colors"
            />
          </motion.div>

          {/* Disclaimer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-sm text-gray-500 text-center"
          >
            No credit card required · Only scan sites you own or have permission
            to test
          </motion.p>
        </div>
      </section>

      {/* ──────────────────────────────────── STATS ──────────────────────────────────── */}
      <section className="relative py-16 border-y border-cyan-500/10 bg-slate-900/30 backdrop-blur-xl">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="py-6 px-4 md:px-8 text-center border-r border-cyan-500/10 last:border-r-0"
              >
                <div className="text-2xl md:text-3xl font-bold text-cyan-400">
                  {stat.num}
                </div>
                <div className="text-xs md:text-sm text-gray-400 mt-2">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────── FEATURES ──────────────────────────────────── */}
      <section id="features" className="relative scroll-mt-28 py-32 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Comprehensive<br />
              <span className="text-cyan-400">vulnerability coverage</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Every scan checks across all OWASP Top 10 categories and beyond.
              Get detailed results with AI-powered remediation guidance.
            </p>
          </motion.div>

          {/* Features grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.id}
                id={`feature-${feature.id}`}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="scroll-mt-32"
              >
                <GlassmorphicCard
                  hoverable
                  glowing
                  delay={i * 0.05}
                  className="h-full p-6 cursor-pointer group"
                  onClick={() => setSelectedFeature(feature)}
                >
                  <div
                    className={`inline-flex p-3 rounded-lg ${feature.bgColor} mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>

                  <h3 className="font-bold text-lg mb-2">{feature.label}</h3>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    {feature.shortDesc}
                  </p>

                  <motion.button
                    whileHover={{ x: 5 }}
                    className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold flex items-center gap-2 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFeature(feature);
                    }}
                  >
                    Learn more <ChevronRight className="h-4 w-4" />
                  </motion.button>
                </GlassmorphicCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ──────────────────────────────────── LIVE TERMINAL ──────────────────────────────────── */}
      <section id="how-it-works" className="relative scroll-mt-28 py-32 px-4 bg-slate-900/30">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Watch it work in<br />
              <span className="text-cyan-400">real time</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Every scan streams live results directly to your browser.
            </p>
          </motion.div>

          {/* Terminal */}
          <GlassmorphicCard hoverable={false} glowing className="overflow-hidden">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-cyan-500/10 bg-slate-950/50">
              <div className="h-3 w-3 rounded-full bg-red-500/70" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
              <div className="h-3 w-3 rounded-full bg-green-500/70" />
              <span className="ml-3 text-xs text-gray-500 font-mono">
                vulnscanner — scan: example.com
              </span>
            </div>

            {/* Terminal content */}
            <div className="p-6 font-mono text-sm space-y-2">
              {terminalLines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-gray-600 text-xs w-12 shrink-0">
                    [{line.time}]
                  </span>
                  <span className={`shrink-0 ${typeColors[line.type]}`}>
                    {typeIcons[line.type]}
                  </span>
                  <span className={typeColors[line.type]}>{line.text}</span>
                </motion.div>
              ))}

              {/* Blinking cursor */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-gray-600 text-xs w-12 shrink-0">
                  [00:15]
                </span>
                <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse" />
              </div>
            </div>
          </GlassmorphicCard>
        </div>
      </section>

      {/* ──────────────────────────────────── CTA ──────────────────────────────────── */}
      <section className="relative py-32 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to secure<br />
              <span className="text-cyan-400">your application?</span>
            </h2>

            <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
              Join thousands of developers scanning their apps with VulnScanner.
              No credit card. No limits on free tier.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <AnimatedButton size="lg" variant="primary" glowing>
                  Get started free
                  <ChevronRight className="h-5 w-5" />
                </AnimatedButton>
              </Link>
              <Link href="/auth/login">
                <AnimatedButton size="lg" variant="outline">
                  Already have an account?
                </AnimatedButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Modal */}
      <FeatureModal
        feature={selectedFeature}
        onClose={() => setSelectedFeature(null)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}