"use client";

import ModuleLayout from "@/components/modules/ModuleLayout";
import ChatInterface from "@/components/modules/ChatInterface";
import { Heart, Pill, Brain, Eye, Activity, AlertTriangle, BookOpen } from "lucide-react";

const anatomyModels = [
  { name: "Heart", icon: Heart, status: "Explored" },
  { name: "Brain", icon: Brain, status: "In Progress" },
  { name: "Eye", icon: Eye, status: "New" },
];

const drugBank = [
  { name: "Paracetamol", category: "Analgesic", interactions: 3 },
  { name: "Metformin", category: "Antidiabetic", interactions: 5 },
  { name: "Amoxicillin", category: "Antibiotic", interactions: 7 },
  { name: "Lisinopril", category: "ACE Inhibitor", interactions: 4 },
];

export default function MedicalPage() {
  return (
    <ModuleLayout moduleId="medical">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Disclaimer */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <AlertTriangle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-300 font-medium">Clinical Decision Support Disclaimer</p>
              <p className="text-xs text-amber-300/70 mt-0.5">
                This tool is for educational purposes only. Always consult qualified medical professionals for clinical decisions.
              </p>
            </div>
          </div>

          {/* 3D Anatomy viewer placeholder */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
              <h3 className="text-white font-semibold text-sm">3D Anatomy Viewer</h3>
              <div className="flex gap-2">
                {anatomyModels.map((model) => (
                  <button
                    key={model.name}
                    className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-md transition-colors ${
                      model.name === "Heart"
                        ? "bg-pink-600 text-white"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <model.icon size={12} />
                    {model.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="aspect-[16/9] flex items-center justify-center bg-slate-950/50">
              <div className="text-center">
                <Heart size={48} className="text-pink-400 mx-auto mb-3 animate-pulse" />
                <p className="text-white font-medium">3D Heart Model</p>
                <p className="text-sm text-slate-400 mt-1">Interactive anatomy with labeled structures</p>
              </div>
            </div>
          </div>

          <ChatInterface
            placeholder="Ask about anatomy, pharmacology, or clinical cases..."
            accentColor="#EC4899"
            welcomeMessage="Ask me about anatomy, pharmacology, or clinical scenarios"
            suggestions={[
              "Explain cardiac cycle",
              "Drug interactions for Metformin",
              "Differential diagnosis for chest pain",
              "CME: Latest in cardiology",
            ]}
          />
        </div>

        <div className="space-y-6">
          {/* Drug reference */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="text-white font-semibold mb-4">Drug Reference</h3>
            <div className="space-y-2">
              {drugBank.map((drug) => (
                <button
                  key={drug.name}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <Pill size={14} className="text-pink-400" />
                    <div>
                      <p className="text-sm text-white">{drug.name}</p>
                      <p className="text-[11px] text-slate-500">{drug.category}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-amber-400">{drug.interactions} interactions</span>
                </button>
              ))}
            </div>
          </div>

          {/* CME tracker */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="text-white font-semibold mb-3">CME Credits</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Progress</span>
              <span className="text-sm text-pink-400 font-semibold">18/30</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-pink-500 rounded-full" style={{ width: "60%" }} />
            </div>
            <p className="text-xs text-slate-500">12 credits remaining for this cycle</p>
          </div>

          {/* Quick access */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="text-white font-semibold mb-3">Quick Access</h3>
            <div className="space-y-2">
              {[
                { name: "Clinical Cases", icon: Activity },
                { name: "Pharmacology DB", icon: Pill },
                { name: "Anatomy Atlas", icon: Heart },
                { name: "Medical MCQs", icon: BookOpen },
              ].map((item) => (
                <button
                  key={item.name}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-slate-300 rounded-lg border border-slate-700 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <item.icon size={14} />
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
