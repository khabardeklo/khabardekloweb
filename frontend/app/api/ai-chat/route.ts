import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { question, context } = (await req.json()) as { question: string; context: string };

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const prompt = `You are a helpful Hindi/English bilingual news assistant for "Khabar Deklo" news website.
Answer questions based on the following today's news headlines. Keep answers short (2-3 sentences), friendly, and in Hinglish (mix of Hindi and English).

Today's News:
${context}

User question: ${question}

Answer:`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 200, temperature: 0.7 },
      }),
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "AI service error" }, { status: 502 });
  }

  const data = await res.json() as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };

  const answer = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Koi jawab nahi mila.";
  return NextResponse.json({ answer });
}
