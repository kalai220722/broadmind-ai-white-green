"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MonitorPlay as Youtube,
  Sparkles,
  Loader2,
  Play,
  Clock,
  Tag,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import AppLayout from "@/components/layout/AppLayout";
import GlassCard from "@/components/ui/GlassCard";
import ShimmerButton from "@/components/ui/ShimmerButton";
import { track } from "@/lib/personalization";

interface Summary {
  title: string;
  channel?: string;
  tldr: string;
  keyPoints: string[];
  chapters?: { time: string; title: string }[];
  tags: string[];
  quiz: { q: string; a: string }[];
  videoId?: string;
}

export default function YouTubePage() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const [revealedQuiz, setRevealedQuiz] = useState<Set<number>>(new Set());

  const submit = async () => {
    if (!url.trim()) {
      toast.error("Enter a YouTube URL or topic");
      return;
    }
    setLoading(true);
    setSummary(null);
    setRevealedQuiz(new Set());
    try {
      const res = await fetch("/api/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSummary(data);
      track("youtube_summarized");
      toast.success("Summary generated!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const toggleQuiz = (i: number) => {
    setRevealedQuiz((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <AppLayout title="YouTube Summarizer">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Input */}
        <GlassCard className="p-6" glow>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-red-600 to-rose-700">
              <Youtube size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Summarize any YouTube video</h2>
              <p className="text-xs text-slate-400">
                Paste a URL or just describe the topic — get key points, chapters, and a quick quiz.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="https://youtube.com/watch?v=..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-red-500/50"
            />
            <ShimmerButton onClick={submit} disabled={loading || !url.trim()}>
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              Summarize
            </ShimmerButton>
          </div>
        </GlassCard>

        <AnimatePresence>
          {summary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Video embed */}
              {summary.videoId && (
                <GlassCard className="p-2 overflow-hidden">
                  <div className="aspect-video w-full rounded-lg overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${summary.videoId}`}
                      title={summary.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                </GlassCard>
              )}

              {/* TLDR */}
              <GlassCard className="p-6" glow>
                <h2 className="text-xl font-bold text-white mb-2">{summary.title}</h2>
                {summary.channel && (
                  <p className="text-xs text-slate-400 mb-3">📺 {summary.channel}</p>
                )}
                <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-violet-500/20">
                  <p className="text-xs uppercase tracking-widest text-violet-300 mb-1">TL;DR</p>
                  <p className="text-sm text-slate-200">{summary.tldr}</p>
                </div>
                {summary.tags?.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap mt-4">
                    <Tag size={12} className="text-slate-500" />
                    {summary.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </GlassCard>

              {/* Key points */}
              <GlassCard className="p-6">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400" /> Key Points
                </h3>
                <ul className="space-y-2.5">
                  {summary.keyPoints?.map((p, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex gap-3 text-sm text-slate-200"
                    >
                      <span className="flex-shrink-0 w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-[11px] font-bold text-white mt-0.5">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{p}</span>
                    </motion.li>
                  ))}
                </ul>
              </GlassCard>

              {/* Chapters */}
              {summary.chapters && summary.chapters.length > 0 && (
                <GlassCard className="p-6">
                  <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Clock size={14} className="text-amber-400" /> Chapters
                  </h3>
                  <div className="space-y-2">
                    {summary.chapters.map((c, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition cursor-pointer"
                      >
                        <Play size={10} className="text-red-400 flex-shrink-0" />
                        <span className="text-xs font-mono text-amber-300 w-12">{c.time}</span>
                        <span className="text-sm text-slate-200">{c.title}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* Quiz */}
              {summary.quiz && summary.quiz.length > 0 && (
                <GlassCard className="p-6">
                  <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Sparkles size={14} className="text-violet-400" /> Quick Check
                  </h3>
                  <div className="space-y-2">
                    {summary.quiz.map((q, i) => (
                      <div
                        key={i}
                        className="rounded-lg bg-white/5 border border-white/10 overflow-hidden"
                      >
                        <button
                          onClick={() => toggleQuiz(i)}
                          className="w-full flex items-center justify-between gap-3 p-3 text-left hover:bg-white/5"
                        >
                          <span className="text-sm text-white">
                            <span className="text-violet-400 font-semibold">Q{i + 1}.</span> {q.q}
                          </span>
                          {revealedQuiz.has(i) ? (
                            <ChevronDown size={14} className="text-slate-400" />
                          ) : (
                            <ChevronRight size={14} className="text-slate-400" />
                          )}
                        </button>
                        <AnimatePresence>
                          {revealedQuiz.has(i) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-3 pb-3 pt-1 text-sm text-emerald-300 border-t border-emerald-500/20 bg-emerald-500/5">
                                <span className="text-xs uppercase tracking-widest text-emerald-400">
                                  Answer:
                                </span>{" "}
                                {q.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {!summary && !loading && (
          <GlassCard className="p-12 text-center">
            <Youtube size={36} className="text-red-500 mx-auto mb-3" />
            <p className="text-sm text-slate-400">
              Paste a YouTube URL above to get a quick summary, chapters, and a self-check quiz.
            </p>
          </GlassCard>
        )}
      </div>
    </AppLayout>
  );
}
