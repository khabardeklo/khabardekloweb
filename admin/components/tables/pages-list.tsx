"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { PageRow } from "@/types";

type PagesListProps = {
  pages: PageRow[];
  categories: Array<{ label: string; value: string }>;
  onDelete?: (id: string) => void;
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

export function PagesList({ pages: initialPages, categories, onDelete }: PagesListProps) {
  const [pages, setPages] = useState(initialPages);
  const [activeCategory, setActiveCategory] = useState(categories[0]?.value || "");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    setPages(initialPages);
  }, [initialPages]);

  useEffect(() => {
    if (!categories.some((category) => category.value === activeCategory)) {
      setActiveCategory(categories[0]?.value || "");
    }
  }, [categories, activeCategory]);

  const filteredPages = pages.filter((page) => page.category === activeCategory);

  const handleDelete = async (id: string) => {
    setDeleting(true);
    setDeleteError(null);
    try {
      const response = await fetch(`${backendUrl}/pages/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message || "Failed to delete page");
      }
      setPages(pages.filter((page) => page.id !== id));
      onDelete?.(id);
      setDeleteConfirm(null);
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "Failed to delete page");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-950">All Pages</h2>
        <Link
          href="/create-pages"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          + New Page
        </Link>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => setActiveCategory(category.value)}
            className={`px-4 py-3 font-medium text-sm transition border-b-2 ${
              activeCategory === category.value
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Pages Table */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-950">Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-950">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-950">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-950">Created</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-950">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredPages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No pages found in this category. <Link href="/create-pages" className="text-blue-600 hover:underline">Create one</Link>
                  </td>
                </tr>
              ) : (
                filteredPages.map((page) => (
                  <tr key={page.id || page.title} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-950">{page.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {page.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          page.status === "Published"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {page.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600">{page.createdAt}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={page.id ? `/create-pages?editId=${encodeURIComponent(page.id)}` : "/create-pages"}
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                        >
                          ✏️ Edit
                        </Link>
                        <button
                          onClick={() => page.id && setDeleteConfirm(page.id)}
                          disabled={!page.id}
                          className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition disabled:opacity-50"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-lg bg-white p-6 shadow-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-slate-950">Delete Page?</h3>
            <p className="mt-2 text-slate-600">Are you sure you want to delete this page? This action cannot be undone.</p>
            {deleteError ? <p className="mt-2 text-sm text-red-600">{deleteError}</p> : null}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => { setDeleteConfirm(null); setDeleteError(null); }}
                disabled={deleting}
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleDelete(deleteConfirm)}
                disabled={deleting}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
