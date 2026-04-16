"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

type ReporterApprovalStatus = "pending" | "active" | "rejected";

type ReporterRow = {
  id: string;
  name: string;
  email: string;
  role: "reporter";
  approvalStatus: ReporterApprovalStatus;
  createdAt: string;
  updatedAt: string;
  reviewedAt: string | null;
};

type ReporterResponse = {
  reporters: ReporterRow[];
};

type ReporterDetailResponse = {
  reporter: {
    id: string;
    name: string;
    email: string;
    role: "reporter";
    approvalStatus: ReporterApprovalStatus;
    avatar?: string | null;
    bio?: string | null;
    phone?: string | null;
    location?: string | null;
    title?: string | null;
    socialLinks?: Record<string, string>;
    createdAt: string;
    reviewedAt: string | null;
  };
  posts: Array<{
    id: string;
    title: string;
    slug: string;
    category: string;
    isPublished: boolean;
    createdAt: string;
  }>;
  pages: Array<{
    id: string;
    title: string;
    slug: string;
    templateType: string;
    isPublished: boolean;
    createdAt: string;
  }>;
};

type EditingItem = {
  type: "post" | "page";
  id: string;
  title: string;
} | null;

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

const statusMeta: Record<ReporterApprovalStatus, { label: string; tone: string }> = {
  pending: { label: "Pending approval", tone: "bg-amber-50 text-amber-700 ring-amber-200" },
  active: { label: "Approved", tone: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  rejected: { label: "Rejected", tone: "bg-rose-50 text-rose-700 ring-rose-200" },
};

export function ReporterManagementPanel() {
  const [reporters, setReporters] = useState<ReporterRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedReporter, setSelectedReporter] = useState<ReporterDetailResponse | null>(null);
  const [viewingReporterId, setViewingReporterId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<EditingItem>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const counts = useMemo(() => {
    return reporters.reduce(
      (accumulator, reporter) => {
        accumulator.total += 1;
        accumulator[reporter.approvalStatus] += 1;
        return accumulator;
      },
      { total: 0, pending: 0, active: 0, rejected: 0 }
    );
  }, [reporters]);

  const loadReporters = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${backendUrl}/users/reporters`, {
        credentials: "include",
      });

      const data = (await response.json().catch(() => null)) as ReporterResponse & { message?: string } | null;

      if (!response.ok) {
        throw new Error(data?.message || "Unable to load reporter applications");
      }

      setReporters(data?.reporters || []);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load reporter applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadReporters();
  }, []);

  const reviewReporter = async (id: string, approvalStatus: ReporterApprovalStatus) => {
    setSubmittingId(id);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`${backendUrl}/users/reporters/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: approvalStatus }),
      });

      const data = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(data?.message || "Unable to update reporter status");
      }

      setMessage(data?.message || (approvalStatus === "active" ? "Reporter approved." : "Reporter rejected."));
      await loadReporters();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to update reporter status");
    } finally {
      setSubmittingId(null);
    }
  };

  const viewReporterProfile = async (id: string) => {
    setViewingReporterId(id);
    setError(null);

    try {
      const response = await fetch(`${backendUrl}/users/reporters/${id}/profile`, {
        credentials: "include",
      });

      const data = (await response.json().catch(() => null)) as ReporterDetailResponse & { message?: string } | null;

      if (!response.ok) {
        throw new Error(data?.message || "Unable to load reporter details");
      }

      setSelectedReporter(data);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load reporter details");
    } finally {
      setViewingReporterId(null);
    }
  };

  const deleteItem = async (type: "post" | "page", id: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) {
      return;
    }

    setActionLoading(`${type}-${id}`);
    setError(null);

    try {
      const endpoint = type === "post" ? "news" : "pages";
      const response = await fetch(`${backendUrl}/${endpoint}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message || `Unable to delete ${type}`);
      }

      setMessage(`${type === "post" ? "Post" : "Page"} deleted successfully`);

      // Refresh reporter profile
      if (selectedReporter) {
        await viewReporterProfile(selectedReporter.reporter.id);
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : `Unable to delete ${type}`);
    } finally {
      setActionLoading(null);
    }
  };

  const togglePublishStatus = async (type: "post" | "page", id: string, currentStatus: boolean) => {
    setActionLoading(`toggle-${type}-${id}`);
    setError(null);

    try {
      const endpoint = type === "post" ? "news" : "pages";
      const response = await fetch(`${backendUrl}/${endpoint}/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPublished: !currentStatus }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message || `Unable to update ${type}`);
      }

      setMessage(`${type === "post" ? "Post" : "Page"} ${!currentStatus ? "published" : "unpublished"} successfully`);

      // Refresh reporter profile
      if (selectedReporter) {
        await viewReporterProfile(selectedReporter.reporter.id);
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : `Unable to update ${type}`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <section className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr_0.9fr_0.9fr]">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Reporter intake</p>
          <h2 className="mt-3 text-2xl font-black text-slate-950">Applications queue</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Approve reporters before login becomes active. Rejected accounts stay blocked until reviewed again.</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">Total</p>
          <p className="mt-4 text-4xl font-black">{counts.total}</p>
          <p className="mt-2 text-sm text-white/70">Reporter applications tracked</p>
        </div>
        <div className="rounded-[1.75rem] border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">Pending</p>
          <p className="mt-4 text-4xl font-black text-amber-950">{counts.pending}</p>
          <p className="mt-2 text-sm text-amber-800/80">Waiting for approval</p>
        </div>
        <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Approved</p>
          <p className="mt-4 text-4xl font-black text-emerald-950">{counts.active}</p>
          <p className="mt-2 text-sm text-emerald-800/80">Can log in now</p>
        </div>
      </div>

      {message ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{message}</div> : null}
      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</div> : null}

      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <h3 className="text-lg font-black text-slate-950">Reporter Applications</h3>
            <p className="mt-1 text-sm text-slate-500">Review every new reporter request and control access centrally.</p>
          </div>
          <Button type="button" className="bg-white px-4 py-2 text-slate-700 ring-1 ring-slate-300 hover:bg-slate-100" onClick={() => void loadReporters()}>
            Refresh
          </Button>
        </div>

        <div className="divide-y divide-slate-200">
          {loading ? (
            <div className="px-6 py-10 text-sm text-slate-500">Loading reporter queue...</div>
          ) : reporters.length === 0 ? (
            <div className="px-6 py-10 text-sm text-slate-500">No reporter applications yet.</div>
          ) : (
            reporters.map((reporter) => {
              const meta = statusMeta[reporter.approvalStatus];
              const isBusy = submittingId === reporter.id;

              return (
                <div key={reporter.id} className="grid gap-4 px-5 py-5 sm:px-6 lg:grid-cols-[1.2fr_0.7fr_0.9fr] lg:items-center">
                  <div>
                    <p className="text-base font-bold text-slate-950">{reporter.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{reporter.email}</p>
                    <p className="mt-2 text-xs font-medium text-slate-400">Applied on {new Date(reporter.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${meta.tone}`}>{meta.label}</span>
                    <p className="mt-2 text-sm text-slate-600">
                      Reviewed: {reporter.reviewedAt ? new Date(reporter.reviewedAt).toLocaleString() : "Not yet reviewed"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    <Button
                      type="button"
                      disabled={isBusy || viewingReporterId === reporter.id}
                      className="bg-slate-100 px-4 py-2 text-slate-700 ring-1 ring-slate-300 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={() => void viewReporterProfile(reporter.id)}
                    >
                      {viewingReporterId === reporter.id ? "Loading..." : "View profile"}
                    </Button>
                    <Button
                      type="button"
                      disabled={isBusy}
                      className="bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={() => void reviewReporter(reporter.id, "active")}
                    >
                      {isBusy && reporter.approvalStatus === "pending" ? "Approving..." : "Approve"}
                    </Button>
                    <Button
                      type="button"
                      disabled={isBusy}
                      className="bg-rose-600 px-4 py-2 text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={() => void reviewReporter(reporter.id, "rejected")}
                    >
                      {isBusy && reporter.approvalStatus === "pending" ? "Rejecting..." : "Reject"}
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {selectedReporter ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
              <div>
                <h3 className="text-xl font-black text-slate-950">Reporter Profile</h3>
                <p className="text-sm text-slate-600">{selectedReporter.reporter.name} ({selectedReporter.reporter.email})</p>
              </div>
              <Button type="button" className="bg-slate-100 px-4 py-2 text-slate-700 ring-1 ring-slate-300 hover:bg-slate-200" onClick={() => setSelectedReporter(null)}>
                Close
              </Button>
            </div>

            <div className="grid gap-6 p-6 lg:grid-cols-[1fr_1fr]">
              <section className="rounded-2xl border border-slate-200 p-4">
                <h4 className="text-base font-black text-slate-950">Profile Details</h4>
                <div className="mt-4 space-y-2 text-sm text-slate-700">
                  <p><span className="font-semibold">Status:</span> {statusMeta[selectedReporter.reporter.approvalStatus].label}</p>
                  <p><span className="font-semibold">Title:</span> {selectedReporter.reporter.title || "Not provided"}</p>
                  <p><span className="font-semibold">Location:</span> {selectedReporter.reporter.location || "Not provided"}</p>
                  <p><span className="font-semibold">Phone:</span> {selectedReporter.reporter.phone || "Not provided"}</p>
                  <p><span className="font-semibold">Joined:</span> {new Date(selectedReporter.reporter.createdAt).toLocaleString()}</p>
                  <p><span className="font-semibold">Reviewed:</span> {selectedReporter.reporter.reviewedAt ? new Date(selectedReporter.reporter.reviewedAt).toLocaleString() : "Not yet reviewed"}</p>
                </div>
                <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">Bio</p>
                  <p className="mt-1 whitespace-pre-wrap">{selectedReporter.reporter.bio || "No bio available"}</p>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 p-4">
                <h4 className="text-base font-black text-slate-950">Content Summary</h4>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-emerald-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Posts</p>
                    <p className="mt-2 text-2xl font-black text-emerald-900">{selectedReporter.posts.length}</p>
                  </div>
                  <div className="rounded-xl bg-indigo-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Pages</p>
                    <p className="mt-2 text-2xl font-black text-indigo-900">{selectedReporter.pages.length}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-semibold text-slate-900">Latest Posts</p>
                  <div className="mt-2 max-h-52 space-y-2 overflow-y-auto pr-1">
                    {selectedReporter.posts.length === 0 ? (
                      <p className="text-sm text-slate-500">No posts created yet.</p>
                    ) : (
                      selectedReporter.posts.map((post) => (
                        <div key={post.id} className="rounded-xl border border-slate-200 p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="font-medium text-slate-900">{post.title}</p>
                              <p className="mt-1 text-xs text-slate-500">{post.category} | {post.isPublished ? "Published" : "Draft"}</p>
                            </div>
                            <div className="flex flex-shrink-0 gap-1">
                              <Button
                                type="button"
                                disabled={actionLoading === `toggle-post-${post.id}`}
                                className={`px-2 py-1 text-xs font-semibold text-white ${post.isPublished ? "bg-slate-500 hover:bg-slate-600" : "bg-emerald-600 hover:bg-emerald-700"} disabled:cursor-not-allowed disabled:opacity-60`}
                                onClick={() => void togglePublishStatus("post", post.id, post.isPublished)}
                                title={post.isPublished ? "Unpublish" : "Publish"}
                              >
                                {actionLoading === `toggle-post-${post.id}` ? "..." : post.isPublished ? "Unpub" : "Pub"}
                              </Button>
                              <Button
                                type="button"
                                disabled={actionLoading === `post-${post.id}`}
                                className="px-2 py-1 text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                                onClick={() => void deleteItem("post", post.id)}
                                title="Delete post"
                              >
                                {actionLoading === `post-${post.id}` ? "Del..." : "Del"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-semibold text-slate-900">Latest Pages</p>
                  <div className="mt-2 max-h-52 space-y-2 overflow-y-auto pr-1">
                    {selectedReporter.pages.length === 0 ? (
                      <p className="text-sm text-slate-500">No pages created yet.</p>
                    ) : (
                      selectedReporter.pages.map((page) => (
                        <div key={page.id} className="rounded-xl border border-slate-200 p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="font-medium text-slate-900">{page.title}</p>
                              <p className="mt-1 text-xs text-slate-500">{page.templateType} | {page.isPublished ? "Published" : "Draft"}</p>
                            </div>
                            <div className="flex flex-shrink-0 gap-1">
                              <Button
                                type="button"
                                disabled={actionLoading === `toggle-page-${page.id}`}
                                className={`px-2 py-1 text-xs font-semibold text-white ${page.isPublished ? "bg-slate-500 hover:bg-slate-600" : "bg-emerald-600 hover:bg-emerald-700"} disabled:cursor-not-allowed disabled:opacity-60`}
                                onClick={() => void togglePublishStatus("page", page.id, page.isPublished)}
                                title={page.isPublished ? "Unpublish" : "Publish"}
                              >
                                {actionLoading === `toggle-page-${page.id}` ? "..." : page.isPublished ? "Unpub" : "Pub"}
                              </Button>
                              <Button
                                type="button"
                                disabled={actionLoading === `page-${page.id}`}
                                className="px-2 py-1 text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                                onClick={() => void deleteItem("page", page.id)}
                                title="Delete page"
                              >
                                {actionLoading === `page-${page.id}` ? "Del..." : "Del"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
