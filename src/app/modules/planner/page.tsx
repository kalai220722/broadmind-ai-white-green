"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  CalendarDays,
  Check,
  Trash2,
  Target,
  Flame,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";
import AppLayout from "@/components/layout/AppLayout";
import GlassCard from "@/components/ui/GlassCard";
import ShimmerButton from "@/components/ui/ShimmerButton";
import { smallConfetti } from "@/lib/confetti";

interface Task {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  subject?: string;
  duration?: number; // minutes
  done: boolean;
}

const SUBJECTS = ["Math", "Physics", "Chemistry", "Biology", "CS", "English", "History", "Other"];
const SUBJECT_COLORS: Record<string, string> = {
  Math: "from-violet-500 to-purple-600",
  Physics: "from-cyan-500 to-blue-600",
  Chemistry: "from-emerald-500 to-green-600",
  Biology: "from-pink-500 to-rose-600",
  CS: "from-amber-500 to-orange-600",
  English: "from-fuchsia-500 to-pink-600",
  History: "from-yellow-500 to-amber-600",
  Other: "from-slate-500 to-slate-600",
};

function newId() {
  return Math.random().toString(36).slice(2);
}

function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function startOfWeek(d: Date) {
  const x = new Date(d);
  const day = x.getDay();
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
}

export default function PlannerPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [cursor, setCursor] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(dateKey(new Date()));
  const [showAdd, setShowAdd] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [duration, setDuration] = useState(30);

  useEffect(() => {
    const stored = localStorage.getItem("bm-planner");
    if (stored) {
      try {
        setTasks(JSON.parse(stored));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("bm-planner", JSON.stringify(tasks));
  }, [tasks]);

  const monthDays = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const last = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
    const start = startOfWeek(first);
    const days: Date[] = [];
    const d = new Date(start);
    while (d <= last || d.getDay() !== 0) {
      days.push(new Date(d));
      d.setDate(d.getDate() + 1);
      if (days.length > 42) break;
    }
    return days;
  }, [cursor]);

  const dayTasks = (key: string) => tasks.filter((t) => t.date === key);

  const addTask = () => {
    if (!title.trim()) {
      toast.error("Enter a task");
      return;
    }
    const t: Task = {
      id: newId(),
      date: selectedDate,
      title: title.trim(),
      subject,
      duration,
      done: false,
    };
    setTasks((prev) => [...prev, t]);
    setTitle("");
    setShowAdd(false);
    toast.success("Task added");
  };

  const toggleDone = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          if (!t.done) smallConfetti();
          return { ...t, done: !t.done };
        }
        return t;
      })
    );
  };

  const remove = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Stats
  const today = dateKey(new Date());
  const todayTasks = dayTasks(today);
  const doneToday = todayTasks.filter((t) => t.done).length;
  const totalMinutes = todayTasks.reduce((s, t) => s + (t.done ? t.duration || 0 : 0), 0);

  // Streak
  const streak = useMemo(() => {
    let s = 0;
    const d = new Date();
    while (true) {
      const key = dateKey(d);
      const dayList = tasks.filter((t) => t.date === key);
      if (dayList.length === 0 || !dayList.every((t) => t.done)) break;
      s++;
      d.setDate(d.getDate() - 1);
    }
    return s;
  }, [tasks]);

  const monthLabel = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const todayKey = today;

  return (
    <AppLayout title="Study Planner">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-4">
        {/* Calendar */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
              className="p-2 rounded-lg hover:bg-white/5 text-slate-300"
            >
              <ChevronLeft size={16} />
            </button>
            <h2 className="text-lg font-bold text-white">{monthLabel}</h2>
            <button
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
              className="p-2 rounded-lg hover:bg-white/5 text-slate-300"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-center text-xs uppercase tracking-wider text-slate-500 py-1">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {monthDays.map((d, i) => {
              const key = dateKey(d);
              const inMonth = d.getMonth() === cursor.getMonth();
              const isToday = key === todayKey;
              const isSelected = key === selectedDate;
              const list = dayTasks(key);
              const allDone = list.length > 0 && list.every((t) => t.done);
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(key)}
                  className={`relative aspect-square rounded-lg p-1.5 text-left transition group ${
                    isSelected
                      ? "bg-violet-600/30 ring-2 ring-violet-500/60"
                      : "hover:bg-white/5"
                  } ${!inMonth ? "opacity-30" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-medium ${
                        isToday
                          ? "text-cyan-300 font-bold"
                          : isSelected
                          ? "text-white"
                          : "text-slate-300"
                      }`}
                    >
                      {d.getDate()}
                    </span>
                    {allDone && <Check size={10} className="text-emerald-400" />}
                  </div>
                  <div className="flex flex-wrap gap-0.5 mt-1">
                    {list.slice(0, 3).map((t) => (
                      <span
                        key={t.id}
                        className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${
                          SUBJECT_COLORS[t.subject || "Other"]
                        }`}
                      />
                    ))}
                    {list.length > 3 && (
                      <span className="text-[8px] text-slate-500">+{list.length - 3}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </GlassCard>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            <GlassCard className="p-3 text-center">
              <Target size={14} className="mx-auto text-violet-400 mb-1" />
              <div className="text-lg font-bold text-white">{doneToday}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest">Done</div>
            </GlassCard>
            <GlassCard className="p-3 text-center">
              <TrendingUp size={14} className="mx-auto text-cyan-400 mb-1" />
              <div className="text-lg font-bold text-white">{totalMinutes}m</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest">Today</div>
            </GlassCard>
            <GlassCard className="p-3 text-center">
              <Flame size={14} className="mx-auto text-rose-400 mb-1" />
              <div className="text-lg font-bold text-white">{streak}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest">Streak</div>
            </GlassCard>
          </div>

          {/* Day tasks */}
          <GlassCard className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">
                {new Date(selectedDate + "T00:00").toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </h3>
              <button
                onClick={() => setShowAdd((s) => !s)}
                className="p-1.5 rounded-lg bg-violet-600/20 text-violet-300 hover:bg-violet-600/30"
              >
                <Plus size={14} />
              </button>
            </div>

            <AnimatePresence>
              {showAdd && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mb-3"
                >
                  <div className="space-y-2 p-3 rounded-lg bg-white/5 border border-white/10">
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addTask()}
                      placeholder="What to study?"
                      className="w-full bg-white/5 border border-white/10 rounded-md p-2 text-sm text-white outline-none"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-md p-2 text-xs text-white outline-none"
                      >
                        {SUBJECTS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(+e.target.value || 30)}
                        placeholder="30"
                        className="w-20 bg-white/5 border border-white/10 rounded-md p-2 text-xs text-white outline-none"
                      />
                      <span className="text-xs text-slate-400 self-center">min</span>
                    </div>
                    <ShimmerButton onClick={addTask} size="sm" className="w-full">
                      Add task
                    </ShimmerButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin">
              {dayTasks(selectedDate).length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-8">No tasks for this day</p>
              ) : (
                dayTasks(selectedDate).map((t) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`group flex items-start gap-2 p-2.5 rounded-lg bg-white/5 border border-white/10 ${
                      t.done ? "opacity-50" : ""
                    }`}
                  >
                    <button
                      onClick={() => toggleDone(t.id)}
                      className={`mt-0.5 w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center transition ${
                        t.done
                          ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white"
                          : "border-2 border-white/20 hover:border-violet-500"
                      }`}
                    >
                      {t.done && <Check size={11} />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm ${t.done ? "line-through text-slate-500" : "text-white"}`}>
                        {t.title}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {t.subject && (
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded-full bg-gradient-to-r ${
                              SUBJECT_COLORS[t.subject]
                            } text-white`}
                          >
                            {t.subject}
                          </span>
                        )}
                        {t.duration && (
                          <span className="text-[10px] text-slate-500">{t.duration} min</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => remove(t.id)}
                      className="opacity-0 group-hover:opacity-60 hover:opacity-100 hover:text-rose-400 text-slate-500"
                    >
                      <Trash2 size={12} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </AppLayout>
  );
}
