"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, X, Zap, Shield, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "Forever free",
    description: "Perfect for individuals and small projects",
    cta: "Get started",
    ctaHref: "/auth/register",
    badge: null,
    features: [
      { included: true, text: "2 scans per day" },
      { included: true, text: "Basic vulnerability detection" },
      { included: true, text: "Security headers check" },
      { included: true, text: "SSL/TLS analysis" },
      { included: true, text: "Email support" },
      { included: false, text: "API access" },
      { included: false, text: "Advanced reports" },
      { included: false, text: "Priority support" },
      { included: false, text: "SIEM integration" },
      { included: false, text: "Custom scanning rules" },
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For developers and small teams",
    cta: "Start free trial",
    ctaHref: "/auth/register",
    badge: "Most popular",
    features: [
      { included: true, text: "Unlimited scans" },
      { included: true, text: "Advanced vulnerability detection" },
      { included: true, text: "Security headers check" },
      { included: true, text: "SSL/TLS analysis" },
      { included: true, text: "XSS & SQLi advanced detection" },
      { included: true, text: "API access" },
      { included: true, text: "Advanced PDF reports" },
      { included: true, text: "Priority email support" },
      { included: false, text: "SIEM integration" },
      { included: false, text: "Custom scanning rules" },
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "For large teams and enterprises",
    cta: "Contact sales",
    ctaHref: "mailto:sales@vulnscanner.com",
    badge: null,
    features: [
      { included: true, text: "Unlimited scans" },
      { included: true, text: "Advanced vulnerability detection" },
      { included: true, text: "Security headers check" },
      { included: true, text: "SSL/TLS analysis" },
      { included: true, text: "XSS & SQLi advanced detection" },
      { included: true, text: "Full API access" },
      { included: true, text: "Advanced PDF reports" },
      { included: true, text: "24/7 priority support" },
      { included: true, text: "SIEM integration" },
      { included: true, text: "Custom scanning rules" },
    ],
    highlighted: false,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
  }),
};

const comparison = [
  { feature: "API Access", free: false, pro: true, enterprise: true },
  { feature: "Priority Support", free: false, pro: true, enterprise: true },
  { feature: "Advanced Reports", free: false, pro: true, enterprise: true },
  { feature: "Custom Scanning Rules", free: false, pro: false, enterprise: true },
  { feature: "SIEM Integration", free: false, pro: false, enterprise: true },
  { feature: "Dedicated Account Manager", free: false, pro: false, enterprise: true },
  { feature: "SLA Guarantee", free: false, pro: false, enterprise: true },
];

export default function PricingPage() {
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
              <Zap className="mr-2 h-3.5 w-3.5" />
              Simple, transparent pricing
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
          >
Plans that fit your needs
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            From free tier for individuals to enterprise solutions for large teams. No credit card required.
          </motion.p>
        </div>
      </section>

      {/* ── PRICING CARDS ────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Card
                  className={`relative h-full flex flex-col transition-all duration-300 ${
                    plan.highlighted
                      ? "border-primary/50 bg-card ring-1 ring-primary/10 shadow-lg md:scale-105"
                      : "border-border hover:border-primary/20"
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        {plan.badge}
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="pb-6">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-sm text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col">
                    <Link href={plan.ctaHref} className="mb-6">
                      <Button
                        className="w-full"
                        variant={plan.highlighted ? "default" : "outline"}
                      >
                        {plan.cta}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>

                    <ul className="space-y-3 flex-1">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm">
                          {feature.included ? (
                            <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground/50 shrink-0 mt-0.5" />
                          )}
                          <span
                            className={
                              feature.included
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }
                          >
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ──────────────────────────────── */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Feature comparison</h2>
            <p className="text-muted-foreground">
              Choose the perfect plan for your security needs
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Feature
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">
                    Free
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">
                    Pro
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-border/50 hover:bg-card/50 transition-colors"
                  >
                    <td className="px-4 py-4 text-sm font-medium">
                      {row.feature}
                    </td>
                    <td className="px-4 py-4 text-center">
                      {row.free ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      {row.pro ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      {row.enterprise ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently asked questions</h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "Can I upgrade or downgrade my plan?",
                a: "Yes, you can change your plan at any time. Changes take effect at the start of your next billing cycle.",
              },
              {
                q: "Do you offer refunds?",
                a: "We offer a 30-day money-back guarantee for annual plans. Monthly subscriptions are non-refundable but can be cancelled anytime.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and wire transfers for enterprise plans.",
              },
              {
                q: "Is there a free trial for Pro plan?",
                a: "Yes, Pro plan comes with a 14-day free trial. No credit card required to start.",
              },
              {
                q: "Do you offer volume discounts?",
                a: "Yes! Contact our sales team for custom pricing if you&apos;re scanning multiple domains or building for clients.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Absolutely. Cancel your subscription at any time with no questions asked. Your account and data remain accessible.",
              },
            ].map((faq, i) => (
              <div key={i} className="border-b border-border/50 pb-6 last:border-0">
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Start scanning for vulnerabilities today
          </h2>
<p className="text-muted-foreground text-lg mb-8">
            No credit card required. Get started free and upgrade when you&apos;re ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="px-10 bg-primary text-primary-foreground hover:bg-primary/90">
                Get started free
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/docs">
              <Button size="lg" variant="outline" className="px-10">
                View documentation
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
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/docs" className="hover:text-foreground transition-colors">
              Docs
            </Link>
            <a
              href="https://github.com"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
