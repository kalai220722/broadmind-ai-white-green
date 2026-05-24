"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Trash2,
  Sparkles,
  Loader2,
  StickyNote,
  Tag,
  Eye,
  Pencil,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import AppLayout from "@/components/layout/AppLayout";
import GlassCard from "@/components/ui/GlassCard";
import ShimmerButton from "@/components/ui/ShimmerButton";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  summary?: string;
  updatedAt: number;
}

function id() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const active = notes.find((n) => n.id === activeId) || null;

  useEffect(() => {
    const stored = localStorage.getItem("bm-notes");
    if (stored) {
      try {
        const parsed: Note[] = JSON.parse(stored);
        setNotes(parsed);
        if (parsed.length > 0) setActiveId(parsed[0].id);
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (notes.length > 0) localStorage.setItem("bm-notes", JSON.stringify(notes));
  }, [notes]);

  const create = () => {
    const n: Note = {
      id: id(),
      title: "Untitled",
      content: "",
      tags: [],
      updatedAt: Date.now(),
    };
    setNotes((prev) => [n, ...prev]);
    setActiveId(n.id);
    setPreviewMode(false);
  };

  const update = (patch: Partial<Note>) => {
    if (!activeId) return;
    setNotes((prev) =>
      prev.map((n) => (n.id === activeId ? { ...n, ...patch, updatedAt: Date.now() } : n))
    );
  };

  const remove = (noteId: string) => {
    setNotes((prev) => {
      const filtered = prev.filter((n) => n.id !== noteId);
      if (noteId === activeId) setActiveId(filtered[0]?.id || null);
      return filtered;
    });
    toast.success("Note deleted");
  };

  const addTag = () => {
    if (!active || !tagInput.trim()) return;
    if (active.tags.includes(tagInput.trim())) return;
    update({ tags: [...active.tags, tagInput.trim()] });
    setTagInput("");
  };

  const removeTag = (t: string) => {
    if (!active) return;
    update({ tags: active.tags.filter((x) => x !== t) });
  };

  const summarize = async () => {
    if (!active) return;
    setIsSummarizing(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: active.content }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      update({ summary: data.summary });
      setShowSummary(true);
      toast.success("AI summary ready!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed";
      toast.error(msg);
    } finally {
      setIsSummarizing(false);
    }
  };

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return notes;
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(s) ||
        n.content.toLowerCase().includes(s) ||
        n.tags.some((t) => t.toLowerCase().includes(s))
    );
  }, [notes, search]);

  return (
    <AppLayout title="Smart Notes">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 h-[calc(100vh-9rem)]">
        {/* Notes list */}
        <aside className="flex flex-col gap-3">
          <ShimmerButton onClick={create} className="w-full">
            <Plus size={16} /> New Note
          </ShimmerButton>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white outline-none focus:border-violet-500/40"
            />
          </div>
          <GlassCard className="p-2 flex-1 overflow-y-auto scrollbar-thin">
            {filtered.length === 0 ? (
              <p className="text-xs text-slate-500 p-6 text-center">No notes yet</p>
            ) : (
              <div className="space-y-1">
                {filtered.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      setActiveId(n.id);
                      setPreviewMode(false);
                      setShowSummary(false);
                    }}
                    className={`group block w-full text-left px-3 py-2.5 rounded-lg transition ${
                      n.id === activeId
                        ? "bg-violet-600/20 text-white"
                        : "text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium truncate">{n.title || "Untitled"}</div>
                        <div className="text-[10px] text-slate-500 truncate mt-0.5">
                          {n.content.slice(0, 60) || "Empty note"}
                        </div>
                      </div>
                      <Trash2
                        size={12}
                        onClick={(e) => {
                          e.stopPropagation();
                          remove(n.id);
                        }}
                        className="opacity-0 group-hover:opacity-60 hover:opacity-100 hover:text-rose-400 cursor-pointer flex-shrink-0"
                      />
                    </div>
                    {n.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {n.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </GlassCard>
        </aside>

        {/* Editor */}
        <div>
          {active ? (
            <GlassCard className="h-full flex flex-col overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center justify-between p-3 border-b border-white/10 gap-3">
                <input
                  value={active.title}
                  onChange={(e) => update({ title: e.target.value })}
                  placeholder="Note title"
                  className="flex-1 bg-transparent text-lg font-semibold text-white placeholder-slate-500 outline-none"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewMode((p) => !p)}
                    className={`p-2 rounded-lg transition ${
                      previewMode
                        ? "bg-violet-600/20 text-violet-300"
                        : "bg-white/5 text-slate-300 hover:bg-white/10"
                    }`}
                    title={previewMode ? "Edit" : "Preview"}
                  >
                    {previewMode ? <Pencil size={14} /> : <Eye size={14} />}
                  </button>
                  <ShimmerButton onClick={summarize} disabled={isSummarizing} size="sm">
                    {isSummarizing ? (
                      <>
                        <Loader2 size={12} className="animate-spin" /> Summarizing
                      </>
                    ) : (
                      <>
                        <Sparkles size={12} /> AI Summary
                      </>
                    )}
                  </ShimmerButton>
                </div>
              </div>

              {/* Tags */}
              <div className="px-3 py-2 border-b border-white/10 flex items-center gap-2 flex-wrap">
                <Tag size={12} className="text-slate-500" />
                {active.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 text-xs"
                  >
                    #{t}
                    <button onClick={() => removeTag(t)} className="hover:text-white">
                      <X size={10} />
                    </button>
                  </span>
                ))}
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Add tag..."
                  className="bg-transparent text-xs text-white outline-none w-24 placeholder-slate-600"
                />
              </div>

              {/* Body */}
              <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-2">
                {!previewMode && (
                  <textarea
                    value={active.content}
                    onChange={(e) => update({ content: e.target.value })}
                    placeholder="Start writing... Markdown is supported. Use **bold**, # headings, ```code```, $math$..."
                    className="md:col-span-1 col-span-2 w-full h-full p-4 bg-transparent text-sm text-white placeholder-slate-600 outline-none resize-none scrollbar-thin font-mono leading-relaxed"
                  />
                )}
                {(previewMode || (active.content && typeof window !== "undefined" && window.innerWidth >= 768)) && (
                  <div
                    className={`overflow-y-auto scrollbar-thin p-4 ${
                      previewMode ? "" : "border-l border-white/10 hidden md:block"
                    }`}
                  >
                    {active.content ? (
                      <MarkdownRenderer content={active.content} />
                    ) : (
                      <p className="text-slate-500 text-sm italic">Preview will appear here</p>
                    )}
                  </div>
                )}
              </div>

              {/* AI Summary panel */}
              <AnimatePresence>
                {showSummary && active.summary && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/10 overflow-hidden"
                  >
                    <div className="p-4 bg-gradient-to-br from-violet-500/10 to-cyan-500/10 max-h-64 overflow-y-auto scrollbar-thin">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-violet-300 flex items-center gap-2">
                          <Sparkles size={12} /> AI Summary
                        </h3>
                        <button
                          onClick={() => setShowSummary(false)}
                          className="text-slate-400 hover:text-white"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <MarkdownRenderer content={active.summary} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          ) : (
            <GlassCard className="h-full flex flex-col items-center justify-center p-12 text-center">
              <StickyNote size={36} className="text-violet-400 mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">No note selected</h2>
              <p className="text-sm text-slate-400 mb-6">Create your first markdown note</p>
              <ShimmerButton onClick={create}>
                <Plus size={16} /> New Note
              </ShimmerButton>
            </GlassCard>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
