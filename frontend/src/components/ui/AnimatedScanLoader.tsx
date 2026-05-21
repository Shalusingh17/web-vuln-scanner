"use client";

import { motion } from "framer-motion";
import { Scan } from "lucide-react";

export function AnimatedScanLoader({ label = "Scanning" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-cyan-500/20 bg-slate-950/40 px-4 py-3 shadow-[0_0_30px_rgba(0,229,255,0.08)]">
      <motion.div
        className="relative h-6 w-6"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
      >
        <Scan className="h-6 w-6 text-cyan-300" />
      </motion.div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-cyan-100">{label}</p>
        <p className="text-xs text-muted-foreground">Initializing detection engines…</p>
      </div>
      <div className="ml-auto flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-cyan-400"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  );
}

