"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Languages, Sparkles } from "lucide-react";
import AnimatedRobot from "./AnimatedRobot";
import VoiceLanguageModal from "./VoiceLanguageModal";
import { speak, getStoredVoiceLanguage, setStoredVoiceLanguage, stopAllVoice, type VoiceController } from "@/lib/voice";

// Polished, motivational intro scripts. Punctuation is tuned for prosody —
// commas = micro-pauses, dashes = breath beats, periods = full stops.
const INTRO_SCRIPTS: Record<string, string[]> = {
  English: [
    "Hello, and welcome to BroadMind — the AI learning operating system, built just for you.",
    "I don't teach everyone the same way. I learn how you learn — your pace, your style, your strengths — and then I adapt every lesson, every quiz, every plan, to match.",
    "From class eight to PhD. Twenty-two Indian languages. One private profile, one beautiful studio. Your journey starts now. Are you ready?",
  ],
  Hindi: [
    "नमस्ते, ब्रॉडमाइंड में आपका स्वागत है — आपके लिए बनाया गया AI लर्निंग सिस्टम।",
    "मैं हर किसी को एक जैसा नहीं सिखाता। मैं सीखता हूँ कि आप कैसे सीखते हैं — आपकी गति, आपकी शैली, आपकी ताकत — और फिर हर पाठ आपके अनुसार ढाल देता हूँ।",
    "कक्षा आठ से PhD तक, बाईस भारतीय भाषाएँ, एक सुंदर स्टूडियो। आपकी यात्रा अभी शुरू होती है। तैयार हैं?",
  ],
  Tamil: [
    "வணக்கம், ப்ராட்மைண்டுக்கு வரவேற்கிறோம் — உங்களுக்காகவே உருவாக்கப்பட்ட AI கற்றல் இயக்க முறைமை.",
    "நான் எல்லோருக்கும் ஒரே மாதிரி கற்பிக்க மாட்டேன். நீங்கள் எப்படி கற்கிறீர்கள் என்பதை நான் கற்றுக்கொள்கிறேன், பிறகு ஒவ்வொரு பாடமும் உங்களுக்கு ஏற்ப மாறும்.",
    "எட்டாம் வகுப்பு முதல் PhD வரை, இருபத்திரண்டு இந்திய மொழிகள், ஒரே ஸ்டுடியோ. உங்கள் பயணம் இப்போது தொடங்குகிறது.",
  ],
  Telugu: [
    "నమస్తే, బ్రాడ్‌మైండ్‌కు స్వాగతం. ఇది మీ కోసం ప్రత్యేకంగా రూపొందించబడిన AI లెర్నింగ్ సిస్టమ్.",
    "నేను అందరికీ ఒకే విధంగా నేర్పను. మీరు ఎలా నేర్చుకుంటారో నేను నేర్చుకుంటాను, తర్వాత ప్రతి పాఠం మీకు తగినట్లుగా మారుతుంది.",
  ],
  Malayalam: [
    "നമസ്കാരം, ബ്രോഡ്മൈൻഡിലേക്ക് സ്വാഗതം — നിങ്ങൾക്കായി രൂപകൽപ്പന ചെയ്ത AI പഠന സിസ്റ്റം.",
    "നിങ്ങൾ എങ്ങനെ പഠിക്കുന്നു എന്ന് ഞാൻ പഠിക്കും, എന്നിട്ട് ഓരോ പാഠവും നിങ്ങൾക്ക് ഇണങ്ങുന്ന വിധത്തിൽ ക്രമീകരിക്കും.",
  ],
  Kannada: [
    "ನಮಸ್ಕಾರ, ಬ್ರಾಡ್‌ಮೈಂಡ್‌ಗೆ ಸ್ವಾಗತ — ನಿಮಗಾಗಿಯೇ ರಚಿಸಿದ AI ಕಲಿಕೆ ವ್ಯವಸ್ಥೆ.",
    "ನೀವು ಹೇಗೆ ಕಲಿಯುತ್ತೀರಿ ಎಂಬುದನ್ನು ನಾನು ಕಲಿಯುತ್ತೇನೆ, ನಂತರ ಪ್ರತಿ ಪಾಠವೂ ನಿಮಗೆ ಸರಿಹೊಂದುತ್ತದೆ.",
  ],
  Marathi: [
    "नमस्कार, ब्रॉडमाइंडमध्ये आपले स्वागत आहे — तुमच्यासाठी तयार केलेली AI शिकण्याची प्रणाली.",
    "तुम्ही कसे शिकता ते मी शिकतो, मग प्रत्येक धडा तुमच्या शैलीनुसार बदलतो.",
  ],
  Bengali: [
    "নমস্কার, ব্রডমাইন্ডে স্বাগতম — আপনার জন্য তৈরি AI শেখার সিস্টেম।",
    "আপনি কীভাবে শিখছেন তা আমি শিখি, তারপর প্রতিটি পাঠ আপনার স্টাইলের সাথে মানিয়ে নেয়।",
  ],
  Gujarati: [
    "નમસ્તે, બ્રોડમાઇંડમાં તમારું સ્વાગત છે — તમારા માટે બનાવેલ AI શીખવાની સિસ્ટમ.",
    "તમે કેવી રીતે શીખો છો તે હું શીખું છું, પછી દરેક પાઠ તમારી શૈલી મુજબ બદલાય છે.",
  ],
  Punjabi: [
    "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਬ੍ਰੌਡਮਾਈਂਡ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ — ਤੁਹਾਡੇ ਲਈ ਬਣਾਇਆ ਗਿਆ AI ਸਿੱਖਣ ਦਾ ਸਿਸਟਮ।",
    "ਤੁਸੀਂ ਕਿਵੇਂ ਸਿੱਖਦੇ ਹੋ ਇਹ ਮੈਂ ਸਿੱਖਦਾ ਹਾਂ, ਫਿਰ ਹਰ ਪਾਠ ਤੁਹਾਡੀ ਸ਼ੈਲੀ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।",
  ],
};

export default function RobotHero() {
  const [language, setLanguage] = useState("English");
  const [showLangModal, setShowLangModal] = useState(false);
  const [muted, setMuted] = useState(false);
  const [state, setState] = useState<"idle" | "talking">("idle");
  const [currentLine, setCurrentLine] = useState(0);
  const [hasIntroduced, setHasIntroduced] = useState(false);
  const [voiceCtl, setVoiceCtl] = useState<VoiceController | null>(null);

  // First-visit voice-language picker
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("bm-voice-language");
    if (saved) {
      setLanguage(saved);
      setHasIntroduced(localStorage.getItem("bm-intro-done") === "true");
    } else {
      const t = setTimeout(() => setShowLangModal(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  // Auto-narrate intro on first visit after language picked
  useEffect(() => {
    if (showLangModal || muted) return;
    if (hasIntroduced) return;
    const scripts = INTRO_SCRIPTS[language] || INTRO_SCRIPTS.English;
    if (currentLine >= scripts.length) {
      localStorage.setItem("bm-intro-done", "true");
      setHasIntroduced(true);
      setState("idle");
      return;
    }
    const line = scripts[currentLine];
    setState("talking");
    const ctl = speak(line, { language, style: "intro", speaker: "female" });
    setVoiceCtl(ctl);
    ctl.promise.then(() => {
      setTimeout(() => setCurrentLine((c) => c + 1), 350);
    });
    return () => {
      ctl.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLine, language, muted, hasIntroduced, showLangModal]);

  const replayIntro = () => {
    if (muted) {
      setMuted(false);
    }
    stopAllVoice();
    localStorage.removeItem("bm-intro-done");
    setHasIntroduced(false);
    setCurrentLine(0);
  };

  const toggleMute = () => {
    if (!muted) {
      voiceCtl?.stop();
      stopAllVoice();
      setState("idle");
    }
    setMuted((m) => !m);
  };

  const onLangPicked = (lang: string) => {
    setLanguage(lang);
    setStoredVoiceLanguage(lang);
    setShowLangModal(false);
    setCurrentLine(0);
    setHasIntroduced(false);
    localStorage.removeItem("bm-intro-done");
  };

  const currentScript = INTRO_SCRIPTS[language] || INTRO_SCRIPTS.English;
  const currentText = currentScript[Math.min(currentLine, currentScript.length - 1)];

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <AnimatedRobot size={220} state={state} />
        </div>

        {/* Speech bubble */}
        {!muted && state === "talking" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md text-center"
          >
            <div className="inline-block px-4 py-2 rounded-2xl glass-card border border-violet-500/30 text-sm text-slate-200">
              <span className="inline-flex items-center gap-2">
                <Sparkles size={11} className="text-violet-300" />
                {currentText}
              </span>
            </div>
          </motion.div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={toggleMute}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition"
            title={muted ? "Unmute robot" : "Mute robot"}
          >
            {muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
            {muted ? "Unmute" : "Mute"}
          </button>
          <button
            onClick={() => setShowLangModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition"
            title="Change voice language"
          >
            <Languages size={12} />
            {language}
          </button>
          {hasIntroduced && (
            <button
              onClick={replayIntro}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/30 text-xs text-violet-300 transition"
              title="Replay intro"
            >
              <Sparkles size={12} /> Replay intro
            </button>
          )}
        </div>
      </div>

      <VoiceLanguageModal
        open={showLangModal}
        onPicked={onLangPicked}
        onSkip={() => {
          setMuted(true);
          setShowLangModal(false);
          setStoredVoiceLanguage("English");
          localStorage.setItem("bm-intro-done", "true");
          setHasIntroduced(true);
        }}
      />
    </>
  );
}
