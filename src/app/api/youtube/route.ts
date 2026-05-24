import { NextRequest } from "next/server";

const PROMPT = `You are a YouTube video summarizer. Given a YouTube video URL or title, produce a structured summary.

Since you don't have direct access to the video, base your summary on:
- What the title and channel name suggest
- Your general knowledge of the topic

Output STRICT JSON only:
{
  "title": "Inferred title or topic of the video",
  "channel": "Channel name if known",
  "tldr": "1-2 sentence summary",
  "keyPoints": ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"],
  "chapters": [
    { "time": "0:00", "title": "Intro" },
    { "time": "1:30", "title": "Topic 1" }
  ],
  "tags": ["tag1", "tag2"],
  "quiz": [
    { "q": "Question?", "a": "Answer" },
    { "q": "Question?", "a": "Answer" },
    { "q": "Question?", "a": "Answer" }
  ]
}

If you can't determine specifics, say so honestly in the tldr.`;

function extractVideoId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/);
  return m ? m[1] : null;
}

async function callGroq(prompt: string) {
  const Groq = (await import("groq-sdk")).default;
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY! });
  const result = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: PROMPT },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    max_tokens: 2500,
  });
  return result.choices[0].message.content || "{}";
}

async function callGemini(prompt: string) {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = client.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: PROMPT,
    generationConfig: { responseMimeType: "application/json" },
  });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return Response.json({ error: "URL required" }, { status: 400 });

    const videoId = extractVideoId(url);
    const prompt = videoId
      ? `Video URL: ${url}\nVideo ID: ${videoId}\nProvide a summary based on what this video likely covers.`
      : `Topic/Title: ${url}\nProvide a summary.`;

    let raw = "";
    if (process.env.GROQ_API_KEY) raw = await callGroq(prompt);
    else if (process.env.GEMINI_API_KEY) raw = await callGemini(prompt);
    else return Response.json({ error: "No AI provider configured" }, { status: 503 });

    let parsed: Record<string, unknown> = {};
    try {
      parsed = JSON.parse(raw);
    } catch {
      const m = raw.match(/\{[\s\S]*\}/);
      if (m) parsed = JSON.parse(m[0]);
    }
    return Response.json({ ...parsed, videoId });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: msg }, { status: 500 });
  }
}
