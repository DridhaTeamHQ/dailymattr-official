"use client";

import { motion } from "motion/react";

import { cn } from "cn";

/** Three bouncing dots shown while NIA "types" its reply. */
export function TypingDots({ className }: { className?: string }) {
  return (
    <span
      className={cn("flex h-5 items-center gap-1.5", className)}
      aria-label="NIA is typing"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-white/50"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  );
}
