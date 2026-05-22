"use client";

import ModuleLayout from "@/components/modules/ModuleLayout";
import ChatInterface from "@/components/modules/ChatInterface";
import { Cpu, Zap, Cog, Calculator, CircuitBoard, Wrench } from "lucide-react";

const branches = [
  { name: "ECE", topics: 42, icon: CircuitBoard, color: "#14B8A6" },
  { name: "CSE", topics: 38, icon: Cpu, color: "#06B6D4" },
  { name: "EEE", topics: 35, icon: Zap, color: "#F59E0B" },
  { name: "Mechanical", topics: 30, icon: Cog, color: "#EF4444" },
  { name: "Civil", topics: 28, icon: Wrench, color: "#8B5CF6" },
];

const gateSubjects = [
  { name: "Digital Electronics", score: 82, total: 120 },
  { name: "Signals & Systems", score: 58, total: 100 },
  { name: "Control Systems", score: 45, total: 80 },
  { name: "Network Theory", score: 65, total: 90 },
  { name: "Microprocessors", score: 78, total: 60 },
];

export default function EngineeringPage() {
  return (
    <ModuleLayout moduleId="engineering">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Branch selector */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {branches.map((branch) => (
              <button
                key={branch.name}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                  branch.name === "ECE"
                    ? "border-teal-500/30 bg-teal-500/10"
                    : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                }`}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${branch.color}15` }}
                >
                  <branch.icon size={20} style={{ color: branch.color }} />
                </div>
                <span className="text-sm text-white font-medium">{branch.name}</span>
                <span className="text-[11px] text-slate-400">{branch.topics} topics</span>
              </button>
            ))}
          </div>

          {/* Circuit simulator placeholder */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
              <h3 className="text-white font-semibold text-sm">Circuit Simulator</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs bg-teal-600 text-white rounded-md">Simulate</button>
                <button className="px-3 py-1 text-xs text-slate-400 hover:text-white border border-slate-700 rounded-md">Reset</button>
              </div>
            </div>
            <div className="aspect-[16/9] flex items-center justify-center bg-slate-950/50">
              <div className="text-center">
                <CircuitBoard size={48} className="text-teal-400 mx-auto mb-3" />
                <p className="text-white font-medium">Interactive Circuit Builder</p>
                <p className="text-sm text-slate-400 mt-1">Drag components to build and simulate circuits</p>
              </div>
            </div>
          </div>

          <ChatInterface
            placeholder="Ask about engineering concepts..."
            accentColor="#14B8A6"
            welcomeMessage="Ask me about any engineering concept, GATE prep, or circuits"
            suggestions={[
              "Explain Thevenin's theorem",
              "GATE prep for Digital Electronics",
              "How does a BJT work?",
              "Algorithm for Dijkstra's",
            ]}
          />
        </div>

        <div className="space-y-6">
          {/* GATE progress */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="text-white font-semibold mb-4">GATE Prep Progress</h3>
            <div className="space-y-3">
              {gateSubjects.map((sub) => (
                <div key={sub.name}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-300">{sub.name}</span>
                    <span className={`font-semibold ${
                      sub.score >= 75 ? "text-emerald-400" : sub.score >= 55 ? "text-amber-400" : "text-red-400"
                    }`}>
                      {sub.score}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        sub.score >= 75 ? "bg-emerald-500" : sub.score >= 55 ? "bg-amber-500" : "bg-red-500"
                      }`}
                      style={{ width: `${sub.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="text-white font-semibold mb-3">Tools</h3>
            <div className="space-y-2">
              {["Circuit Simulator", "Algorithm Visualiser", "GATE Calculator", "Formula Sheet", "FYP Helper"].map(
                (tool) => (
                  <button
                    key={tool}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-slate-300 rounded-lg border border-slate-700 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <Calculator size={14} />
                    {tool}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
