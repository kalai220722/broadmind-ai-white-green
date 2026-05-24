"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  Brain,
  Sparkles,
  Trophy,
  Flame,
  TrendingUp,
  Clock,
  Zap,
  Target,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import AppLayout from "@/components/layout/AppLayout";
import GlassCard from "@/components/ui/GlassCard";
import ShimmerButton from "@/components/ui/ShimmerButton";
import {
  useProfile,
  getEvents,
  resetProfile,
  ALL_BADGES,
  getRecommendations,
  getDailyInsight,
  type LearnStyle,
} from "@/lib/personalization";
import Link from "next/link";

const STYLE_LABELS: Record<LearnStyle, string> = {
  analogy: "Analogy",
  visual: "Visual",
  stepByStep: "Step-by-Step",
  storytelling: "Storytelling",
  formal: "Formal",
};

const STYLE_EMOJI: Record<LearnStyle, string> = {
  analogy: "💡",
  visual: "👁️",
  stepByStep: "📋",
  storytelling: "📖",
  formal: "🎓",
};

export default function InsightsPage() {
  const profile = useProfile();
  const events = getEvents();
  const recommendations = getRecommendations(profile);
  const insight = getDailyInsight(profile);

  // Radar chart data
  const radarData = useMemo(
    () =>
      (Object.entries(profile.style) as [LearnStyle, number][]).map(([k, v]) => ({
        style: STYLE_LABELS[k],
        value: v,
      })),
    [profile.style]
  );

  // Mastery bar chart data
  const masteryData = useMemo(() => {
    return Object.entries(profile.mastery)
      .map(([topic, mastery]) => ({ topic: topic.slice(0, 20), mastery }))
      .sort((a, b) => b.mastery - a.mastery)
      .slice(0, 8);
  }, [profile.mastery]);

  // 7-day activity histogram
  const weekData = useMemo(() => {
    const days: { date: string; events: number }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString("en-US", { weekday: "short" });
      const count = events.filter((e) => {
        const ed = new Date(e.ts);
        return (
          ed.getFullYear() === d.getFullYear() &&
          ed.getMonth() === d.getMonth() &&
          ed.getDate() === d.getDate()
        );
      }).length;
      days.push({ date: label, events: count });
    }
    return days;
  }, [events]);

  const earned = new Set(profile.badges);
  const topStyle = (Object.entries(profile.style) as [LearnStyle, number][]).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const reset = () => {
    if (confirm("Reset all your learning data? This cannot be undone.")) {
      resetProfile();
      toast.success("Profile reset. Start fresh!");
    }
  };

  return (
    <AppLayout title="Learning DNA">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="p-6 md:p-8" glow>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500">
                  <Brain size={26} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    Your <span className="animate-gradient-text">Learning DNA</span>
                  </h1>
                  <p className="text-sm text-slate-400 mt-1">
                    The ML engine has analyzed {events.length} of your interactions to map how you learn best.
                  </p>
                </div>
              </div>
              <button
                onClick={reset}
                className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-white/5 transition"
              >
                <RefreshCw size={12} /> Reset profile
              </button>
            </div>

            {/* Top-line metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              <MetricCard
                icon={Flame}
                value={profile.streakDays}
                label="Day streak"
                color="text-rose-400"
              />
              <MetricCard
                icon={Zap}
                value={profile.totalSessions}
                label="Sessions"
                color="text-amber-400"
              />
              <MetricCard
                icon={Clock}
                value={`${(profile.counters.minutesFocused / 60).toFixed(1)}h`}
                label="Focused"
                color="text-cyan-400"
              />
              <MetricCard
                icon={Target}
                value={profile.counters.doubtsSolved}
                label="Doubts"
                color="text-violet-400"
              />
            </div>
          </GlassCard>
        </motion.div>

        {/* Today's insight + Top style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <GlassCard className="p-5 h-full">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                <Sparkles size={12} className="text-violet-400" /> Today&apos;s Insight
              </h3>
              <div className="flex items-start gap-3">
                <span className="text-4xl">{insight.emoji}</span>
                <p className="text-base text-white leading-relaxed pt-1">{insight.text}</p>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <GlassCard className="p-5 h-full" glow>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                <Brain size={12} className="text-cyan-400" /> Dominant Style
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{STYLE_EMOJI[topStyle[0]]}</span>
                <div>
                  <div className="text-2xl font-bold text-white">{STYLE_LABELS[topStyle[0]]}</div>
                  <div className="text-sm text-slate-400">
                    {topStyle[1]}% of your learning leans this way
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                {styleAdvice(topStyle[0])}
              </p>
            </GlassCard>
          </motion.div>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Radar — Learning style */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <GlassCard className="p-5 h-full">
              <h3 className="text-sm font-semibold text-white mb-1">Learning Style Profile</h3>
              <p className="text-xs text-slate-400 mb-4">How you absorb new concepts best</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(139, 92, 246, 0.2)" />
                    <PolarAngleAxis dataKey="style" tick={{ fill: "currentColor", fontSize: 11 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 60]} tick={false} axisLine={false} />
                    <Radar
                      name="Style"
                      dataKey="value"
                      stroke="#8b5cf6"
                      fill="url(#radarGrad)"
                      fillOpacity={0.5}
                      strokeWidth={2}
                    />
                    <defs>
                      <linearGradient id="radarGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.6} />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.3} />
                      </linearGradient>
                    </defs>
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>

          {/* 7-day activity */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <GlassCard className="p-5 h-full">
              <h3 className="text-sm font-semibold text-white mb-1">Weekly Activity</h3>
              <p className="text-xs text-slate-400 mb-4">Interactions per day in the last 7 days</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weekData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
                    <XAxis dataKey="date" tick={{ fill: "currentColor", fontSize: 11 }} />
                    <YAxis tick={{ fill: "currentColor", fontSize: 11 }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(15, 23, 42, 0.95)",
                        border: "1px solid rgba(139, 92, 246, 0.3)",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="events" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
                    <defs>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Mastery */}
        {masteryData.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <GlassCard className="p-5">
              <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                <TrendingUp size={14} className="text-emerald-400" /> Topic Mastery
              </h3>
              <p className="text-xs text-slate-400 mb-4">Where you&apos;re strong (green) and where to grow (red)</p>
              <div className="space-y-2.5">
                {masteryData.map((m) => (
                  <div key={m.topic}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-200 capitalize">{m.topic}</span>
                      <span className="text-slate-400">{m.mastery}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${m.mastery}%` }}
                        transition={{ duration: 0.8 }}
                        className={`h-full rounded-full ${
                          m.mastery >= 70
                            ? "bg-gradient-to-r from-emerald-500 to-green-500"
                            : m.mastery >= 40
                            ? "bg-gradient-to-r from-amber-500 to-yellow-500"
                            : "bg-gradient-to-r from-rose-500 to-pink-500"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <GlassCard className="p-5">
              <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                <Sparkles size={14} className="text-violet-400" /> Recommended for You
              </h3>
              <p className="text-xs text-slate-400 mb-4">Personalized suggestions based on your profile</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {recommendations.map((r) => (
                  <Link key={r.id} href={r.href}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-violet-500/30 transition-all cursor-pointer"
                    >
                      <span className="text-2xl flex-shrink-0">{r.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-white">{r.title}</div>
                        <div className="text-xs text-slate-400 truncate">{r.reason}</div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Badges */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
              <Trophy size={14} className="text-amber-400" /> Achievements
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {profile.badges.length} / {ALL_BADGES.length} unlocked
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {ALL_BADGES.map((b) => {
                const got = earned.has(b.id);
                return (
                  <motion.div
                    key={b.id}
                    whileHover={got ? { scale: 1.05 } : {}}
                    className={`relative p-3 rounded-xl text-center border transition-all ${
                      got
                        ? "bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border-violet-500/40"
                        : "bg-white/5 border-white/5 opacity-40"
                    }`}
                    title={b.description}
                  >
                    <div className={`text-3xl mb-1 ${got ? "" : "grayscale"}`}>{b.emoji}</div>
                    <div className={`text-[10px] font-medium ${got ? "text-white" : "text-slate-500"}`}>
                      {b.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>

        {/* CTA */}
        <div className="text-center pt-2 pb-6">
          <Link href="/dashboard">
            <ShimmerButton>
              Back to dashboard
            </ShimmerButton>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}

function MetricCard({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: typeof Brain;
  value: string | number;
  label: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <Icon size={14} className={`${color} mb-1.5`} />
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">{label}</div>
    </div>
  );
}

function styleAdvice(style: LearnStyle): string {
  const advice: Record<LearnStyle, string> = {
    analogy: "You connect new ideas through familiar everyday concepts. We'll keep using real-world analogies in answers.",
    visual: "You learn best through diagrams, images, and videos. Try the YouTube Summarizer and image-based doubts.",
    stepByStep: "You prefer methodical breakdowns. Quiz Generator and Study Planner will suit you.",
    storytelling: "You absorb knowledge through narrative. Voice answers and contextual explanations help most.",
    formal: "You like rigorous, textbook-style definitions. We'll use precise terminology in your answers.",
  };
  return advice[style];
}
