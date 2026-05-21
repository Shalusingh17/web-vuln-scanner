/**
 * Framer Motion animation presets for cybersecurity SaaS theme
 */

import { Variants } from "framer-motion";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i: number = 1) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.06, duration: 0.3 },
  }),
};

export const glowPulse: Variants = {
  animate: {
    boxShadow: [
      "0 0 10px rgba(0, 229, 255, 0.3), inset 0 0 10px rgba(0, 229, 255, 0.1)",
      "0 0 20px rgba(0, 229, 255, 0.6), inset 0 0 20px rgba(0, 229, 255, 0.2)",
      "0 0 10px rgba(0, 229, 255, 0.3), inset 0 0 10px rgba(0, 229, 255, 0.1)",
    ],
    transition: { duration: 2, repeat: Infinity },
  },
};

export const borderGlow: Variants = {
  initial: { borderColor: "rgba(0, 229, 255, 0.2)" },
  animate: {
    borderColor: ["rgba(0, 229, 255, 0.2)", "rgba(0, 229, 255, 0.6)", "rgba(0, 229, 255, 0.2)"],
    boxShadow: ["0 0 15px rgba(0, 229, 255, 0.2)", "0 0 30px rgba(0, 229, 255, 0.4)", "0 0 15px rgba(0, 229, 255, 0.2)"],
    transition: { duration: 2, repeat: Infinity },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: (i: number = 1) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: (i: number = 1) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number = 1) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export const hoverScale = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { type: "spring", stiffness: 400, damping: 10 },
};

export const glowHover = {
  whileHover: { boxShadow: "0 0 25px rgba(0, 229, 255, 0.6)" },
  transition: { duration: 0.3 },
};

export const floatingAnimation = {
  animate: { y: [0, -10, 0] },
  transition: { duration: 3, repeat: Infinity },
};

export const rotateAnimation = {
  animate: { rotate: 360 },
  transition: { duration: 20, repeat: Infinity, ease: "linear" as const },
};

export const shimmerAnimation = {
  animate: { backgroundPosition: ["200% 0", "-200% 0"] },
  transition: { duration: 3, repeat: Infinity, ease: "linear" as const },
};