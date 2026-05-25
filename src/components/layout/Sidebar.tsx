"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Globe,
  Flame,
  X,
} from "lucide-react";
import Logo from "@/components/Logo";
import { MODULES } from "@/lib/constants";
import { useProfile } from "@/lib/personalization";
import { clsx } from "clsx";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobile?: boolean;
  onNavigate?: () => void;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ collapsed, onToggle, mobile, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const profile = useProfile();

  return (
    <div className="h-full w-full bg-slate-950/95 backdrop-blur-xl border-r border-slate-800/50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800/50 flex-shrink-0">
        <Link href="/dashboard" onClick={onNavigate}>
          <Logo size={36} showText={!collapsed} />
        </Link>
        <button
          onClick={onToggle}
          aria-label={mobile ? "Close menu" : collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={clsx(
            "p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors",
            collapsed && !mobile && "mx-auto mt-2"
          )}
        >
          {mobile ? (
            <X size={18} />
          ) : collapsed ? (
            <ChevronRight size={16} />
          ) : (
            <ChevronLeft size={16} />
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1 scrollbar-thin">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-violet-600/20 text-violet-300 border border-violet-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              )}
            >
              <item.icon size={20} className="flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}

        <div className={clsx("pt-4 pb-2", collapsed ? "px-2" : "px-3")}>
          {!collapsed && (
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Modules
            </p>
          )}
          {collapsed && <div className="border-t border-slate-800" />}
        </div>

        {MODULES.map((mod) => {
          const isActive = pathname === mod.href;
          return (
            <Link
              key={mod.id}
              href={mod.href}
              onClick={onNavigate}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                isActive
                  ? "bg-violet-600/20 text-violet-300 border border-violet-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              )}
              title={collapsed ? mod.name : undefined}
            >
              <div
                className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${mod.color}20` }}
              >
                <mod.icon size={16} style={{ color: mod.color }} />
              </div>
              {!collapsed && <span className="truncate">{mod.shortName}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer profile */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-800/50 flex-shrink-0">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-violet-600/10 to-cyan-600/10 border border-violet-500/20">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{profile.name}</p>
              <div className="flex items-center gap-1 text-xs text-amber-400">
                <Flame size={12} />
                <span>{profile.streakDays} day streak</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400 flex-shrink-0">
              <Globe size={12} />
              <span className="hidden sm:inline">{profile.language}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
