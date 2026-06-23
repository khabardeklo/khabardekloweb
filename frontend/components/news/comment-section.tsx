"use client";

import { useEffect, useState, type FormEvent } from "react";

type CommentItem = {
  _id: string;
  name: string;
  content: string;
  createdAt: string;
};

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000/api";

const toDate = (v: string) =>
  new Date(v).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export function CommentSection({ newsSlug }: { newsSlug: string }) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${backendUrl}/comments/news/${newsSlug}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data: unknown) => setComments(Array.isArray(data) ? (data as CommentItem[]) : []))
      .catch(() => {});
  }, [newsSlug]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !content.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const r = await fetch(`${backendUrl}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newsSlug, name, email, content }),
      });
      const data = (await r.json().catch(() => null)) as { message?: string } | null;
      if (!r.ok) throw new Error(data?.message ?? "Submission failed");
      setSubmitted(true);
      setName(""); setEmail(""); setContent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-10">
      <h2 className="mb-5 text-xl font-black text-slate-950">
        Comments {comments.length > 0 && <span className="text-slate-400">({comments.length})</span>}
      </h2>

      {/* Approved comments */}
      {comments.length > 0 && (
        <div className="mb-8 space-y-4">
          {comments.map((c) => (
            <div key={c._id} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">{c.name}</span>
                <span className="text-xs text-slate-400">{toDate(c.createdAt)}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{c.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Submission form */}
      {submitted ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
          Your comment has been submitted and is awaiting moderation. Thank you!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-bold text-slate-700">Leave a comment</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Your name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400"
            />
            <input
              type="email"
              placeholder="Your email *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400"
            />
          </div>
          <textarea
            placeholder="Write your comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={4}
            maxLength={1000}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400"
          />
          {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Post Comment"}
          </button>
          <p className="text-xs text-slate-400">Comments are reviewed before going live.</p>
        </form>
      )}
    </section>
  );
}
