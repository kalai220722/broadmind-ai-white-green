"use client";

import { Flame, Clock, Zap, Target } from "lucide-react";
import { mockStudent, mockProgress } from "@/lib/mock-data";

const stats = [
  {
    label: "Day Streak",
    value: mockStudent.streakDays,
    icon: Flame,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
  },
  {
    label: "Total Hours",
    value: Math.round(mockStudent.totalMinutes / 60),
    icon: Clock,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/20",
  },
  {
    label: "Sessions",
    value: mockStudent.totalSessions,
    icon: Zap,
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
  },
  {
    label: "Avg. Accuracy",
    value: `${Math.round(mockProgress.reduce((a, b) => a + b.accuracy, 0) / mockProgress.length * 100)}%`,
    icon: Target,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
  },
];

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`${stat.bg} ${stat.border} border rounded-xl p-4 lg:p-5`}
        >
          <div className="flex items-center gap-2 mb-2">
            <stat.icon size={18} className={stat.color} />
            <span className="text-xs text-slate-400 font-medium">{stat.label}</span>
          </div>
          <p className={`text-2xl lg:text-3xl font-bold ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
