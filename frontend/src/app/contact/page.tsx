"use client";

import { motion } from "framer-motion";
import { Mail, ArrowRight, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import { GlowingBadge } from "@/components/ui/GlowingBadge";
import { GradientText } from "@/components/ui/GradientText";
import { GlassmorphicCard } from "@/components/ui/GlassmorphicCard";
import { AnimatedButton } from "@/components/ui/AnimatedButton";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground bg-grid-pattern overflow-hidden">
      <Navbar />

      <section className="relative pt-32 pb-24 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GlowingBadge variant="primary" size="md" className="mb-6 justify-center">
              <ShieldCheck className="h-4 w-4" />
              <span>Enterprise Grade Security</span>
            </GlowingBadge>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Contact <GradientText animated>Sales</GradientText>
            </h1>

            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
              Ready to secure your entire infrastructure? Our team is here to help you design a custom enterprise plan.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-md mx-auto"
          >
            <GlassmorphicCard className="p-8">
              <form className="space-y-6 text-left" onSubmit={(e) => { e.preventDefault(); alert("Thanks for reaching out! We'll be in touch shortly."); window.location.href="/dashboard"; }}>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Work Email</label>
                  <input 
                    type="email" 
                    className="w-full bg-slate-900/50 border border-cyan-500/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Company Size</label>
                  <select className="w-full bg-slate-900/50 border border-cyan-500/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors">
                    <option>1-50 employees</option>
                    <option>51-200 employees</option>
                    <option>201-1000 employees</option>
                    <option>1000+ employees</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                  <textarea 
                    className="w-full bg-slate-900/50 border border-cyan-500/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors h-32 resize-none"
                    placeholder="Tell us about your security needs..."
                  ></textarea>
                </div>
                <AnimatedButton className="w-full justify-center group" type="submit">
                  <Mail className="w-5 h-5 mr-2" />
                  <span>Send Message</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </AnimatedButton>
              </form>
            </GlassmorphicCard>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
