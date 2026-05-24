"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";
import clsx from "clsx";

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  glow?: boolean;
  hover?: boolean;
  className?: string;
}

export default function GlassCard({
  children,
  glow = false,
  hover = true,
  className,
  ...rest
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -3, scale: 1.01 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={clsx(
        "relative rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl",
        "shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
        glow && "ring-1 ring-violet-500/30 shadow-[0_0_40px_rgba(139,92,246,0.15)]",
        className
      )}
      {...rest}
    >
      {glow && (
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10" />
      )}
      <div className="relative">{children}</div>
    </motion.div>
  );
}
