"use client";

import { ReactNode, useRef } from "react";
import clsx from "clsx";

interface Props {
  children: ReactNode;
  className?: string;
  intensity?: number; // 0..1 — how much tilt
}

/**
 * Subtle 3D tilt on mouse move. Falls back to flat on touch.
 * Uses CSS vars + transform so it's GPU-fast.
 */
export default function TiltCard({ children, className, intensity = 1 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--tx", `${px * intensity}`);
    el.style.setProperty("--ty", `${py * intensity}`);
    el.classList.add("tilt-active");
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tx", `0`);
    el.style.setProperty("--ty", `0`);
    el.classList.remove("tilt-active");
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={clsx("tilt", className)}
    >
      {children}
    </div>
  );
}
