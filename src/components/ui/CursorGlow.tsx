"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Soft gradient orb that follows the cursor on desktop.
 * Adds a subtle "you're in a futuristic OS" feel without being distracting.
 */
export default function CursorGlow() {
  const [enabled, setEnabled] = useState(false);
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const x = useSpring(mx, { stiffness: 220, damping: 28, mass: 0.5 });
  const y = useSpring(my, { stiffness: 220, damping: 28, mass: 0.5 });

  useEffect(() => {
    // disable on touch devices
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setEnabled(true);
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  if (!enabled) return null;

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[1] w-[280px] h-[280px] rounded-full"
      style={{
        x,
        y,
        translateX: "-50%",
        translateY: "-50%",
        background:
          "radial-gradient(circle, rgba(192,132,252,0.18) 0%, rgba(192,132,252,0.08) 30%, transparent 70%)",
        mixBlendMode: "screen",
      }}
      aria-hidden="true"
    />
  );
}
