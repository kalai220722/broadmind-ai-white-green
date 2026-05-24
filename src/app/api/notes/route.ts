import { NextRequest } from "next/server";

const PROMPT = `You are a notes summarizer. Given the user's notes, produce a concise, well-structured summary.

Format with markdown:
- A 1-sentence TL;DR at the top.
- Then "## Key Points" with 4-6 bullet points.
- Then "## Quick Quiz" with 2-3 self-check questions.

Preserve the language of the input.`;

async function callGroq(content: string) {
  const Groq = (await import("groq-sdk")).default;
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY! });
  const result = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: PROMPT },
      { role: "user", content },
    ],
    max_tokens: 1500,
  });
  return result.choices[0].message.content || "";
}

async function callGemini(content: string) {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = client.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: PROMPT,
  });
  const result = await model.generateContent(content);
  return result.response.text();
}

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();
    if (!content || content.length < 20) {
      return Response.json({ error: "Note is too short to summarize" }, { status: 400 });
    }
    let summary = "";
    if (process.env.GROQ_API_KEY) summary = await callGroq(content);
    else if (process.env.GEMINI_API_KEY) summary = await callGemini(content);
    else return Response.json({ error: "No AI provider configured" }, { status: 503 });
    return Response.json({ summary });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: msg }, { status: 500 });
  }
}
