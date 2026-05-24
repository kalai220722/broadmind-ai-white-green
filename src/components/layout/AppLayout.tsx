"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { clsx } from "clsx";
import GradientOrbs from "@/components/ui/GradientOrbs";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function AppLayout({ children, title }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Auto-close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close mobile sidebar on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 relative">
      <GradientOrbs />

      {/* Desktop sidebar — always fixed, width animates */}
      <aside
        className={clsx(
          "hidden lg:flex fixed inset-y-0 left-0 z-40 transition-[width] duration-300",
          sidebarCollapsed ? "w-[72px]" : "w-[260px]"
        )}
      >
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((c) => !c)}
        />
      </aside>

      {/* Mobile backdrop */}
      <div
        className={clsx(
          "lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile sidebar — slides from left */}
      <aside
        className={clsx(
          "lg:hidden fixed inset-y-0 left-0 z-50 w-[280px] transition-transform duration-300 ease-out shadow-2xl shadow-violet-900/30",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-hidden={!mobileOpen}
      >
        <Sidebar
          collapsed={false}
          mobile
          onToggle={() => setMobileOpen(false)}
          onNavigate={() => setMobileOpen(false)}
        />
      </aside>

      {/* Main content */}
      <div
        className={clsx(
          "transition-[margin] duration-300 min-h-screen",
          sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"
        )}
      >
        <Header onMenuClick={() => setMobileOpen(true)} title={title} />
        <main className="p-4 lg:p-6 relative z-10">{children}</main>
      </div>
    </div>
  );
}
