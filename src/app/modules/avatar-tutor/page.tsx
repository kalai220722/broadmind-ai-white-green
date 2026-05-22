"use client";

import ModuleLayout from "@/components/modules/ModuleLayout";
import ChatInterface from "@/components/modules/ChatInterface";
import { Play, Globe, Brain, Video, Volume2 } from "lucide-react";

const recentLessons = [
  { title: "Fourier Transform", subject: "Signals", lang: "Tamil", duration: "12 min" },
  { title: "Newton's Laws", subject: "Physics", lang: "Tamil", duration: "8 min" },
  { title: "Binary Search", subject: "DSA", lang: "English", duration: "15 min" },
  { title: "Ohm's Law", subject: "Electronics", lang: "Tamil", duration: "6 min" },
];

export default function AvatarTutorPage() {
  return (
    <ModuleLayout moduleId="avatar-tutor">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar video area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video player placeholder */}
          <div className="relative rounded-xl border border-slate-800 bg-slate-900 overflow-hidden aspect-video flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-violet-600/20 flex items-center justify-center mx-auto mb-4">
                <Play size={32} className="text-violet-400 ml-1" />
              </div>
              <p className="text-white font-medium mb-1">Avatar Tutor Ready</p>
              <p className="text-sm text-slate-400">Ask a question to start a lesson</p>
            </div>
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 text-xs text-slate-300">
                <Globe size={12} />
                Tamil
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 text-xs text-slate-300">
                <Volume2 size={12} />
                Voice On
              </div>
            </div>
          </div>

          <ChatInterface
            placeholder="Ask your avatar tutor anything in Tamil or English..."
            showMic={true}
            accentColor="#8B5CF6"
            welcomeMessage="I'm your AI tutor. Ask me anything in your language!"
            suggestions={[
              "Force nu enna?",
              "Explain recursion with an analogy",
              "What is Ohm's law?",
              "Kirchhoff's law in Tamil",
            ]}
          />
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Learning stats */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="text-white font-semibold mb-4">Session Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Video, label: "Videos Watched", value: "127", color: "text-violet-400" },
                { icon: Brain, label: "Concepts Learned", value: "84", color: "text-cyan-400" },
                { icon: Globe, label: "Languages Used", value: "2", color: "text-emerald-400" },
                { icon: Volume2, label: "Voice Sessions", value: "43", color: "text-amber-400" },
              ].map((stat) => (
                <div key={stat.label} className="bg-slate-800/50 rounded-lg p-3">
                  <stat.icon size={16} className={stat.color} />
                  <p className="text-lg font-bold text-white mt-1">{stat.value}</p>
                  <p className="text-[11px] text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent lessons */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="text-white font-semibold mb-4">Recent Lessons</h3>
            <div className="space-y-2">
              {recentLessons.map((lesson) => (
                <button
                  key={lesson.title}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-violet-600/10 flex items-center justify-center flex-shrink-0">
                    <Play size={12} className="text-violet-400 ml-0.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{lesson.title}</p>
                    <p className="text-xs text-slate-500">
                      {lesson.subject} · {lesson.lang} · {lesson.duration}
                    </p>
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
