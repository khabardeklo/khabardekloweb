"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/layout/admin-shell";
import { PostsList } from "@/components/tables/posts-list";
import type { NewsRow } from "@/types";

type NewsApiItem = {
  _id?: string;
  title?: string;
  category?: string;
  isPublished?: boolean;
  authorId?: {
    name?: string;
  } | null;
};

import { backendUrl } from "@/lib/config";

export default function PostsPage() {
  const [posts, setPosts] = useState<NewsRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${backendUrl}/news`, {
          credentials: "include",
        });

        const data = (await response.json().catch(() => null)) as NewsApiItem[] | { message?: string } | null;

        if (!response.ok || !Array.isArray(data)) {
          const message = !Array.isArray(data) ? data?.message : undefined;
          throw new Error(message || "Unable to load posts");
        }

        const mappedRows: NewsRow[] = data.map((post, index) => ({
          id: post._id,
          title: post.title || `Untitled ${index + 1}`,
          author: post.authorId?.name || "Unknown",
          category: post.category || "General",
          status: post.isPublished ? "Published" : "Draft",
        }));

        setPosts(mappedRows);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Unable to load posts");
      } finally {
        setLoading(false);
      }
    };

    void loadPosts();
  }, []);

  return (
    <AdminShell title="Posts" subtitle="Manage all your posts and articles.">
      {loading ? <p className="text-sm text-slate-600">Loading posts...</p> : null}
      {error ? <p className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
      <PostsList posts={posts} />
    </AdminShell>
  );
}
