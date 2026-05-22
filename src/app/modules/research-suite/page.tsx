"use client";

import ModuleLayout from "@/components/modules/ModuleLayout";
import { FileText, Search, BookOpen, Quote, PenTool, Upload } from "lucide-react";

const papers = [
  { title: "ML-based Circuit Optimisation for VLSI", authors: "Chen et al.", year: 2025, status: "Summarised" },
  { title: "Adaptive Learning in Neural Networks", authors: "Patel, Sharma", year: 2026, status: "Reading" },
  { title: "Efficient Transformer Architectures", authors: "Wang et al.", year: 2025, status: "Cited" },
  { title: "Signal Processing with Deep Learning", authors: "Kumar, Lee", year: 2024, status: "Summarised" },
];

const tools = [
  { name: "Paper Summariser", desc: "Upload any paper for an instant summary", icon: FileText, color: "#6366F1" },
  { name: "Literature Review", desc: "Auto-generate lit reviews from papers", icon: BookOpen, color: "#8B5CF6" },
  { name: "Citation Manager", desc: "Manage references in APA/IEEE/MLA", icon: Quote, color: "#A855F7" },
  { name: "AI Writing Co-pilot", desc: "Get help writing papers and thesis", icon: PenTool, color: "#C084FC" },
];

export default function ResearchSuitePage() {
  return (
    <ModuleLayout moduleId="research-suite">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Paper upload */}
          <div className="rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/30 p-8 text-center hover:border-indigo-500/50 transition-colors cursor-pointer">
            <Upload size={32} className="text-indigo-400 mx-auto mb-3" />
            <p className="text-white font-medium mb-1">Upload Research Paper</p>
            <p className="text-sm text-slate-400">PDF, DOI link, or paste text for instant analysis</p>
          </div>

          {/* Tools grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tools.map((tool) => (
              <button
                key={tool.name}
                className="flex items-start gap-3 p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-slate-700 transition-all text-left"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${tool.color}15` }}
                >
                  <tool.icon size={20} style={{ color: tool.color }} />
                </div>
                <div>
                  <p className="text-sm text-white font-medium">{tool.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{tool.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Paper library */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Paper Library</h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search papers..."
                    className="bg-slate-800 text-sm text-white rounded-lg pl-8 pr-3 py-1.5 outline-none border border-slate-700 focus:border-indigo-500 placeholder-slate-500 w-40"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {papers.map((paper) => (
                <div
                  key={paper.title}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <FileText size={16} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-white">{paper.title}</p>
                      <p className="text-xs text-slate-500">{paper.authors} · {paper.year}</p>
                    </div>
                  </div>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                    paper.status === "Summarised"
                      ? "text-emerald-400 bg-emerald-400/10"
                      : paper.status === "Reading"
                        ? "text-amber-400 bg-amber-400/10"
                        : "text-indigo-400 bg-indigo-400/10"
                  }`}>
                    {paper.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="text-white font-semibold mb-4">Research Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-indigo-400">24</p>
                <p className="text-[11px] text-slate-400">Papers Read</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-violet-400">156</p>
                <p className="text-[11px] text-slate-400">Citations</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-purple-400">3</p>
                <p className="text-[11px] text-slate-400">Lit Reviews</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-fuchsia-400">12k</p>
                <p className="text-[11px] text-slate-400">Words Written</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="text-white font-semibold mb-3">Citation Format</h3>
            <div className="space-y-1.5">
              {["APA 7th", "IEEE", "MLA", "Chicago", "Harvard"].map((fmt) => (
                <button
                  key={fmt}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                    fmt === "IEEE"
                      ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
