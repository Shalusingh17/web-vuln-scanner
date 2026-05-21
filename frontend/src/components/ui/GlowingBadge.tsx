"use client";

import React from "react";
import { motion } from "framer-motion";

interface GlowingBadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "accent";
  size?: "sm" | "md" | "lg";
}

export function GlowingBadge({
  children,
  className = "",
  variant = "primary",
  size = "md",
}: GlowingBadgeProps) {
  const variantClasses = {
    primary: "bg-cyan-500/20 border-cyan-500/50 text-cyan-300",
    secondary: "bg-blue-500/20 border-blue-500/50 text-blue-300",
    accent: "bg-emerald-500/20 border-emerald-500/50 text-emerald-300",
  };

  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`
        inline-flex items-center gap-2
        rounded-full border
        font-semibold
        transition-all duration-300
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
