"use client";

import ModuleLayout from "@/components/modules/ModuleLayout";
import ChatInterface from "@/components/modules/ChatInterface";
import { BookOpen, GraduationCap, Scale, Briefcase, Beaker, Palette } from "lucide-react";

const disciplines = [
  { name: "Arts & Humanities", count: 24, icon: Palette, color: "#A855F7" },
  { name: "Commerce & Business", count: 18, icon: Briefcase, color: "#F59E0B" },
  { name: "Law", count: 12, icon: Scale, color: "#EF4444" },
  { name: "Sciences", count: 22, icon: Beaker, color: "#06B6D4" },
  { name: "Management", count: 15, icon: GraduationCap, color: "#10B981" },
  { name: "Social Sciences", count: 16, icon: BookOpen, color: "#6366F1" },
];

const popularCourses = [
  { title: "Business Economics", uni: "Madras University", enrolled: 1240 },
  { title: "Indian Constitutional Law", uni: "NLU", enrolled: 890 },
  { title: "Organic Chemistry", uni: "Bharathiar Uni", enrolled: 760 },
  { title: "English Literature", uni: "Anna University", enrolled: 650 },
  { title: "Financial Accounting", uni: "PSG CAS", enrolled: 580 },
];

export default function HigherEducationPage() {
  return (
    <ModuleLayout moduleId="higher-education">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Discipline cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {disciplines.map((disc) => (
              <button
                key={disc.name}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900 transition-all"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${disc.color}15` }}
                >
                  <disc.icon size={24} style={{ color: disc.color }} />
                </div>
                <span className="text-sm text-white font-medium text-center">{disc.name}</span>
                <span className="text-[11px] text-slate-400">{disc.count} courses</span>
              </button>
            ))}
          </div>

          {/* Popular courses */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="text-white font-semibold mb-4">Popular Courses</h3>
            <div className="space-y-2">
              {popularCourses.map((course) => (
                <button
                  key={course.title}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <BookOpen size={14} className="text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-white">{course.title}</p>
                      <p className="text-[11px] text-slate-500">{course.uni}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">{course.enrolled.toLocaleString()} enrolled</span>
                </button>
              ))}
            </div>
          </div>

          <ChatInterface
            placeholder="Ask about any college subject..."
            accentColor="#A855F7"
            welcomeMessage="100+ disciplines covered. What would you like to learn?"
            suggestions={[
              "Explain contract law basics",
              "Help with financial accounting",
              "Organic chemistry reactions",
              "Business management theories",
            ]}
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="text-white font-semibold mb-4">Your Courses</h3>
            <div className="space-y-3">
              {[
                { name: "Digital Signal Processing", progress: 72 },
                { name: "Control Systems", progress: 45 },
                { name: "VLSI Design", progress: 30 },
              ].map((c) => (
                <div key={c.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">{c.name}</span>
                    <span className="text-purple-400">{c.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${c.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="text-white font-semibold mb-4">University Partners</h3>
            <div className="space-y-2">
              {["Anna University", "Madras University", "Bharathiar University", "PSG CAS", "NLU Bangalore"].map(
                (uni) => (
                  <div key={uni} className="flex items-center gap-2 text-sm text-slate-300 py-1.5">
                    <GraduationCap size={14} className="text-purple-400" />
                    {uni}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
