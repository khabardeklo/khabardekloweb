import Link from "next/link";
import type { HomeNewsItem } from "@/lib/home-content";

type BigNewsGridProps = {
  items: HomeNewsItem[];
  title?: string;
  ctaLabel?: string;
  ctaHref?: string;
  limit?: number;
};

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

export function BigNewsGrid({
  items,
  title = "बड़ी खबरें",
  ctaLabel = "सभी खबरें",
  ctaHref = "/news",
  limit = 7,
}: BigNewsGridProps) {
  const [featured, ...rest] = items.slice(0, limit);
  const secondaryItems = rest.slice(0, 2);
  const gridItems = rest.slice(2, 6);

  if (!featured) return null;

  return (
    <section aria-label="Top news" className="mb-10">
      {/* Section Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="h-6 w-1 rounded-full bg-red-600" />
        <h2
          className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {title}
        </h2>
        <div className="ml-auto">
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-sky-300 hover:text-sky-700"
          >
            {ctaLabel}
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Hero + Secondary Row */}
      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Featured / Hero */}
        <article className="group relative overflow-hidden rounded-2xl shadow-md lg:col-span-7" style={{ minHeight: "320px" }}>
          <Link href={`/news/${featured.slug}`} className="block h-full">
            <img
              src={featured.image}
              alt={featured.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <span
                className={`mb-3 inline-block rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-widest ${getBadge(featured.category)}`}
              >
                {featured.category}
              </span>
              <h3 className="text-xl font-black leading-snug text-white sm:text-2xl drop-shadow-sm">
                {featured.title}
              </h3>
              <p className="mt-2 text-xs font-medium text-slate-300">{featured.publishedAt}</p>
            </div>
          </Link>
        </article>

        {/* Secondary 2 stories */}
        <div className="grid grid-rows-2 gap-4 lg:col-span-5">
          {secondaryItems.map((item) => (
            <article
              key={item.slug}
              className="group relative flex overflow-hidden rounded-2xl shadow-sm"
              style={{ minHeight: "148px" }}
            >
              <Link href={`/news/${item.slug}`} className="block h-full w-full">
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <span
                    className={`mb-1.5 inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getBadge(item.category)}`}
                  >
                    {item.category}
                  </span>
                  <h3 className="line-clamp-2 text-sm font-bold leading-tight text-white">{item.title}</h3>
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
              className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <Link href={`/news/${item.slug}`} className="block overflow-hidden">
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </Link>
              <div className="flex flex-1 flex-col p-3">
                <span className="mb-1 text-[10px] font-bold uppercase tracking-wider text-sky-700">
                  {item.category}
                </span>
                <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-slate-900">
                  <Link href={`/news/${item.slug}`} className="hover:text-sky-700">
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
