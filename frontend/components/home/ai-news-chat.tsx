"use client";
import { useRef, useState } from "react";
import type { HomeNewsItem } from "@/lib/home-content";

type Message = { role: "user" | "ai"; text: string };

type Props = { items: HomeNewsItem[]; limit?: number; title?: string };

export function AiNewsChat({ items, limit = 10, title = "AI News Chat" }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Namaste! 👋 Aaj ki khabar ke baare mein kuch poochhen — main aapki madad karunga." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const context = items
    .slice(0, limit)
    .map((n, i) => `${i + 1}. [${n.category}] ${n.title}${n.description ? ": " + n.description : ""}`)
    .join("\n");

  const sendMessage = async () => {
    const question = input.trim();
    if (!question || loading) return;

    const next: Message[] = [...messages, { role: "user", text: question }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, context }),
      });
      const data = await res.json() as { answer?: string; error?: string };
      setMessages([...next, { role: "ai", text: data.answer || "Koi jawab nahi mila, dobara try karein." }]);
    } catch {
      setMessages([...next, { role: "ai", text: "Network error. Please try again." }]);
    } finally {
      setLoading(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  return (
    <section className="mb-10" aria-label="AI News Chat">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="h-6 w-1 rounded-full bg-violet-600" />
        <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white shadow">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
          </svg>
          AI
        </span>
        <h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {title}
        </h2>
        <span className="ml-auto rounded-full bg-violet-50 border border-violet-200 px-3 py-1 text-[11px] font-semibold text-violet-700">
          Powered by Gemini
        </span>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Today's headlines context bar */}
        <div className="border-b border-slate-100 bg-gradient-to-r from-violet-50 to-indigo-50 px-5 py-3 flex items-center gap-2">
          <svg className="h-4 w-4 text-violet-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd"/>
          </svg>
          <span className="text-xs font-medium text-violet-700">
            {items.slice(0, 3).map(n => n.title).join(" · ")}
          </span>
        </div>

        {/* Chat messages */}
        <div className="h-80 overflow-y-auto px-5 py-4 space-y-4 scrollbar-none">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "ai" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-xs font-black shadow">
                  AI
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                msg.role === "user"
                  ? "rounded-tr-none bg-gradient-to-br from-violet-600 to-indigo-600 text-white"
                  : "rounded-tl-none bg-slate-50 border border-slate-100 text-slate-800"
              }`}>
                {msg.text}
              </div>
              {msg.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600 text-xs font-bold">
                  You
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-xs font-black shadow">
                AI
              </div>
              <div className="rounded-2xl rounded-tl-none bg-slate-50 border border-slate-100 px-4 py-3">
                <span className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce [animation-delay:0ms]" />
                  <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce [animation-delay:150ms]" />
                  <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce [animation-delay:300ms]" />
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggested questions */}
        <div className="px-5 pb-3 flex flex-wrap gap-2">
          {["Aaj ki top 3 khabren?", "Sports mein kya hua?", "Tech news sunao"].map((q) => (
            <button
              key={q}
              onClick={() => { setInput(q); }}
              className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700 hover:bg-violet-100 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input area */}
        <div className="border-t border-slate-100 px-4 py-3 flex gap-2 bg-slate-50">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Khabar ke baare mein poochhen..."
            disabled={loading}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 disabled:opacity-60 transition"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow transition hover:opacity-90 disabled:opacity-40"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
