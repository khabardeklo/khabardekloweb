"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminShell } from "@/components/layout/admin-shell";
import { ReporterNewsForm } from "@/components/forms/reporter-news-form";

type EditPost = {
  id: string;
  title: string;
  category: string;
  description?: string;
  content: string;
  tags: string[];
  isPublished: boolean;
  scheduledAt?: string | null;
};

import { backendUrl } from "@/lib/config";

function NewsManagementContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");

  const [loadingEditPost, setLoadingEditPost] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editPost, setEditPost] = useState<EditPost | null>(null);

  useEffect(() => {
    if (!editId) {
      setEditPost(null);
      setEditError(null);
      setLoadingEditPost(false);
      return;
    }

    const loadPostForEdit = async () => {
      setLoadingEditPost(true);
      setEditError(null);

      try {
        const response = await fetch(`${backendUrl}/news/admin/${editId}`, {
          credentials: "include",
        });

        const data = (await response.json().catch(() => null)) as Record<string, unknown> | null;

        if (!response.ok || !data) {
          throw new Error((data?.message as string) || "Unable to load post for editing");
        }

        setEditPost({
          id: data._id as string,
          title: data.title as string,
          category: data.category as string,
          description: (data.description as string) || "",
          content: data.content as string,
          tags: (data.tags as string[]) || [],
          isPublished: Boolean(data.isPublished),
          scheduledAt: (data.scheduledAt as string) || null,
        });
      } catch (requestError) {
        setEditError(requestError instanceof Error ? requestError.message : "Unable to load post for editing");
        setEditPost(null);
      } finally {
        setLoadingEditPost(false);
      }
    };

    void loadPostForEdit();
  }, [editId]);

  return (
    <AdminShell
      title="News Desk"
      subtitle="Create posts using the exact same editor and workflow as reporter post creation."
    >
      <section className="mt-2">
        {loadingEditPost ? <p className="mb-3 text-sm text-slate-600">Loading selected post...</p> : null}
        {editError ? <p className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{editError}</p> : null}
        <ReporterNewsForm
          authorName="Super Admin"
          postToEdit={editPost}
          onCancelEdit={() => router.push("/news")}
          onSuccess={() => {
            if (editId) router.push("/posts");
          }}
        />
      </section>
    </AdminShell>
  );
}

export default function NewsManagementPage() {
  return (
    <Suspense
      fallback={
        <AdminShell
          title="News Desk"
          subtitle="Create posts using the exact same editor and workflow as reporter post creation."
        >
          <section className="mt-2">
            <p className="mb-3 text-sm text-slate-600">Loading selected post...</p>
          </section>
        </AdminShell>
      }
    >
      <NewsManagementContent />
    </Suspense>
  );
}
