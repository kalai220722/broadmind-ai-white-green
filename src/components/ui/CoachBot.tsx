"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Loader2,
} from "lucide-react";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";
import AnimatedRobot from "@/components/ui/AnimatedRobot";
import { useProfile, track } from "@/lib/personalization";
import { speak, getStoredVoiceLanguage, stopAllVoice } from "@/lib/voice";

interface Msg {
  id: string;
  role: "user" | "assistant";
  content: string;
  ts: number;
}

export default function CoachBot() {
  const pathname = usePathname();
  const profile = useProfile();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [robotState, setRobotState] = useState<"idle" | "talking" | "thinking" | "listening">("idle");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Hide on landing and login (where RobotHero already exists)
  const hidden = pathname === "/" || pathname === "/login";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!open) stopAllVoice();
  }, [open]);

  if (hidden) return null;

  const send = async () => {
    if (!input.trim()) return;
    const userMsg: Msg = {
      id: Math.random().toString(36).slice(2),
      role: "user",
      content: input.trim(),
      ts: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setRobotState("thinking");
    track("doubt_asked", { length: userMsg.content.length, prompt: userMsg.content.slice(0, 200) });

    try {
      const res = await fetch("/api/doubt-solver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          provider: "groq",
        }),
      });
      const data = await res.json();
      const reply: Msg = {
        id: Math.random().toString(36).slice(2),
        role: "assistant",
        content: data.response || data.error || "Sorry, I couldn't fetch an answer.",
        ts: Date.now(),
      };
      setMessages((prev) => [...prev, reply]);

      // Auto-speak with Sarvam (or browser fallback) in user's voice language
      if (autoSpeak && data.response) {
        setRobotState("talking");
        const voiceLang = getStoredVoiceLanguage();
        const ctl = speak(reply.content, { language: voiceLang, style: "professional", speaker: "female" });
        ctl.promise.finally(() => setRobotState("idle"));
      } else {
        setRobotState("idle");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? `Error: ${err.message}` : "Network error";
      setMessages((prev) => [
        ...prev,
        { id: Math.random().toString(36).slice(2), role: "assistant", content: msg, ts: Date.now() },
      ]);
      setRobotState("idle");
    } finally {
      setLoading(false);
    }
  };

  const startVoice = () => {
    type SR = {
      lang: string; continuous: boolean; interimResults: boolean;
      start: () => void; stop: () => void;
      onresult: (e: { results: { transcript: string }[][] }) => void;
      onerror: () => void; onend: () => void;
    };
    const w = window as unknown as { SpeechRecognition?: new () => SR; webkitSpeechRecognition?: new () => SR };
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) return;
    const rec = new Ctor();
    rec.lang = "en-IN";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e) => setInput((prev) => (prev ? `${prev} ${e.results[0][0].transcript}` : e.results[0][0].transcript));
    rec.onerror = () => {
      setListening(false);
      setRobotState("idle");
    };
    rec.onend = () => {
      setListening(false);
      setRobotState("idle");
    };
    rec.start();
    recognitionRef.current = rec;
    setListening(true);
    setRobotState("listening");
    track("doubt_voice");
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setListening(false);
    setRobotState("idle");
  };

  const speakLast = () => {
    const last = [...messages].reverse().find((m) => m.role === "assistant");
    if (!last) return;
    setRobotState("talking");
    const ctl = speak(last.content, { language: getStoredVoiceLanguage(), style: "professional", speaker: "female" });
    ctl.promise.finally(() => setRobotState("idle"));
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="mb-3 w-[340px] h-[520px] rounded-2xl border border-violet-500/30 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-violet-900/40 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-white/5 bg-gradient-to-r from-violet-500/10 to-cyan-500/10">
              <div className="flex items-center gap-2.5">
                <AnimatedRobot size={36} state={robotState} />
                <div>
                  <div className="text-sm font-semibold text-white">Coach</div>
                  <div className="text-[10px] text-slate-400">
                    {robotState === "talking" ? "speaking..." :
                     robotState === "listening" ? "listening..." :
                     robotState === "thinking" ? "thinking..." :
                     "always here · ML-tuned"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setAutoSpeak((s) => !s)}
                  className={`p-1.5 rounded-lg transition ${
                    autoSpeak ? "bg-violet-500/20 text-violet-300" : "text-slate-400 hover:text-white"
                  }`}
                  title={autoSpeak ? "Mute voice" : "Unmute voice"}
                >
                  {autoSpeak ? <Volume2 size={12} /> : <VolumeX size={12} />}
                </button>
                <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5">
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-3">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center px-4">
                  <div>
                    <p className="text-sm text-slate-300 font-medium mb-1">
                      Hi {profile.name.split(" ")[0]}! 👋
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Ask me anything across your modules. I know your DNA, your
                      weak topics, your goals — and I&apos;ll speak in{" "}
                      <span className="text-violet-300">{getStoredVoiceLanguage()}</span>.
                    </p>
                    <div className="mt-4 flex flex-col gap-1.5 text-left">
                      {[
                        "Explain Newton's laws in Tamil",
                        "Quiz me on photosynthesis",
                        "What should I study today?",
                      ].map((q) => (
                        <button
                          key={q}
                          onClick={() => setInput(q)}
                          className="text-xs text-slate-300 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm ${
                        m.role === "user"
                          ? "bg-gradient-to-br from-violet-600 to-violet-700 text-white"
                          : "bg-white/5 border border-white/10"
                      }`}
                    >
                      {m.role === "assistant" ? <MarkdownRenderer content={m.content} /> : m.content}
                      {m.role === "assistant" && (
                        <button
                          onClick={() => {
                            setRobotState("talking");
                            const ctl = speak(m.content, { language: getStoredVoiceLanguage(), style: "professional", speaker: "female" });
                            ctl.promise.finally(() => setRobotState("idle"));
                          }}
                          className="mt-2 flex items-center gap-1 text-[10px] text-slate-400 hover:text-violet-300"
                        >
                          <Volume2 size={9} /> Read aloud
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 rounded-2xl px-3 py-2 text-violet-300">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="p-2 border-t border-white/5 flex items-center gap-1.5">
              <button
                onClick={listening ? stopVoice : startVoice}
                className={`p-2 rounded-lg ${listening ? "bg-rose-500/20 text-rose-300 animate-pulse" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}
              >
                {listening ? <MicOff size={14} /> : <Mic size={14} />}
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask anything..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-500/50"
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 text-white disabled:opacity-50"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Robot orb button */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-500 shadow-lg shadow-violet-500/40 flex items-center justify-center pulse-ring overflow-hidden"
        aria-label="Open Coach Bot"
      >
        <AnimatedRobot size={48} state={open ? "idle" : robotState} />
        {messages.length > 0 && !open && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-slate-950">
            {messages.filter((m) => m.role === "assistant").length}
          </span>
        )}
      </motion.button>
    </div>
  );
}
