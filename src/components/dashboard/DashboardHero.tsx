"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Newspaper,
  CalendarClock,
  Brain,
  Sparkles,
  ArrowRight,
  Loader2,
  RefreshCw,
  Star,
  TrendingUp,
  Flame,
  Target,
  Clock,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { useProfile, getDailyInsight, type LearnStyle } from "@/lib/personalization";
import { EXAMS, nextOccurrence, daysUntil } from "@/lib/exams-data";

const STYLE_LABELS: Record<LearnStyle, string> = {
  analogy: "Analogy",
  visual: "Visual",
  stepByStep: "Step-by-step",
  storytelling: "Storytelling",
  formal: "Formal",
};

// ── Top news ticker ──────────────────────────────────────────────────
interface Story {
  id: string;
  title: string;
  summary: string;
  category: string;
  publishedAt: string;
  examRelevant?: string[];
}

const CATEGORY_COLORS: Record<string, string> = {
  national: "from-orange-500 to-red-600",
  international: "from-cyan-500 to-blue-600",
  "sci-tech": "from-violet-500 to-fuchsia-600",
  economy: "from-emerald-500 to-green-600",
  sports: "from-yellow-500 to-amber-600",
  education: "from-pink-500 to-rose-600",
  exams: "from-blue-500 to-indigo-600",
};

function NewsCarousel() {
  const profile = useProfile();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const cached = localStorage.getItem("bm-news-cache");
    if (cached) {
      try {
        const { stories: s, ts } = JSON.parse(cached);
        if (Date.now() - ts < 6 * 60 * 60 * 1000) {
          setStories(s);
          return;
        }
      } catch {}
    }
    // Auto-fetch if cache miss
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-rotate
  useEffect(() => {
    if (stories.length === 0) return;
    const t = setInterval(() => {
      setActiveIdx((i) => (i + 1) % Math.min(stories.length, 6));
    }, 6000);
    return () => clearInterval(t);
  }, [stories.length]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const interests = JSON.parse(localStorage.getItem("bm-news-interests") || '["UPSC", "Tech"]');
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interests, language: profile.language, region: "India" }),
      });
      const data = await res.json();
      if (data.stories) {
        setStories(data.stories);
        localStorage.setItem("bm-news-cache", JSON.stringify({ stories: data.stories, ts: Date.now() }));
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  const visibleStories = stories.slice(0, 6);
  const current = visibleStories[activeIdx];

  return (
    <GlassCard className="p-4 lg:p-5 h-full flex flex-col overflow-hidden relative" glow>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600">
            <Newspaper size={12} className="text-white" />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-rose-300 font-semibold">
            Today&apos;s Pulse
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/modules/news" className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1">
            All news <ArrowRight size={10} />
          </Link>
          <button
            onClick={fetchNews}
            disabled={loading}
            className="p-1 rounded text-slate-400 hover:text-white"
            title="Refresh news"
          >
            {loading ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />}
          </button>
        </div>
      </div>

      {visibleStories.length === 0 ? (
        loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 size={20} className="text-rose-400 animate-spin" />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-xs text-slate-400 mb-2">No news cached yet</p>
            <button onClick={fetchNews} className="text-xs text-rose-300 hover:text-white">
              Load today&apos;s news →
            </button>
          </div>
        )
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={current?.id || activeIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col"
            >
              <span
                className={`text-[9px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-widest w-fit bg-gradient-to-r ${
                  CATEGORY_COLORS[current?.category || "national"] || "from-slate-500 to-slate-600"
                } text-white mb-2`}
              >
                {current?.category}
              </span>
              <h3 className="text-base lg:text-lg font-bold text-white leading-tight mb-1.5 line-clamp-2">
                {current?.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 flex-1">
                {current?.summary}
              </p>
              {current?.examRelevant && current.examRelevant.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {current.examRelevant.slice(0, 3).map((e) => (
                    <span key={e} className="text-[9px] px-1.5 py-0.5 rounded-full bg-violet-500/15 text-violet-300">
                      {e}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {visibleStories.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`h-1 rounded-full transition-all ${
                  i === activeIdx ? "w-6 bg-rose-400" : "w-1.5 bg-white/10"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </GlassCard>
  );
}

// ── Exam countdown ─────────────────────────────────────────────────────
function ExamCountdown() {
  const [starred, setStarred] = useState<string[]>([]);

  useEffect(() => {
    const s = localStorage.getItem("bm-starred-exams");
    if (s) {
      try {
        setStarred(JSON.parse(s));
      } catch {}
    }
  }, []);

  const upcoming = useMemo(() => {
    return EXAMS
      .filter((e) => starred.length === 0 || starred.includes(e.id))
      .map((e) => {
        const date = nextOccurrence(e.recurringMonth, e.recurringDay);
        const days = daysUntil(date);
        return { ...e, date, days };
      })
      .filter((e) => e.days !== null && e.days >= 0)
      .sort((a, b) => (a.days || 999) - (b.days || 999))
      .slice(0, 4);
  }, [starred]);

  return (
    <GlassCard className="p-4 lg:p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
            <CalendarClock size={12} className="text-white" />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-blue-300 font-semibold">
            {starred.length > 0 ? "Your Exams" : "Top Exams"}
          </span>
        </div>
        <Link href="/modules/exams" className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1">
          All <ArrowRight size={10} />
        </Link>
      </div>

      <div className="space-y-2 flex-1">
        {upcoming.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-xs text-slate-400 mb-1">No upcoming exams</p>
            <Link href="/modules/exams" className="text-xs text-violet-300 hover:text-white">
              Star your exams →
            </Link>
          </div>
        ) : (
          upcoming.map((e, i) => {
            const urgent = (e.days ?? 999) <= 30;
            const soon = (e.days ?? 999) <= 90;
            return (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {starred.includes(e.id) && <Star size={9} className="text-amber-400" fill="currentColor" />}
                    <span className="text-xs font-semibold text-white truncate">{e.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {e.date?.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </span>
                </div>
                <div
                  className={`text-right ml-2 ${
                    urgent ? "text-rose-300" : soon ? "text-amber-300" : "text-cyan-300"
                  }`}
                >
                  <div className="text-base font-bold leading-none">{e.days}d</div>
                  <div className="text-[8px] uppercase tracking-widest opacity-60">left</div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </GlassCard>
  );
}

// ── AI Schedule chip ──────────────────────────────────────────────────
interface PlanTask {
  title: string;
  subject: string;
  duration: number;
  priority: string;
}

function AIScheduleChip() {
  const profile = useProfile();
  const [plan, setPlan] = useState<{ title: string; tasks: PlanTask[]; tip?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cached = localStorage.getItem("bm-todays-plan");
    if (cached) {
      try {
        const { plan: p, date } = JSON.parse(cached);
        if (date === new Date().toDateString()) {
          setPlan(p);
        }
      } catch {}
    }
  }, []);

  const generate = async () => {
    setLoading(true);
    try {
      const topStyle = (Object.entries(profile.style).sort((a, b) => b[1] - a[1])[0]?.[0]) || "stepByStep";
      const weak = Object.entries(profile.mastery).filter(([, v]) => v < 50).map(([k]) => k);
      const strong = Object.entries(profile.mastery).filter(([, v]) => v >= 70).map(([k]) => k);
      const res = await fetch("/api/planner-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level: profile.level,
          pace: profile.pace,
          style: topStyle,
          weakTopics: weak.slice(0, 5),
          strongTopics: strong.slice(0, 5),
          availableMinutes: 90,
          language: profile.language,
        }),
      });
      const data = await res.json();
      if (!data.error) {
        setPlan(data);
        localStorage.setItem("bm-todays-plan", JSON.stringify({ plan: data, date: new Date().toDateString() }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard className="p-4 lg:p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
            <Sparkles size={12} className="text-white" />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-cyan-300 font-semibold">
            AI Today
          </span>
        </div>
        <Link href="/modules/planner" className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1">
          Full plan <ArrowRight size={10} />
        </Link>
      </div>

      {plan ? (
        <div className="flex-1 flex flex-col">
          <p className="text-xs text-cyan-300 font-medium mb-2">{plan.title}</p>
          <div className="space-y-1.5 flex-1 max-h-[180px] overflow-y-auto scrollbar-thin">
            {plan.tasks?.slice(0, 4).map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-2 p-1.5 rounded-md bg-white/5"
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    t.priority === "high" ? "bg-rose-400" : t.priority === "medium" ? "bg-amber-400" : "bg-cyan-400"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] text-white truncate">{t.title}</div>
                </div>
                <span className="text-[9px] text-slate-400 flex-shrink-0">{t.duration}m</span>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <Sparkles size={20} className="text-cyan-400 mb-2 float-slow" />
          <p className="text-xs text-slate-400 mb-3">
            Let AI plan today
            <br />
            from your DNA
          </p>
          <button
            onClick={generate}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-medium disabled:opacity-50"
          >
            {loading ? <Loader2 size={11} className="animate-spin" /> : <Sparkles size={11} />}
            {loading ? "Planning..." : "Generate"}
          </button>
        </div>
      )}
    </GlassCard>
  );
}

// ── Insights tiles ────────────────────────────────────────────────────
function InsightsTile() {
  const profile = useProfile();
  const insight = getDailyInsight(profile);
  const topStyle = (Object.entries(profile.style) as [LearnStyle, number][]).sort((a, b) => b[1] - a[1])[0];

  return (
    <GlassCard className="p-4 lg:p-5 h-full flex flex-col" glow>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600">
            <Brain size={12} className="text-white" />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-violet-300 font-semibold">
            Your DNA
          </span>
        </div>
        <Link href="/modules/insights" className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1">
          Details <ArrowRight size={10} />
        </Link>
      </div>

      <div className="flex-1 flex flex-col gap-2.5">
        {/* Top style */}
        <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20">
          <div className="text-[9px] uppercase tracking-widest text-violet-300 mb-0.5">Dominant style</div>
          <div className="text-sm font-bold text-white">{STYLE_LABELS[topStyle[0]]} · {topStyle[1]}%</div>
        </div>

        {/* Daily insight */}
        <div className="p-2 rounded-lg bg-white/5 border border-white/10 flex-1">
          <div className="text-[9px] uppercase tracking-widest text-slate-400 mb-0.5">Today&apos;s insight</div>
          <div className="text-xs text-slate-200 leading-relaxed">
            <span className="mr-1">{insight.emoji}</span>
            {insight.text}
          </div>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-3 gap-1 text-center">
          <div className="p-1.5 rounded-md bg-white/5">
            <Flame size={10} className="text-rose-400 mx-auto" />
            <div className="text-xs font-bold text-white">{profile.streakDays}d</div>
          </div>
          <div className="p-1.5 rounded-md bg-white/5">
            <Clock size={10} className="text-cyan-400 mx-auto" />
            <div className="text-xs font-bold text-white">{(profile.counters.minutesFocused / 60).toFixed(1)}h</div>
          </div>
          <div className="p-1.5 rounded-md bg-white/5">
            <Target size={10} className="text-violet-400 mx-auto" />
            <div className="text-xs font-bold text-white">{profile.counters.doubtsSolved}</div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

// ── The hero strip ────────────────────────────────────────────────────
export default function DashboardHero() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
      <NewsCarousel />
      <ExamCountdown />
      <AIScheduleChip />
      <InsightsTile />
    </div>
  );
}
