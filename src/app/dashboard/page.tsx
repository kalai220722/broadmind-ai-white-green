"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import SmartWelcome from "@/components/dashboard/SmartWelcome";
import DashboardHero from "@/components/dashboard/DashboardHero";
import GlassCard from "@/components/ui/GlassCard";
import { MODULES } from "@/lib/constants";

// These four are featured in the DashboardHero strip above — don't repeat them in the grid
const HERO_MODULE_IDS = new Set(["news", "exams", "planner", "insights"]);
const GRID_MODULES = MODULES.filter((m) => !HERO_MODULE_IDS.has(m.id));
import { useProfile, ALL_BADGES, type LearnStyle } from "@/lib/personalization";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { ArrowRight, Brain, Trophy, Compass } from "lucide-react";

const STYLE_LABELS: Record<LearnStyle, string> = {
  analogy: "Analogy",
  visual: "Visual",
  stepByStep: "Step",
  storytelling: "Story",
  formal: "Formal",
};

export default function Dashboard() {
  const profile = useProfile();
  const radarData = (Object.entries(profile.style) as [LearnStyle, number][]).map(([k, v]) => ({
    style: STYLE_LABELS[k],
    value: v,
  }));
  const earned = new Set(profile.badges);
  const recentBadges = ALL_BADGES.filter((b) => earned.has(b.id)).slice(0, 6);

  return (
    <AppLayout title="Dashboard">
      {/* TOP HERO: News · Exam Countdown · AI Today · DNA Insights */}
      <DashboardHero />

      <SmartWelcome />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main column — modules */}
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Modules</h3>
            <span className="text-xs text-slate-400">{GRID_MODULES.length} modules</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 stagger">
            {GRID_MODULES.map((mod, i) => (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link href={mod.href}>
                  <GlassCard className="p-4 h-full group cursor-pointer">
                    <div className="flex items-start gap-3 mb-2">
                      <div
                        className={`flex-shrink-0 p-2.5 rounded-xl bg-gradient-to-br ${mod.gradient}`}
                      >
                        <mod.icon size={16} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-white group-hover:text-violet-300 transition">
                          {mod.name}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
                          {mod.description}
                        </p>
                      </div>
                      <ArrowRight
                        size={14}
                        className="text-slate-500 group-hover:text-violet-400 group-hover:translate-x-0.5 transition"
                      />
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {mod.features.slice(0, 2).map((f) => (
                        <span
                          key={f}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-slate-400"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Learning DNA snapshot */}
          <GlassCard className="p-5" glow>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Brain size={14} className="text-violet-400" /> Learning DNA
              </h3>
              <Link
                href="/modules/insights"
                className="text-xs text-violet-300 hover:text-violet-200 flex items-center gap-1"
              >
                Details <ArrowRight size={10} />
              </Link>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(139, 92, 246, 0.2)" />
                  <PolarAngleAxis dataKey="style" tick={{ fill: "currentColor", fontSize: 10 }} />
                  <Radar
                    dataKey="value"
                    stroke="#8b5cf6"
                    fill="url(#dashRadar)"
                    fillOpacity={0.5}
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="dashRadar" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Recent badges */}
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Trophy size={14} className="text-amber-400" /> Achievements
              </h3>
              <span className="text-xs text-slate-400">
                {profile.badges.length} / {ALL_BADGES.length}
              </span>
            </div>
            {recentBadges.length === 0 ? (
              <p className="text-xs text-slate-500">Use BroadMind to unlock badges 🏆</p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {recentBadges.map((b) => (
                  <div
                    key={b.id}
                    title={b.description}
                    className="text-center p-2 rounded-lg bg-gradient-to-br from-violet-500/15 to-cyan-500/15 border border-violet-500/30"
                  >
                    <div className="text-2xl mb-0.5">{b.emoji}</div>
                    <div className="text-[9px] text-slate-300">{b.label}</div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Quick discover */}
          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
              <Compass size={14} className="text-cyan-400" /> Quick Discover
            </h3>
            <div className="space-y-1.5">
              {[
                { href: "/modules/doubt-solver", label: "Ask a doubt", emoji: "💬" },
                { href: "/modules/quiz", label: "Take a quiz", emoji: "❓" },
                { href: "/modules/pomodoro", label: "Start a focus session", emoji: "🍅" },
                { href: "/modules/insights", label: "See your Learning DNA", emoji: "🧠" },
              ].map((q) => (
                <Link key={q.href} href={q.href}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 transition text-sm text-slate-200"
                  >
                    <span>{q.emoji}</span>
                    <span>{q.label}</span>
                    <ArrowRight size={12} className="ml-auto text-slate-500" />
                  </motion.div>
                </Link>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </AppLayout>
  );
}
