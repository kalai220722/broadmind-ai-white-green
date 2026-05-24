"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, Check, X, RotateCcw, Trophy, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import AppLayout from "@/components/layout/AppLayout";
import GlassCard from "@/components/ui/GlassCard";
import ShimmerButton from "@/components/ui/ShimmerButton";
import { celebrate } from "@/lib/confetti";
import { track } from "@/lib/personalization";

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

type Stage = "setup" | "playing" | "results";

export default function QuizPage() {
  const [stage, setStage] = useState<Stage>("setup");
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [isLoading, setIsLoading] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<{ correct: boolean; idx: number }[]>([]);

  const generate = async () => {
    if (!topic.trim()) {
      toast.error("Enter a topic");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, count, difficulty }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (!data.questions || data.questions.length === 0) throw new Error("No questions returned");

      setQuestions(data.questions);
      setCurrentIdx(0);
      setSelectedIdx(null);
      setShowResult(false);
      setAnswers([]);
      setStage("playing");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const submit = () => {
    if (selectedIdx === null) return;
    setShowResult(true);
    const correct = selectedIdx === questions[currentIdx].correctIndex;
    setAnswers((prev) => [...prev, { correct, idx: selectedIdx }]);
    track("quiz_answered", { topic, correct, difficulty });
    if (correct) toast.success("Correct!");
  };

  const nextQuestion = () => {
    if (currentIdx >= questions.length - 1) {
      const score = answers.filter((a) => a.correct).length;
      if (score >= Math.ceil(questions.length * 0.7)) celebrate();
      setStage("results");
      return;
    }
    setCurrentIdx((i) => i + 1);
    setSelectedIdx(null);
    setShowResult(false);
  };

  const reset = () => {
    setStage("setup");
    setTopic("");
    setQuestions([]);
    setAnswers([]);
  };

  const score = answers.filter((a) => a.correct).length;
  const percentage = questions.length ? Math.round((score / questions.length) * 100) : 0;

  return (
    <AppLayout title="Quiz Generator">
      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {/* Setup */}
          {stage === "setup" && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <GlassCard className="p-8" glow>
                <div className="text-center mb-6">
                  <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-600 mb-4">
                    <Sparkles size={20} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Generate a Quiz</h2>
                  <p className="text-sm text-slate-400">
                    AI-powered MCQs on any topic in any language
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1.5">Topic</label>
                    <input
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Photosynthesis, French Revolution, JavaScript closures"
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white outline-none focus:border-violet-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1.5">
                      Number of questions: {count}
                    </label>
                    <input
                      type="range"
                      min={3}
                      max={15}
                      value={count}
                      onChange={(e) => setCount(+e.target.value)}
                      className="w-full accent-violet-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1.5">Difficulty</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["easy", "medium", "hard"] as const).map((d) => (
                        <button
                          key={d}
                          onClick={() => setDifficulty(d)}
                          className={`py-2 rounded-lg text-sm font-medium capitalize transition ${
                            difficulty === d
                              ? "bg-gradient-to-r from-violet-600 to-cyan-600 text-white"
                              : "bg-white/5 text-slate-300 hover:bg-white/10"
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-center">
                  <ShimmerButton onClick={generate} disabled={isLoading || !topic.trim()} size="lg">
                    {isLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} /> Generate Quiz
                      </>
                    )}
                  </ShimmerButton>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Playing */}
          {stage === "playing" && questions[currentIdx] && (
            <motion.div
              key="playing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-400">
                  Question {currentIdx + 1} / {questions.length}
                </span>
                <div className="flex-1 mx-4 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-violet-500 to-cyan-500"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((currentIdx + (showResult ? 1 : 0)) / questions.length) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm text-emerald-400 font-medium">
                  {answers.filter((a) => a.correct).length} ✓
                </span>
              </div>

              <GlassCard className="p-8" glow>
                <h3 className="text-xl font-semibold text-white mb-6">
                  {questions[currentIdx].question}
                </h3>
                <div className="space-y-2">
                  {questions[currentIdx].options.map((opt, i) => {
                    const isSelected = selectedIdx === i;
                    const isCorrect = i === questions[currentIdx].correctIndex;
                    const showWrong = showResult && isSelected && !isCorrect;
                    const showRight = showResult && isCorrect;
                    return (
                      <motion.button
                        key={i}
                        whileHover={!showResult ? { x: 4 } : {}}
                        onClick={() => !showResult && setSelectedIdx(i)}
                        disabled={showResult}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${
                          showRight
                            ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-200"
                            : showWrong
                            ? "bg-rose-500/20 border-rose-500/50 text-rose-200"
                            : isSelected
                            ? "bg-violet-600/20 border-violet-500/50 text-white"
                            : "bg-white/5 border-white/10 text-slate-200 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold ${
                              showRight
                                ? "bg-emerald-500 text-white"
                                : showWrong
                                ? "bg-rose-500 text-white"
                                : isSelected
                                ? "bg-violet-500 text-white"
                                : "bg-white/10 text-slate-300"
                            }`}
                          >
                            {showRight ? <Check size={12} /> : showWrong ? <X size={12} /> : String.fromCharCode(65 + i)}
                          </span>
                          <span className="text-sm leading-relaxed">{opt}</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30"
                  >
                    <p className="text-xs uppercase tracking-widest text-cyan-300 mb-1">
                      Explanation
                    </p>
                    <p className="text-sm text-slate-200">{questions[currentIdx].explanation}</p>
                  </motion.div>
                )}

                <div className="mt-6 flex justify-end">
                  {!showResult ? (
                    <ShimmerButton onClick={submit} disabled={selectedIdx === null}>
                      Submit Answer
                    </ShimmerButton>
                  ) : (
                    <ShimmerButton onClick={nextQuestion}>
                      {currentIdx < questions.length - 1 ? "Next" : "Finish"}{" "}
                      <ChevronRight size={16} />
                    </ShimmerButton>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Results */}
          {stage === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <GlassCard className="p-10 text-center" glow>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="inline-flex p-4 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 mb-4"
                >
                  <Trophy size={28} className="text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h2>
                <p className="text-sm text-slate-400 mb-6">{topic}</p>
                <div className="text-6xl font-bold animate-gradient-text mb-2">{percentage}%</div>
                <p className="text-slate-300 mb-8">
                  {score} out of {questions.length} correct
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 text-left max-w-md mx-auto">
                  <Stat label="Correct" value={score} color="emerald" />
                  <Stat label="Wrong" value={questions.length - score} color="rose" />
                  <Stat label="Score" value={`${percentage}%`} color="violet" />
                </div>
                <div className="flex gap-3 justify-center">
                  <ShimmerButton onClick={reset} variant="secondary">
                    <RotateCcw size={16} /> New Quiz
                  </ShimmerButton>
                  <ShimmerButton onClick={() => { setStage("playing"); setCurrentIdx(0); setSelectedIdx(null); setShowResult(false); setAnswers([]); }}>
                    Retry
                  </ShimmerButton>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}

function Stat({ label, value, color }: { label: string; value: string | number; color: string }) {
  const colorClass: Record<string, string> = {
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    rose: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    violet: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  };
  return (
    <div className={`p-3 rounded-xl border ${colorClass[color]}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs uppercase tracking-widest opacity-70">{label}</div>
    </div>
  );
}
