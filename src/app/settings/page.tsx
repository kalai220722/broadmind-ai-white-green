"use client";

import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { LANGUAGES } from "@/lib/constants";
import {
  Globe, Bell, Moon, Shield, Volume2, Eye,
  Smartphone, ChevronRight, ToggleLeft, ToggleRight,
} from "lucide-react";

interface ToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

function Toggle({ enabled, onToggle }: ToggleProps) {
  return (
    <button onClick={onToggle} className="flex-shrink-0">
      {enabled ? (
        <ToggleRight size={28} className="text-violet-400" />
      ) : (
        <ToggleLeft size={28} className="text-slate-600" />
      )}
    </button>
  );
}

export default function SettingsPage() {
  const [language, setLanguage] = useState("Tamil");
  const [notifications, setNotifications] = useState(true);
  const [voice, setVoice] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [privacy, setPrivacy] = useState(true);

  return (
    <AppLayout title="Settings">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Language */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-violet-400/10 flex items-center justify-center">
              <Globe size={20} className="text-violet-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Language & Region</h3>
              <p className="text-xs text-slate-400">Choose your preferred language for learning</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {LANGUAGES.slice(0, 8).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  language === lang
                    ? "bg-violet-600 text-white"
                    : "border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
          <button className="mt-3 text-xs text-violet-400 hover:text-violet-300">
            Show all {LANGUAGES.length} languages
          </button>
        </div>

        {/* Toggles */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 divide-y divide-slate-800">
          {[
            {
              icon: Bell, color: "text-amber-400", bg: "bg-amber-400/10",
              title: "Notifications", desc: "Study reminders, streak alerts, and progress updates",
              enabled: notifications, toggle: () => setNotifications(!notifications),
            },
            {
              icon: Volume2, color: "text-cyan-400", bg: "bg-cyan-400/10",
              title: "Voice Responses", desc: "Enable text-to-speech for AI responses",
              enabled: voice, toggle: () => setVoice(!voice),
            },
            {
              icon: Moon, color: "text-indigo-400", bg: "bg-indigo-400/10",
              title: "Dark Mode", desc: "Always use dark theme",
              enabled: darkMode, toggle: () => setDarkMode(!darkMode),
            },
            {
              icon: Eye, color: "text-emerald-400", bg: "bg-emerald-400/10",
              title: "Auto-play Videos", desc: "Automatically play avatar tutor videos",
              enabled: autoPlay, toggle: () => setAutoPlay(!autoPlay),
            },
            {
              icon: Shield, color: "text-rose-400", bg: "bg-rose-400/10",
              title: "Privacy Mode", desc: "On-device processing with MediaPipe (no video upload)",
              enabled: privacy, toggle: () => setPrivacy(!privacy),
            },
          ].map((item) => (
            <div key={item.title} className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center`}>
                  <item.icon size={20} className={item.color} />
                </div>
                <div>
                  <p className="text-sm text-white font-medium">{item.title}</p>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
              </div>
              <Toggle enabled={item.enabled} onToggle={item.toggle} />
            </div>
          ))}
        </div>

        {/* Connected devices */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-cyan-400/10 flex items-center justify-center">
              <Smartphone size={20} className="text-cyan-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Connected Platforms</h3>
              <p className="text-xs text-slate-400">Manage your connected learning channels</p>
            </div>
          </div>
          <div className="space-y-2">
            {[
              { name: "WhatsApp", status: "Connected", number: "+91 98765 43210" },
              { name: "Telegram", status: "Connected", number: "@priya_learns" },
              { name: "SMS", status: "Not connected", number: null },
            ].map((platform) => (
              <div
                key={platform.name}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30"
              >
                <div>
                  <p className="text-sm text-white">{platform.name}</p>
                  <p className="text-xs text-slate-500">
                    {platform.number || "Click to connect"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${
                    platform.status === "Connected" ? "text-emerald-400" : "text-slate-500"
                  }`}>
                    {platform.status}
                  </span>
                  <ChevronRight size={14} className="text-slate-600" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
