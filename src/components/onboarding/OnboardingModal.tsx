"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Check, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import GlassCard from "@/components/ui/GlassCard";
import ShimmerButton from "@/components/ui/ShimmerButton";
import { track, type LearnStyle, type Pace, type SkillLevel } from "@/lib/personalization";
import { celebrate } from "@/lib/confetti";

const ONBOARDED_KEY = "bm-onboarded";

interface Step {
  id: string;
  question: string;
  type: "text" | "choice";
  choices?: { label: string; emoji: string; value: string; helper?: string }[];
  field: "name" | "language" | "level" | "style" | "pace";
}

const STEPS: Step[] = [
  {
    id: "name",
    question: "Hi 👋 What's your name?",
    type: "text",
    field: "name",
  },
  {
    id: "language",
    question: "Which language do you prefer to learn in?",
    type: "choice",
    field: "language",
    choices: [
      { label: "English", emoji: "🇬🇧", value: "English" },
      { label: "Tamil", emoji: "🇮🇳", value: "Tamil" },
      { label: "Hindi", emoji: "🇮🇳", value: "Hindi" },
      { label: "Telugu", emoji: "🇮🇳", value: "Telugu" },
      { label: "Mix English + my language", emoji: "🌐", value: "Mixed" },
    ],
  },
  {
    id: "level",
    question: "What level are you studying at?",
    type: "choice",
    field: "level",
    choices: [
      { label: "School (Class 8–12)", emoji: "🎒", value: "beginner", helper: "Foundations & exam prep" },
      { label: "Undergraduate", emoji: "🎓", value: "intermediate", helper: "College / competitive exams" },
      { label: "Postgrad / PhD / Pro", emoji: "🔬", value: "advanced", helper: "Deep specialisation" },
    ],
  },
  {
    id: "style",
    question: "How do you understand things best?",
    type: "choice",
    field: "style",
    choices: [
      {
        label: "Analogies & examples",
        emoji: "💡",
        value: "analogy",
        helper: "\"Explain it like cricket\"",
      },
      { label: "Pictures & diagrams", emoji: "👁️", value: "visual", helper: "Show me, don't tell me" },
      { label: "Step-by-step breakdown", emoji: "📋", value: "stepByStep", helper: "Logic-by-logic" },
      { label: "Stories & narratives", emoji: "📖", value: "storytelling", helper: "Context first" },
      { label: "Strict definitions", emoji: "🎓", value: "formal", helper: "Textbook-precise" },
    ],
  },
  {
    id: "pace",
    question: "What's your usual pace?",
    type: "choice",
    field: "pace",
    choices: [
      { label: "Slow & deep", emoji: "🐢", value: "slow", helper: "I like to ponder" },
      { label: "Steady", emoji: "🚶", value: "medium", helper: "Balanced rhythm" },
      { label: "Fast", emoji: "🐇", value: "fast", helper: "Quick fire, lots of questions" },
    ],
  },
];

export default function OnboardingModal() {
  const [open, setOpen] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // Show on first run only
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onboarded = localStorage.getItem(ONBOARDED_KEY);
    if (!onboarded) {
      const t = setTimeout(() => setOpen(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const step = STEPS[stepIdx];
  const current = answers[step?.field] || "";

  const next = () => {
    if (!current) {
      toast.error("Pick an option to continue");
      return;
    }
    if (stepIdx < STEPS.length - 1) {
      setStepIdx((i) => i + 1);
    } else {
      finish();
    }
  };

  const back = () => {
    if (stepIdx > 0) setStepIdx((i) => i - 1);
  };

  const finish = () => {
    setSubmitting(true);
    track("onboarding_answer", {
      name: answers.name,
      language: answers.language,
      level: answers.level as SkillLevel,
      style: answers.style as LearnStyle,
      pace: answers.pace as Pace,
    });
    localStorage.setItem(ONBOARDED_KEY, "true");
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
      celebrate();
    }, 800);
  };

  const skip = () => {
    localStorage.setItem(ONBOARDED_KEY, "skipped");
    setOpen(false);
  };

  const close = () => {
    localStorage.setItem(ONBOARDED_KEY, "true");
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            className="w-full max-w-lg"
          >
            <GlassCard className="p-7 md:p-9" glow>
              {!done ? (
                <>
                  {/* Progress */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-1.5">
                      {STEPS.map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 rounded-full transition-all ${
                            i <= stepIdx
                              ? "bg-gradient-to-r from-violet-500 to-cyan-500 w-8"
                              : "bg-white/10 w-4"
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={skip}
                      className="text-[11px] text-slate-500 hover:text-white"
                    >
                      Skip
                    </button>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-[11px] text-violet-200 mb-4">
                    <Sparkles size={11} />
                    {stepIdx === 0
                      ? "Welcome to BroadMind"
                      : `Step ${stepIdx + 1} of ${STEPS.length}`}
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-2">{step.question}</h2>
                  {stepIdx === 0 && (
                    <p className="text-sm text-slate-400 mb-6">
                      30 seconds to set up the ML engine that&apos;ll personalise your learning.
                    </p>
                  )}

                  {step.type === "text" ? (
                    <input
                      autoFocus
                      value={current}
                      onChange={(e) => setAnswers({ ...answers, [step.field]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") next();
                      }}
                      placeholder="Type your name..."
                      className="w-full mt-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-base text-white outline-none focus:border-violet-500/60 placeholder-slate-500"
                    />
                  ) : (
                    <div className="space-y-2 mt-3 max-h-[50vh] overflow-y-auto scrollbar-thin">
                      {step.choices?.map((c) => {
                        const selected = current === c.value;
                        return (
                          <motion.button
                            key={c.value}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setAnswers({ ...answers, [step.field]: c.value })}
                            className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                              selected
                                ? "bg-violet-600/20 border-violet-500/50"
                                : "bg-white/5 border-white/10 hover:bg-white/10"
                            }`}
                          >
                            <span className="text-2xl flex-shrink-0">{c.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <div
                                className={`text-sm font-medium ${
                                  selected ? "text-white" : "text-slate-200"
                                }`}
                              >
                                {c.label}
                              </div>
                              {c.helper && (
                                <div className="text-[11px] text-slate-500 mt-0.5">{c.helper}</div>
                              )}
                            </div>
                            {selected && (
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                                <Check size={12} className="text-white" />
                              </div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-6">
                    {stepIdx > 0 ? (
                      <button
                        onClick={back}
                        className="text-sm text-slate-400 hover:text-white"
                      >
                        ← Back
                      </button>
                    ) : (
                      <span />
                    )}
                    <ShimmerButton onClick={next} disabled={!current || submitting}>
                      {submitting ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <>
                          {stepIdx === STEPS.length - 1 ? "Finish" : "Next"}{" "}
                          <ArrowRight size={14} />
                        </>
                      )}
                    </ShimmerButton>
                  </div>
                </>
              ) : (
                /* Done screen */
                <div className="text-center py-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 14 }}
                    className="inline-flex p-5 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 mb-5"
                  >
                    <Sparkles size={28} className="text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    All set, <span className="animate-gradient-text">{answers.name}!</span>
                  </h2>
                  <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto">
                    The ML engine is now tuning to your style. Your Learning DNA will grow with every
                    question you ask.
                  </p>
                  <ShimmerButton onClick={close} size="lg">
                    Start learning <ArrowRight size={16} />
                  </ShimmerButton>
                </div>
              )}
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
