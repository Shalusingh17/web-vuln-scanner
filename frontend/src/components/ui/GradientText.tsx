"use client";

import React from "react";
import { motion } from "framer-motion";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
}

export function GradientText({
  children,
  className = "",
  animated = true,
}: GradientTextProps) {
  const baseClasses = `
    bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 
    bg-clip-text text-transparent font-bold
  `;

  if (!animated) {
    return <span className={`${baseClasses} ${className}`}>{children}</span>;
  }

  return (
    <motion.span
      className={`${baseClasses} ${className}`}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        backgroundSize: "200% 100%",
      }}
    >
      {children}
    </motion.span>
  );
}
