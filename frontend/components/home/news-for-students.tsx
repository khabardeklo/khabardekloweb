"use client";
import { useState } from "react";
import Link from "next/link";
import type { HomeNewsItem } from "@/lib/home-content";

type Props = { items: HomeNewsItem[]; limit?: number; title?: string };

const SUBJECTS = ["All", "Politics", "Technology", "Sports", "Health", "Business", "Entertainment"];

export function NewsForStudents({ items, limit = 8, title = "News for Students" }: Props) {
  const [activeSubject, setActiveSubject] = useState("All");

  const list = items
    .slice(0, limit * 2)
    .filter((item) =>
      activeSubject === "All"
        ? true
        : item.category?.toLowerCase() === activeSubject.toLowerCase()
    )
    .slice(0, limit);

  if (!items.length) return null;

  return (
    <section className="mb-10" aria-label="News for students">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="h-6 w-1 rounded-full bg-indigo-600" />
        <span className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white shadow">
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
          </svg>
          Students
        </span>
        <h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {title}
        </h2>
      </div>

      {/* Subject filter chips */}
      <div className="mb-5 flex flex-wrap gap-2">
        {SUBJECTS.map((subject) => (
          <button
            key={subject}
            onClick={() => setActiveSubject(subject)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
              subject === activeSubject
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
            }`}
          >
            {subject}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-12 text-center text-sm text-slate-400">
          No news found for this subject.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((item) => (
            <article key={item.slug} className="group flex flex-col rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="relative aspect-video overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-2 left-2 flex gap-1.5">
                  <span className="rounded-full bg-indigo-600 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wide">
                    {item.category}
                  </span>
                  <span className="rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-bold text-white">
                    Easy Read
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="line-clamp-2 text-sm font-bold leading-snug text-slate-900">
                  <Link href={`/news/${item.slug}`} className="hover:text-indigo-700 transition-colors">
                    {item.title}
                  </Link>
                </h3>
                {item.description && (
                  <p className="mt-2 line-clamp-2 text-xs text-slate-500 leading-relaxed">{item.description}</p>
                )}
                {/* Key point pill */}
                <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-2">
                  <svg className="h-3.5 w-3.5 shrink-0 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[11px] font-medium text-indigo-700 line-clamp-1">
                    {item.description ? item.description.split(".")[0] + "." : "Key update for students."}
                  </span>
                </div>
                <div className="mt-auto pt-3 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">{item.publishedAt}</span>
                  <Link href={`/news/${item.slug}`} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                    Read →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
