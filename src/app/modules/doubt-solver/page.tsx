"use client";

import ModuleLayout from "@/components/modules/ModuleLayout";
import ChatInterface from "@/components/modules/ChatInterface";
import { Camera, Upload, Image, Clock, CheckCircle } from "lucide-react";

const recentDoubts = [
  { q: "Kirchhoff's Current Law derivation", subject: "Electronics", time: "2h ago", solved: true },
  { q: "Thevenin's theorem step-by-step", subject: "Circuits", time: "1d ago", solved: true },
  { q: "Integration by parts formula", subject: "Maths", time: "2d ago", solved: true },
  { q: "Normalization in DBMS", subject: "CS", time: "3d ago", solved: true },
];

export default function DoubtSolverPage() {
  return (
    <ModuleLayout moduleId="doubt-solver">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Photo upload area */}
          <div className="rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/30 p-8 text-center hover:border-emerald-500/50 transition-colors cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-emerald-600/10 flex items-center justify-center mx-auto mb-4">
              <Camera size={28} className="text-emerald-400" />
            </div>
            <p className="text-white font-medium mb-1">Snap or Upload a Problem</p>
            <p className="text-sm text-slate-400 mb-4">
              Take a photo of any question — handwritten or printed — and get an instant solution
            </p>
            <div className="flex items-center justify-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded-lg transition-colors">
                <Camera size={16} />
                Take Photo
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm rounded-lg transition-colors">
                <Upload size={16} />
                Upload Image
              </button>
            </div>
          </div>

          <ChatInterface
            placeholder="Type your doubt here or upload a photo..."
            showCamera={true}
            showMic={true}
            accentColor="#10B981"
            welcomeMessage="Snap a photo or type your question for instant help!"
            suggestions={[
              "Solve this integral",
              "Explain this circuit",
              "What is this formula?",
              "Step-by-step solution",
            ]}
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="text-white font-semibold mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-emerald-400">156</p>
                <p className="text-[11px] text-slate-400">Doubts Solved</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-cyan-400">92%</p>
                <p className="text-[11px] text-slate-400">Accuracy</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-violet-400">&lt;1s</p>
                <p className="text-[11px] text-slate-400">Avg Response</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-amber-400">5</p>
                <p className="text-[11px] text-slate-400">Subjects</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="text-white font-semibold mb-4">Recent Doubts</h3>
            <div className="space-y-2">
              {recentDoubts.map((d) => (
                <div
                  key={d.q}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <CheckCircle size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{d.q}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span>{d.subject}</span>
                      <span>·</span>
                      <Clock size={10} />
                      <span>{d.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
