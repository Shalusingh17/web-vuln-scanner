"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield,
  Globe,
  MessageCircle,
  Send,
} from "lucide-react";
import { FOOTER_LINKS } from "@/lib/constants";
import { type FormEvent, useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 2000);
  };

  const socialLinks = [
    { icon: Globe, href: "https://github.com", label: "GitHub" },
    { icon: Globe, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Globe, href: "https://twitter.com", label: "Twitter" },
    { icon: MessageCircle, href: "https://discord.com", label: "Discord" },
    { icon: Send, href: "https://telegram.com", label: "Telegram" },
  ];

  return (
    <footer className="relative mt-32 border-t border-cyan-500/10 bg-gradient-to-b from-slate-950/50 to-slate-950">
      {/* Glassmorphic background */}
      <div className="absolute inset-0 backdrop-blur-xl" />

      <div className="relative container mx-auto px-4 py-20">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/30">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-lg">
                  Vuln<span className="text-cyan-400">Scanner</span>
                </div>
                <div className="text-xs text-gray-500">Enterprise Security</div>
              </div>
            </Link>

            <p className="text-gray-400 text-sm mb-6 leading-relaxed max-w-xs">
              Professional web vulnerability scanning with AI-powered
              remediation. Enterprise-grade security for developers.
            </p>

            {/* Newsletter subscription */}
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-900/50 border border-cyan-500/20 rounded-lg text-sm text-white placeholder-gray-500 hover:border-cyan-500/40 focus:outline-none focus:border-cyan-500/60 transition-colors"
                  required
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
                >
                  {subscribed ? "✓" : "→"}
                </motion.button>
              </div>
              {subscribed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-cyan-400"
                >
                  Thanks for subscribing!
                </motion.p>
              )}
            </form>
          </motion.div>

          {/* Footer columns */}
          {Object.entries(FOOTER_LINKS).map(([key, items], columnIndex) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: columnIndex * 0.1 }}
            >
              <h4 className="font-semibold text-white mb-4 capitalize text-sm">
                {key}
              </h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-1.5 transition-all" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent my-12" />

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm text-gray-500 text-center md:text-left"
          >
            <p>© 2024 VulnScanner. All rights reserved.</p>
          </motion.div>

          {/* Social icons */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/40 transition-all"
                title={social.label}
              >
                <social.icon className="w-4 h-4" />
              </motion.a>
            ))}
          </motion.div>

          {/* Status */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 text-sm text-gray-400"
          >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>All systems operational</span>
          </motion.div>
        </div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
    </footer>
  );
}
