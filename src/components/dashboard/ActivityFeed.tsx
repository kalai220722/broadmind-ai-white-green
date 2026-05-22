"use client";

import { Camera, Code, FileText, Video, BookOpen, Award } from "lucide-react";
import { mockActivity } from "@/lib/mock-data";
import type { ActivityItem } from "@/lib/types";

const typeConfig: Record<ActivityItem["type"], { icon: typeof Camera; color: string; bg: string }> = {
  doubt: { icon: Camera, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  code: { icon: Code, color: "text-cyan-400", bg: "bg-cyan-400/10" },
  quiz: { icon: Award, color: "text-amber-400", bg: "bg-amber-400/10" },
  video: { icon: Video, color: "text-violet-400", bg: "bg-violet-400/10" },
  research: { icon: BookOpen, color: "text-indigo-400", bg: "bg-indigo-400/10" },
  exam: { icon: FileText, color: "text-red-400", bg: "bg-red-400/10" },
};

function timeAgo(dateStr: string) {
  const now = new Date("2026-05-22T12:00:00");
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffHrs = Math.floor(diffMs / 3600000);
  if (diffHrs < 1) return "Just now";
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
}

export default function ActivityFeed() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Recent Activity</h3>
        <button className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
          View all
        </button>
      </div>

      <div className="space-y-3">
        {mockActivity.slice(0, 6).map((item) => {
          const config = typeConfig[item.type];
          return (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer"
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.bg}`}
              >
                <config.icon size={16} className={config.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{item.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-500">{item.module}</span>
                  <span className="text-slate-700">·</span>
                  <span className="text-xs text-slate-500">{timeAgo(item.timestamp)}</span>
                </div>
              </div>
              {item.score !== undefined && (
                <span
                  className={`text-sm font-semibold ${
                    item.score >= 90
                      ? "text-emerald-400"
                      : item.score >= 70
                        ? "text-amber-400"
                        : "text-red-400"
                  }`}
                >
                  {item.score}%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
