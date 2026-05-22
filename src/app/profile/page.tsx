"use client";

import AppLayout from "@/components/layout/AppLayout";
import PedagogyChart from "@/components/dashboard/PedagogyChart";
import { mockStudent, mockProgress } from "@/lib/mock-data";
import { MODULES } from "@/lib/constants";
import {
  User, Mail, GraduationCap, Building, Globe, Calendar,
  Flame, Clock, Zap, Award, TrendingUp,
} from "lucide-react";

export default function ProfilePage() {
  return (
    <AppLayout title="Profile">
      <div className="max-w-5xl mx-auto">
        {/* Profile header */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold">
              {mockStudent.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">{mockStudent.name}</h2>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Mail size={14} /> {mockStudent.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <GraduationCap size={14} /> {mockStudent.grade}
                </span>
                <span className="flex items-center gap-1.5">
                  <Building size={14} /> {mockStudent.institution}
                </span>
                <span className="flex items-center gap-1.5">
                  <Globe size={14} /> {mockStudent.language}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} /> Joined {new Date(mockStudent.joinedAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                </span>
              </div>
            </div>
            <button className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm rounded-lg transition-colors">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { icon: Flame, label: "Day Streak", value: mockStudent.streakDays, color: "text-amber-400", bg: "bg-amber-400/10" },
            { icon: Clock, label: "Total Hours", value: Math.round(mockStudent.totalMinutes / 60), color: "text-cyan-400", bg: "bg-cyan-400/10" },
            { icon: Zap, label: "Sessions", value: mockStudent.totalSessions, color: "text-violet-400", bg: "bg-violet-400/10" },
            { icon: Award, label: "Level", value: "Advanced", color: "text-emerald-400", bg: "bg-emerald-400/10" },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.bg} border border-slate-800 rounded-xl p-4`}>
              <stat.icon size={18} className={stat.color} />
              <p className={`text-2xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
              <p className="text-xs text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pedagogy chart */}
          <PedagogyChart />

          {/* Module progress */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="text-white font-semibold mb-4">Module Progress</h3>
            <div className="space-y-3">
              {mockProgress.map((prog) => {
                const mod = MODULES.find((m) => m.id === prog.moduleId)!;
                const pct = Math.round((prog.completedTopics / prog.totalTopics) * 100);
                return (
                  <div key={prog.moduleId} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${mod.color}15` }}
                    >
                      <mod.icon size={16} style={{ color: mod.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-300">{mod.shortName}</span>
                        <span style={{ color: mod.color }}>{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, backgroundColor: mod.color }}
                        />
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-slate-400">
                        {Math.round(prog.accuracy * 100)}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
