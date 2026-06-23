"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/layout/admin-shell";

type CategoryItem = {
  slug: string;
  name: string;
  description?: string;
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch(`${backendUrl}/categories`, { credentials: "include" });
        const data = (await response.json().catch(() => null)) as CategoryItem[] | null;
        if (!response.ok || !Array.isArray(data)) {
          throw new Error("Unable to load categories");
        }
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load categories");
      } finally {
        setLoading(false);
      }
    };

    void loadCategories();
  }, []);

  return (
    <AdminShell title="Categories" subtitle="Organize editorial sections and taxonomy.">
      {loading ? <p className="text-sm text-slate-600">Loading categories...</p> : null}
      {error ? <p className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
      {!loading && !error ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div key={category.slug} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-700">{category.name}</p>
                {category.description ? (
                  <p className="mt-1 text-xs text-slate-500">{category.description}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </AdminShell>
  );
}
