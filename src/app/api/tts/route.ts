import { NextRequest } from "next/server";

// ── Sarvam AI TTS proxy ─────────────────────────────────────────────
// Sarvam supports: Hindi, Tamil, Telugu, Malayalam, Kannada, Marathi,
//   Gujarati, Bengali, Punjabi, Odia, English.
// API: https://api.sarvam.ai/text-to-speech

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

const SPEAKERS: Record<string, string> = {
  female: "anushka",
  male: "abhilash",
};

export async function POST(req: NextRequest) {
  try {
    const { text, language = "English", speaker = "female" } = await req.json();
    if (!text || text.length < 1) {
      return Response.json({ error: "Text required" }, { status: 400 });
    }

    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey) {
      // Graceful degradation — frontend should fall back to browser SpeechSynthesis
      return Response.json(
        { error: "no-key", message: "Sarvam not configured — using browser TTS" },
        { status: 503 }
      );
    }

    const langCode = LANG_MAP[language] || "en-IN";
    const speakerVoice = SPEAKERS[speaker] || SPEAKERS.female;

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
        loudness: 1.0,
        speech_sample_rate: 22050,
        enable_preprocessing: true,
        model: "bulbul:v1",
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return Response.json({ error: `Sarvam error: ${errText}` }, { status: res.status });
    }

    const data = await res.json();
    // Sarvam returns { audios: [base64-string] }
    const audio = data.audios?.[0];
    if (!audio) {
      return Response.json({ error: "No audio returned" }, { status: 500 });
    }
    return Response.json({ audio, format: "wav" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: msg }, { status: 500 });
  }
}
