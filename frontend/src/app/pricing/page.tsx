"use client";

import { useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Check, X, Zap, ChevronRight, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassmorphicCard } from "@/components/ui/GlassmorphicCard";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { GlowingBadge } from "@/components/ui/GlowingBadge";
import { GradientText } from "@/components/ui/GradientText";
import { FAQ_ITEMS } from "@/lib/constants";
import { containerVariants, itemVariants } from "@/lib/animations";


const pricing = {
  monthly: {
    professional: 60,
    enterprise: 249,
  },
  yearly: {
    professional: 600,
    enterprise: 2490,
  },
} as const;

const USD_TO_INR = 83;


const PRICING_PLANS = [
  {
    id: "free" as const,
    name: "Free",
    highlighted: false,
    descriptionUsd: "Perfect for individuals getting started",
    descriptionInr: "Perfect for individuals getting started",
    cta: "Get started",
    features: [
      "2 scans per day",
      "1 URL depth",
      "1 concurrent scan",
      "Basic vulnerability detection",
    ],
  },
  {
    id: "pro" as const,
    name: "Professional",
    highlighted: true,
    descriptionUsd: "For developers and small teams",
    descriptionInr: "For developers and small teams",
    cta: "Start free trial",
    features: [
      "Unlimited scans",
      "10 URL depth",
      "5 concurrent scans",
      "API access",
    ],
  },
  {
    id: "enterprise" as const,
    name: "Enterprise",
    highlighted: false,
    descriptionUsd: "For large teams and enterprises",
    descriptionInr: "For large teams and enterprises",
    cta: "Contact sales",
    features: [
      "Unlimited scans",
      "Unlimited URL depth",
      "Unlimited concurrent scans",
      "Full API access",
    ],
  },
];

const featureComparison = [

  {
    category: "Scanning",
    features: [
      { name: "Scans per day", free: "5", pro: "Unlimited", enterprise: "Unlimited" },
      { name: "URL depth", free: "1", pro: "10", enterprise: "Unlimited" },
      { name: "Concurrent scans", free: "1", pro: "5", enterprise: "Unlimited" },
      { name: "API access", free: false, pro: true, enterprise: true },
    ],
  },
  {
    category: "Detection",
    features: [
      { name: "Detection modules", free: "15+", pro: "30+", enterprise: "30+" },
      { name: "AI fix suggestions", free: false, pro: true, enterprise: true },
      { name: "Threat intelligence", free: false, pro: true, enterprise: true },
      { name: "Custom scanning rules", free: false, pro: false, enterprise: true },
    ],
  },
  {
    category: "Reports & Export",
    features: [
      { name: "PDF reports", free: true, pro: true, enterprise: true },
      { name: "JSON export", free: false, pro: true, enterprise: true },
      { name: "Custom branding", free: false, pro: false, enterprise: true },
      { name: "Scheduled reports", free: false, pro: true, enterprise: true },
    ],
  },
  {
    category: "Support",
    features: [
      { name: "Community support", free: true, pro: false, enterprise: false },
      { name: "Email support", free: false, pro: true, enterprise: true },
      { name: "Priority support", free: false, pro: false, enterprise: true },
      { name: "Dedicated account manager", free: false, pro: false, enterprise: true },
    ],
  },
];

export default function PricingPage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [currency, setCurrency] = useState<"INR" | "USD">("USD");
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const getCurrency = () => (currency === "USD" ? "$" : "₹");

  const getPlanPrice = (planId: "free" | "pro" | "enterprise") => {
    if (planId === "free") return 0;

    const isPro = planId === "pro";
    const period = billingPeriod;

    const priceUsd = isPro ? pricing[period].professional : pricing[period].enterprise;
    const convertedPrice = currency === "INR" ? priceUsd * USD_TO_INR : priceUsd;

    return convertedPrice;
  };

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      toast.error("Please login to subscribe");
      router.push("/auth/login");
      return;
    }
    
    if (planId === "free") {
      router.push("/dashboard");
      return;
    }

    if (planId === "enterprise") {
      router.push("/contact");
      return;
    }

    setLoadingPlan(planId);
    try {
      // 1. Create Order
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ plan: planId })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || "Failed to create order");

      // 2. Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_dummy", 
        amount: data.amount,
        currency: data.currency,
        name: "VulnScanner",
        description: `${planId.toUpperCase()} Plan Subscription`,
        order_id: data.orderId,
        handler: async function (response: any) {
          try {
            // 3. Verify Payment
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan: planId
              })
            });
            const verifyData = await verifyRes.json();
            
            if (!verifyRes.ok) throw new Error(verifyData.message || "Verification failed");
            
            toast.success(`Successfully subscribed to ${planId} plan!`);
            router.push("/dashboard");
          } catch (err: any) {
            toast.error(err.message || "Payment verification failed");
          }
        },
        prefill: {
          name: user.name || "",
          email: user.email || ""
        },
        theme: {
          color: "#06b6d4" // Cyan-500
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        toast.error(response.error.description || "Payment failed");
      });
      rzp.open();
      
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-foreground overflow-hidden">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <Navbar />

      {/* ──────────────────────────────────── HEADER ──────────────────────────────────── */}
      <section className="relative py-24 px-4 border-b border-cyan-500/10">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GlowingBadge variant="primary" size="md" className="mb-6 justify-center">
              <Zap className="h-4 w-4" />
              <span>Transparent, Flexible Pricing</span>
            </GlowingBadge>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Choose your<br />
              <GradientText animated>scanning plan</GradientText>
            </h1>

            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Start free. Scale with your security needs. No credit card required
              for the free plan.
            </p>
          </motion.div>

          {/* Toggles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-6 justify-center mt-12"
          >
            {/* Currency toggle */}
            <div className="flex items-center gap-3 bg-slate-900/50 border border-cyan-500/20 rounded-lg p-1">
              <button
                onClick={() => setCurrency("USD")}
                className={`px-4 py-2 rounded transition-all ${
                  currency === "USD"
                    ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                    : "text-gray-400"
                }`}
              >
                USD
              </button>
              <button
                onClick={() => setCurrency("INR")}
                className={`px-4 py-2 rounded transition-all ${
                  currency === "INR"
                    ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                    : "text-gray-400"
                }`}
              >
                INR
              </button>
            </div>

            {/* Billing toggle */}
            <div className="flex items-center gap-3 bg-slate-900/50 border border-cyan-500/20 rounded-lg p-1">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`px-4 py-2 rounded transition-all ${
                  billingPeriod === "monthly"
                    ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                    : "text-gray-400"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod("yearly")}
                className={`px-4 py-2 rounded transition-all ${
                  billingPeriod === "yearly"
                    ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                    : "text-gray-400"
                }`}
              >
                Yearly
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ──────────────────────────────────── PRICING CARDS ──────────────────────────────────── */}
      <section className="relative py-32 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-3 gap-8"
          >
            {PRICING_PLANS.map((plan, i) => (
              <motion.div
                key={plan.id}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="relative overflow-visible"
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <GlowingBadge variant="primary" size="sm">
                      Most Popular
                    </GlowingBadge>
                  </div>
                )}

                <GlassmorphicCard
                  hoverable
                  glowing={plan.highlighted}
                  className={`h-full p-8 flex flex-col ${
                    plan.highlighted ? "border-cyan-400 shadow-2xl shadow-cyan-500/30" : ""
                  }`}
                >
                  {/* Plan header */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-3">{plan.name}</h3>
                    <p className="text-gray-400 text-sm mb-6">
                      {currency === "USD"
                        ? plan.descriptionUsd
                        : plan.descriptionInr}
                    </p>

                    {/* Price */}
                    <div className="mb-6">
                      <span className="text-5xl font-bold">
                        {getCurrency()}
                        {getPlanPrice(plan.id as "free" | "pro" | "enterprise").toLocaleString()}
                      </span>
                      {plan.id !== "free" && (
                        <span className="text-gray-400 text-sm ml-2">
                          / {billingPeriod}
                        </span>
                      )}

                    </div>

                    {/* CTA Button */}
                    <div onClick={() => handleSubscribe(plan.id)}>
                      <AnimatedButton
                        size="lg"
                        variant={plan.highlighted ? "primary" : "outline"}
                        glowing={plan.highlighted}
                        className="w-full"
                        disabled={loadingPlan === plan.id}
                      >
                        {loadingPlan === plan.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            {plan.cta}
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </AnimatedButton>
                    </div>
                  </div>

                  {/* Features list */}
                  <div className="space-y-4 flex-1">
                    {plan.features.map((feature, j) => (
                      <motion.div
                        key={j}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: j * 0.05 }}
                        className="flex items-center gap-3"
                      >
                        <Check className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </GlassmorphicCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ──────────────────────────────────── FEATURE COMPARISON ──────────────────────────────────── */}
      <section className="relative py-32 px-4 bg-slate-900/30 border-y border-cyan-500/10">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Detailed<br />
              <span className="text-cyan-400">feature comparison</span>
            </h2>
            <p className="text-gray-400">Compare all features across plans</p>
          </motion.div>

          {/* Comparison table */}
          <div className="space-y-12">
            {featureComparison.map((category) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <GlassmorphicCard className="overflow-hidden">
                  <div className="p-6 border-b border-cyan-500/10">
                    <h3 className="text-lg font-bold text-cyan-300">
                      {category.category}
                    </h3>
                  </div>

                  <div className="p-6 space-y-4">
                    {category.features.map((feature) => (
                      <div
                        key={feature.name}
                        className="grid grid-cols-4 gap-4 py-3 border-b border-cyan-500/5 last:border-b-0"
                      >
                        <div className="text-gray-300 font-medium">
                          {feature.name}
                        </div>
                        <div className="flex items-center justify-center">
                          {typeof feature.free === "boolean" ? (
                            feature.free ? (
                              <Check className="h-5 w-5 text-emerald-400" />
                            ) : (
                              <X className="h-5 w-5 text-gray-500" />
                            )
                          ) : (
                            <span className="text-gray-300 text-sm">
                              {feature.free}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-center">
                          {typeof feature.pro === "boolean" ? (
                            feature.pro ? (
                              <Check className="h-5 w-5 text-emerald-400" />
                            ) : (
                              <X className="h-5 w-5 text-gray-500" />
                            )
                          ) : (
                            <span className="text-gray-300 text-sm">
                              {feature.pro}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-center">
                          {typeof feature.enterprise === "boolean" ? (
                            feature.enterprise ? (
                              <Check className="h-5 w-5 text-emerald-400" />
                            ) : (
                              <X className="h-5 w-5 text-gray-500" />
                            )
                          ) : (
                            <span className="text-gray-300 text-sm">
                              {feature.enterprise}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassmorphicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────── FAQ ──────────────────────────────────── */}
      <section className="relative py-32 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Frequently Asked<br />
              <span className="text-cyan-400">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassmorphicCard className="cursor-pointer p-6 hover:border-cyan-400/60">
                  <button
                    onClick={() =>
                      setExpandedFaq(expandedFaq === item.question ? null : item.question)
                    }
                    className="w-full text-left flex items-center justify-between gap-4"
                  >
                    <h3 className="text-lg font-semibold">{item.question}</h3>
                    <motion.div
                      animate={{
                        rotate: expandedFaq === item.question ? 180 : 0,
                      }}
                    >
                      <ChevronRight className="h-5 w-5 text-cyan-400" />
                    </motion.div>
                  </button>

                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: expandedFaq === item.question ? 1 : 0,
                      height: expandedFaq === item.question ? "auto" : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-gray-400 mt-4">{item.answer}</p>
                  </motion.div>
                </GlassmorphicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────── FINAL CTA ──────────────────────────────────── */}
      <section className="relative py-24 px-4 border-t border-cyan-500/10">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to get started?
            </h2>
            <p className="text-gray-400 text-lg mb-10">
              Choose the perfect plan for your security needs and start scanning
              immediately.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <AnimatedButton size="lg" variant="primary" glowing>
                  Start free
                  <ChevronRight className="h-5 w-5" />
                </AnimatedButton>
              </Link>
              <Link href="/docs#faq">
                <AnimatedButton size="lg" variant="outline">
                  Contact sales
                </AnimatedButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
