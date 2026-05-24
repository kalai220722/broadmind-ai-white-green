import { NextRequest } from "next/server";

const PROMPT = `You are a quiz generator. Generate exactly the requested number of multiple-choice questions on the given topic at the given difficulty.

OUTPUT STRICT JSON ONLY (no markdown):
{ "questions": [
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Brief explanation why this is correct."
  },
  ...
] }

Rules:
- Always 4 options, exactly one correct.
- Vary the position of the correct answer.
- Explanation must be 1-2 sentences.
- Difficulty: easy = recall, medium = application, hard = reasoning/edge cases.
- No duplicates.
- If topic is in non-English language, generate in that language.`;

async function callGroq(topic: string, count: number, difficulty: string) {
  const Groq = (await import("groq-sdk")).default;
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY! });
  const result = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: PROMPT },
      { role: "user", content: `Topic: ${topic}\nDifficulty: ${difficulty}\nCount: ${count}` },
    ],
    response_format: { type: "json_object" },
    max_tokens: 3500,
  });
  return result.choices[0].message.content || "{}";
}

async function callGemini(topic: string, count: number, difficulty: string) {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = client.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: PROMPT,
    generationConfig: { responseMimeType: "application/json" },
  });
  const result = await model.generateContent(`Topic: ${topic}\nDifficulty: ${difficulty}\nCount: ${count}`);
  return result.response.text();
}

export async function POST(req: NextRequest) {
  try {
    const { topic, count = 5, difficulty = "medium" } = await req.json();
    if (!topic) return Response.json({ error: "Topic required" }, { status: 400 });

    let raw = "";
    if (process.env.GROQ_API_KEY) raw = await callGroq(topic, count, difficulty);
    else if (process.env.GEMINI_API_KEY) raw = await callGemini(topic, count, difficulty);
    else return Response.json({ error: "No AI provider configured" }, { status: 503 });

    let parsed: { questions?: unknown[] } = {};
    try {
      parsed = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
    }
    return Response.json({ questions: parsed.questions || [] });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: msg }, { status: 500 });
  }
}
