"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Check, ArrowRight, X } from "lucide-react";
import AnimatedRobot from "./AnimatedRobot";
import GlassCard from "./GlassCard";
import ShimmerButton from "./ShimmerButton";
import { speak, setStoredVoiceLanguage } from "@/lib/voice";

const VOICE_LANGS = [
  { id: "English", label: "English", native: "Hello, I'm BroadMind", flag: "🇬🇧" },
  { id: "Hindi", label: "Hindi", native: "नमस्ते, मैं ब्रॉडमाइंड हूँ", flag: "🇮🇳" },
  { id: "Tamil", label: "Tamil", native: "வணக்கம், நான் ப்ராட்மைண்ட்", flag: "🇮🇳" },
  { id: "Telugu", label: "Telugu", native: "నమస్తే, నేను బ్రాడ్‌మైండ్", flag: "🇮🇳" },
  { id: "Malayalam", label: "Malayalam", native: "നമസ്കാരം", flag: "🇮🇳" },
  { id: "Kannada", label: "Kannada", native: "ನಮಸ್ಕಾರ", flag: "🇮🇳" },
  { id: "Marathi", label: "Marathi", native: "नमस्कार", flag: "🇮🇳" },
  { id: "Bengali", label: "Bengali", native: "নমস্কার", flag: "🇮🇳" },
  { id: "Gujarati", label: "Gujarati", native: "નમસ્તે", flag: "🇮🇳" },
  { id: "Punjabi", label: "Punjabi", native: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", flag: "🇮🇳" },
];

interface Props {
  open: boolean;
  onPicked: (lang: string) => void;
  onSkip: () => void;
}

export default function VoiceLanguageModal({ open, onPicked, onSkip }: Props) {
  const [selected, setSelected] = useState("English");
  const [previewing, setPreviewing] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    // Pre-warm voices for browser SpeechSynthesis
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
    }
  }, [open]);

  const preview = (lang: { id: string; native: string }) => {
    setPreviewing(lang.id);
    setSelected(lang.id);
    const ctl = speak(lang.native, { language: lang.id, style: "intro", speaker: "female" });
    ctl.promise.finally(() => setPreviewing(null));
  };

  const confirm = () => {
    setStoredVoiceLanguage(selected);
    onPicked(selected);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.92, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            className="w-full max-w-lg"
          >
            <GlassCard glow className="p-6 md:p-8">
              <button
                onClick={onSkip}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
                aria-label="Skip"
              >
                <X size={16} />
              </button>

              <div className="flex flex-col items-center text-center mb-5">
                <AnimatedRobot size={130} state={previewing ? "talking" : "idle"} />
                <h2 className="text-2xl font-bold text-white mt-2 mb-1">
                  Pick my <span className="animate-gradient-text">voice</span>
                </h2>
                <p className="text-sm text-slate-400 max-w-sm">
                  I&apos;ll greet you and read answers in your language. Tap any flag to preview.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5 max-h-[40vh] overflow-y-auto scrollbar-thin px-1">
                {VOICE_LANGS.map((l) => {
                  const isSel = selected === l.id;
                  const isPlaying = previewing === l.id;
                  return (
                    <motion.button
                      key={l.id}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => preview(l)}
                      className={`relative p-3 rounded-xl border text-left transition-all ${
                        isSel
                          ? "bg-violet-600/20 border-violet-500/50"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-2xl">{l.flag}</span>
                        {isPlaying ? (
                          <Volume2 size={12} className="text-cyan-300 animate-pulse" />
                        ) : isSel ? (
                          <Check size={12} className="text-violet-300" />
                        ) : null}
                      </div>
                      <div className="text-sm font-semibold text-white">{l.label}</div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">{l.native}</div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between gap-2">
                <button onClick={onSkip} className="text-xs text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5">
                  Skip — no voice
                </button>
                <ShimmerButton onClick={confirm} size="md">
                  Use {selected} <ArrowRight size={14} />
                </ShimmerButton>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
