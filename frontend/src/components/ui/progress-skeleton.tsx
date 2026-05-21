"use client";

import { motion } from "framer-motion";

export function ProgressSkeleton({ label }: { label?: string }) {
  return (
    <div className="space-y-3">
      {label ? <div className="text-xs text-muted-foreground">{label}</div> : null}
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-900/60 border border-cyan-500/10">
        <motion.div
          className="h-full w-2/3 bg-gradient-to-r from-cyan-500/10 via-cyan-400/25 to-blue-500/10"
          animate={{ x: [-200, 400] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

