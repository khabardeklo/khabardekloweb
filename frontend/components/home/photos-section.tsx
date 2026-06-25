import Link from "next/link";
import type { HomeNewsItem } from "@/lib/home-content";

type PhotosSectionProps = { items: HomeNewsItem[]; title?: string; ctaLabel?: string; ctaHref?: string; limit?: number };

export function PhotosSection({ items, title = "Photos Section", ctaLabel = "View Gallery", ctaHref = "/news", limit = 6 }: PhotosSectionProps) {
  const photoItems = items.slice(0, limit);

  return (
    <section aria-label="Photos section" className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <h2 className="text-base font-extrabold tracking-tight text-slate-900">{title}</h2>
        </div>
        <Link href={ctaHref} className="flex items-center gap-1 text-xs font-semibold text-sky-600 transition hover:text-sky-800">
          {ctaLabel}
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3">
        {photoItems.map((item) => (
          <article key={item.slug} className="group overflow-hidden rounded-xl">
            <Link href={`/news/${item.slug}`} className="block">
              <div className="relative overflow-hidden rounded-xl bg-slate-100" style={{ aspectRatio: "4/3" }}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="line-clamp-2 text-[10px] font-semibold text-white leading-snug">{item.title}</p>
                </div>
              </div>
              <h3 className="mt-1.5 line-clamp-2 text-xs font-semibold leading-snug text-slate-800 group-hover:text-sky-700 transition-colors">
                {item.title}
              </h3>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
