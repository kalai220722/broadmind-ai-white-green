// ─────────────────────────────────────────────────────────────────────
// BroadMind Personalization Engine
// A lightweight, fully client-side learner model that adapts the
// platform to how each student learns. Records every interaction,
// computes a learning profile, and recommends next actions.
// ─────────────────────────────────────────────────────────────────────

"use client";

export type LearnStyle = "analogy" | "visual" | "stepByStep" | "storytelling" | "formal";
export type Pace = "slow" | "medium" | "fast";
export type SkillLevel = "beginner" | "intermediate" | "advanced";

export interface LearnerEvent {
  ts: number;
  kind:
    | "doubt_asked"
    | "doubt_image"
    | "doubt_voice"
    | "quiz_answered"
    | "flashcard_easy"
    | "flashcard_hard"
    | "pomodoro_completed"
    | "note_created"
    | "note_summarized"
    | "youtube_summarized"
    | "task_completed"
    | "module_visited"
    | "onboarding_answer";
  // arbitrary metadata
  meta?: Record<string, string | number | boolean>;
}

export interface Profile {
  // identity
  name: string;
  language: string;
  level: SkillLevel;

  // learning style — weighted preferences (0-100 each, sum = 100)
  style: Record<LearnStyle, number>;

  // pace
  pace: Pace;

  // strengths / weaknesses (by subject/topic, lower-cased keys)
  mastery: Record<string, number>; // 0-100

  // engagement
  totalSessions: number;
  streakDays: number;
  lastActive: number;
  bestHour: number | null; // hour-of-day when they learn most

  // achievements
  badges: string[];

  // counters
  counters: {
    doubtsSolved: number;
    quizzesTaken: number;
    flashcardsReviewed: number;
    pomodorosCompleted: number;
    notesWritten: number;
    minutesFocused: number;
  };

  createdAt: number;
}

const PROFILE_KEY = "bm-learner-profile";
const EVENTS_KEY = "bm-learner-events";
const MAX_EVENTS = 500;

// ── Defaults ──────────────────────────────────────────────────────────
function defaultProfile(): Profile {
  return {
    name: "Student",
    language: "English",
    level: "intermediate",
    style: { analogy: 20, visual: 20, stepByStep: 20, storytelling: 20, formal: 20 },
    pace: "medium",
    mastery: {},
    totalSessions: 0,
    streakDays: 0,
    lastActive: Date.now(),
    bestHour: null,
    badges: [],
    counters: {
      doubtsSolved: 0,
      quizzesTaken: 0,
      flashcardsReviewed: 0,
      pomodorosCompleted: 0,
      notesWritten: 0,
      minutesFocused: 0,
    },
    createdAt: Date.now(),
  };
}

// ── Storage helpers ───────────────────────────────────────────────────
function readProfile(): Profile {
  if (typeof window === "undefined") return defaultProfile();
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return defaultProfile();
    const p = JSON.parse(raw) as Profile;
    return { ...defaultProfile(), ...p, counters: { ...defaultProfile().counters, ...p.counters } };
  } catch {
    return defaultProfile();
  }
}

function writeProfile(p: Profile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  // notify any open windows
  window.dispatchEvent(new CustomEvent("bm-profile-update", { detail: p }));
}

function readEvents(): LearnerEvent[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(EVENTS_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeEvents(events: LearnerEvent[]) {
  if (typeof window === "undefined") return;
  const trimmed = events.slice(-MAX_EVENTS);
  localStorage.setItem(EVENTS_KEY, JSON.stringify(trimmed));
}

// ── Public API ───────────────────────────────────────────────────────

export function getProfile(): Profile {
  return readProfile();
}

export function getEvents(): LearnerEvent[] {
  return readEvents();
}

/**
 * Record an interaction. The engine updates the profile based on the
 * event type — counters, mastery, style preferences, streak, etc.
 */
export function track(kind: LearnerEvent["kind"], meta?: LearnerEvent["meta"]) {
  if (typeof window === "undefined") return;

  const events = readEvents();
  const event: LearnerEvent = { ts: Date.now(), kind, meta };
  events.push(event);
  writeEvents(events);

  const p = readProfile();

  // Update lastActive + streak
  const today = new Date(Date.now()).toDateString();
  const lastDay = new Date(p.lastActive).toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (today !== lastDay) {
    p.streakDays = lastDay === yesterday ? p.streakDays + 1 : 1;
    p.totalSessions += 1;
  }
  p.lastActive = Date.now();

  // bestHour rolling — keep simple by tracking the mode of hours from events
  const hourCounts: Record<number, number> = {};
  for (const e of events.slice(-100)) {
    const h = new Date(e.ts).getHours();
    hourCounts[h] = (hourCounts[h] || 0) + 1;
  }
  let bestH = -1;
  let bestC = 0;
  for (const [hStr, c] of Object.entries(hourCounts)) {
    if (c > bestC) {
      bestC = c;
      bestH = parseInt(hStr, 10);
    }
  }
  p.bestHour = bestH >= 0 ? bestH : null;

  // Per-event updates
  switch (kind) {
    case "doubt_asked":
      p.counters.doubtsSolved += 1;
      // long, formal questions push formal style; short, "explain like..." push analogy
      if (typeof meta?.length === "number" && meta.length > 200) shiftStyle(p, "formal", 2);
      if (typeof meta?.prompt === "string" && /explain|simple|easy|analog/i.test(meta.prompt))
        shiftStyle(p, "analogy", 3);
      if (typeof meta?.topic === "string") bumpMastery(p, meta.topic, +1);
      break;

    case "doubt_image":
      p.counters.doubtsSolved += 1;
      shiftStyle(p, "visual", 4);
      break;

    case "doubt_voice":
      shiftStyle(p, "storytelling", 3);
      break;

    case "quiz_answered":
      p.counters.quizzesTaken += 1;
      if (typeof meta?.topic === "string") {
        const correct = meta.correct === true;
        bumpMastery(p, meta.topic, correct ? +8 : -4);
      }
      if (meta?.correct === true) shiftStyle(p, "stepByStep", 1);
      break;

    case "flashcard_easy":
      p.counters.flashcardsReviewed += 1;
      if (typeof meta?.deck === "string") bumpMastery(p, meta.deck, +3);
      break;

    case "flashcard_hard":
      p.counters.flashcardsReviewed += 1;
      if (typeof meta?.deck === "string") bumpMastery(p, meta.deck, -2);
      break;

    case "pomodoro_completed":
      p.counters.pomodorosCompleted += 1;
      p.counters.minutesFocused += typeof meta?.minutes === "number" ? meta.minutes : 25;
      break;

    case "note_created":
      p.counters.notesWritten += 1;
      shiftStyle(p, "formal", 1);
      break;

    case "note_summarized":
      shiftStyle(p, "stepByStep", 2);
      break;

    case "youtube_summarized":
      shiftStyle(p, "visual", 2);
      shiftStyle(p, "storytelling", 1);
      break;

    case "task_completed":
      // small generic engagement
      break;

    case "onboarding_answer":
      if (typeof meta?.style === "string") {
        shiftStyle(p, meta.style as LearnStyle, 18);
      }
      if (typeof meta?.pace === "string") {
        p.pace = meta.pace as Pace;
      }
      if (typeof meta?.level === "string") {
        p.level = meta.level as SkillLevel;
      }
      if (typeof meta?.language === "string") {
        p.language = meta.language;
      }
      if (typeof meta?.name === "string" && meta.name.trim().length > 0) {
        p.name = String(meta.name).trim();
      }
      break;
  }

  // Recompute pace from recent counters
  if (p.counters.doubtsSolved + p.counters.quizzesTaken >= 6) {
    const recent = events.slice(-25).filter((e) => e.kind === "doubt_asked" || e.kind === "quiz_answered");
    if (recent.length >= 2) {
      const intervals: number[] = [];
      for (let i = 1; i < recent.length; i++) intervals.push(recent[i].ts - recent[i - 1].ts);
      const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      // <30s → fast, 30–90s → medium, >90s → slow
      p.pace = avg < 30000 ? "fast" : avg < 90000 ? "medium" : "slow";
    }
  }

  // Re-evaluate badges
  p.badges = computeBadges(p);

  writeProfile(p);
}

function shiftStyle(p: Profile, style: LearnStyle, amount: number) {
  const styles = Object.keys(p.style) as LearnStyle[];
  // Add `amount` to chosen, subtract proportionally from the rest
  p.style[style] = Math.min(80, p.style[style] + amount);
  const others = styles.filter((s) => s !== style);
  const per = amount / others.length;
  for (const s of others) {
    p.style[s] = Math.max(5, p.style[s] - per);
  }
  // Normalize to sum ≈ 100
  const sum = styles.reduce((a, s) => a + p.style[s], 0);
  if (sum > 0) {
    for (const s of styles) p.style[s] = Math.round((p.style[s] / sum) * 100);
  }
}

function bumpMastery(p: Profile, topic: string, delta: number) {
  const key = topic.toLowerCase().slice(0, 32);
  const cur = p.mastery[key] ?? 50;
  p.mastery[key] = Math.max(0, Math.min(100, cur + delta));
}

function computeBadges(p: Profile): string[] {
  const earned: string[] = [];
  if (p.counters.doubtsSolved >= 1) earned.push("first-doubt");
  if (p.counters.doubtsSolved >= 25) earned.push("doubt-slayer");
  if (p.counters.quizzesTaken >= 5) earned.push("quiz-champ");
  if (p.counters.flashcardsReviewed >= 20) earned.push("flashcard-pro");
  if (p.counters.pomodorosCompleted >= 4) earned.push("focused");
  if (p.counters.pomodorosCompleted >= 20) earned.push("zen-master");
  if (p.counters.notesWritten >= 3) earned.push("notetaker");
  if (p.streakDays >= 3) earned.push("on-fire");
  if (p.streakDays >= 7) earned.push("week-warrior");
  if (p.streakDays >= 30) earned.push("legendary");
  if (p.counters.minutesFocused >= 60) earned.push("hour-focused");
  if (p.counters.minutesFocused >= 600) earned.push("ten-hour-club");
  return earned;
}

export const ALL_BADGES: { id: string; label: string; emoji: string; description: string }[] = [
  { id: "first-doubt", label: "First Doubt", emoji: "💡", description: "Asked your first question" },
  { id: "doubt-slayer", label: "Doubt Slayer", emoji: "⚔️", description: "Solved 25 doubts" },
  { id: "quiz-champ", label: "Quiz Champ", emoji: "🏆", description: "Completed 5 quizzes" },
  { id: "flashcard-pro", label: "Card Master", emoji: "🎴", description: "Reviewed 20 flashcards" },
  { id: "focused", label: "Focused", emoji: "🎯", description: "4 Pomodoros done" },
  { id: "zen-master", label: "Zen Master", emoji: "🧘", description: "20 Pomodoros done" },
  { id: "notetaker", label: "Notetaker", emoji: "📝", description: "Wrote 3 notes" },
  { id: "on-fire", label: "On Fire", emoji: "🔥", description: "3 day streak" },
  { id: "week-warrior", label: "Week Warrior", emoji: "⚡", description: "7 day streak" },
  { id: "legendary", label: "Legendary", emoji: "🌟", description: "30 day streak" },
  { id: "hour-focused", label: "Deep Work", emoji: "⏱️", description: "60 min focused" },
  { id: "ten-hour-club", label: "10-Hour Club", emoji: "💎", description: "10 hours focused" },
];

// ── Recommendations ──────────────────────────────────────────────────
export interface Recommendation {
  id: string;
  href: string;
  title: string;
  reason: string;
  emoji: string;
}

export function getRecommendations(p: Profile): Recommendation[] {
  const recs: Recommendation[] = [];
  const visited = readEvents().filter((e) => e.kind === "module_visited").map((e) => e.meta?.id);

  // Weak subjects → suggest flashcards
  const weak = Object.entries(p.mastery)
    .filter(([, v]) => v < 40)
    .sort((a, b) => a[1] - b[1]);
  if (weak.length > 0) {
    recs.push({
      id: "weak",
      href: "/modules/flashcards",
      title: `Strengthen ${weak[0][0]}`,
      reason: `Your mastery is at ${weak[0][1]}% — flashcards will help`,
      emoji: "💪",
    });
  }

  // No quiz yet → suggest quiz
  if (p.counters.quizzesTaken === 0) {
    recs.push({
      id: "first-quiz",
      href: "/modules/quiz",
      title: "Take your first quiz",
      reason: "Test what you know in any subject",
      emoji: "🎯",
    });
  }

  // Low focus → pomodoro
  if (p.counters.pomodorosCompleted < 3) {
    recs.push({
      id: "pomodoro",
      href: "/modules/pomodoro",
      title: "Try a focus session",
      reason: "25 minutes of distraction-free study",
      emoji: "🍅",
    });
  }

  // No doubts asked → doubt solver
  if (p.counters.doubtsSolved === 0) {
    recs.push({
      id: "first-doubt",
      href: "/modules/doubt-solver",
      title: "Ask your first doubt",
      reason: "Get instant answers in any language",
      emoji: "💬",
    });
  }

  // Style-based suggestions
  const topStyle = (Object.entries(p.style) as [LearnStyle, number][]).sort(
    (a, b) => b[1] - a[1]
  )[0][0];
  if (topStyle === "visual" && !visited.includes("youtube")) {
    recs.push({
      id: "yt",
      href: "/modules/youtube",
      title: "Try YouTube Summarizer",
      reason: "You learn best from visual content",
      emoji: "📺",
    });
  }
  if (topStyle === "stepByStep") {
    recs.push({
      id: "planner",
      href: "/modules/planner",
      title: "Plan your week",
      reason: "Step-by-step planning suits your style",
      emoji: "📅",
    });
  }

  return recs.slice(0, 4);
}

// ── Insights ─────────────────────────────────────────────────────────
export interface Insight {
  emoji: string;
  text: string;
}

export function getDailyInsight(p: Profile): Insight {
  const insights: Insight[] = [];

  if (p.bestHour !== null) {
    const period = p.bestHour < 12 ? "morning" : p.bestHour < 17 ? "afternoon" : "evening";
    insights.push({
      emoji: "⏰",
      text: `You learn best in the ${period} (around ${p.bestHour}:00)`,
    });
  }

  if (p.streakDays >= 3) {
    insights.push({
      emoji: "🔥",
      text: `${p.streakDays}-day streak! Consistency is your superpower.`,
    });
  }

  const topStyle = (Object.entries(p.style) as [LearnStyle, number][]).sort(
    (a, b) => b[1] - a[1]
  )[0];
  const styleNames: Record<LearnStyle, string> = {
    analogy: "Analogy-based",
    visual: "Visual",
    stepByStep: "Step-by-step",
    storytelling: "Storytelling",
    formal: "Formal definition",
  };
  insights.push({
    emoji: "🎓",
    text: `Your dominant style: ${styleNames[topStyle[0]]} (${topStyle[1]}%)`,
  });

  if (p.counters.minutesFocused > 0) {
    const hrs = (p.counters.minutesFocused / 60).toFixed(1);
    insights.push({
      emoji: "⏱️",
      text: `${hrs}h of focused study so far`,
    });
  }

  const strong = Object.entries(p.mastery).sort((a, b) => b[1] - a[1])[0];
  if (strong && strong[1] > 60) {
    insights.push({
      emoji: "💪",
      text: `Strongest topic: ${strong[0]} (${strong[1]}% mastery)`,
    });
  }

  if (insights.length === 0) {
    return { emoji: "✨", text: "Start using BroadMind — I'll learn how you learn." };
  }

  // pick rotating insight based on day
  const idx = Math.floor(Date.now() / 86400000) % insights.length;
  return insights[idx];
}

// ── React hook ───────────────────────────────────────────────────────
import { useEffect, useState } from "react";

export function useProfile(): Profile {
  const [p, setP] = useState<Profile>(defaultProfile);
  useEffect(() => {
    setP(readProfile());
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<Profile>).detail;
      if (detail) setP(detail);
    };
    window.addEventListener("bm-profile-update", handler);
    window.addEventListener("storage", () => setP(readProfile()));
    return () => {
      window.removeEventListener("bm-profile-update", handler);
    };
  }, []);
  return p;
}

export function resetProfile() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(EVENTS_KEY);
  window.dispatchEvent(new CustomEvent("bm-profile-update", { detail: defaultProfile() }));
}
