"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Languages, Sparkles } from "lucide-react";
import AnimatedRobot from "./AnimatedRobot";
import VoiceLanguageModal from "./VoiceLanguageModal";
import { speak, getStoredVoiceLanguage, setStoredVoiceLanguage, stopAllVoice, type VoiceController } from "@/lib/voice";

// One-line scripts per language. Robot reads ONE on landing.
const INTRO_SCRIPTS: Record<string, string[]> = {
  English: [
    "Hi! I'm BroadMind — your personal AI learning OS.",
    "I learn how you learn. Then every lesson, plan, and answer adapts to match your style.",
    "Class 8 to PhD, twenty-two Indian languages, all in one studio. Ready to begin?",
  ],
  Hindi: [
    "नमस्ते! मैं ब्रॉडमाइंड हूँ — आपका व्यक्तिगत AI लर्निंग OS।",
    "मैं सीखता हूँ कि आप कैसे सीखते हैं। फिर हर पाठ आपकी शैली से मेल खाता है।",
    "कक्षा आठ से PhD तक, बाईस भारतीय भाषाएँ, सब एक जगह। चलें शुरू करें?",
  ],
  Tamil: [
    "வணக்கம்! நான் ப்ராட்மைண்ட் — உங்கள் சொந்த AI கற்றல் OS.",
    "நீங்கள் எப்படி கற்கிறீர்கள் என்பதை நான் கற்றுக்கொள்கிறேன். பிறகு ஒவ்வொரு பாடமும் உங்கள் பாணிக்கு பொருந்தும்.",
    "8ம் வகுப்பு முதல் PhD வரை, 22 இந்திய மொழிகள், ஒரே இடத்தில். தொடங்கலாமா?",
  ],
  Telugu: [
    "నమస్తే! నేను బ్రాడ్‌మైండ్ — మీ సొంత AI లెర్నింగ్ OS.",
    "మీరు ఎలా నేర్చుకుంటున్నారో నేను నేర్చుకుంటాను. తర్వాత ప్రతి పాఠం మీ శైలికి సరిపోతుంది.",
  ],
  Malayalam: ["നമസ്കാരം! ഞാൻ ബ്രോഡ്മൈൻഡ് — നിങ്ങളുടെ AI ലേണിംഗ് OS."],
  Kannada: ["ನಮಸ್ಕಾರ! ನಾನು ಬ್ರಾಡ್‌ಮೈಂಡ್ — ನಿಮ್ಮ AI ಕಲಿಕೆ OS."],
  Marathi: ["नमस्कार! मी ब्रॉडमाइंड — तुमचा AI लर्निंग OS."],
  Bengali: ["নমস্কার! আমি ব্রডমাইন্ড — আপনার AI লার্নিং OS।"],
  Gujarati: ["નમસ્તે! હું બ્રોડમાઇંડ છું — તમારું AI શીખવાનું OS."],
  Punjabi: ["ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਬ੍ਰੌਡਮਾਈਂਡ ਹਾਂ — ਤੁਹਾਡਾ AI ਲਰਨਿੰਗ OS।"],
};

export default function RobotHero() {
  const [language, setLanguage] = useState("English");
  const [showLangModal, setShowLangModal] = useState(false);
  const [muted, setMuted] = useState(false);
  const [state, setState] = useState<"idle" | "talking">("idle");
  const [currentLine, setCurrentLine] = useState(0);
  const [hasIntroduced, setHasIntroduced] = useState(false);
  const [voiceCtl, setVoiceCtl] = useState<VoiceController | null>(null);

  // First-visit voice-language picker
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("bm-voice-language");
    if (saved) {
      setLanguage(saved);
      setHasIntroduced(localStorage.getItem("bm-intro-done") === "true");
    } else {
      const t = setTimeout(() => setShowLangModal(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  // Auto-narrate intro on first visit after language picked
  useEffect(() => {
    if (showLangModal || muted) return;
    if (hasIntroduced) return;
    const scripts = INTRO_SCRIPTS[language] || INTRO_SCRIPTS.English;
    if (currentLine >= scripts.length) {
      localStorage.setItem("bm-intro-done", "true");
      setHasIntroduced(true);
      setState("idle");
      return;
    }
    const line = scripts[currentLine];
    setState("talking");
    const ctl = speak(line, language);
    setVoiceCtl(ctl);
    ctl.promise.then(() => {
      setTimeout(() => setCurrentLine((c) => c + 1), 350);
    });
    return () => {
      ctl.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLine, language, muted, hasIntroduced, showLangModal]);

  const replayIntro = () => {
    if (muted) {
      setMuted(false);
    }
    stopAllVoice();
    localStorage.removeItem("bm-intro-done");
    setHasIntroduced(false);
    setCurrentLine(0);
  };

  const toggleMute = () => {
    if (!muted) {
      voiceCtl?.stop();
      stopAllVoice();
      setState("idle");
    }
    setMuted((m) => !m);
  };

  const onLangPicked = (lang: string) => {
    setLanguage(lang);
    setStoredVoiceLanguage(lang);
    setShowLangModal(false);
    setCurrentLine(0);
    setHasIntroduced(false);
    localStorage.removeItem("bm-intro-done");
  };

  const currentScript = INTRO_SCRIPTS[language] || INTRO_SCRIPTS.English;
  const currentText = currentScript[Math.min(currentLine, currentScript.length - 1)];

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <AnimatedRobot size={220} state={state} />
        </div>

        {/* Speech bubble */}
        {!muted && state === "talking" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md text-center"
          >
            <div className="inline-block px-4 py-2 rounded-2xl glass-card border border-violet-500/30 text-sm text-slate-200">
              <span className="inline-flex items-center gap-2">
                <Sparkles size={11} className="text-violet-300" />
                {currentText}
              </span>
            </div>
          </motion.div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={toggleMute}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition"
            title={muted ? "Unmute robot" : "Mute robot"}
          >
            {muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
            {muted ? "Unmute" : "Mute"}
          </button>
          <button
            onClick={() => setShowLangModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition"
            title="Change voice language"
          >
            <Languages size={12} />
            {language}
          </button>
          {hasIntroduced && (
            <button
              onClick={replayIntro}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/30 text-xs text-violet-300 transition"
              title="Replay intro"
            >
              <Sparkles size={12} /> Replay intro
            </button>
          )}
        </div>
      </div>

      <VoiceLanguageModal
        open={showLangModal}
        onPicked={onLangPicked}
        onSkip={() => {
          setMuted(true);
          setShowLangModal(false);
          setStoredVoiceLanguage("English");
          localStorage.setItem("bm-intro-done", "true");
          setHasIntroduced(true);
        }}
      />
    </>
  );
}
