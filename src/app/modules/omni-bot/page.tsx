"use client";

import ModuleLayout from "@/components/modules/ModuleLayout";
import ChatInterface from "@/components/modules/ChatInterface";
import { MessageSquare, Phone, Smartphone, Send } from "lucide-react";

const channels = [
  { name: "WhatsApp", icon: MessageSquare, status: "Connected", color: "#25D366", messages: 342 },
  { name: "Voice Bot", icon: Phone, status: "Ready", color: "#06B6D4", messages: 28 },
  { name: "SMS", icon: Smartphone, status: "Active", color: "#F59E0B", messages: 15 },
  { name: "Telegram", icon: Send, status: "Connected", color: "#0088CC", messages: 89 },
];

export default function OmniBotPage() {
  return (
    <ModuleLayout moduleId="omni-bot">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChatInterface
            placeholder="Chat with Omni-Bot..."
            showMic={true}
            accentColor="#22C55E"
            welcomeMessage="I'm available on WhatsApp, Voice, SMS & Telegram. How can I help?"
            suggestions={[
              "Send me today's flashcards",
              "Quick quiz on Signals",
              "Set study reminder",
              "Practice speaking English",
            ]}
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="text-white font-semibold mb-4">Connected Channels</h3>
            <div className="space-y-3">
              {channels.map((ch) => (
                <div
                  key={ch.name}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${ch.color}15` }}
                  >
                    <ch.icon size={20} style={{ color: ch.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">{ch.name}</p>
                    <p className="text-xs text-slate-500">{ch.messages} messages</p>
                  </div>
                  <span
                    className="text-[11px] px-2 py-0.5 rounded-full"
                    style={{ color: ch.color, backgroundColor: `${ch.color}15` }}
                  >
                    {ch.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="text-white font-semibold mb-4">Bot Features</h3>
            <div className="space-y-2">
              {[
                "Daily Flashcards",
                "Voice Quizzes",
                "Study Reminders",
                "Doubt Resolution",
                "Progress Reports",
                "Parent Updates",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-slate-300 py-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
