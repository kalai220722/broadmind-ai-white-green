"use client";

import AppLayout from "@/components/layout/AppLayout";
import StatsGrid from "@/components/dashboard/StatsGrid";
import ModuleCard from "@/components/dashboard/ModuleCard";
import PedagogyChart from "@/components/dashboard/PedagogyChart";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import { MODULES } from "@/lib/constants";
import { mockProgress, mockStudent } from "@/lib/mock-data";
import { Sparkles } from "lucide-react";

export default function Dashboard() {
  return (
    <AppLayout title="Dashboard">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-violet-600/20 via-indigo-600/20 to-cyan-600/20 border border-violet-500/20 p-6 mb-6 animate-pulse-glow">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={18} className="text-violet-400" />
            <span className="text-xs text-violet-300 font-medium">Welcome back</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-white mb-1">
            Good morning, {mockStudent.name.split(" ")[0]}!
          </h2>
          <p className="text-sm text-slate-300">
            You&apos;ve completed {mockStudent.totalSessions} sessions across {mockProgress.length} modules.
            Your strongest style is <span className="text-violet-300 font-medium">Analogy-based learning</span>.
          </p>
        </div>
        <div className="absolute -top-10 -right-10 w-60 h-60 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      {/* Stats */}
      <div className="mb-6">
        <StatsGrid />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Modules grid */}
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Your Modules</h3>
            <span className="text-xs text-slate-400">{MODULES.length} modules</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MODULES.map((mod) => (
              <ModuleCard
                key={mod.id}
                module={mod}
                progress={mockProgress.find((p) => p.moduleId === mod.id)}
              />
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          <PedagogyChart />
          <ActivityFeed />
        </div>
      </div>
    </AppLayout>
  );
}
