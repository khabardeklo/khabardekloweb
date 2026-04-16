"use client";

import { useState, useEffect } from "react";
import { NewsGrid } from "@/components/news/news-grid";
import type { NewsItem } from "@/types";

type CategoryPageClientProps = {
  categoryName: string;
  categoryColor: string;
  icon: React.ReactNode;
};

export function CategoryPageClient({ categoryName, categoryColor, icon }: CategoryPageClientProps) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNewsItems = async () => {
      try {
        // This would fetch from your backend filtered by category
        // For now, using mock data pattern
        setItems([]);
      } catch (error) {
        console.error("Failed to load news items:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNewsItems();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className={`${categoryColor} border-b border-slate-200`}>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-white rounded-full shadow-sm">{icon}</div>
            <div>
              <h1 className="text-4xl font-black text-slate-950">{categoryName}</h1>
              <p className="mt-2 text-slate-600">Latest stories and updates</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-sky-500"></div>
              <p className="mt-4 text-slate-600">Loading articles...</p>
            </div>
          </div>
        ) : items.length > 0 ? (
          <NewsGrid items={items} />
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-4 text-lg font-semibold text-slate-700">No articles yet</p>
              <p className="text-slate-500">Check back soon for {categoryName.toLowerCase()} news</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
