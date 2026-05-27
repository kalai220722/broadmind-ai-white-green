"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, X, RotateCcw, Sparkles } from "lucide-react";
import AnimatedRobot from "./AnimatedRobot";
import { findIntro, scriptForLanguage } from "@/lib/module-intros";
import {
  speak,
  stopAllVoice,
  getStoredVoiceLanguage,
  isVoiceMuted,
  setVoiceMuted,
  type VoiceController,
} from "@/lib/voice";

const SEEN_KEY = "bm-narrator-seen"; // set of pathnames the user has heard

function loadSeen(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveSeen(set: Set<string>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SEEN_KEY, JSON.stringify(Array.from(set)));
}

/**
 * Travels with the user. Every time they land on a new module page (one they
 * haven't heard before), a small mascot slides in with a professional voice intro.
 * After the intro it auto-collapses. User can mute, replay, or close.
 */
export default function ModuleNarrator() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [robotState, setRobotState] = useState<"idle" | "talking">("idle");
  const [muted, setMuted] = useState(false);
  const [currentIntro, setCurrentIntro] = useState<ReturnType<typeof findIntro>>(null);
  const ctlRef = useRef<VoiceController | null>(null);
  const lastPathRef = useRef<string | null>(null);

  // Init muted state from storage
  useEffect(() => {
    setMuted(isVoiceMuted());
  }, []);

  // On path change, decide whether to narrate
  useEffect(() => {
    // Skip landing and login (RobotHero handles those)
    if (pathname === "/" || pathname === "/login") {
      setOpen(false);
      return;
    }
    if (pathname === lastPathRef.current) return;
    lastPathRef.current = pathname;

    const intro = findIntro(pathname);
    if (!intro) {
      setOpen(false);
      return;
    }

    setCurrentIntro(intro);
    setOpen(true);

    const seen = loadSeen();
    const alreadyHeard = seen.has(intro.path);

    if (muted || alreadyHeard) {
      // Show the panel briefly, no audio
      setRobotState("idle");
      const t = setTimeout(() => setOpen(false), alreadyHeard ? 4500 : 8000);
      return () => clearTimeout(t);
    }

    // Speak the intro
    const lang = getStoredVoiceLanguage();
    const text = scriptForLanguage(intro, lang);
    setRobotState("talking");
    ctlRef.current?.stop();
    const ctl = speak(text, { language: lang, style: "intro", speaker: "female" });
    ctlRef.current = ctl;
    ctl.promise.then(() => {
      setRobotState("idle");
      seen.add(intro.path);
      saveSeen(seen);
      // Auto-collapse 2s after intro ends
      setTimeout(() => setOpen(false), 2400);
    });

    return () => {
      ctl.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Stop voice if user navigates fast or unmounts
  useEffect(() => {
    return () => {
      ctlRef.current?.stop();
    };
  }, []);

  const replay = () => {
    if (!currentIntro) return;
    setMuted(false);
    setVoiceMuted(false);
    const lang = getStoredVoiceLanguage();
    const text = scriptForLanguage(currentIntro, lang);
    setRobotState("talking");
    ctlRef.current?.stop();
    const ctl = speak(text, { language: lang, style: "intro", speaker: "female" });
    ctlRef.current = ctl;
    ctl.promise.then(() => setRobotState("idle"));
  };

  const toggleMute = () => {
    if (!muted) {
      ctlRef.current?.stop();
      stopAllVoice();
      setRobotState("idle");
    }
    const next = !muted;
    setMuted(next);
    setVoiceMuted(next);
  };

  const close = () => {
    ctlRef.current?.stop();
    setOpen(false);
    setRobotState("idle");
  };

  if (!currentIntro) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
          className="fixed bottom-24 right-4 z-30 max-w-[320px]"
        >
          <div className="flex items-end gap-2.5">
            {/* Mascot */}
            <motion.div
              animate={{ y: robotState === "talking" ? [0, -2, 0] : 0 }}
              transition={{ duration: 1.2, repeat: robotState === "talking" ? Infinity : 0 }}
              className="flex-shrink-0"
            >
              <AnimatedRobot size={64} state={robotState} />
            </motion.div>

            {/* Speech bubble */}
            <div className="relative">
              {/* Pointer */}
              <div className="absolute -left-2 bottom-3 w-3 h-3 rotate-45 bg-slate-900/95 border-l border-b border-violet-500/30" />
              <div className="rounded-2xl border border-violet-500/30 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-violet-500/20 p-3 pr-8 min-w-[220px] relative">
                <button
                  onClick={close}
                  className="absolute top-1.5 right-1.5 p-1 text-slate-400 hover:text-white rounded hover:bg-white/5"
                  aria-label="Close"
                >
                  <X size={12} />
                </button>

                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles size={10} className="text-violet-300" />
                  <span className="text-[10px] uppercase tracking-widest text-violet-300 font-semibold">
                    {currentIntro.title}
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed line-clamp-3">
                  {scriptForLanguage(currentIntro, getStoredVoiceLanguage())}
                </p>

                <div className="flex items-center gap-1 mt-2 pt-2 border-t border-white/5">
                  <button
                    onClick={toggleMute}
                    className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded transition ${
                      muted ? "text-slate-500 hover:text-white" : "text-violet-300 hover:bg-white/5"
                    }`}
                  >
                    {muted ? <VolumeX size={10} /> : <Volume2 size={10} />}
                    {muted ? "Muted" : "Voice on"}
                  </button>
                  <button
                    onClick={replay}
                    className="flex items-center gap-1 text-[10px] px-2 py-1 rounded text-slate-400 hover:text-white hover:bg-white/5 transition"
                  >
                    <RotateCcw size={10} /> Replay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
