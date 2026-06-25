"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/layout/admin-shell";

type CommentItem = {
  _id: string;
  newsSlug: string;
  name: string;
  email: string;
  content: string;
  isApproved: boolean;
  createdAt: string;
};

type CommentsResponse = {
  data?: CommentItem[];
  pagination?: { total: number; hasMore: boolean };
};

import { backendUrl } from "@/lib/config";

const toDate = (v: string) =>
  new Date(v).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export default function CommentsPage() {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("pending");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`${backendUrl}/comments?limit=100`, { credentials: "include" });
      const data = (await r.json().catch(() => null)) as CommentsResponse | null;
      if (!r.ok) throw new Error("Failed to load comments");
      setComments(data?.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const handleApprove = async (id: string) => {
    try {
      const r = await fetch(`${backendUrl}/comments/${id}/approve`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!r.ok) throw new Error("Failed to approve");
      setComments((prev) => prev.map((c) => (c._id === id ? { ...c, isApproved: true } : c)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to approve");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this comment?")) return;
    try {
      const r = await fetch(`${backendUrl}/comments/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!r.ok) throw new Error("Failed to delete");
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const filtered = comments.filter((c) => {
    if (filter === "pending") return !c.isApproved;
    if (filter === "approved") return c.isApproved;
    return true;
  });

  const pendingCount = comments.filter((c) => !c.isApproved).length;

  return (
    <AdminShell title="Comments" subtitle="Moderate reader comments before they go live.">
      {/* Filter Tabs */}
      <div className="mb-5 flex gap-4 border-b border-slate-200">
        {(["pending", "approved", "all"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`pb-3 text-sm font-semibold capitalize transition border-b-2 ${
              filter === tab
                ? "border-slate-950 text-slate-950"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab}
            {tab === "pending" && pendingCount > 0 && (
              <span className="ml-2 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-700">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading && <p className="text-sm text-slate-600">Loading comments...</p>}
      {error && (
        <p className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <p className="text-slate-500">No {filter === "all" ? "" : filter} comments.</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((comment) => (
            <div
              key={comment._id}
              className={`rounded-2xl border bg-white p-4 shadow-sm ${
                comment.isApproved ? "border-slate-200" : "border-amber-200 bg-amber-50/30"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-900">{comment.name}</span>
                    <span className="text-xs text-slate-400">{comment.email}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        comment.isApproved
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {comment.isApproved ? "Approved" : "Pending"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    On{" "}
                    <a
                      href={`/news/${comment.newsSlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-sky-700 hover:underline"
                    >
                      {comment.newsSlug}
                    </a>{" "}
                    · {toDate(comment.createdAt)}
                  </p>
                  <p className="mt-2 text-sm text-slate-700">{comment.content}</p>
                </div>

                <div className="flex shrink-0 gap-2">
                  {!comment.isApproved && (
                    <button
                      onClick={() => handleApprove(comment._id)}
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
