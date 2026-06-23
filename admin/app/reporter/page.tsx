"use client";

import { useEffect, useState } from "react";
import { ReporterShell } from "@/components/layout/reporter-shell";
import { NewsTable } from "@/components/tables/news-table";
import { ReporterNewsForm } from "@/components/forms/reporter-news-form";
import { ReporterPageForm } from "@/components/forms/reporter-page-form";
import { ReporterPagesList } from "@/components/tables/reporter-pages-list";
import { ProfileEditForm } from "@/components/forms/profile-edit-form";
import { reporterNav } from "@/lib/constants";
import type { NewsRow } from "@/types";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

type ReporterPost = {
  _id: string;
  title: string;
  content: string;
  category: string;
  description?: string;
  tags?: string[];
  isPublished: boolean;
  scheduledAt?: string | null;
  createdAt: string;
  authorId: {
    _id: string;
    id?: string;
    name: string;
    email: string;
  };
};

type ReporterPostRow = NewsRow & {
  id: string;
  content: string;
  description?: string;
  tags: string[];
  isPublished: boolean;
  scheduledAt?: string | null;
};

type ReporterPage = {
  _id: string;
  title: string;
  slug: string;
  templateType: string;
  isPublished: boolean;
  createdAt: string;
  authorId: {
    _id: string;
    id?: string;
    name: string;
    email: string;
  };
};

type PageRow = {
  id: string;
  title: string;
  templateType: string;
  status: string;
};

type CurrentUser = {
  id: string;
  _id?: string;
  name: string;
  email: string;
};

type Tab = "posts" | "pages" | "profile";

export default function ReporterWorkspacePage() {
  const [activeTab, setActiveTab] = useState<Tab>("posts");
  const [posts, setPosts] = useState<ReporterPostRow[]>([]);
  const [pages, setPages] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorName, setAuthorName] = useState("Reporter");
  const [refreshKey, setRefreshKey] = useState(0);
  const [reporterId, setReporterId] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<ReporterPostRow | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: "post" | "page"; title: string; id?: string } | null>(null);

  useEffect(() => {
    const loadReporterData = async () => {
      setLoading(true);
      try {
        let currentReporterId = reporterId;

        // Get current reporter info
        const meResponse = await fetch(`${backendUrl}/auth/me`, { credentials: "include" });
        if (meResponse.ok) {
          const userData = (await meResponse.json()) as CurrentUser | null;
          if (userData) {
            const userId = userData.id || userData._id;
            currentReporterId = userId || null;
            setReporterId(userId || null);
            if (userData.name) {
              setAuthorName(userData.name);
            }
          }
        }

        // Get all news and pages
        const [newsResponse, pagesResponse] = await Promise.all([
          fetch(`${backendUrl}/news`, { credentials: "include" }),
          fetch(`${backendUrl}/pages`, { credentials: "include" }),
        ]);

        if (newsResponse.ok) {
          const allNews = (await newsResponse.json()) as ReporterPost[] | null;
          if (allNews && Array.isArray(allNews)) {
            // Filter posts by current reporter
            const reporterPosts = allNews
              .filter((post) => {
                const authorId = post.authorId?._id || post.authorId?.id;
                return authorId === currentReporterId;
              })
              .map((post) => ({
                id: post._id,
                title: post.title,
                content: post.content || "",
                description: post.description || "",
                tags: post.tags || [],
                author: post.authorId?.name || "Unknown",
                category: post.category,
                status: post.isPublished ? "Published" : "Draft",
                isPublished: post.isPublished,
                scheduledAt: post.scheduledAt || null,
              }));
            setPosts(reporterPosts);
          }
        }

        if (pagesResponse.ok) {
          const allPages = (await pagesResponse.json()) as ReporterPage[] | null;
          if (allPages && Array.isArray(allPages)) {
            // Filter pages by current reporter
            const reporterPages = allPages
              .filter((page) => {
                const authorId = page.authorId?._id || page.authorId?.id;
                return authorId === currentReporterId;
              })
              .map((page) => ({
                id: page._id,
                title: page.title,
                templateType: page.templateType,
                status: page.isPublished ? "Published" : "Draft",
              }));
            setPages(reporterPages);
          }
        }
      } catch (error) {
        console.error("Failed to load reporter data:", error);
      } finally {
        setLoading(false);
      }
    };

    void loadReporterData();
  }, [refreshKey]); // reporterId intentionally excluded - we fetch it fresh each time

  const handleSuccess = () => {
    setEditingPost(null);
    setRefreshKey((prev) => prev + 1);
  };

  const handleDeletePost = async (id: string) => {
    const post = posts.find((p) => p.id === id);
    if (!post) return;

    try {
      const response = await fetch(`${backendUrl}/news/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message || "Failed to delete post");
      }

      setPosts(posts.filter((p) => p.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Delete error:", error);
      alert(error instanceof Error ? error.message : "Failed to delete post");
    }
  };

  const handleDeletePage = async (id: string) => {
    try {
      const response = await fetch(`${backendUrl}/pages/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message || "Failed to delete page");
      }

      setPages(pages.filter((p) => p.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Delete error:", error);
      alert(error instanceof Error ? error.message : "Failed to delete page");
    }
  };

  const handleDelete = (type: "post" | "page", title: string, id?: string) => {
    setDeleteConfirm({ type, title, id });
  };

  const handleEditPost = (id: string) => {
    const selectedPost = posts.find((post) => post.id === id) || null;
    setEditingPost(selectedPost);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === "post") {
      if (!deleteConfirm.id) return;
      await handleDeletePost(deleteConfirm.id);
    } else {
      if (!deleteConfirm.id) return;
      await handleDeletePage(deleteConfirm.id);
    }
  };

  return (
    <ReporterShell
      title="Reporter Workspace"
      subtitle="Create and manage your posts, articles, and pages."
      navItems={reporterNav}
    >
      {/* Tab Navigation */}
      <div className="border-b border-slate-200">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("posts")}
            className={`px-4 py-3 font-medium text-sm transition border-b-2 ${
              activeTab === "posts"
                ? "border-slate-950 text-slate-950"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            📝 Create Post
          </button>
          <button
            onClick={() => setActiveTab("pages")}
            className={`px-4 py-3 font-medium text-sm transition border-b-2 ${
              activeTab === "pages"
                ? "border-slate-950 text-slate-950"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            📄 Create Pages
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-3 font-medium text-sm transition border-b-2 ${
              activeTab === "profile"
                ? "border-slate-950 text-slate-950"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            👤 My Profile
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-2xl bg-white p-6 shadow-lg max-w-sm">
            <h3 className="text-lg font-bold text-slate-950">
              Delete {deleteConfirm.type === "post" ? "Post" : "Page"}?
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to delete "{deleteConfirm.title}"? This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Posts Tab */}
      {activeTab === "posts" && (
        <section className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <ReporterNewsForm
            authorName={authorName}
            onSuccess={handleSuccess}
            postToEdit={
              editingPost
                ? {
                    id: editingPost.id,
                    title: editingPost.title,
                    category: editingPost.category,
                    description: editingPost.description,
                    content: editingPost.content,
                    tags: editingPost.tags,
                    isPublished: editingPost.isPublished,
                    scheduledAt: editingPost.scheduledAt,
                  }
                : null
            }
            onCancelEdit={() => setEditingPost(null)}
          />
          <NewsTable
            rows={posts}
            showAuthor={false}
            isLoading={loading}
            showActions={true}
            onDelete={(row) => handleDelete("post", row.title, row.id)}
            onEdit={(row) => row.id && handleEditPost(row.id)}
          />
        </section>
      )}

      {/* Pages Tab */}
      {activeTab === "pages" && (
        <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
          <ReporterPageForm authorName={authorName} onSuccess={handleSuccess} />
          <ReporterPagesList
            pages={pages}
            isLoading={loading}
            onDelete={(id) => handleDelete("page", "", id)}
            onEdit={(id) => alert("Edit functionality coming soon")}
          />
        </section>
      )}

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <section className="mt-6">
          <ProfileEditForm />
        </section>
      )}
    </ReporterShell>
  );
}
