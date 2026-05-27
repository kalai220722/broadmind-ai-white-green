import { NextRequest } from "next/server";

// ─────────────────────────────────────────────────────────────────────
// BroadMind TTS — tiered quality
//
// Tier 1: OpenAI TTS (tts-1-hd)
//   • Voices: nova (warm female), shimmer (energetic female),
//     onyx (deep male), echo (clear male)
//   • Best quality for English and mixed-language content
//   • ~$0.030 / 1k chars (HD)
//
// Tier 2: Sarvam AI (bulbul:v1)
//   • Indian-language native pronunciation
//   • Used for pure Hindi/Tamil/Telugu/etc when OpenAI sounds off
//
// Tier 3: client-side SpeechSynthesis (fallback, free, offline)
// ─────────────────────────────────────────────────────────────────────

const LANG_MAP: Record<string, string> = {
  English: "en-IN",
  Hindi: "hi-IN",
  Tamil: "ta-IN",
  Telugu: "te-IN",
  Malayalam: "ml-IN",
  Kannada: "kn-IN",
  Marathi: "mr-IN",
  Gujarati: "gu-IN",
  Bengali: "bn-IN",
  Punjabi: "pa-IN",
  Odia: "od-IN",
};

const SARVAM_SPEAKERS: Record<string, string> = {
  female: "anushka",
  male: "abhilash",
};

const PURE_INDIAN_LANGS = new Set([
  "Hindi", "Tamil", "Telugu", "Malayalam", "Kannada",
  "Marathi", "Gujarati", "Bengali", "Punjabi", "Odia",
]);

// ── Tier 1: OpenAI TTS (HD, professional speaker quality) ───────────
async function tryOpenAI(text: string, voice: string, speed: number) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  try {
    const OpenAI = (await import("openai")).default;
    const client = new OpenAI({ apiKey });
    const speech = await client.audio.speech.create({
      model: "tts-1-hd",
      voice: voice as "nova" | "shimmer" | "onyx" | "echo" | "alloy" | "fable",
      input: text.slice(0, 1500),
      speed,
      response_format: "mp3",
    });
    const buf = Buffer.from(await speech.arrayBuffer());
    return { audio: buf.toString("base64"), format: "mp3", source: "openai-tts-hd" };
  } catch (err) {
    console.error("OpenAI TTS failed:", err);
    return null;
  }
}

// ── Tier 2: Sarvam AI (Indian languages) ─────────────────────────────
async function trySarvam(text: string, language: string, speaker: string) {
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) return null;
  try {
    const langCode = LANG_MAP[language] || "en-IN";
    const speakerVoice = SARVAM_SPEAKERS[speaker] || SARVAM_SPEAKERS.female;
    const res = await fetch("https://api.sarvam.ai/text-to-speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": apiKey,
      },
      body: JSON.stringify({
        inputs: [text.slice(0, 500)],
        target_language_code: langCode,
        speaker: speakerVoice,
        pitch: 0,
        pace: 1.0,
        loudness: 1.2,
        speech_sample_rate: 22050,
        enable_preprocessing: true,
        model: "bulbul:v1",
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const audio = data.audios?.[0];
    return audio ? { audio, format: "wav", source: "sarvam" } : null;
  } catch (err) {
    console.error("Sarvam TTS failed:", err);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      text,
      language = "English",
      speaker = "female",
      style = "professional",
    } = await req.json();
    if (!text || text.length < 1) {
      return Response.json({ error: "Text required" }, { status: 400 });
    }

    // Voice selection by style + speaker
    // OpenAI voices:
    //   nova     — warm, friendly, expressive female (motivational)
    //   shimmer  — energetic, bright female (intro narration)
    //   onyx     — deep, calm, authoritative male
    //   echo     — clear, conversational male
    const voice =
      style === "motivational" || style === "intro"
        ? (speaker === "male" ? "onyx" : "shimmer")
        : (speaker === "male" ? "echo" : "nova");

    // Slightly slower for motivational/narration so it lands
    const speed = style === "motivational" || style === "intro" ? 0.96 : 1.0;

    // Routing:
    // - Pure Indian languages → Sarvam first (native pronunciation),
    //                            then OpenAI (still readable), then fallback
    // - English / mixed       → OpenAI first (best quality),
    //                            then Sarvam (en-IN), then fallback
    const wantSarvamFirst = PURE_INDIAN_LANGS.has(language);

    let result =
      (wantSarvamFirst ? await trySarvam(text, language, speaker) : null) ??
      (await tryOpenAI(text, voice, speed)) ??
      (!wantSarvamFirst ? await trySarvam(text, language, speaker) : null);

    if (!result) {
      return Response.json(
        { error: "no-key", message: "No TTS provider configured — using browser fallback" },
        { status: 503 }
      );
    }

    return Response.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("TTS error:", msg);
    return Response.json({ error: msg }, { status: 500 });
  }
}
