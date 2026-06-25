"use client";

import Link from "next/link";
import { useLang } from "@/lib/language-context";

type NewsDetailClientProps = {
  slug: string;
  title: string;
  category: string;
  publishedAt: string;
  readTime: number;
  content: string;
  description?: string;
  sourceUrl?: string;
  authorId?: { _id?: string; name?: string };
  categoryColor: string;
};

export function NewsDetailClient({
  title, category, publishedAt, readTime, content, description, sourceUrl, authorId, categoryColor,
}: NewsDetailClientProps) {
  const { t } = useLang();

  const handleShare = (platform: "facebook" | "twitter" | "copy") => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (platform === "facebook") window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
    else if (platform === "twitter") window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, "_blank");
    else void navigator.clipboard.writeText(url);
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-[1200px] px-4 py-3 sm:px-6 xl:px-10">
          <nav className="flex items-center gap-2 text-xs overflow-x-auto scrollbar-none" aria-label="Breadcrumb">
            <Link href="/" className="font-medium text-sky-600 hover:text-sky-800 transition-colors whitespace-nowrap">
              {t.home}
            </Link>
            <svg className="h-3 w-3 text-slate-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-medium text-slate-500 whitespace-nowrap">{category}</span>
            <svg className="h-3 w-3 text-slate-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-slate-400 line-clamp-1">{title}</span>
          </nav>
        </div>
      </div>

      <div className="w-full bg-slate-50">
        <div className="mx-auto max-w-[800px] px-4 py-10 sm:px-6 xl:px-6">

          {/* Category + Title */}
          <div className="mb-8 space-y-5">
            <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${categoryColor}`}>
              {category}
            </div>
            <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl xl:text-5xl">
              {title}
            </h1>
            {description && (
              <p className="text-lg text-slate-600 leading-relaxed border-l-4 border-sky-400 pl-5 py-1">
                {description}
              </p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-slate-100 py-4 text-sm text-slate-500">
              <span className="flex items-center gap-1.5 font-medium">
                <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {publishedAt}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {readTime} {t.minRead}
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                {t.updatedToday}
              </span>
              {authorId?._id && (
                <Link href={`/reporter/${authorId._id}`} className="flex items-center gap-1.5 font-semibold text-sky-700 hover:text-sky-900 transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  {t.by} {authorId.name || t.reporter}
                </Link>
              )}

              {/* Share row inline */}
              <div className="ml-auto flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-400 mr-1">{t.share}:</span>
                {[
                  { key: "facebook" as const, label: "Facebook", bg: "bg-blue-600 hover:bg-blue-700", icon: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /> },
                  { key: "twitter" as const, label: "Twitter", bg: "bg-sky-500 hover:bg-sky-600", icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" /> },
                  { key: "copy" as const, label: "Copy", bg: "bg-slate-700 hover:bg-slate-800", icon: null },
                ].map((s) => (
                  <button
                    key={s.key}
                    onClick={() => handleShare(s.key)}
                    title={s.label}
                    aria-label={`Share on ${s.label}`}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-white transition active:scale-95 ${s.bg}`}
                  >
                    {s.icon ? (
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">{s.icon}</svg>
                    ) : (
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="article-prose mb-10 rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm">
            <div dangerouslySetInnerHTML={{ __html: content }} />
            {sourceUrl && (
              <p className="mt-8 border-t border-slate-100 pt-6 text-sm text-slate-500">
                {t.source}:{" "}
                <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline font-medium">
                  {sourceUrl}
                </a>
              </p>
            )}
          </div>

          {/* Newsletter CTA */}
          <div className="mb-8 rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-blue-50 p-6 sm:p-8">
            <h3 className="mb-2 text-xl font-bold text-slate-900">{t.stayUpdated}</h3>
            <p className="mb-5 text-sm text-slate-600">{t.stayUpdatedDesc}</p>
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <input
                type="email"
                placeholder={t.enterEmail}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
              />
              <button className="rounded-xl bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 active:scale-95">
                {t.subscribe}
              </button>
            </div>
          </div>

          {/* Back Button */}
          <div className="flex justify-start">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 active:scale-95"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t.backToHome}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
