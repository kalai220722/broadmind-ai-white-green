"use client";

// ─────────────────────────────────────────────────────────────────────
// BroadMind voice engine — tiered, professional-quality TTS
//
// Strategy (server picks the best):
//   1. OpenAI TTS HD     → nova / shimmer / onyx / echo  (best, English+mixed)
//   2. Sarvam AI         → native Indian-language pronunciation
//   3. Browser SpeechSynthesis (client fallback, offline)
// ─────────────────────────────────────────────────────────────────────

export type VoiceStyle = "professional" | "motivational" | "intro" | "casual";

export interface VoiceController {
  stop: () => void;
  promise: Promise<void>;
}

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

interface SpeakOptions {
  language?: string;
  style?: VoiceStyle;
  speaker?: "female" | "male";
}

export function speak(text: string, options: string | SpeakOptions = "English"): VoiceController {
  stopAllVoice();
  const opts: SpeakOptions = typeof options === "string" ? { language: options } : options;
  const language = opts.language || "English";
  const style = opts.style || "professional";
  const speaker = opts.speaker || "female";

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
    // Clean text for speech — remove markdown noise but keep punctuation for prosody
    const clean = text
      .replace(/[*_`#$]/g, "")
      .replace(/!\[.*?\]\(.*?\)/g, "")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 1500);

    // Try server-side (OpenAI HD / Sarvam)
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: clean, language, style, speaker }),
      });
      if (stopped) return;
      if (res.ok) {
        const data = await res.json();
        if (data.audio) {
          const mime = data.format === "mp3" ? "audio/mpeg" : "audio/wav";
          const audio = new Audio(`data:${mime};base64,${data.audio}`);
          // Subtle warmth via playback rate (closer to natural speech)
          audio.playbackRate = style === "motivational" ? 1.0 : 1.0;
          audio.volume = 1.0;
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

    if (stopped) return;
    // Browser SpeechSynthesis fallback — pick the highest-quality voice available
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    // Voices load async on some browsers — wait if not yet populated
    let voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      await new Promise<void>((resolve) => {
        const handler = () => {
          window.speechSynthesis.removeEventListener("voiceschanged", handler);
          resolve();
        };
        window.speechSynthesis.addEventListener("voiceschanged", handler);
        setTimeout(resolve, 800); // safety timeout
      });
      voices = window.speechSynthesis.getVoices();
    }
    if (stopped) return;

    const utter = new SpeechSynthesisUtterance(clean);
    utter.lang = BROWSER_LANG_MAP[language] || "en-IN";
    utter.rate = style === "motivational" || style === "intro" ? 0.95 : 1.02;
    utter.pitch = style === "motivational" ? 1.05 : 1.0;
    utter.volume = 1;

    // Tiered voice selection — premium neural voices first
    const langPrefix = utter.lang.split("-")[0];

    // Tier A: explicitly premium / neural / Siri-grade voices for this language
    const tierA = voices.find((v) =>
      v.lang.startsWith(langPrefix) &&
      /\(enhanced\)|\(premium\)|\(neural\)|natural|siri|microsoft (aria|jenny|sonia|guy)|google.*(neural|wavenet)/i.test(v.name)
    );
    // Tier B: known-good named voices (macOS / Chrome / Edge defaults)
    const tierB = voices.find((v) =>
      v.lang.startsWith(langPrefix) &&
      /samantha|karen|moira|tessa|allison|ava|nicky|aria|sonia|jenny|fiona|google us english|google.*(female|hindi|tamil)/i.test(v.name)
    );
    // Tier C: any female voice in this language
    const tierC = voices.find((v) =>
      v.lang.startsWith(langPrefix) && /female|woman/i.test(v.name)
    );
    // Tier D: any local voice in this exact lang
    const tierD = voices.find((v) => v.lang === utter.lang && v.localService);
    // Tier E: any voice in this lang
    const tierE = voices.find((v) => v.lang === utter.lang);
    // Tier F: any voice that starts with the lang prefix
    const tierF = voices.find((v) => v.lang.startsWith(langPrefix));

    const chosen = tierA || tierB || tierC || tierD || tierE || tierF;
    if (chosen) utter.voice = chosen;

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

export function isVoiceMuted(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("bm-voice-muted") === "true";
}

export function setVoiceMuted(muted: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem("bm-voice-muted", muted ? "true" : "false");
}
