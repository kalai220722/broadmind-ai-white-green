export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  level: "school" | "exam" | "engineering" | "college" | "research" | "medical";
  language: string;
  grade?: string;
  institution?: string;
  joinedAt: string;
  streakDays: number;
  totalSessions: number;
  totalMinutes: number;
  pedagogyVector: PedagogyVector;
}

export interface PedagogyVector {
  analogy: number;
  visual: number;
  stepByStep: number;
  storytelling: number;
  formal: number;
}

export interface ModuleProgress {
  moduleId: string;
  completedTopics: number;
  totalTopics: number;
  lastAccessed: string;
  timeSpent: number;
  accuracy: number;
}

export interface ActivityItem {
  id: string;
  type: "doubt" | "quiz" | "video" | "code" | "research" | "exam";
  title: string;
  module: string;
  timestamp: string;
  score?: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  language?: string;
  attachments?: { type: "image" | "file"; url: string; name: string }[];
}
