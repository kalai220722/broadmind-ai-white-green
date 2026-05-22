"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Module } from "@/lib/constants";
import type { ModuleProgress } from "@/lib/types";

interface ModuleCardProps {
  module: Module;
  progress?: ModuleProgress;
}

export default function ModuleCard({ module, progress }: ModuleCardProps) {
  const pct = progress
    ? Math.round((progress.completedTopics / progress.totalTopics) * 100)
    : 0;

  return (
    <Link href={module.href} className="group block">
      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 p-5 transition-all hover:border-slate-700 hover:bg-slate-900 hover:shadow-lg hover:shadow-violet-500/5">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${module.color}15` }}
          >
            <module.icon size={22} style={{ color: module.color }} />
          </div>
          <ArrowRight
            size={16}
            className="text-slate-600 group-hover:text-slate-400 transition-colors mt-1"
          />
        </div>

        <h3 className="text-white font-semibold mb-1">{module.name}</h3>
        <p className="text-xs text-slate-400 mb-4 line-clamp-2">{module.description}</p>

        {progress ? (
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400">
                {progress.completedTopics}/{progress.totalTopics} topics
              </span>
              <span style={{ color: module.color }}>{pct}%</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${pct}%`,
                  backgroundColor: module.color,
                }}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {module.features.slice(0, 3).map((f) => (
              <span
                key={f}
                className="text-[10px] px-2 py-0.5 rounded-full border border-slate-700 text-slate-400"
              >
                {f}
              </span>
            ))}
          </div>
        )}

        {/* Glow effect on hover */}
        <div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-3xl"
          style={{ backgroundColor: `${module.color}08` }}
        />
      </div>
    </Link>
  );
}
