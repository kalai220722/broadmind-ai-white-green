"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Coffee, Brain, Settings, Bell, Flame } from "lucide-react";
import toast from "react-hot-toast";
import AppLayout from "@/components/layout/AppLayout";
import GlassCard from "@/components/ui/GlassCard";
import ShimmerButton from "@/components/ui/ShimmerButton";
import { celebrate } from "@/lib/confetti";

type Mode = "focus" | "shortBreak" | "longBreak";

const PRESETS: Record<Mode, { label: string; duration: number; color: string; icon: typeof Brain }> = {
  focus: { label: "Focus", duration: 25 * 60, color: "from-violet-500 to-fuchsia-600", icon: Brain },
  shortBreak: { label: "Short Break", duration: 5 * 60, color: "from-cyan-500 to-blue-600", icon: Coffee },
  longBreak: { label: "Long Break", duration: 15 * 60, color: "from-emerald-500 to-teal-600", icon: Coffee },
};

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function PomodoroPage() {
  const [mode, setMode] = useState<Mode>("focus");
  const [secondsLeft, setSecondsLeft] = useState(PRESETS.focus.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [completedToday, setCompletedToday] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState(15);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const preset = PRESETS[mode];
  const totalSeconds =
    mode === "focus" ? focusMinutes * 60 : mode === "shortBreak" ? shortBreakMinutes * 60 : longBreakMinutes * 60;
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  // Load stats from localStorage
  useEffect(() => {
    const stats = JSON.parse(localStorage.getItem("bm-pomodoro-stats") || "{}");
    const today = new Date().toDateString();
    if (stats.date === today) {
      setCompletedToday(stats.count || 0);
    }
    setStreak(stats.streak || 0);
  }, []);

  // Persist stats
  const recordCompletion = () => {
    const today = new Date().toDateString();
    const stats = JSON.parse(localStorage.getItem("bm-pomodoro-stats") || "{}");
    const newCount = stats.date === today ? (stats.count || 0) + 1 : 1;
    let newStreak = stats.streak || 0;
    if (stats.date !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      newStreak = stats.date === yesterday ? newStreak + 1 : 1;
    }
    localStorage.setItem(
      "bm-pomodoro-stats",
      JSON.stringify({ date: today, count: newCount, streak: newStreak })
    );
    setCompletedToday(newCount);
    setStreak(newStreak);
  };

  // Timer
  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsRunning(false);
          if (mode === "focus") {
            recordCompletion();
            celebrate();
            toast.success("Focus session complete! 🎉 Time for a break.");
            playBell();
            setMode("shortBreak");
            return shortBreakMinutes * 60;
          } else {
            toast.success("Break done — back to work!");
            playBell();
            setMode("focus");
            return focusMinutes * 60;
          }
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, mode]);

  // Reset timer when mode/duration changes
  useEffect(() => {
    if (!isRunning) {
      setSecondsLeft(totalSeconds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, focusMinutes, shortBreakMinutes, longBreakMinutes]);

  const playBell = () => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
      gain.gain.linearRampToValueAtTime(0.0, ctx.currentTime + 0.6);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {}
  };

  const toggle = () => setIsRunning((r) => !r);
  const reset = () => {
    setIsRunning(false);
    setSecondsLeft(totalSeconds);
  };

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  // SVG circle props
  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (progress / 100) * circumference;

  const Icon = preset.icon;

  return (
    <AppLayout title="Pomodoro Timer">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Mode tabs */}
        <div className="flex gap-2 justify-center">
          {(Object.keys(PRESETS) as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => {
                if (isRunning) {
                  toast.error("Pause the timer first");
                  return;
                }
                setMode(m);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === m
                  ? `bg-gradient-to-r ${PRESETS[m].color} text-white shadow-lg`
                  : "bg-white/5 text-slate-400 hover:bg-white/10"
              }`}
            >
              {PRESETS[m].label}
            </button>
          ))}
        </div>

        {/* Timer card */}
        <GlassCard className="p-10 text-center" glow>
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-6"
          >
            <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${preset.color}`}>
              <Icon size={20} className="text-white" />
            </div>

            {/* Circular progress */}
            <div className="relative">
              <svg width="300" height="300" className="-rotate-90">
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                <circle
                  cx="150"
                  cy="150"
                  r={radius}
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="12"
                />
                <motion.circle
                  cx="150"
                  cy="150"
                  r={radius}
                  fill="none"
                  stroke="url(#grad)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: dashOffset }}
                  transition={{ duration: 0.5 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  key={`${mins}:${secs}`}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="text-7xl font-bold text-white tabular-nums"
                >
                  {pad(mins)}:{pad(secs)}
                </motion.div>
                <p className="text-sm text-slate-400 mt-2 uppercase tracking-widest">
                  {preset.label}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              <ShimmerButton onClick={toggle} size="lg">
                {isRunning ? <Pause size={18} /> : <Play size={18} />}
                {isRunning ? "Pause" : "Start"}
              </ShimmerButton>
              <ShimmerButton onClick={reset} variant="secondary" size="lg">
                <RotateCcw size={16} />
                Reset
              </ShimmerButton>
              <ShimmerButton
                onClick={() => setShowSettings((s) => !s)}
                variant="ghost"
                size="lg"
              >
                <Settings size={16} />
              </ShimmerButton>
            </div>
          </motion.div>
        </GlassCard>

        {/* Stats + Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Flame size={14} className="text-rose-400" />
                Today&apos;s Progress
              </h3>
              <span className="text-xs text-slate-400">Pomodoros completed</span>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <div className="text-4xl font-bold text-white">{completedToday}</div>
                <div className="text-xs text-slate-400 mt-1">today</div>
              </div>
              <div className="h-12 w-px bg-white/10" />
              <div>
                <div className="text-4xl font-bold animate-gradient-text">{streak}</div>
                <div className="text-xs text-slate-400 mt-1">day streak 🔥</div>
              </div>
            </div>
          </GlassCard>

          <AnimatePresence mode="wait">
            {showSettings ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <GlassCard className="p-5">
                  <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Settings size={14} className="text-violet-400" />
                    Duration (minutes)
                  </h3>
                  <div className="space-y-3">
                    <DurationInput label="Focus" value={focusMinutes} onChange={setFocusMinutes} max={90} />
                    <DurationInput label="Short break" value={shortBreakMinutes} onChange={setShortBreakMinutes} max={30} />
                    <DurationInput label="Long break" value={longBreakMinutes} onChange={setLongBreakMinutes} max={60} />
                  </div>
                </GlassCard>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <GlassCard className="p-5">
                  <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Bell size={14} className="text-cyan-400" />
                    Tips
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-400">
                    <li>• Work for 25 min, rest for 5. Repeat 4 times.</li>
                    <li>• Take a 15-min break after every 4 cycles.</li>
                    <li>• Silence notifications during focus blocks.</li>
                    <li>• Don&apos;t skip breaks — they consolidate memory.</li>
                  </ul>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
}

function DurationInput({
  label,
  value,
  onChange,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  max: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-xs text-slate-300">{label}</label>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(1, value - 1))}
          className="w-7 h-7 rounded-md bg-white/5 hover:bg-white/10 text-white"
        >
          –
        </button>
        <input
          type="number"
          value={value}
          min={1}
          max={max}
          onChange={(e) => onChange(Math.max(1, Math.min(max, +e.target.value || 1)))}
          className="w-14 text-center bg-white/5 border border-white/10 rounded-md py-1 text-sm text-white outline-none"
        />
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-7 h-7 rounded-md bg-white/5 hover:bg-white/10 text-white"
        >
          +
        </button>
      </div>
    </div>
  );
}
