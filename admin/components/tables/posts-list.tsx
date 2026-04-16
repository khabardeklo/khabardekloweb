"use client";

import Link from "next/link";
import { useState } from "react";
import type { NewsRow } from "@/types";

type PostsListProps = {
  posts: NewsRow[];
  onDelete?: (title: string) => void;
};

export function PostsList({ posts: initialPosts, onDelete }: PostsListProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = (title: string) => {
    setPosts(posts.filter((post) => post.title !== title));
    onDelete?.(title);
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-950">All Posts</h2>
        <Link
          href="/news"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          + New Post
        </Link>
      </div>

      {/* Posts Table */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-950">Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-950">Author</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-950">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-950">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-950">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No posts found. <Link href="/news" className="text-blue-600 hover:underline">Create one</Link>
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.title} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-950">{post.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600">{post.author}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600">{post.category}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          post.status === "Published"
                            ? "bg-green-100 text-green-800"
                            : post.status === "Draft"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/news?edit=${encodeURIComponent(post.title)}`}
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                        >
                          ✏️ Edit
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(post.title)}
                          className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition"
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
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h3 className="text-lg font-bold text-slate-950">Delete Post?</h3>
            <p className="mt-2 text-slate-600">Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
