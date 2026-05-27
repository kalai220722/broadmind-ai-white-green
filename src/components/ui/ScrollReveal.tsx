"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "scale";
}

/**
 * Wraps any element so it animates into view as the user scrolls.
 * Cheap, declarative, runs only once per element.
 */
export default function ScrollReveal({
  children,
  delay = 0,
  y = 20,
  className,
  direction = "up",
}: ScrollRevealProps) {
  const initial =
    direction === "up"   ? { opacity: 0, y } :
    direction === "down" ? { opacity: 0, y: -y } :
    direction === "left" ? { opacity: 0, x: y } :
    direction === "right"? { opacity: 0, x: -y } :
                           { opacity: 0, scale: 0.94 };

  const animate =
    direction === "up" || direction === "down" ? { opacity: 1, y: 0 } :
    direction === "left" || direction === "right" ? { opacity: 1, x: 0 } :
    { opacity: 1, scale: 1 };

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
