"use client";

import { useState } from "react";
import {
  Search,
  Bell,
  Globe,
  Menu,
  Flame,
  X,
} from "lucide-react";
import { mockStudent } from "@/lib/mock-data";
import { LANGUAGES } from "@/lib/constants";

interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
}

export default function Header({ onMenuClick, title }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <Menu size={20} />
          </button>
          {title && (
            <h1 className="text-lg font-semibold text-white">{title}</h1>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            {searchOpen ? (
              <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-2">
                <Search size={16} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search modules, topics..."
                  className="bg-transparent text-sm text-white placeholder-slate-400 outline-none w-48 lg:w-64"
                  autoFocus
                />
                <button onClick={() => setSearchOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <Search size={20} />
              </button>
            )}
          </div>

          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => { setLangOpen(!langOpen); setNotifOpen(false); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm"
            >
              <Globe size={16} />
              <span className="hidden sm:inline">{mockStudent.language}</span>
            </button>
            {langOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 py-2 max-h-64 overflow-y-auto">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                      onClick={() => setLangOpen(false)}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setNotifOpen(!notifOpen); setLangOpen(false); }}
              className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-violet-500 rounded-full" />
            </button>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 p-4">
                  <h3 className="text-sm font-semibold text-white mb-3">Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3 p-2 rounded-lg hover:bg-slate-800">
                      <div className="w-8 h-8 rounded-full bg-violet-600/20 flex items-center justify-center flex-shrink-0">
                        <Flame size={14} className="text-violet-400" />
                      </div>
                      <div>
                        <p className="text-sm text-white">42 day streak! Keep going!</p>
                        <p className="text-xs text-slate-400">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex gap-3 p-2 rounded-lg hover:bg-slate-800">
                      <div className="w-8 h-8 rounded-full bg-cyan-600/20 flex items-center justify-center flex-shrink-0">
                        <Bell size={14} className="text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-sm text-white">New GATE mock test available</p>
                        <p className="text-xs text-slate-400">5 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm cursor-pointer">
            {mockStudent.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}
