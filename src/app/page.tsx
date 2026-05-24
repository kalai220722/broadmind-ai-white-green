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
} from "lucide-react";
import Logo from "@/components/Logo";
import { MODULES } from "@/lib/constants";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import GradientOrbs from "@/components/ui/GradientOrbs";
import ShimmerButton from "@/components/ui/ShimmerButton";
import GlassCard from "@/components/ui/GlassCard";
import ThemeToggle from "@/components/ui/ThemeToggle";

const stats = [
  { value: "22+", label: "Languages", icon: Languages },
  { value: "16", label: "AI Modules", icon: Brain },
  { value: "100+", label: "Subjects", icon: Award },
  { value: "5", label: "AI Models", icon: Zap },
];

const highlights = [
  {
    icon: Brain,
    title: "Multi-AI Brain",
    text: "Gemini, ChatGPT, Claude, Groq & Kimi all in one place. Switch instantly.",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: Languages,
    title: "22+ Languages",
    text: "Learn in Tamil, Hindi, Telugu, English — the AI speaks your language.",
    color: "from-cyan-500 to-blue-600",
  },
  {
    icon: Zap,
    title: "Instant Answers",
    text: "Step-by-step solutions with formulas, code, and visualizations.",
    color: "from-pink-500 to-rose-600",
  },
  {
    icon: Globe2,
    title: "Every Discipline",
    text: "Math, science, code, medicine, law, arts — Class 8 to PhD.",
    color: "from-emerald-500 to-green-600",
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
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#modules" className="hover:text-white transition">Modules</a>
            <a href="#about" className="hover:text-white transition">About</a>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium mb-6"
          >
            <Sparkles size={14} />
            India&apos;s First Unified AI Learning Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
          >
            Learn anything,
            <br />
            <span className="animate-gradient-text">in any language.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10"
          >
            16 AI-powered modules. 5 frontier models. 22+ Indian languages.
            Doubt solving, flashcards, quizzes, study plans — all in one unified platform.
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
