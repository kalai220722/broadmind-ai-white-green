"use client";

import AppLayout from "@/components/layout/AppLayout";
import { MODULES } from "@/lib/constants";
import { mockProgress } from "@/lib/mock-data";
import { ArrowLeft, Clock, Target, BookOpen } from "lucide-react";
import Link from "next/link";

interface ModuleLayoutProps {
  moduleId: string;
  children: React.ReactNode;
}

export default function ModuleLayout({ moduleId, children }: ModuleLayoutProps) {
  const module = MODULES.find((m) => m.id === moduleId)!;
  const progress = mockProgress.find((p) => p.moduleId === moduleId);

  const pct = progress
    ? Math.round((progress.completedTopics / progress.totalTopics) * 100)
    : 0;

  return (
    <AppLayout>
      {/* Module header */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </Link>

        <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${module.color}15` }}
              >
                <module.icon size={28} style={{ color: module.color }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{module.name}</h1>
                <p className="text-sm text-slate-400">{module.description}</p>
              </div>
            </div>

            {progress && (
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-slate-400" />
                  <span className="text-sm text-slate-300">
                    {Math.round(progress.timeSpent / 60)}h spent
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Target size={14} className="text-slate-400" />
                  <span className="text-sm text-slate-300">
                    {Math.round(progress.accuracy * 100)}% accuracy
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen size={14} className="text-slate-400" />
                  <span className="text-sm text-slate-300">
                    {progress.completedTopics}/{progress.totalTopics} topics
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Progress bar */}
          {progress && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400">Module progress</span>
                <span style={{ color: module.color }}>{pct}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, backgroundColor: module.color }}
                />
              </div>
            </div>
          )}

          {/* Features */}
          <div className="mt-4 flex flex-wrap gap-2">
            {module.features.map((f) => (
              <span
                key={f}
                className="text-xs px-3 py-1 rounded-full border text-slate-300"
                style={{ borderColor: `${module.color}30`, backgroundColor: `${module.color}08` }}
              >
                {f}
              </span>
            ))}
          </div>

          <div
            className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: module.color }}
          />
        </div>
      </div>

      {children}
    </AppLayout>
  );
}
