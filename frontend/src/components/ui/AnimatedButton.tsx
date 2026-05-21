"use client";

import React from "react";
import { motion } from "framer-motion";

type MotionButtonProps = React.ComponentPropsWithoutRef<typeof motion.button>;

interface AnimatedButtonProps extends MotionButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  glowing?: boolean;
  loading?: boolean;
}

export function AnimatedButton({
  children,
  variant = "primary",
  size = "md",
  glowing = true,
  loading = false,
  className = "",
  ...props
}: AnimatedButtonProps) {
  const baseClasses =
    "relative font-semibold transition-all duration-300 rounded-lg font-medium disabled:opacity-50";

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/50",
    secondary:
      "bg-gradient-to-r from-blue-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-blue-500/50",
    outline:
      "border-2 border-cyan-500/50 text-cyan-400 hover:border-cyan-400 hover:bg-cyan-500/10",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${glowing && variant !== "outline" ? "shadow-lg shadow-cyan-500/30" : ""}
        ${className}
      `}
      disabled={loading}
      {...props}
    >
      {loading && (
        <span className="absolute inset-0 rounded-lg animate-spin bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 opacity-75 blur-md" />
      )}
      <span className="relative flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}
