// ─────────────────────────────────────────────────────────────────────
// BroadMind module intros
//
// Professional speaker tone — energetic, motivational, never preachy.
// Punctuation is tuned for prosody: commas = micro-pauses, dashes =
// breath beats, period+space = full stops.
// ─────────────────────────────────────────────────────────────────────

export interface ModuleIntro {
  /** route prefix to match against pathname */
  path: string;
  /** Short title shown beside the mascot bubble */
  title: string;
  /** Spoken script in English */
  script: string;
  /** Optional translations — used when user picks a non-English voice */
  i18n?: Partial<Record<string, string>>;
}

export const MODULE_INTROS: ModuleIntro[] = [
  {
    path: "/dashboard",
    title: "Your command center",
    script:
      "Welcome back to BroadMind. This is your command center — news, exams, today's plan, and your learning DNA, all in one view. Pick where to dive in, and let's make today count.",
    i18n: {
      Hindi:
        "ब्रॉडमाइंड में फिर से स्वागत है। यह आपका कमांड सेंटर है — समाचार, परीक्षाएँ, आज की योजना, और आपका लर्निंग डीएनए, सब एक जगह।",
      Tamil:
        "ப்ராட்மைண்டுக்கு மீண்டும் வரவேற்கிறோம். இது உங்கள் கட்டுப்பாட்டு மையம் — செய்திகள், தேர்வுகள், இன்றைய திட்டம், மற்றும் உங்கள் கற்றல் டிஎன்ஏ.",
    },
  },
  {
    path: "/modules/doubt-solver",
    title: "Tutor — your AI teacher",
    script:
      "Welcome to your personal AI tutor. No question is too small, no doubt is silly. Ask me anything — math, physics, code, languages — in your language, and I'll explain it your way. Let's solve something amazing.",
    i18n: {
      Hindi:
        "अपने व्यक्तिगत AI ट्यूटर में आपका स्वागत है। कोई भी प्रश्न छोटा नहीं है। कुछ भी पूछिए — गणित, विज्ञान, कोडिंग — और मैं आपकी भाषा में समझाऊंगा।",
      Tamil:
        "உங்கள் சொந்த AI ஆசிரியருக்கு வரவேற்கிறோம். எந்த கேள்வியும் சிறியதல்ல. கணிதம், அறிவியல், கோடிங் — எதையும் கேளுங்கள், உங்கள் மொழியில் விளக்குகிறேன்.",
    },
  },
  {
    path: "/modules/capture",
    title: "Capture — your second brain",
    script:
      "Welcome to Capture Studio — your second brain. Type a note, dictate a voice memo, or drop in a YouTube link. I'll turn everything you capture into organized, searchable knowledge. Your ideas deserve to be remembered.",
  },
  {
    path: "/modules/recall",
    title: "Recall — train your memory",
    script:
      "Step into the Recall Arena. Active recall, and spaced repetition — the two scientific superpowers of memory. Take a quick quiz, or build a flashcard deck. Every answer makes you sharper. Ready to train your brain?",
  },
  {
    path: "/modules/news",
    title: "Pulse — today's news",
    script:
      "Daily News, curated just for you. The world moves fast, and so do exam syllabi. Tap any story to read more, or let me read it aloud. Stay informed. Stay ahead.",
  },
  {
    path: "/modules/exams",
    title: "Calendar — every exam, one place",
    script:
      "Every major Indian exam, one calendar. Star the ones you care about — I'll remind you, plan for you, and prepare you. Your dream career starts with a date on a calendar. Which exam will you conquer?",
  },
  {
    path: "/modules/planner",
    title: "Today — AI plans your day",
    script:
      "Welcome to your AI study coach. Tell me how much time you have, and I'll build today's plan from your Learning DNA — weak topics first, strong topics for momentum. Smart sessions. Real progress. Let's plan a winning day.",
  },
  {
    path: "/modules/insights",
    title: "DNA — see how you learn",
    script:
      "This is your Learning DNA — the unique map of how you think and how you learn. Every interaction shapes it. Look at your patterns, celebrate your wins, and discover where to grow next. This is you, learning.",
  },
  // Other static modules
  {
    path: "/modules/avatar-tutor",
    title: "Avatar Tutor",
    script:
      "Meet your video tutor — a friendly avatar that teaches in twenty-two Indian languages. Pick your subject, sit back, and learn the human way.",
  },
  {
    path: "/modules/code-builder",
    title: "Code Builder",
    script:
      "Welcome to Code Builder — your browser-based IDE with an AI pair programmer. Write, run, debug, in sixty plus languages. Every line is a step toward mastery.",
  },
  {
    path: "/modules/exam-assistant",
    title: "Exam Assistant",
    script:
      "Welcome to Exam Assistant. Fifty thousand previous-year questions, mock tests, weak-area detection — everything you need to walk in confident on test day.",
  },
  {
    path: "/modules/research-suite",
    title: "Research Suite",
    script:
      "Welcome to the Research Suite — paper summarizer, literature review, citation manager. From idea to published paper, I'm with you at every step.",
  },
  {
    path: "/modules/visualisation",
    title: "Visualisation Engine",
    script:
      "Welcome to the Visualisation Engine. Diagrams, animations, three-D models — drawn on demand, explained simply. Because some ideas only make sense when you see them.",
  },
  {
    path: "/modules/medical",
    title: "Medical Module",
    script:
      "Welcome to the Medical Module — three-D anatomy, pharmacology, and clinical decision support. Built for future doctors who learn deeply.",
  },
  {
    path: "/modules/engineering",
    title: "Engineering Module",
    script:
      "Welcome to the Engineering Module — GATE prep, circuit simulator, algorithm visualizer, final-year project helper. Engineering, taught the way engineers think.",
  },
  {
    path: "/modules/higher-education",
    title: "Higher Education",
    script:
      "Welcome to Higher Education — one hundred plus college disciplines, all in one place. Whatever you study, BroadMind goes deep.",
  },
  {
    path: "/modules/omni-bot",
    title: "Omni-Bot",
    script:
      "Welcome to Omni-Bot. Learn through WhatsApp, voice calls, or SMS — anywhere, anytime, no app needed. BroadMind in your pocket, on your terms.",
  },
];

/** Find the intro that matches a pathname (exact match → prefix match). */
export function findIntro(pathname: string): ModuleIntro | null {
  // exact match first
  const exact = MODULE_INTROS.find((m) => m.path === pathname);
  if (exact) return exact;
  // longest prefix match
  let best: ModuleIntro | null = null;
  for (const m of MODULE_INTROS) {
    if (pathname.startsWith(m.path) && (!best || m.path.length > best.path.length)) {
      best = m;
    }
  }
  return best;
}

/** Pick the localised script if available, else fall back to English. */
export function scriptForLanguage(intro: ModuleIntro, language: string): string {
  return intro.i18n?.[language] || intro.script;
}
