"use client";
import Link from "next/link";
import type { HomeNewsItem } from "@/lib/home-content";
import { useLang } from "@/lib/language-context";

type TopStoriesSectionProps = { items: HomeNewsItem[]; title?: string; ctaLabel?: string; ctaHref?: string; limit?: number };

export function TopStoriesSection({ items, title, ctaLabel, ctaHref = "/news", limit = 5 }: TopStoriesSectionProps) {
  const { t } = useLang();
  const resolvedTitle = title ?? t.topStories;
  const resolvedCtaLabel = ctaLabel ?? t.moreStories;
  const [featured, ...rest] = items.slice(0, limit);

  if (!featured) return null;

  return (
    <section aria-label="Top story" className="mb-8">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex items-center gap-3">
          <span className="section-pill" style={{ background: "linear-gradient(135deg,#0ea5e9,#6366f1)" }}>
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            Top
          </span>
          <h2 className="text-xl font-black tracking-tight sm:text-2xl gradient-text" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {resolvedTitle}
          </h2>
        </div>
        <div className="ml-auto">
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-white px-4 py-1.5 text-xs font-bold text-indigo-700 shadow-sm transition hover:bg-indigo-50 hover:border-indigo-300 hover:shadow-md active:scale-95"
          >
            {resolvedCtaLabel}
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Featured large */}
        <article className="group relative overflow-hidden rounded-2xl lg:col-span-7" style={{ minHeight: 320 }}>
          <Link href={`/news/${featured.slug}`} className="block h-full">
            <img
              src={featured.image}
              alt={featured.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/88 via-slate-950/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <span className="mb-2 inline-flex items-center rounded-full bg-sky-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm">
                {featured.category}
              </span>
              <h3 className="line-clamp-2 text-xl font-black leading-tight text-white sm:text-2xl drop-shadow-sm">
                {featured.title}
              </h3>
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-300">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {featured.publishedAt}
              </div>
            </div>
          </Link>
        </article>

        {/* Side list */}
        <div className="flex flex-col gap-3 lg:col-span-5">
          {rest.map((item, i) => (
            <article
              key={item.slug}
              className="group flex gap-3 rounded-xl border border-slate-100 bg-white p-3 transition-all duration-200 hover:border-indigo-200 hover:shadow-md hover:bg-indigo-50/20 hover:-translate-y-0.5"
            >
              <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                  loading="lazy"
                />
              </div>
              <div className="flex min-w-0 flex-col justify-center gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-sky-600">{item.category}</span>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-black text-slate-500">#{i + 2}</span>
                </div>
                <h3 className="line-clamp-2 text-sm font-bold leading-snug text-slate-900">
                  <Link href={`/news/${item.slug}`} className="hover:text-sky-700 transition-colors">
                    {item.title}
                  </Link>
                </h3>
                <p className="text-[11px] text-slate-400">{item.publishedAt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
