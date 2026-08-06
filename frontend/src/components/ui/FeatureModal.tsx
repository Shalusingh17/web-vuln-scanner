"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";
import { Feature } from "@/lib/constants";

import { useRouter } from "next/navigation";
import { AnimatedButton } from "@/components/ui/AnimatedButton";

interface FeatureModalProps {
  feature: Feature | null;
  onClose: () => void;
}

export function FeatureModal({ feature, onClose }: FeatureModalProps) {
  const router = useRouter();

  if (!feature) return null;

  return (
    <AnimatePresence>
      {feature && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl rounded-xl glass-lg cyber-border-glow shadow-2xl shadow-cyan-500/20"
          >
            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-cyan-500/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-cyan-400" />
            </motion.button>

            {/* Content */}
            <div className="p-8">
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className={`inline-flex p-4 rounded-lg ${feature.bgColor}`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2 font-mono text-cyan-50 tracking-tight">{feature.title}</h2>
                  <p className="text-cyan-300/80 leading-relaxed">{feature.fullDescription}</p>
                </div>
              </div>

              {/* Severity badge */}
              {feature.severity && (
                <div className="mb-6 flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-400">
                    Severity:
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      feature.severity === "critical"
                        ? "bg-red-500/20 text-red-400 border border-red-500/50"
                        : feature.severity === "high"
                          ? "bg-orange-500/20 text-orange-400 border border-orange-500/50"
                          : feature.severity === "medium"
                            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50"
                            : "bg-green-500/20 text-green-400 border border-green-500/50"
                    }`}
                  >
                    {feature.severity.toUpperCase()}
                  </span>
                </div>
              )}

              {/* Benefits section */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-4 text-cyan-300">
                  Key Benefits
                </h3>
                <div className="space-y-3">
                  {feature.benefits.map((benefit, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 text-gray-300"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <span>{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <AnimatedButton
                onClick={() => {
                  router.push("/dashboard");
                  onClose();
                }}
                variant="outline"
                glowing
                className="w-full mt-4"
              >
                Start Scanning for {feature.title}
              </AnimatedButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
