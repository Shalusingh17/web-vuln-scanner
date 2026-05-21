"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield,
  Code,
  Lock,
  BookOpen,
  ChevronRight,
  ExternalLink,
  Zap,
  AlertCircle,
  Settings,
  Key,
  BarChart3,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";


// Removed Api/Deploy tabs; keep content below in case you re-add later.
const endpoints = [
  {
    method: "POST",
    path: "/api/auth/register",
    desc: "Create a new user account",
    params: ["email", "password", "name"],
  },
  {
    method: "POST",
    path: "/api/auth/login",
    desc: "Login and receive JWT token",
    params: ["email", "password"],
  },
  {
    method: "GET",
    path: "/api/auth/me",
    desc: "Get current logged-in user",
    params: [],
  },
  {
    method: "POST",
    path: "/api/scan",
    desc: "Start a new website scan",
    params: ["url"],
  },
  {
    method: "GET",
    path: "/api/scans",
    desc: "List all user scans",
    params: [],
  },
  {
    method: "GET",
    path: "/api/scan/:id",
    desc: "Get specific scan results",
    params: ["id"],
  },
];

const faq = [
  {
    q: "Is VulnScanner free?",
    a: "Yes! VulnScanner has a free tier with 2 scans per day. Upgrade to Pro for unlimited scans.",
  },
  {
    q: "Can I scan websites I don't own?",
    a: "No. Only scan websites you own or have explicit permission to test. Unauthorized scanning is illegal.",
  },
  {
    q: "How long does a scan take?",
    a: "Average scans take 30 seconds to 2 minutes depending on website size and complexity.",
  },
  {
    q: "What information do you store?",
    a: "We store scan results, user accounts, and vulnerability findings. All data is encrypted and never shared.",
  },
  {
    q: "Do you offer API access?",
    a: "Yes, Pro and Enterprise plans include full API access for integration with your workflows.",
  },
  {
    q: "Can I export scan reports?",
    a: "Yes, Pro plan includes PDF report download. Enterprise plan supports multiple formats.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" },
  }),
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 px-4">
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
              <BookOpen className="mr-2 h-3.5 w-3.5" />
              Complete documentation
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
          >
            VulnScanner Documentation
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Learn how to use VulnScanner to find and fix vulnerabilities in your web applications.
          </motion.p>
        </div>
      </section>

      {/* ── TOC ───────────────────────────────────────────── */}
      <section className="py-12 px-4 sticky top-16 bg-background/80 backdrop-blur border-b border-border/50 z-40">
        <div className="container mx-auto max-w-4xl">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {["overview", "features", "auth", "faq"].map((id) => (
              <Link
                key={id}
                href={`#${id}`}
                className="px-4 py-2 rounded-lg border border-border/50 text-sm whitespace-nowrap hover:border-primary/50 hover:text-primary transition-colors"
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── OVERVIEW ──────────────────────────────────────── */}
      <section id="overview" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Project Overview</h2>
          </div>

          <Card className="border-border">
            <CardContent className="p-6 sm:p-8">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                VulnScanner is an enterprise-grade web vulnerability scanner that detects security issues in your applications. Built with modern security tools and AI-powered recommendations, VulnScanner helps developers and security teams identify and fix vulnerabilities before attackers do.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { icon: Code, title: "Modern Stack", desc: "Next.js, Express, MongoDB" },
                  { icon: Zap, title: "Fast Scanning", desc: "30 seconds to 2 minutes" },
                  { icon: Lock, title: "Secure", desc: "Enterprise-grade encryption" },
                  { icon: BarChart3, title: "Detailed Reports", desc: "Professional insights" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex-shrink-0">
                      <item.icon className="h-6 w-6 text-primary mt-1" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section id="features" className="py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Scanner Features</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "SQL Injection detection",
              "XSS vulnerability scanning",
              "SSL/TLS validation",
              "Security headers analysis",
              "CORS misconfiguration",
              "Subdomain enumeration",
              "Risk scoring",
              "PDF report generation",
              "AI-powered suggestions",
              "OWASP Top 10 coverage",
              "Cookie security analysis",
              "Server fingerprinting",
            ].map((feature, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <div className="flex items-center gap-3 p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
                  <ChevronRight className="h-5 w-5 text-primary shrink-0" />
                  <span>{feature}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AUTHENTICATION ────────────────────────────────── */}
      <section id="auth" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <Key className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Authentication Flow</h2>
          </div>

          <Card className="border-border mb-8">
            <CardContent className="p-6 sm:p-8">
              <p className="text-muted-foreground mb-6">
                VulnScanner uses JWT (JSON Web Tokens) for stateless authentication. User credentials are securely hashed with bcrypt, and tokens are stored in HTTP-only cookies to prevent XSS attacks.
              </p>

              <div className="space-y-4">
                {[
                  { step: 1, title: "Register", desc: "Create account with email and strong password" },
                  { step: 2, title: "Login", desc: "Submit credentials to receive JWT token" },
                  { step: 3, title: "Token Storage", desc: "Token is stored in HTTP-only cookie" },
                  { step: 4, title: "Auto-refresh", desc: "Token automatically refreshed for 7 days" },
                  { step: 5, title: "Logout", desc: "Token invalidated on logout" },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-primary">{item.step}</span>
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* ── FAQ ───────────────────────────────────────────── */}
      <section id="faq" className="py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faq.map((item, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Card className="border-border hover:border-primary/30 transition-colors">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-primary" />
                      {item.q}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.a}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to secure your application?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Start with a free scan. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="px-10 bg-primary text-primary-foreground hover:bg-primary/90">
                Get started free
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="px-10">
                View pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
