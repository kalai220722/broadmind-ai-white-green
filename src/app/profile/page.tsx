"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import PedagogyChart from "@/components/dashboard/PedagogyChart";
import { mockProgress } from "@/lib/mock-data";
import { MODULES, LANGUAGES } from "@/lib/constants";
import { useProfile, track, resetProfile, type SkillLevel } from "@/lib/personalization";
import {
  Mail,
  GraduationCap,
  Globe,
  Calendar,
  Flame,
  Clock,
  Zap,
  Award,
  Pencil,
  Save,
  X,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const profile = useProfile();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    name: profile.name,
    language: profile.language,
    level: profile.level as SkillLevel,
  });
  const [authUser, setAuthUser] = useState<{ email?: string | null; phone?: string | null } | null>(
    null
  );

  useEffect(() => {
    setDraft({ name: profile.name, language: profile.language, level: profile.level });
  }, [profile.name, profile.language, profile.level]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bm-user");
      if (stored) setAuthUser(JSON.parse(stored));
    } catch {}
  }, []);

  const save = () => {
    track("onboarding_answer", {
      name: draft.name.trim() || "Student",
      language: draft.language,
      level: draft.level,
    });
    setEditing(false);
    toast.success("Profile updated");
  };

  const cancel = () => {
    setDraft({ name: profile.name, language: profile.language, level: profile.level });
    setEditing(false);
  };

  const wipe = () => {
    if (!confirm("Reset your entire learning profile? This will clear streak, badges, mastery, and DNA.")) return;
    resetProfile();
    toast.success("Profile reset");
  };

  const totalHours = (profile.counters.minutesFocused / 60).toFixed(1);
  const joined = new Date(profile.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" });

  return (
    <AppLayout title="Profile">
      <div className="max-w-5xl mx-auto">
        {/* Profile header */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              {!editing ? (
                <>
                  <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-400">
                    {authUser?.email && (
                      <span className="flex items-center gap-1.5">
                        <Mail size={14} /> {authUser.email}
                      </span>
                    )}
                    {authUser?.phone && (
                      <span className="flex items-center gap-1.5">
                        <Mail size={14} /> {authUser.phone}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <GraduationCap size={14} /> {profile.level}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Globe size={14} /> {profile.language}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} /> Joined {joined}
                    </span>
                  </div>
                </>
              ) : (
                <div className="space-y-3 max-w-md">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Display name</label>
                    <input
                      value={draft.name}
                      onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-violet-500/50"
                      autoFocus
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Language</label>
                      <select
                        value={draft.language}
                        onChange={(e) => setDraft((d) => ({ ...d, language: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none cursor-pointer"
                      >
                        {LANGUAGES.map((l) => (
                          <option key={l} value={l} className="bg-slate-900">{l}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Level</label>
                      <select
                        value={draft.level}
                        onChange={(e) => setDraft((d) => ({ ...d, level: e.target.value as SkillLevel }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none cursor-pointer"
                      >
                        <option value="beginner" className="bg-slate-900">Beginner (School)</option>
                        <option value="intermediate" className="bg-slate-900">Intermediate (UG)</option>
                        <option value="advanced" className="bg-slate-900">Advanced (PG/Pro)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm rounded-lg transition"
                >
                  <Pencil size={12} /> Edit
                </button>
              ) : (
                <>
                  <button
                    onClick={save}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded-lg transition"
                  >
                    <Save size={12} /> Save
                  </button>
                  <button
                    onClick={cancel}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 text-sm rounded-lg transition"
                  >
                    <X size={12} /> Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats row — now from real profile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { icon: Flame, label: "Day Streak", value: profile.streakDays, color: "text-amber-400", bg: "bg-amber-400/10" },
            { icon: Clock, label: "Total Hours", value: totalHours, color: "text-cyan-400", bg: "bg-cyan-400/10" },
            { icon: Zap, label: "Sessions", value: profile.totalSessions, color: "text-violet-400", bg: "bg-violet-400/10" },
            { icon: Award, label: "Badges", value: profile.badges.length, color: "text-emerald-400", bg: "bg-emerald-400/10" },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.bg} border border-white/10 rounded-xl p-4`}>
              <stat.icon size={18} className={stat.color} />
              <p className={`text-2xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
              <p className="text-xs text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Pedagogy chart still uses static data — see Insights for live radar */}
          <PedagogyChart />

          {/* Module progress */}
          <div className="rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-5">
            <h3 className="text-white font-semibold mb-4">Module Progress (sample)</h3>
            <div className="space-y-3">
              {mockProgress.map((prog) => {
                const mod = MODULES.find((m) => m.id === prog.moduleId);
                if (!mod) return null;
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
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
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

        {/* Danger zone */}
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-rose-300">Reset learning profile</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Wipe everything the ML engine has learned about you. Cannot be undone.
            </p>
          </div>
          <button
            onClick={wipe}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 rounded-lg transition"
          >
            <Trash2 size={12} /> Reset
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
