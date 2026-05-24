"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Layers,
  Trash2,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  Edit3,
  Save,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import AppLayout from "@/components/layout/AppLayout";
import GlassCard from "@/components/ui/GlassCard";
import ShimmerButton from "@/components/ui/ShimmerButton";
import { smallConfetti } from "@/lib/confetti";

interface Card {
  id: string;
  front: string;
  back: string;
  easy: number; // SRS counter
  hard: number;
}

interface Deck {
  id: string;
  name: string;
  cards: Card[];
  createdAt: number;
}

function id() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function FlashcardsPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [activeDeckId, setActiveDeckId] = useState<string | null>(null);
  const [studyMode, setStudyMode] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(8);
  const [isGenerating, setIsGenerating] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFront, setEditFront] = useState("");
  const [editBack, setEditBack] = useState("");

  const activeDeck = decks.find((d) => d.id === activeDeckId);
  const currentCard = activeDeck?.cards[currentIdx];

  useEffect(() => {
    const stored = localStorage.getItem("bm-decks");
    if (stored) {
      try {
        const parsed: Deck[] = JSON.parse(stored);
        setDecks(parsed);
        if (parsed.length > 0) setActiveDeckId(parsed[0].id);
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (decks.length > 0) localStorage.setItem("bm-decks", JSON.stringify(decks));
  }, [decks]);

  const generateDeck = async () => {
    if (!topic.trim()) {
      toast.error("Enter a topic");
      return;
    }
    setIsGenerating(true);
    try {
      const res = await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, count }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (!data.cards || data.cards.length === 0) throw new Error("No cards generated");

      const newDeck: Deck = {
        id: id(),
        name: topic,
        cards: data.cards.map((c: { front: string; back: string }) => ({
          id: id(),
          front: c.front,
          back: c.back,
          easy: 0,
          hard: 0,
        })),
        createdAt: Date.now(),
      };
      setDecks((prev) => [newDeck, ...prev]);
      setActiveDeckId(newDeck.id);
      setShowCreate(false);
      setTopic("");
      smallConfetti();
      toast.success(`Created "${topic}" with ${newDeck.cards.length} cards`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to generate";
      toast.error(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteDeck = (deckId: string) => {
    setDecks((prev) => prev.filter((d) => d.id !== deckId));
    if (deckId === activeDeckId) {
      setActiveDeckId(decks[0]?.id || null);
    }
    toast.success("Deck deleted");
  };

  const startStudy = () => {
    if (!activeDeck || activeDeck.cards.length === 0) return;
    setCurrentIdx(0);
    setFlipped(false);
    setStudyMode(true);
  };

  const next = () => {
    if (!activeDeck) return;
    if (currentIdx >= activeDeck.cards.length - 1) {
      smallConfetti();
      toast.success("Deck completed! 🎉");
      setStudyMode(false);
      return;
    }
    setCurrentIdx((i) => i + 1);
    setFlipped(false);
  };

  const prev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((i) => i - 1);
      setFlipped(false);
    }
  };

  const rate = (easy: boolean) => {
    if (!activeDeck || !currentCard) return;
    setDecks((prev) =>
      prev.map((d) =>
        d.id === activeDeck.id
          ? {
              ...d,
              cards: d.cards.map((c, i) =>
                i === currentIdx
                  ? { ...c, easy: easy ? c.easy + 1 : c.easy, hard: !easy ? c.hard + 1 : c.hard }
                  : c
              ),
            }
          : d
      )
    );
    next();
  };

  const startEdit = (card: Card) => {
    setEditingId(card.id);
    setEditFront(card.front);
    setEditBack(card.back);
  };

  const saveEdit = () => {
    if (!activeDeck || !editingId) return;
    setDecks((prev) =>
      prev.map((d) =>
        d.id === activeDeck.id
          ? {
              ...d,
              cards: d.cards.map((c) =>
                c.id === editingId ? { ...c, front: editFront, back: editBack } : c
              ),
            }
          : d
      )
    );
    setEditingId(null);
    toast.success("Card updated");
  };

  const deleteCard = (cardId: string) => {
    if (!activeDeck) return;
    setDecks((prev) =>
      prev.map((d) =>
        d.id === activeDeck.id
          ? { ...d, cards: d.cards.filter((c) => c.id !== cardId) }
          : d
      )
    );
  };

  return (
    <AppLayout title="Flashcards">
      <div className="max-w-7xl mx-auto">
        {!studyMode ? (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
            {/* Decks list */}
            <aside className="space-y-3">
              <ShimmerButton onClick={() => setShowCreate(true)} className="w-full">
                <Plus size={16} /> New Deck
              </ShimmerButton>
              <GlassCard className="p-3 max-h-[70vh] overflow-y-auto scrollbar-thin">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3 px-2">
                  Your Decks ({decks.length})
                </h3>
                {decks.length === 0 ? (
                  <p className="text-xs text-slate-500 p-3 text-center">No decks yet</p>
                ) : (
                  <div className="space-y-1.5">
                    {decks.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setActiveDeckId(d.id)}
                        className={`group w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between transition ${
                          d.id === activeDeckId
                            ? "bg-violet-600/20 text-white"
                            : "text-slate-300 hover:bg-white/5"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{d.name}</div>
                          <div className="text-[10px] text-slate-500">{d.cards.length} cards</div>
                        </div>
                        <Trash2
                          size={12}
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteDeck(d.id);
                          }}
                          className="opacity-0 group-hover:opacity-60 hover:opacity-100 hover:text-rose-400 cursor-pointer"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </GlassCard>
            </aside>

            {/* Main */}
            <div>
              {activeDeck ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{activeDeck.name}</h2>
                      <p className="text-sm text-slate-400">{activeDeck.cards.length} cards</p>
                    </div>
                    <ShimmerButton onClick={startStudy} disabled={activeDeck.cards.length === 0}>
                      <Sparkles size={16} /> Study Now
                    </ShimmerButton>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeDeck.cards.map((c) => (
                      <GlassCard key={c.id} className="p-4">
                        {editingId === c.id ? (
                          <div className="space-y-2">
                            <input
                              value={editFront}
                              onChange={(e) => setEditFront(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white outline-none"
                              placeholder="Front"
                            />
                            <textarea
                              value={editBack}
                              onChange={(e) => setEditBack(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white outline-none"
                              rows={3}
                              placeholder="Back"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={saveEdit}
                                className="flex items-center gap-1 px-3 py-1 rounded-md bg-emerald-600/20 text-emerald-300 text-xs"
                              >
                                <Save size={12} /> Save
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="flex items-center gap-1 px-3 py-1 rounded-md bg-white/5 text-slate-300 text-xs"
                              >
                                <X size={12} /> Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="text-sm font-semibold text-white flex-1">{c.front}</h4>
                              <div className="flex gap-1 ml-2">
                                <button
                                  onClick={() => startEdit(c)}
                                  className="text-slate-500 hover:text-white"
                                >
                                  <Edit3 size={12} />
                                </button>
                                <button
                                  onClick={() => deleteCard(c.id)}
                                  className="text-slate-500 hover:text-rose-400"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-slate-400">{c.back}</p>
                            {(c.easy > 0 || c.hard > 0) && (
                              <div className="flex gap-3 mt-3 text-[10px]">
                                <span className="text-emerald-400">✓ {c.easy}</span>
                                <span className="text-rose-400">✗ {c.hard}</span>
                              </div>
                            )}
                          </>
                        )}
                      </GlassCard>
                    ))}
                  </div>
                </>
              ) : (
                <GlassCard className="p-12 text-center">
                  <Layers size={36} className="mx-auto text-violet-400 mb-4" />
                  <h2 className="text-xl font-bold text-white mb-2">No deck selected</h2>
                  <p className="text-sm text-slate-400 mb-6">Create your first AI-generated deck</p>
                  <ShimmerButton onClick={() => setShowCreate(true)}>
                    <Plus size={16} /> Create Deck
                  </ShimmerButton>
                </GlassCard>
              )}
            </div>
          </div>
        ) : (
          // Study mode
          <div className="max-w-3xl mx-auto py-8">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setStudyMode(false)}
                className="text-sm text-slate-400 hover:text-white flex items-center gap-1"
              >
                <ChevronLeft size={14} /> Exit
              </button>
              <span className="text-sm text-slate-400">
                {currentIdx + 1} / {activeDeck?.cards.length}
              </span>
            </div>

            <div className="flex justify-center mb-8">
              <div
                className={`flip-card ${flipped ? "flipped" : ""}`}
                style={{ width: "min(550px, 90vw)", height: "320px" }}
                onClick={() => setFlipped((f) => !f)}
              >
                <div className="flip-card-inner cursor-pointer">
                  <div className="flip-card-front">
                    <GlassCard glow className="h-full flex flex-col items-center justify-center p-8">
                      <span className="text-xs uppercase tracking-widest text-violet-400 mb-4">
                        Question
                      </span>
                      <p className="text-2xl font-semibold text-white text-center">
                        {currentCard?.front}
                      </p>
                      <span className="text-xs text-slate-500 mt-6">Tap to reveal</span>
                    </GlassCard>
                  </div>
                  <div className="flip-card-back">
                    <GlassCard glow className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-violet-900/40 to-cyan-900/40">
                      <span className="text-xs uppercase tracking-widest text-cyan-400 mb-4">
                        Answer
                      </span>
                      <p className="text-lg text-white text-center leading-relaxed">
                        {currentCard?.back}
                      </p>
                    </GlassCard>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <ShimmerButton onClick={prev} variant="secondary" disabled={currentIdx === 0}>
                <ChevronLeft size={16} /> Prev
              </ShimmerButton>
              {flipped ? (
                <>
                  <ShimmerButton onClick={() => rate(false)} variant="secondary">
                    <ThumbsDown size={16} /> Hard
                  </ShimmerButton>
                  <ShimmerButton onClick={() => rate(true)}>
                    <ThumbsUp size={16} /> Easy
                  </ShimmerButton>
                </>
              ) : (
                <ShimmerButton onClick={next}>
                  Next <ChevronRight size={16} />
                </ShimmerButton>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => !isGenerating && setShowCreate(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <GlassCard className="p-6" glow>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Sparkles size={18} className="text-violet-400" /> Generate Flashcards
                </h2>
                <div className="space-y-3 mb-5">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Topic</label>
                    <input
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Photosynthesis, JavaScript Promises, Tamil grammar"
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white outline-none focus:border-violet-500/50"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">
                      Number of cards: {count}
                    </label>
                    <input
                      type="range"
                      min={4}
                      max={20}
                      value={count}
                      onChange={(e) => setCount(+e.target.value)}
                      className="w-full accent-violet-500"
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowCreate(false)}
                    disabled={isGenerating}
                    className="px-4 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <ShimmerButton onClick={generateDeck} disabled={isGenerating || !topic.trim()}>
                    {isGenerating ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} /> Generate
                      </>
                    )}
                  </ShimmerButton>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
