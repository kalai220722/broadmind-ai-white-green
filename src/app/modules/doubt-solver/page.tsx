"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Mic,
  MicOff,
  Image as ImageIcon,
  X,
  Volume2,
  VolumeX,
  Copy,
  Check,
  RotateCcw,
  Download,
  Sparkles,
  ChevronDown,
  Plus,
  Trash2,
  History,
  Camera,
} from "lucide-react";
import toast from "react-hot-toast";
import AppLayout from "@/components/layout/AppLayout";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";
import GlassCard from "@/components/ui/GlassCard";
import ShimmerButton from "@/components/ui/ShimmerButton";
import { track } from "@/lib/personalization";

type Role = "user" | "assistant";
interface Message {
  id: string;
  role: Role;
  content: string;
  image?: string;
  provider?: string;
  timestamp: number;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

interface ProviderInfo {
  name: string;
  emoji: string;
  model: string;
}

const SUGGESTIONS = [
  "Explain Newton's third law with a real-world example",
  "What is the difference between mitosis and meiosis?",
  "Solve: 2x² + 5x - 3 = 0",
  "Write a Python function to find prime numbers up to N",
  "Explain GDP in Tamil",
];

function newId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function DoubtSolverPro() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [providers, setProviders] = useState<Record<string, ProviderInfo>>({});
  const [available, setAvailable] = useState<string[]>([]);
  const [provider, setProvider] = useState<string>("groq");
  const [providerOpen, setProviderOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const [input, setInput] = useState("");
  const [imageData, setImageData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<unknown>(null);

  const active = conversations.find((c) => c.id === activeId) ?? null;
  const messages = active?.messages ?? [];

  // ── Load providers ────────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/doubt-solver")
      .then((r) => r.json())
      .then((data) => {
        setProviders(data.providers || {});
        setAvailable(data.available || []);
        setProvider(data.defaultProvider || "groq");
      })
      .catch(() => {
        setProviders({
          gemini: { name: "Google Gemini", emoji: "🟢", model: "gemini-2.0-flash" },
          chatgpt: { name: "ChatGPT", emoji: "🟡", model: "gpt-4o-mini" },
          claude: { name: "Claude", emoji: "🟠", model: "claude-sonnet-4-20250514" },
          groq: { name: "Groq", emoji: "🟣", model: "llama-3.3-70b-versatile" },
          kimi: { name: "Kimi", emoji: "🔵", model: "moonshot-v1-8k" },
        });
      });
  }, []);

  // ── Load conversations from localStorage ──────────────────────────
  useEffect(() => {
    try {
      const stored = localStorage.getItem("bm-conversations");
      if (stored) {
        const parsed: Conversation[] = JSON.parse(stored);
        setConversations(parsed);
        if (parsed.length > 0) setActiveId(parsed[0].id);
        return;
      }
    } catch {}
    const fresh = { id: newId(), title: "New chat", messages: [], updatedAt: Date.now() };
    setConversations([fresh]);
    setActiveId(fresh.id);
  }, []);

  // ── Persist conversations ─────────────────────────────────────────
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem("bm-conversations", JSON.stringify(conversations));
    }
  }, [conversations]);

  // ── Auto-scroll ───────────────────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Voice recognition ─────────────────────────────────────────────
  const startListening = () => {
    track("doubt_voice");
    type SR = {
      lang: string;
      continuous: boolean;
      interimResults: boolean;
      start: () => void;
      stop: () => void;
      onresult: (e: { results: { transcript: string }[][] }) => void;
      onerror: () => void;
      onend: () => void;
    };
    const w = window as unknown as {
      SpeechRecognition?: new () => SR;
      webkitSpeechRecognition?: new () => SR;
    };
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) {
      toast.error("Voice input not supported. Use Chrome or Edge.");
      return;
    }
    const rec = new Ctor();
    rec.lang = "en-IN";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);
    rec.start();
    recognitionRef.current = rec;
    setIsListening(true);
  };

  const stopListening = () => {
    const rec = recognitionRef.current as { stop: () => void } | null;
    rec?.stop();
    setIsListening(false);
  };

  // ── Voice output ─────────────────────────────────────────────────
  const speak = (id: string, text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast.error("Voice output not supported");
      return;
    }
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const cleaned = text
      .replace(/[*_`#$]/g, "")
      .replace(/!\[.*?\]\(.*?\)/g, "")
      .slice(0, 4000);
    const utter = new SpeechSynthesisUtterance(cleaned);
    utter.lang = "en-IN";
    utter.rate = 1;
    utter.onend = () => setSpeakingId(null);
    utter.onerror = () => setSpeakingId(null);
    window.speechSynthesis.speak(utter);
    setSpeakingId(id);
  };

  // ── Image upload ─────────────────────────────────────────────────
  const onPickImage = () => fileInputRef.current?.click();
  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image must be under 8MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageData(reader.result as string);
      toast.success("Image attached — will use Gemini Vision");
    };
    reader.readAsDataURL(file);
  };

  // ── Send message ─────────────────────────────────────────────────
  const send = async () => {
    if (!input.trim() && !imageData) return;
    if (!active) return;

    const userMsg: Message = {
      id: newId(),
      role: "user",
      content: input.trim() || (imageData ? "Solve this problem step by step" : ""),
      image: imageData || undefined,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMsg];

    setConversations((prev) =>
      prev.map((c) =>
        c.id === active.id
          ? {
              ...c,
              messages: updatedMessages,
              title:
                c.messages.length === 0
                  ? userMsg.content.slice(0, 40) || "Image question"
                  : c.title,
              updatedAt: Date.now(),
            }
          : c
      )
    );

    setInput("");
    const submittedImage = imageData;
    setImageData(null);
    setIsLoading(true);

    // ── ML profile tracking ────────────────────────────────────────────
    track(submittedImage ? "doubt_image" : "doubt_asked", {
      length: userMsg.content.length,
      prompt: userMsg.content.slice(0, 200),
    });

    try {
      const res = await fetch("/api/doubt-solver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          provider,
          image: submittedImage,
        }),
      });
      const data = await res.json();

      if (data.error) toast.error(data.error);

      const assistantMsg: Message = {
        id: newId(),
        role: "assistant",
        content: data.response || data.error || "Sorry, something went wrong.",
        provider: data.provider,
        timestamp: Date.now(),
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === active.id
            ? { ...c, messages: [...updatedMessages, assistantMsg], updatedAt: Date.now() }
            : c
        )
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  const regenerate = async (idx: number) => {
    if (!active) return;
    const trimmed = messages.slice(0, idx);
    setConversations((prev) =>
      prev.map((c) =>
        c.id === active.id ? { ...c, messages: trimmed, updatedAt: Date.now() } : c
      )
    );
    setIsLoading(true);
    try {
      const res = await fetch("/api/doubt-solver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: trimmed.map((m) => ({ role: m.role, content: m.content })),
          provider,
        }),
      });
      const data = await res.json();
      if (data.error) toast.error(data.error);
      const assistantMsg: Message = {
        id: newId(),
        role: "assistant",
        content: data.response || data.error || "",
        provider: data.provider,
        timestamp: Date.now(),
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === active.id
            ? { ...c, messages: [...trimmed, assistantMsg], updatedAt: Date.now() }
            : c
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const newChat = () => {
    const fresh = { id: newId(), title: "New chat", messages: [], updatedAt: Date.now() };
    setConversations((prev) => [fresh, ...prev]);
    setActiveId(fresh.id);
    setHistoryOpen(false);
  };

  const deleteConvo = (id: string) => {
    setConversations((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      if (filtered.length === 0) {
        const fresh = { id: newId(), title: "New chat", messages: [], updatedAt: Date.now() };
        setActiveId(fresh.id);
        return [fresh];
      }
      if (id === activeId) setActiveId(filtered[0].id);
      return filtered;
    });
  };

  const exportPDF = async () => {
    if (!active || messages.length === 0) {
      toast.error("Nothing to export yet");
      return;
    }
    const { default: jsPDF } = await import("jspdf");
    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 40;
    const width = pdf.internal.pageSize.getWidth() - margin * 2;
    let y = margin;
    pdf.setFontSize(18);
    pdf.text("BroadMind AI — Doubt Solver", margin, y);
    y += 20;
    pdf.setFontSize(10);
    pdf.setTextColor(120);
    pdf.text(`Conversation: ${active.title}`, margin, y);
    y += 24;
    pdf.setTextColor(20);
    for (const m of messages) {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text(m.role === "user" ? "You:" : "AI:", margin, y);
      y += 14;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      const lines = pdf.splitTextToSize(m.content.replace(/[*_`#]/g, ""), width);
      for (const line of lines) {
        if (y > pdf.internal.pageSize.getHeight() - margin) {
          pdf.addPage();
          y = margin;
        }
        pdf.text(line, margin, y);
        y += 12;
      }
      y += 10;
    }
    pdf.save(`broadmind-${active.title.slice(0, 20)}.pdf`);
    toast.success("PDF downloaded!");
  };

  return (
    <AppLayout title="Doubt Solver">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4 h-[calc(100vh-9rem)]">
        {/* History sidebar */}
        <aside className="hidden lg:block">
          <GlassCard className="p-3 h-full overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <History size={14} className="text-violet-400" />
                History
              </h3>
              <button
                onClick={newChat}
                className="p-1.5 rounded-lg bg-violet-600/20 text-violet-300 hover:bg-violet-600/30 transition"
                title="New chat"
              >
                <Plus size={14} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin space-y-1.5 pr-1">
              {conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`group w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center justify-between ${
                    c.id === activeId
                      ? "bg-violet-600/20 text-white"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                >
                  <span className="truncate">{c.title}</span>
                  <Trash2
                    size={12}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConvo(c.id);
                    }}
                    className="opacity-0 group-hover:opacity-60 hover:opacity-100 hover:text-rose-400 transition cursor-pointer"
                  />
                </button>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-white/10">
              <button
                onClick={exportPDF}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 transition"
              >
                <Download size={12} /> Export as PDF
              </button>
            </div>
          </GlassCard>
        </aside>

        {/* Main chat */}
        <GlassCard className="flex flex-col overflow-hidden">
          {/* Top bar */}
          <div className="flex items-center justify-between p-3 border-b border-white/10">
            <button
              onClick={() => setHistoryOpen((v) => !v)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <History size={16} />
            </button>
            <div className="flex items-center gap-2 ml-auto">
              <div className="relative">
                <button
                  onClick={() => setProviderOpen((v) => !v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300"
                >
                  <span>{providers[provider]?.emoji || "🤖"}</span>
                  <span className="font-medium">{providers[provider]?.name || provider}</span>
                  <ChevronDown size={12} />
                </button>
                <AnimatePresence>
                  {providerOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="absolute right-0 top-full mt-1 w-56 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-30 py-1"
                    >
                      {Object.entries(providers).map(([key, info]) => {
                        const isAvail = available.includes(key);
                        return (
                          <button
                            key={key}
                            onClick={() => {
                              if (!isAvail) {
                                toast.error(`${info.name} API key not configured`);
                                return;
                              }
                              setProvider(key);
                              setProviderOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-white/5 ${
                              !isAvail ? "opacity-50" : ""
                            } ${provider === key ? "bg-violet-600/10" : ""}`}
                          >
                            <span className="flex items-center gap-2">
                              <span>{info.emoji}</span>
                              <span className="text-slate-200">{info.name}</span>
                            </span>
                            {provider === key && <Check size={12} className="text-violet-400" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Mobile history overlay */}
          {historyOpen && (
            <div className="lg:hidden fixed inset-0 z-40 bg-slate-950/90 backdrop-blur-md p-4">
              <button
                onClick={() => setHistoryOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400"
              >
                <X size={18} />
              </button>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <History size={16} /> History
              </h3>
              <button
                onClick={newChat}
                className="w-full mb-3 px-3 py-2 rounded-lg bg-violet-600/20 text-violet-300 text-sm flex items-center justify-center gap-2"
              >
                <Plus size={14} /> New chat
              </button>
              <div className="space-y-2 overflow-y-auto max-h-[70vh]">
                {conversations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveId(c.id);
                      setHistoryOpen(false);
                    }}
                    className={`block w-full text-left p-3 rounded-lg text-sm ${
                      c.id === activeId ? "bg-violet-600/20 text-white" : "bg-white/5 text-slate-300"
                    }`}
                  >
                    {c.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center max-w-md">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 mb-4"
                  >
                    <Sparkles size={28} className="text-violet-400" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-2">Ask me anything</h2>
                  <p className="text-slate-400 text-sm mb-6">
                    Math, science, code, languages — I&apos;ve got you covered.
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {SUGGESTIONS.map((s) => (
                      <motion.button
                        key={s}
                        whileHover={{ x: 4 }}
                        onClick={() => setInput(s)}
                        className="text-left text-xs text-slate-300 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-violet-500/30 transition-all"
                      >
                        {s}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              messages.map((m, idx) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <Sparkles size={14} className="text-white" />
                    </div>
                  )}
                  <div className={`max-w-[85%] ${m.role === "user" ? "order-2" : ""}`}>
                    <div
                      className={`rounded-2xl p-4 ${
                        m.role === "user"
                          ? "bg-gradient-to-br from-violet-600 to-violet-700 text-white"
                          : "bg-slate-800/50 border border-white/10"
                      }`}
                    >
                      {m.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={m.image}
                          alt="uploaded"
                          className="mb-3 rounded-lg max-h-64 border border-white/10"
                        />
                      )}
                      {m.role === "assistant" ? (
                        <MarkdownRenderer content={m.content} />
                      ) : (
                        <div className="text-sm whitespace-pre-wrap">{m.content}</div>
                      )}
                    </div>
                    {m.role === "assistant" && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 flex-wrap">
                        {m.provider && (
                          <span className="flex items-center gap-1">
                            {providers[m.provider]?.emoji} {providers[m.provider]?.name}
                          </span>
                        )}
                        <button
                          onClick={() => copyMessage(m.content)}
                          className="hover:text-white transition flex items-center gap-1"
                        >
                          <Copy size={11} /> Copy
                        </button>
                        <button
                          onClick={() => speak(m.id, m.content)}
                          className="hover:text-white transition flex items-center gap-1"
                        >
                          {speakingId === m.id ? <VolumeX size={11} /> : <Volume2 size={11} />}
                          {speakingId === m.id ? "Stop" : "Read"}
                        </button>
                        <button
                          onClick={() => regenerate(idx)}
                          className="hover:text-white transition flex items-center gap-1"
                        >
                          <RotateCcw size={11} /> Regen
                        </button>
                      </div>
                    )}
                  </div>
                  {m.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 mt-1 order-3">
                      <span className="text-xs font-bold text-white">You</span>
                    </div>
                  )}
                </motion.div>
              ))
            )}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                  <Sparkles size={14} className="text-white" />
                </div>
                <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-4 text-violet-300">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </motion.div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input area */}
          <div className="p-3 border-t border-white/10">
            {imageData && (
              <div className="mb-2 inline-flex items-center gap-2 px-3 py-1.5 bg-violet-600/20 border border-violet-500/30 rounded-lg">
                <ImageIcon size={12} className="text-violet-300" />
                <span className="text-xs text-violet-200">Image attached (Gemini Vision)</span>
                <button onClick={() => setImageData(null)} className="text-violet-300 hover:text-white">
                  <X size={12} />
                </button>
              </div>
            )}
            <div className="flex gap-2 items-end">
              <button
                onClick={onPickImage}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition"
                title="Attach image"
              >
                <Camera size={18} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onImageChange}
                className="hidden"
              />
              <button
                onClick={isListening ? stopListening : startListening}
                className={`p-2 rounded-lg transition ${
                  isListening
                    ? "bg-rose-500/20 text-rose-300 animate-pulse"
                    : "bg-white/5 hover:bg-white/10 text-slate-300"
                }`}
                title={isListening ? "Stop listening" : "Voice input"}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Ask anything... (Enter to send, Shift+Enter for new line)"
                rows={1}
                className="flex-1 resize-none bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-500/50 max-h-32"
              />
              <ShimmerButton
                onClick={send}
                disabled={isLoading || (!input.trim() && !imageData)}
                size="md"
                className="disabled:opacity-50"
              >
                <Send size={16} />
              </ShimmerButton>
            </div>
          </div>
        </GlassCard>
      </div>
    </AppLayout>
  );
}
