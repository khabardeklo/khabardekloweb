"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminShell } from "@/components/layout/admin-shell";
import { ReporterPageForm } from "@/components/forms/reporter-page-form";

type PageTemplateType = "frontend-header" | "frontend-footer" | "header-menu" | "custom";

type EditPage = {
  id: string;
  title: string;
  slug: string;
  templateType: PageTemplateType;
  menuLabel?: string;
  content: string;
  isPublished: boolean;
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

function CreatePagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");

  const [loadingEditPage, setLoadingEditPage] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editPage, setEditPage] = useState<EditPage | null>(null);

  useEffect(() => {
    if (!editId) {
      setEditPage(null);
      setEditError(null);
      setLoadingEditPage(false);
      return;
    }

    const loadPageForEdit = async () => {
      setLoadingEditPage(true);
      setEditError(null);

      try {
        const response = await fetch(`${backendUrl}/pages/admin/${editId}`, {
          credentials: "include",
        });

        const data = (await response.json().catch(() => null)) as Record<string, unknown> | null;

        if (!response.ok || !data) {
          throw new Error((data?.message as string) || "Unable to load page for editing");
        }

        setEditPage({
          id: data._id as string,
          title: data.title as string,
          slug: data.slug as string,
          templateType: (data.templateType as PageTemplateType) || "custom",
          menuLabel: (data.menuLabel as string) || "",
          content: data.content as string,
          isPublished: Boolean(data.isPublished),
        });
      } catch (requestError) {
        setEditError(requestError instanceof Error ? requestError.message : "Unable to load page for editing");
        setEditPage(null);
      } finally {
        setLoadingEditPage(false);
      }
    };

    void loadPageForEdit();
  }, [editId]);

  return (
    <AdminShell
      title={editId ? "Edit Page" : "Create Pages"}
      subtitle={editId ? "Update your page using the same TipTap workflow." : "Build and manage pages with the same modern TipTap editor workflow."}
    >
      <section className="mt-2">
        {loadingEditPage ? <p className="mb-3 text-sm text-slate-600">Loading selected page...</p> : null}
        {editError ? <p className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{editError}</p> : null}
        <ReporterPageForm
          authorName="Super Admin"
          postToEdit={editPage}
          onCancelEdit={() => router.push("/create-pages")}
          onSuccess={() => {
            if (editId) router.push("/pages");
          }}
        />
      </section>
    </AdminShell>
  );
}

export default function CreatePagesPage() {
  return (
    <Suspense fallback={<AdminShell title="Create Pages" subtitle="Build and manage pages with the same modern TipTap editor workflow."><section className="mt-2"><p className="mb-3 text-sm text-slate-600">Loading page editor...</p></section></AdminShell>}>
      <CreatePagesContent />
    </Suspense>
  );
}
