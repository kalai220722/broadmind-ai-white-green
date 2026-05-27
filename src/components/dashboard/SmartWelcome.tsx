"use client";

import { motion } from "framer-motion";
import { Sparkles, Flame, TrendingUp, Clock, Brain } from "lucide-react";
import Link from "next/link";
import {
  useProfile,
  getDailyInsight,
  getRecommendations,
  type LearnStyle,
} from "@/lib/personalization";
import AnimatedNumber from "@/components/ui/AnimatedNumber";

const STYLE_LABELS: Record<LearnStyle, string> = {
  analogy: "Analogy-based",
  visual: "Visual",
  stepByStep: "Step-by-step",
  storytelling: "Storytelling",
  formal: "Formal",
};

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Hi night owl";
}

export default function SmartWelcome() {
  const profile = useProfile();
  const insight = getDailyInsight(profile);
  const recs = getRecommendations(profile);
  const topStyle = (Object.entries(profile.style) as [LearnStyle, number][]).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const firstName = profile.name.split(" ")[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600/20 via-indigo-600/20 to-cyan-600/20 border border-violet-500/20 p-6 mb-6 animate-pulse-glow"
    >
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={16} className="text-violet-400" />
            <span className="text-xs text-violet-300 font-medium uppercase tracking-widest">
              {greeting()}
            </span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-1">
            {greeting()}, <span className="animate-gradient-text">{firstName}</span>!
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl">
            <span className="mr-2">{insight.emoji}</span>
            {insight.text}
          </p>
        </div>

        {/* Quick stat strip — animated counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3 stagger">
          <StatCount icon={Flame} value={profile.streakDays} label="Day streak" color="rose" />
          <StatCount
            icon={Clock}
            value={profile.counters.minutesFocused / 60}
            decimals={1}
            suffix="h"
            label="Focused"
            color="cyan"
          />
          <Stat
            icon={Brain}
            value={STYLE_LABELS[topStyle[0]].split(" ")[0]}
            label="Top style"
            color="violet"
          />
          <StatCount
            icon={TrendingUp}
            value={profile.counters.doubtsSolved}
            label="Doubts solved"
            color="emerald"
          />
        </div>
      </div>

      {/* Smart recommendation chips */}
      {recs.length > 0 && (
        <div className="relative z-10 mt-4 pt-4 border-t border-white/10 flex items-start gap-3 flex-wrap">
          <span className="text-xs uppercase tracking-widest text-slate-400 mr-1 flex items-center gap-1 mt-1">
            <Sparkles size={11} /> For you:
          </span>
          {recs.slice(0, 3).map((r) => (
            <Link key={r.id} href={r.href}>
              <motion.div
                whileHover={{ y: -2 }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/40 text-slate-200 transition"
              >
                <span>{r.emoji}</span>
                <span>{r.title}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      )}

      <div className="absolute -top-10 -right-10 w-60 h-60 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
    </motion.div>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: typeof Sparkles;
  value: string | number;
  label: string;
  color: string;
}) {
  const colorClass: Record<string, string> = {
    rose: "text-rose-400",
    cyan: "text-cyan-400",
    violet: "text-violet-400",
    emerald: "text-emerald-400",
  };
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 min-w-[88px] lift-hover hover:border-violet-500/30"
    >
      <div className="flex items-center gap-1.5 mb-0.5">
        <Icon size={12} className={colorClass[color] || "text-violet-400"} />
        <span className="text-[10px] uppercase tracking-widest text-slate-400">{label}</span>
      </div>
      <div className="text-lg font-bold text-white truncate">{value}</div>
    </motion.div>
  );
}

function StatCount({
  icon: Icon,
  value,
  label,
  color,
  decimals = 0,
  suffix = "",
}: {
  icon: typeof Sparkles;
  value: number;
  label: string;
  color: string;
  decimals?: number;
  suffix?: string;
}) {
  const colorClass: Record<string, string> = {
    rose: "text-rose-400",
    cyan: "text-cyan-400",
    violet: "text-violet-400",
    emerald: "text-emerald-400",
  };
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 min-w-[88px] lift-hover hover:border-violet-500/30"
    >
      <div className="flex items-center gap-1.5 mb-0.5">
        <Icon size={12} className={colorClass[color] || "text-violet-400"} />
        <span className="text-[10px] uppercase tracking-widest text-slate-400">{label}</span>
      </div>
      <div className="text-lg font-bold text-white truncate tabular-nums">
        <AnimatedNumber value={value} decimals={decimals} suffix={suffix} />
      </div>
    </motion.div>
  );
}
