import { NextRequest } from "next/server";

const PROMPT = `You are a flashcard generator. Generate exactly the requested number of high-quality flashcards on the given topic.

OUTPUT STRICT JSON ONLY (no markdown, no preamble), shape:
{ "cards": [ { "front": "Question or term", "back": "Concise answer or definition (1-3 sentences)" }, ... ] }

Rules:
- Front: brief question or term (≤ 12 words)
- Back: clear, accurate, complete answer (1-3 sentences)
- No duplicates. Mix difficulty (basic → advanced).
- If topic is in a non-English language, generate flashcards in that language.`;

async function callGroq(topic: string, count: number) {
  const Groq = (await import("groq-sdk")).default;
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY! });
  const result = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: PROMPT },
      { role: "user", content: `Topic: ${topic}\nNumber of cards: ${count}` },
    ],
    response_format: { type: "json_object" },
    max_tokens: 2500,
  });
  return result.choices[0].message.content || "{}";
}

async function callGemini(topic: string, count: number) {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = client.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: PROMPT,
    generationConfig: { responseMimeType: "application/json" },
  });
  const result = await model.generateContent(`Topic: ${topic}\nNumber of cards: ${count}`);
  return result.response.text();
}

export async function POST(req: NextRequest) {
  try {
    const { topic, count = 8 } = await req.json();
    if (!topic) {
      return Response.json({ error: "Topic required" }, { status: 400 });
    }

    let raw = "";
    if (process.env.GROQ_API_KEY) {
      raw = await callGroq(topic, count);
    } else if (process.env.GEMINI_API_KEY) {
      raw = await callGemini(topic, count);
    } else {
      return Response.json({ error: "No AI provider configured" }, { status: 503 });
    }

    let parsed: { cards?: { front: string; back: string }[] } = {};
    try {
      parsed = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
    }

    return Response.json({ cards: parsed.cards || [] });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: msg }, { status: 500 });
  }
}
