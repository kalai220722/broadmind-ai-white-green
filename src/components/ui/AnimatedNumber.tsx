"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  value: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

/**
 * Smoothly counts from current displayed value to `value`.
 * Triggers when the element scrolls into view, then animates on every value change.
 */
export default function AnimatedNumber({
  value,
  duration = 900,
  decimals = 0,
  suffix = "",
  prefix = "",
  className,
}: Props) {
  const [display, setDisplay] = useState(0);
  const lastValue = useRef(0);
  const startedRef = useRef(false);
  const elRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Only animate when visible (or already started)
    if (!startedRef.current && elRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            startedRef.current = true;
            animateTo(value);
            observer.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(elRef.current);
      return () => observer.disconnect();
    } else {
      animateTo(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const animateTo = (target: number) => {
    const start = lastValue.current;
    const startTime = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      const next = start + (target - start) * eased;
      setDisplay(next);
      if (t < 1) requestAnimationFrame(step);
      else lastValue.current = target;
    };
    requestAnimationFrame(step);
  };

  return (
    <span ref={elRef} className={className}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
