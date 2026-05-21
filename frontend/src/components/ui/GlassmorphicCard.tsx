"use client";

import React from "react";
import { motion } from "framer-motion";

interface GlassmorphicCardProps {
  children: React.ReactNode;
  className?: string;
  glowing?: boolean;
  hoverable?: boolean;
  delay?: number;
  onClick?: () => void;
}


export function GlassmorphicCard({
  children,
  className = "",
  glowing = true,
  hoverable = true,
  delay = 0,
  onClick,
}: GlassmorphicCardProps) {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      whileHover={
        hoverable
          ? {
              scale: 1.02,
              boxShadow: "0 0 30px rgba(0, 229, 255, 0.4)",
            }
          : undefined
      }
      className={`
        relative rounded-xl border border-cyan-500/20 
        bg-slate-900/50 backdrop-blur-xl
        ${glowing ? "hover:border-cyan-500/60 hover:shadow-lg hover:shadow-cyan-500/20" : ""}
        ${hoverable ? "cursor-pointer" : ""}
        transition-all duration-300
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
