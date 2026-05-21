"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

interface ParticleBackgroundProps {
  particleCount?: number;
  className?: string;
}

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
};

// Deterministic PRNG (Mulberry32) so particle layout is stable for a given seed.
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function generateParticles(seed: number, count: number): Particle[] {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: rand() * 100,
    y: rand() * 100,
    size: rand() * 4 + 1,
    delay: rand() * 2,
    duration: rand() * 3 + 2,
    drift: rand() * 20 - 10,
  }));
}

export function ParticleBackground({
  particleCount = 20,
  className = "",
}: ParticleBackgroundProps) {
  // Deterministic seed => no randomness => no hydration mismatch
  const seed = particleCount * 99991;

  const particles = useMemo(() => {
    return generateParticles(seed, particleCount);
  }, [seed, particleCount]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-cyan-400/20"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, particle.drift, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
