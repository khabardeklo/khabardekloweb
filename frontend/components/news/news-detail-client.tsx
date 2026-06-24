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
  slug,
  title,
  category,
  publishedAt,
  readTime,
  content,
  description,
  sourceUrl,
  authorId,
  categoryColor,
}: NewsDetailClientProps) {
  const { t } = useLang();

  const handleShare = (platform: "facebook" | "twitter" | "copy") => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
    } else if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, "_blank");
    } else {
      void navigator.clipboard.writeText(url);
    }
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-slate-200 bg-white overflow-x-hidden">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm overflow-x-auto pb-2">
            <Link href="/" className="font-medium text-sky-700 hover:text-sky-900 transition-colors whitespace-nowrap">
              {t.home}
            </Link>
            <span className="text-slate-400">/</span>
            <span className="font-medium text-slate-600 whitespace-nowrap">{category}</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-500 line-clamp-1">{title}</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="mb-8 space-y-4">
        <div className={`inline-block rounded-full border px-4 py-2 text-sm font-semibold uppercase tracking-wide ${categoryColor}`}>
          {category}
        </div>
        <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-5xl break-words">{title}</h1>
        {description && (
          <p className="text-lg text-slate-600 leading-relaxed border-l-4 border-sky-400 pl-4">{description}</p>
        )}
        <div className="flex flex-wrap items-center gap-6 border-b border-slate-200 pb-6 text-sm text-slate-600">
          <span className="font-medium">{publishedAt}</span>
          <span className="font-medium">{readTime} {t.minRead}</span>
          <span className="font-medium">{t.updatedToday}</span>
          {authorId?._id && (
            <>
              <div className="h-1 w-1 rounded-full bg-slate-400" />
              <Link href={`/reporter/${authorId._id}`} className="font-medium text-sky-700 hover:text-sky-900">
                {t.by} {authorId.name || t.reporter}
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Share Buttons */}
      <div className="mb-8 flex items-center gap-3">
        <span className="text-sm font-semibold text-slate-600">{t.share}:</span>
        <button onClick={() => handleShare("facebook")} title="Facebook" aria-label="Share on Facebook"
          className="inline-flex items-center justify-center rounded-full bg-blue-600 p-3 text-white hover:bg-blue-700 hover:shadow-lg transition-all">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </button>
        <button onClick={() => handleShare("twitter")} title="Twitter" aria-label="Share on Twitter"
          className="inline-flex items-center justify-center rounded-full bg-sky-500 p-3 text-white hover:bg-sky-600 hover:shadow-lg transition-all">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </button>
        <button onClick={() => handleShare("copy")} title="Copy link" aria-label="Copy link"
          className="inline-flex items-center justify-center rounded-full bg-slate-700 p-3 text-white hover:bg-slate-800 hover:shadow-lg transition-all">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      {/* Article Content */}
      <div className="article-prose mb-12 overflow-x-hidden">
        <div dangerouslySetInnerHTML={{ __html: content }} />
        {sourceUrl && (
          <p className="mt-6 text-xs text-slate-400 border-t border-slate-100 pt-4">
            {t.source}:{" "}
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">
              {sourceUrl}
            </a>
          </p>
        )}
      </div>

      {/* CTA */}
      <div className="rounded-3xl border border-sky-200 bg-gradient-to-r from-sky-50 to-blue-50 p-8 md:p-12">
        <h3 className="mb-2 text-2xl font-bold text-slate-950">{t.stayUpdated}</h3>
        <p className="mb-6 text-slate-600">{t.stayUpdatedDesc}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input type="email" placeholder={t.enterEmail}
            className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
          <button className="rounded-lg bg-sky-600 px-6 py-3 font-semibold text-white hover:bg-sky-700 hover:shadow-lg transition-all">
            {t.subscribe}
          </button>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-12 flex justify-center">
        <Link href="/" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 transition-all">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t.backToHome}
        </Link>
      </div>
    </>
  );
}
