"use client";

import { useState, useMemo } from "react";
import { NewsCard } from "./news-card";
import type { NewsItem } from "@/types";
import styles from "./news-grid.module.css";

type NewsGridProps = {
  items: NewsItem[];
};

export function NewsGrid({ items }: NewsGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"latest" | "trending">("latest");

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(items.map((item) => item.category));
    return Array.from(cats);
  }, [items]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let filtered = items;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (sortBy === "trending") {
      filtered = [...filtered].sort((a, b) => {
        // Simple trending sort - could be extended with view counts
        return Math.random() - 0.5;
      });
    }

    return filtered;
  }, [items, selectedCategory, sortBy]);

  return (
    <div className={styles.container}>
      {/* Filter & View Controls */}
      <div className={styles.filterBar}>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`${styles.filterButton} ${selectedCategory === "all" ? styles.active : ""}`}
          >
            All Articles
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`${styles.filterButton} ${selectedCategory === category ? styles.active : ""}`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3">
          {/* Sort Options */}
          <select
            title="Sort articles by latest or trending"
            aria-label="Sort articles"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "latest" | "trending")}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            <option value="latest">Latest</option>
            <option value="trending">Trending</option>
          </select>

          {/* View Mode Toggle */}
          <div className={styles.viewToggle}>
            <button
              onClick={() => setViewMode("grid")}
              className={`${styles.viewButton} ${viewMode === "grid" ? styles.active : ""}`}
              title="Grid view"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
              </svg>
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`${styles.viewButton} ${viewMode === "list" ? styles.active : ""}`}
              title="List view"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
              </svg>
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>
      </div>

      {/* News Items */}
      {filteredItems.length > 0 ? (
        <div className={viewMode === "grid" ? styles.gridLayout : styles.listLayout}>
          {filteredItems.map((item) => (
            <NewsCard key={item.slug} item={item} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <svg
            className={styles.emptyStateIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2m2 2a2 2 0 002-2m-2 2v-6a2 2 0 012-2h.5a2 2 0 012 2v6a2 2 0 01-2 2h-.5z"
            />
          </svg>
          <p className={styles.emptyStateText}>No articles found</p>
          <p className={styles.emptyStateSubtext}>
            Try adjusting your filters or check back later
          </p>
        </div>
      )}

      {/* Results Count */}
      {filteredItems.length > 0 && (
        <p className="text-center text-sm text-slate-600">
          Showing <span className="font-semibold text-slate-900">{filteredItems.length}</span> article
          {filteredItems.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}