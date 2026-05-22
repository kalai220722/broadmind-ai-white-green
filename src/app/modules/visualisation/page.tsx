"use client";

import ModuleLayout from "@/components/modules/ModuleLayout";
import { Layers, Box, PenTool, Maximize2, RotateCw } from "lucide-react";

const categories = [
  { name: "Physics", count: 45, examples: ["Force diagrams", "Wave patterns", "Circuit analysis"] },
  { name: "Mathematics", count: 38, examples: ["Graph plotting", "3D surfaces", "Geometry"] },
  { name: "Chemistry", count: 32, examples: ["Molecular structures", "Reactions", "Periodic trends"] },
  { name: "Biology", count: 28, examples: ["Cell structure", "DNA replication", "Anatomy"] },
  { name: "Computer Science", count: 52, examples: ["Algorithm animations", "Data structures", "Neural nets"] },
  { name: "Engineering", count: 40, examples: ["Circuit simulation", "Stress analysis", "Mechanisms"] },
];

const recentViz = [
  { title: "Binary Search Tree Traversal", type: "Animation", subject: "DSA" },
  { title: "RC Circuit Response", type: "Interactive", subject: "Electronics" },
  { title: "Fourier Series Decomposition", type: "Animation", subject: "Signals" },
  { title: "Stress-Strain Curve", type: "2D Diagram", subject: "Mechanics" },
];

export default function VisualisationPage() {
  return (
    <ModuleLayout moduleId="visualisation">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Visualisation canvas */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                {["2D", "3D", "Animated"].map((mode) => (
                  <button
                    key={mode}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${
                      mode === "2D"
                        ? "bg-amber-600 text-white"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1.5 text-slate-400 hover:text-white"><Maximize2 size={14} /></button>
                <button className="p-1.5 text-slate-400 hover:text-white"><RotateCw size={14} /></button>
              </div>
            </div>
            <div className="aspect-[16/9] flex items-center justify-center bg-slate-950/50">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                  <PenTool size={28} className="text-amber-400" />
                </div>
                <p className="text-white font-medium">Visualisation Canvas</p>
                <p className="text-sm text-slate-400 mt-1">Select a topic or type a concept to visualise</p>
              </div>
            </div>
          </div>

          {/* Request a visualisation */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="text-white font-semibold mb-3">Generate Visualisation</h3>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Describe what you want to visualise..."
                className="flex-1 bg-slate-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none border border-slate-700 focus:border-amber-500 placeholder-slate-500"
              />
              <button className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
                <PenTool size={14} />
                Generate
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Categories */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/50 transition-colors text-left"
                >
                  <div>
                    <p className="text-sm text-white">{cat.name}</p>
                    <p className="text-[11px] text-slate-500">{cat.examples.join(", ")}</p>
                  </div>
                  <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="text-white font-semibold mb-4">Recent</h3>
            <div className="space-y-2">
              {recentViz.map((v) => (
                <button
                  key={v.title}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    {v.type === "3D" ? <Box size={14} className="text-amber-400" /> : <Layers size={14} className="text-amber-400" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">{v.title}</p>
                    <p className="text-[11px] text-slate-500">{v.type} · {v.subject}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
