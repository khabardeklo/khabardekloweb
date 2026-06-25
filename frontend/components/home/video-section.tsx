import Link from "next/link";
import type { HomeNewsItem } from "@/lib/home-content";

type VideoSectionProps = { items: HomeNewsItem[]; title?: string; ctaLabel?: string; ctaHref?: string; limit?: number };

const getDuration = (index: number) => ["02:18", "03:42", "05:07", "01:55", "04:12", "02:49"][index % 6];

export function VideoSection({ items, title = "Video Section", ctaLabel = "Watch All", ctaHref = "/news", limit = 4 }: VideoSectionProps) {
  const videoItems = items.slice(0, limit);

  return (
    <section aria-label="Video section" className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-600 text-white">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
              <path d="M8 5v14l11-7z" />
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

      <div className="flex-1 grid gap-0 sm:grid-cols-2 divide-x divide-y divide-slate-100">
        {videoItems.map((item, index) => (
          <article key={item.slug} className="group">
            <Link href={`/news/${item.slug}`} className="block p-3">
              <div className="relative overflow-hidden rounded-xl bg-slate-100" style={{ aspectRatio: "16/9" }}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-slate-950/25 transition group-hover:bg-slate-950/35" />
                {/* Duration badge */}
                <span className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                  <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  {getDuration(index)}
                </span>
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md transition group-hover:scale-110 group-hover:bg-white">
                    <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4 text-slate-800" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <h3 className="mt-2.5 line-clamp-2 text-sm font-semibold leading-snug text-slate-900 group-hover:text-sky-700 transition-colors">
                {item.title}
              </h3>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
