"use client";

import type { NewsRow } from "@/types";

type NewsTableProps = {
  rows: NewsRow[];
  showAuthor?: boolean;
  isLoading?: boolean;
  onDelete?: (row: NewsRow) => void;
  onEdit?: (row: NewsRow) => void;
  showActions?: boolean;
};

export function NewsTable({ rows, showAuthor = true, isLoading = false, onDelete, onEdit, showActions = false }: NewsTableProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-6">
        <h2 className="text-xl font-black text-slate-950">Your articles</h2>
        <p className="mt-1 text-sm text-slate-600">Posts you have created and published</p>
      </div>
      <div className="divide-y divide-slate-200">
        {isLoading ? (
          <div className="px-6 py-10 text-sm text-slate-500">Loading articles...</div>
        ) : rows.length === 0 ? (
          <div className="px-6 py-10 text-sm text-slate-500">No articles published yet. Create one to get started.</div>
        ) : (
          rows.map((row) => (
            <div key={row.id || row.title} className={`grid gap-3 p-6 ${showActions ? 'md:grid-cols-[1.5fr_0.7fr_0.6fr_0.8fr]' : 'md:grid-cols-[1.5fr_0.7fr_0.6fr]'} md:items-center`}>
              <div>
                <h3 className="font-semibold text-slate-950">{row.title}</h3>
                {showAuthor && <p className="text-sm text-slate-500">{row.author}</p>}
              </div>
              <span className="text-sm text-slate-600">{row.category}</span>
              <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {row.status}
              </span>
              {showActions && (
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit?.(row)}
                    className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete?.(row)}
                    className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}