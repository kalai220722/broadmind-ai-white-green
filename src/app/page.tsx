"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  Sparkles,
  ArrowRight,
  Zap,
  Globe2,
  Brain,
  Users,
  Languages,
  Award,
  Compass,
  Target,
  GitBranch,
  Layers,
  Telescope,
} from "lucide-react";
import Logo from "@/components/Logo";
import { MODULES } from "@/lib/constants";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import GradientOrbs from "@/components/ui/GradientOrbs";
import ShimmerButton from "@/components/ui/ShimmerButton";
import GlassCard from "@/components/ui/GlassCard";
import ThemeToggle from "@/components/ui/ThemeToggle";
import RobotHero from "@/components/ui/RobotHero";

const stats = [
  { value: "22+", label: "Languages", icon: Languages },
  { value: "17", label: "AI Modules", icon: Brain },
  { value: "Class 8", label: "→ PhD", icon: Layers },
  { value: "1", label: "Profile / You", icon: Target },
];

const highlights = [
  {
    icon: Brain,
    title: "Personalisation Engine",
    text: "Our ML profile learns how YOU learn — your pace, style, strengths — and adapts every lesson.",
    color: "from-violet-500 to-fuchsia-600",
  },
  {
    icon: Layers,
    title: "Every level of learning",
    text: "Class 8 to PhD. JEE to GATE to CAT to UPSC. Engineering, medicine, law, arts — all in one platform.",
    color: "from-cyan-500 to-blue-600",
  },
  {
    icon: Zap,
    title: "5 AI brains, one app",
    text: "Gemini, ChatGPT, Claude, Groq & Kimi. Pick the model that fits the question — or let us pick.",
    color: "from-pink-500 to-rose-600",
  },
  {
    icon: Languages,
    title: "22+ Indian languages",
    text: "Learn in Tamil, Hindi, Telugu, English, Bengali — the AI replies in whatever language you use.",
    color: "from-emerald-500 to-green-600",
  },
];

const personalizationSteps = [
  {
    icon: Telescope,
    title: "Observe",
    text: "Every question, every answer, every quiz, every flashcard — silently tracked on your device.",
  },
  {
    icon: Compass,
    title: "Model",
    text: "We build your Learning DNA: dominant style, pace, weak topics, best study hours.",
  },
  {
    icon: GitBranch,
    title: "Adapt",
    text: "Future lessons, examples, and recommendations bend to match how YOU absorb best.",
  },
];

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AnimatedBackground density={80} />
      <GradientOrbs />

      {/* Top nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/40 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <Logo size={36} />
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <a href="#personalisation" className="hover:text-white transition">Personalisation</a>
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#modules" className="hover:text-white transition">Modules</a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/dashboard">
              <ShimmerButton size="sm">
                Get Started <ArrowRight size={14} />
              </ShimmerButton>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <motion.section
        ref={heroRef}
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative pt-20 pb-32 px-6"
      >
        <div className="max-w-7xl mx-auto text-center">
          {/* Animated AI Robot mascot — talks on first visit */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="mb-8 flex justify-center"
          >
            <RobotHero />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium mb-6"
          >
            <Sparkles size={14} />
            ML-Personalised. Every level. Every language.
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
          >
            We learn how
            <br />
            <span className="animate-gradient-text">you learn.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10"
          >
            Our ML engine builds a private profile of your pace, style, and weak spots — then
            adapts every lesson to match. <span className="text-slate-200">Class 8 to PhD</span>,
            17 modules, 5 AI brains, 22+ Indian languages — all in one platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link href="/modules/doubt-solver">
              <ShimmerButton size="lg">
                Try Doubt Solver <ArrowRight size={18} />
              </ShimmerButton>
            </Link>
            <Link href="/dashboard">
              <ShimmerButton size="lg" variant="secondary">
                Explore Dashboard
              </ShimmerButton>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                whileHover={{ y: -4 }}
                className="rounded-xl border border-white/10 bg-slate-900/40 backdrop-blur-md p-5"
              >
                <s.icon size={20} className="text-violet-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white mb-1">{s.value}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Personalisation story */}
      <section id="personalisation" className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-medium mb-4">
              <Brain size={12} /> The BroadMind ML Engine
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              One profile. <span className="animate-gradient-text">One curriculum.</span> Just for you.
            </h2>
            <p className="text-slate-400 text-lg max-w-3xl mx-auto">
              Generic learning apps teach everyone the same way. BroadMind&apos;s ML engine watches how you
              think, finds your strongest path, and only then teaches you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
            {personalizationSteps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="p-6 h-full relative overflow-hidden">
                  <div className="absolute top-3 right-4 text-5xl font-bold text-violet-500/10">
                    0{i + 1}
                  </div>
                  <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/20 mb-4">
                    <s.icon size={20} className="text-violet-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{s.text}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Personalisation chip showcase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-6 md:p-10" glow>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    Your <span className="animate-gradient-text">Learning DNA</span>
                  </h3>
                  <p className="text-slate-400 mb-6">
                    Every interaction adds a data point. Within a week, BroadMind knows whether you
                    learn best from analogies, diagrams, step-by-step proofs, stories, or strict
                    definitions — and tunes every future answer to match.
                  </p>
                  <ul className="space-y-2.5 text-sm text-slate-300">
                    {[
                      "Learning style radar (5 dimensions)",
                      "Per-topic mastery tracking",
                      "Best-hour-of-day detection",
                      "Weak-area auto-detection → flashcards",
                      "Adaptive difficulty for quizzes",
                    ].map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <span className="text-emerald-400">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/modules/insights">
                    <ShimmerButton className="mt-6">
                      See your Learning DNA <ArrowRight size={14} />
                    </ShimmerButton>
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { tag: "💡 Analogy 28%", color: "violet" },
                    { tag: "👁️ Visual 22%", color: "cyan" },
                    { tag: "📋 Step 19%", color: "emerald" },
                    { tag: "📖 Story 17%", color: "amber" },
                    { tag: "🎓 Formal 14%", color: "rose" },
                    { tag: "⏰ Best @ 9am", color: "violet" },
                    { tag: "🔥 7-day streak", color: "rose" },
                    { tag: "⚡ Pace: medium", color: "cyan" },
                    { tag: "💪 Strong: calculus", color: "emerald" },
                    { tag: "🎯 Grow: organic chem", color: "amber" },
                  ].map((c) => (
                    <motion.div
                      key={c.tag}
                      whileHover={{ scale: 1.05 }}
                      className={`text-center p-2.5 rounded-lg bg-${c.color}-500/10 border border-${c.color}-500/20 text-${c.color}-300`}
                    >
                      {c.tag}
                    </motion.div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why <span className="animate-gradient-text">BroadMind?</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              One platform. Every AI model. Every subject. Every language.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {highlights.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="p-6 h-full" glow>
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${h.color} mb-4`}>
                    <h.icon size={20} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{h.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{h.text}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section id="modules" className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              16 <span className="animate-gradient-text">Powerful Modules</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              From doubt solving to study planning, every tool a student needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {MODULES.map((mod, i) => (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: (i % 8) * 0.05 }}
              >
                <Link href={mod.href}>
                  <GlassCard className="p-5 h-full cursor-pointer group">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2.5 rounded-xl bg-gradient-to-br ${mod.gradient} flex-shrink-0`}
                      >
                        <mod.icon size={18} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-white mb-1 group-hover:text-violet-300 transition">
                          {mod.name}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {mod.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {mod.features.slice(0, 2).map((f) => (
                        <span
                          key={f}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-slate-400"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="about" className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-10 md:p-16 text-center" glow>
            <Users size={36} className="text-violet-400 mx-auto mb-4" />
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Ready to <span className="animate-gradient-text">learn smarter?</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of students using BroadMind AI to master any subject in any language.
            </p>
            <Link href="/dashboard">
              <ShimmerButton size="lg">
                Launch BroadMind <ArrowRight size={18} />
              </ShimmerButton>
            </Link>
          </GlassCard>
        </div>
      </section>

      <footer className="relative py-10 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size={28} />
          <p className="text-xs text-slate-500">
            © 2026 BroadMind AI. Built with care for Indian students.
          </p>
        </div>
      </footer>
    </div>
  );
}
