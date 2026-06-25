"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/layout/admin-shell";
import { PagesList } from "@/components/tables/pages-list";
import { pageCategories } from "@/lib/constants";
import type { PageRow } from "@/types";

type BackendPage = {
  _id?: string;
  title?: string;
  templateType?: string;
  isPublished?: boolean;
  createdAt?: string;
};

import { backendUrl } from "@/lib/config";

const toDateLabel = (value?: string): string => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function PagesPage() {
  const [pages, setPages] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPages = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${backendUrl}/pages`, {
          credentials: "include",
        });

        const data = (await response.json().catch(() => null)) as BackendPage[] | { message?: string } | null;

        if (!response.ok || !Array.isArray(data)) {
          const message = !Array.isArray(data) ? data?.message : undefined;
          throw new Error(message || "Unable to load pages");
        }

        const mappedPages: PageRow[] = data.map((page, index) => ({
          id: page._id,
          title: page.title || `Untitled ${index + 1}`,
          category: page.templateType || "general",
          status: page.isPublished ? "Published" : "Draft",
          createdAt: toDateLabel(page.createdAt),
        }));

        setPages(mappedPages);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Unable to load pages");
      } finally {
        setLoading(false);
      }
    };

    void loadPages();
  }, []);

  const categories = useMemo(() => {
    const fromDefaults = pageCategories.map((item) => ({ ...item }));
    const defaultsMap = new Map(fromDefaults.map((item) => [item.value, item]));

    pages.forEach((page) => {
      const value = page.category;
      if (!value || defaultsMap.has(value)) {
        return;
      }

      defaultsMap.set(value, {
        value,
        label: value.charAt(0).toUpperCase() + value.slice(1),
      });
    });

    return Array.from(defaultsMap.values());
  }, [pages]);

  return (
    <AdminShell title="Pages" subtitle="Manage all your pages.">
      {loading ? <p className="text-sm text-slate-600">Loading pages...</p> : null}
      {error ? <p className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
      <PagesList pages={pages} categories={categories} />
    </AdminShell>
  );
}
