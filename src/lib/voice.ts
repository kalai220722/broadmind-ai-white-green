"use client";

// ─────────────────────────────────────────────────────────────────────
// BroadMind voice engine
//
// Strategy:
//   1. For Indian languages → POST to /api/tts (Sarvam AI)
//   2. If Sarvam unavailable or English requested → use browser
//      SpeechSynthesis (free, instant, works offline)
//
// Returns a controller so callers can stop playback mid-way.
// ─────────────────────────────────────────────────────────────────────

export interface VoiceController {
  stop: () => void;
  promise: Promise<void>;
}

const SARVAM_LANGS = new Set([
  "Hindi", "Tamil", "Telugu", "Malayalam", "Kannada",
  "Marathi", "Gujarati", "Bengali", "Punjabi", "Odia",
]);

const BROWSER_LANG_MAP: Record<string, string> = {
  English: "en-IN",
  Hindi: "hi-IN",
  Tamil: "ta-IN",
  Telugu: "te-IN",
  Malayalam: "ml-IN",
  Kannada: "kn-IN",
  Marathi: "mr-IN",
  Gujarati: "gu-IN",
  Bengali: "bn-IN",
  Punjabi: "pa-IN",
  Urdu: "ur-IN",
};

let currentAudio: HTMLAudioElement | null = null;
let currentUtter: SpeechSynthesisUtterance | null = null;

export function stopAllVoice() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = "";
    currentAudio = null;
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  currentUtter = null;
}

export function speak(text: string, language: string = "English"): VoiceController {
  stopAllVoice();
  let stopped = false;
  const ctl: { stop: () => void; promise: Promise<void> } = {
    stop: () => {
      stopped = true;
      stopAllVoice();
    },
    promise: Promise.resolve(),
  };

  ctl.promise = (async () => {
    if (stopped) return;
    const clean = text.replace(/[*_`#$]/g, "").replace(/!\[.*?\]\(.*?\)/g, "").slice(0, 1500);

    // Try Sarvam for Indian languages
    if (SARVAM_LANGS.has(language)) {
      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: clean, language }),
        });
        if (stopped) return;
        if (res.ok) {
          const data = await res.json();
          if (data.audio) {
            const audio = new Audio(`data:audio/wav;base64,${data.audio}`);
            currentAudio = audio;
            return new Promise<void>((resolve) => {
              audio.onended = () => resolve();
              audio.onerror = () => resolve();
              audio.play().catch(() => resolve());
            });
          }
        }
      } catch {
        // fall through to browser TTS
      }
    }

    // Browser SpeechSynthesis fallback
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (stopped) return;

    const utter = new SpeechSynthesisUtterance(clean);
    utter.lang = BROWSER_LANG_MAP[language] || "en-IN";
    utter.rate = 1;
    utter.pitch = 1;
    utter.volume = 1;

    // Prefer a female Indian voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((v) =>
      v.lang === utter.lang && /female|samantha|google/i.test(v.name)
    ) || voices.find((v) => v.lang.startsWith(utter.lang.split("-")[0]));
    if (preferred) utter.voice = preferred;

    currentUtter = utter;
    return new Promise<void>((resolve) => {
      utter.onend = () => resolve();
      utter.onerror = () => resolve();
      window.speechSynthesis.speak(utter);
    });
  })();

  return ctl;
}

export function getStoredVoiceLanguage(): string {
  if (typeof window === "undefined") return "English";
  return localStorage.getItem("bm-voice-language") || "English";
}

export function setStoredVoiceLanguage(lang: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("bm-voice-language", lang);
}
