"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { ReactNode, MouseEvent } from "react";
import clsx from "clsx";

interface ShimmerButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function ShimmerButton({
  children,
  variant = "primary",
  size = "md",
  className,
  onClick,
  ...rest
}: ShimmerButtonProps) {
  const variants = {
    primary:
      "bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40",
    secondary:
      "bg-slate-800/80 text-slate-200 border border-white/10 hover:bg-slate-700/80",
    ghost: "bg-transparent text-slate-300 hover:bg-white/5",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  // Material-style click ripple
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const radius = diameter / 2;
    const rect = btn.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.className = "ripple";
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 700);
    onClick?.(e);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.03, y: -1 }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
      onClick={handleClick}
      className={clsx(
        "relative overflow-hidden rounded-lg font-medium transition-colors duration-200 ripple-host",
        variants[variant],
        sizes[size],
        className
      )}
      {...rest}
    >
      {variant === "primary" && (
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent [animation:shimmer_3.5s_infinite]" />
      )}
      <span className="relative z-10 inline-flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}
