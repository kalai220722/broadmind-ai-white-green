"use client";

import ModuleLayout from "@/components/modules/ModuleLayout";
import { BookOpen, Clock, TrendingUp, AlertTriangle, CheckCircle, Target } from "lucide-react";

const exams = [
  { name: "GATE ECE", progress: 45, total: 120, weak: ["Signals", "Control Systems"] },
  { name: "GATE CS", progress: 30, total: 100, weak: ["OS", "Compiler Design"] },
];

const weakAreas = [
  { topic: "Signals & Systems", accuracy: 58, trend: "improving" },
  { topic: "Control Systems", accuracy: 45, trend: "declining" },
  { topic: "Digital Electronics", accuracy: 72, trend: "stable" },
  { topic: "Network Theory", accuracy: 65, trend: "improving" },
];

const mockTests = [
  { name: "GATE ECE Mock #7", questions: 65, time: "180 min", score: null },
  { name: "GATE ECE Mock #6", questions: 65, time: "180 min", score: 78 },
  { name: "GATE ECE Mock #5", questions: 65, time: "180 min", score: 72 },
  { name: "GATE CS Mock #3", questions: 65, time: "180 min", score: 68 },
];

export default function ExamAssistantPage() {
  return (
    <ModuleLayout moduleId="exam-assistant">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Exam progress cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {exams.map((exam) => (
              <div key={exam.name} className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold">{exam.name}</h3>
                  <span className="text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">
                    {Math.round((exam.progress / exam.total) * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{ width: `${(exam.progress / exam.total) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mb-2">{exam.progress}/{exam.total} questions completed</p>
                <div className="flex items-center gap-1">
                  <AlertTriangle size={12} className="text-amber-400" />
                  <span className="text-xs text-amber-400">Weak: {exam.weak.join(", ")}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Weak area analysis */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Weak Area Analysis</h3>
              <button className="text-xs text-red-400 hover:text-red-300">Practice weak areas</button>
            </div>
            <div className="space-y-3">
              {weakAreas.map((area) => (
                <div key={area.topic} className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/30">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white">{area.topic}</span>
                      <span className={`text-sm font-semibold ${
                        area.accuracy >= 70 ? "text-emerald-400" : area.accuracy >= 55 ? "text-amber-400" : "text-red-400"
                      }`}>
                        {area.accuracy}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          area.accuracy >= 70 ? "bg-emerald-500" : area.accuracy >= 55 ? "bg-amber-500" : "bg-red-500"
                        }`}
                        style={{ width: `${area.accuracy}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp
                      size={12}
                      className={
                        area.trend === "improving"
                          ? "text-emerald-400"
                          : area.trend === "declining"
                            ? "text-red-400 rotate-180"
                            : "text-slate-400"
                      }
                    />
                    <span className="text-[11px] text-slate-400 capitalize">{area.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Study plan */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="text-white font-semibold mb-4">Today&apos;s Study Plan</h3>
            <div className="space-y-2">
              {[
                { time: "9:00 AM", task: "Control Systems - Bode Plot Practice", done: true },
                { time: "11:00 AM", task: "Signals - Z-Transform Problems", done: true },
                { time: "2:00 PM", task: "Network Theory - Thevenin Numericals", done: false },
                { time: "4:00 PM", task: "Mock Test - GATE ECE #7", done: false },
              ].map((item) => (
                <div key={item.task} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.done ? "bg-emerald-600" : "border border-slate-600"
                  }`}>
                    {item.done && <CheckCircle size={14} className="text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${item.done ? "text-slate-500 line-through" : "text-white"}`}>
                      {item.task}
                    </p>
                  </div>
                  <span className="text-xs text-slate-500">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="text-white font-semibold mb-4">Mock Tests</h3>
            <div className="space-y-2">
              {mockTests.map((test) => (
                <button
                  key={test.name}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/50 transition-colors text-left"
                >
                  <div>
                    <p className="text-sm text-white">{test.name}</p>
                    <p className="text-[11px] text-slate-500">{test.questions} Qs · {test.time}</p>
                  </div>
                  {test.score !== null ? (
                    <span className={`text-sm font-semibold ${test.score >= 75 ? "text-emerald-400" : "text-amber-400"}`}>
                      {test.score}%
                    </span>
                  ) : (
                    <span className="text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">Start</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="text-white font-semibold mb-3">Quick Practice</h3>
            <div className="space-y-2">
              {["PYQ Random", "Weak Areas Only", "Full Mock", "Speed Round"].map((mode) => (
                <button
                  key={mode}
                  className="w-full px-3 py-2.5 text-sm text-slate-300 rounded-lg border border-slate-700 hover:bg-slate-800 hover:text-white transition-colors text-left"
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
