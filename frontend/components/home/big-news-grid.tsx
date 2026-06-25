"use client";

import Link from "next/link";
import type { HomeNewsItem } from "@/lib/home-content";
import { useLang } from "@/lib/language-context";

type BigNewsGridProps = { items: HomeNewsItem[]; title?: string; ctaLabel?: string; ctaHref?: string; limit?: number };

const BADGE_COLORS: Record<string, string> = {
  politics: "badge-politics",
  sports: "badge-sports",
  technology: "badge-technology",
  entertainment: "badge-entertainment",
  business: "badge-business",
  health: "badge-health",
};
function getBadge(category: string) {
  return BADGE_COLORS[category?.toLowerCase()] ?? "badge-default";
}

export function BigNewsGrid({ items, title, ctaLabel, ctaHref = "/news", limit = 7 }: BigNewsGridProps) {
  const { t } = useLang();
  const resolvedTitle = title ?? t.topNews;
  const resolvedCtaLabel = ctaLabel ?? t.allNews;
  const [featured, ...rest] = items.slice(0, limit);
  const secondaryItems = rest.slice(0, 2);
  const gridItems = rest.slice(2, 6);

  if (!featured) return null;

  return (
    <section aria-label="Top news" className="mb-10">
      {/* Section Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex items-center gap-3">
          <span className="section-pill">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" /></svg>
            Breaking
          </span>
          <h2
            className="text-xl font-black tracking-tight sm:text-2xl gradient-text-news"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {resolvedTitle}
          </h2>
        </div>
        <div className="ml-auto">
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-indigo-200 transition hover:shadow-indigo-300 hover:scale-105 active:scale-95"
          >
            {resolvedCtaLabel}
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Hero + Secondary Row */}
      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <article className="group relative overflow-hidden rounded-2xl lg:col-span-7" style={{ minHeight: 380 }}>
          <Link href={`/news/${featured.slug}`} className="block h-full">
            <img
              src={featured.image}
              alt={featured.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/20 to-transparent" />

            {/* Top badges */}
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
              <span className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-widest ${getBadge(featured.category)}`}>
                {featured.category}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {featured.publishedAt}
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
              <h3 className="text-2xl font-black leading-snug text-white sm:text-[1.75rem] drop-shadow line-clamp-3">
                {featured.title}
              </h3>
              {featured.description && (
                <p className="mt-2 line-clamp-2 text-sm text-slate-300/90">{featured.description}</p>
              )}
              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500/30 to-purple-500/20 border border-white/25 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-sm transition group-hover:from-indigo-500/50 group-hover:to-purple-500/40">
                Read Full Story
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </article>

        {/* Secondary 2 stories */}
        <div className="grid grid-rows-2 gap-4 lg:col-span-5">
          {secondaryItems.map((item) => (
            <article key={item.slug} className="group relative overflow-hidden rounded-2xl" style={{ minHeight: 174 }}>
              <Link href={`/news/${item.slug}`} className="block h-full w-full">
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <span className={`mb-1.5 inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getBadge(item.category)}`}>
                    {item.category}
                  </span>
                  <h3 className="line-clamp-2 text-sm font-bold leading-tight text-white drop-shadow-sm">{item.title}</h3>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      {/* Bottom grid — 4 small cards */}
      {gridItems.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {gridItems.map((item) => (
            <article
              key={item.slug}
              className="group flex flex-col overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm card-lift glow-card"
            >
              <Link href={`/news/${item.slug}`} className="block overflow-hidden">
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                    loading="lazy"
                  />
                </div>
              </Link>
              <div className="flex flex-1 flex-col p-3.5">
                <span className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-sky-600">
                  {item.category}
                </span>
                <h3 className="line-clamp-2 text-[13px] font-bold leading-snug text-slate-900">
                  <Link href={`/news/${item.slug}`} className="hover:text-sky-700 transition-colors">
                    {item.title}
                  </Link>
                </h3>
                <p className="mt-auto pt-2 text-[11px] text-slate-400">{item.publishedAt}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
