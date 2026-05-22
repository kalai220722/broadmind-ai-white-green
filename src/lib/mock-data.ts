import type { StudentProfile, ModuleProgress, ActivityItem } from "./types";

export const mockStudent: StudentProfile = {
  id: "stu_001",
  name: "Kalairajan",
  email: "kalairajan@example.com",
  level: "engineering",
  language: "Tamil",
  grade: "3rd Year",
  institution: "PSG College of Technology",
  joinedAt: "2026-01-15",
  streakDays: 42,
  totalSessions: 187,
  totalMinutes: 4520,
  pedagogyVector: {
    analogy: 0.85,
    visual: 0.72,
    stepByStep: 0.60,
    storytelling: 0.40,
    formal: 0.25,
  },
};

export const mockProgress: ModuleProgress[] = [
  { moduleId: "avatar-tutor", completedTopics: 24, totalTopics: 40, lastAccessed: "2026-05-22T10:30:00", timeSpent: 840, accuracy: 0.88 },
  { moduleId: "code-builder", completedTopics: 18, totalTopics: 35, lastAccessed: "2026-05-21T15:45:00", timeSpent: 1200, accuracy: 0.76 },
  { moduleId: "doubt-solver", completedTopics: 156, totalTopics: 156, lastAccessed: "2026-05-22T09:00:00", timeSpent: 320, accuracy: 0.92 },
  { moduleId: "visualisation", completedTopics: 12, totalTopics: 30, lastAccessed: "2026-05-20T14:20:00", timeSpent: 560, accuracy: 0.85 },
  { moduleId: "exam-assistant", completedTopics: 45, totalTopics: 120, lastAccessed: "2026-05-22T08:00:00", timeSpent: 980, accuracy: 0.71 },
  { moduleId: "engineering", completedTopics: 30, totalTopics: 50, lastAccessed: "2026-05-21T20:00:00", timeSpent: 620, accuracy: 0.82 },
];

export const mockActivity: ActivityItem[] = [
  { id: "1", type: "doubt", title: "Solved: Kirchhoff's Current Law derivation", module: "Engineering", timestamp: "2026-05-22T10:30:00" },
  { id: "2", type: "code", title: "Completed: Binary Search Tree Implementation", module: "Code Builder", timestamp: "2026-05-22T09:15:00", score: 95 },
  { id: "3", type: "quiz", title: "GATE Mock Test: Digital Electronics", module: "Exam Assistant", timestamp: "2026-05-21T20:00:00", score: 78 },
  { id: "4", type: "video", title: "Watched: Fourier Transform explained with music analogy", module: "Avatar Tutor", timestamp: "2026-05-21T18:30:00" },
  { id: "5", type: "exam", title: "Completed: Signals & Systems Chapter 4", module: "Exam Assistant", timestamp: "2026-05-21T15:00:00", score: 82 },
  { id: "6", type: "research", title: "Summarised: ML-based Circuit Optimisation paper", module: "Research Suite", timestamp: "2026-05-20T14:00:00" },
  { id: "7", type: "doubt", title: "Solved: Thevenin's theorem step-by-step", module: "Doubt Solver", timestamp: "2026-05-20T11:00:00" },
  { id: "8", type: "code", title: "Debugged: Stack overflow in recursive Fibonacci", module: "Code Builder", timestamp: "2026-05-19T16:30:00", score: 100 },
];
