"use client";
import { useState } from "react";
import Link from "next/link";
import type { HomeNewsItem } from "@/lib/home-content";

type Props = { items: HomeNewsItem[]; limit?: number; title?: string };

export function NewsIn30Seconds({ items, limit = 6, title = "News in 30 Seconds" }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const list = items.slice(0, limit);

  if (!list.length) return null;

  const active = list[activeIdx];

  return (
    <section className="mb-10" aria-label="News in 30 seconds">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="h-6 w-1 rounded-full bg-amber-500" />
        <span className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white shadow">
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          30 Sec
        </span>
        <h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left: number list */}
        <div className="lg:col-span-4 space-y-2">
          {list.map((item, i) => (
            <button
              key={item.slug}
              onClick={() => setActiveIdx(i)}
              className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
                i === activeIdx
                  ? "border-amber-400 bg-amber-50 shadow-md"
                  : "border-slate-100 bg-white hover:border-amber-200 hover:bg-amber-50/50"
              }`}
            >
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                i === activeIdx ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-500"
              }`}>
                {i + 1}
              </span>
              <span className={`line-clamp-2 text-sm font-semibold leading-snug ${
                i === activeIdx ? "text-amber-800" : "text-slate-700"
              }`}>
                {item.title}
              </span>
            </button>
          ))}
        </div>

        {/* Right: active card */}
        <div className="lg:col-span-8">
          <Link href={`/news/${active.slug}`} className="group block h-full rounded-2xl overflow-hidden relative" style={{ minHeight: 320 }}>
            <img
              src={active.image}
              alt={active.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-6">
              <span className="inline-block rounded-full bg-amber-500 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white mb-3">
                {active.category}
              </span>
              <h3 className="text-xl font-black leading-snug text-white sm:text-2xl drop-shadow line-clamp-2">{active.title}</h3>
              {active.description && (
                <p className="mt-2 line-clamp-2 text-sm text-slate-300">{active.description}</p>
              )}
              <div className="mt-4 flex items-center gap-3">
                <span className="text-xs text-slate-400">{active.publishedAt}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition group-hover:bg-white/30">
                  Read in 30s
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
