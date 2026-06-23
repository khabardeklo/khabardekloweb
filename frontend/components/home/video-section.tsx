import Link from "next/link";
import type { HomeNewsItem } from "@/lib/home-content";

type VideoSectionProps = {
  items: HomeNewsItem[];
  title?: string;
  ctaLabel?: string;
  ctaHref?: string;
  limit?: number;
};

const getDuration = (index: number) => {
  const durations = ["02:18", "03:42", "05:07", "01:55", "04:12", "02:49"];
  return durations[index % durations.length];
};

export function VideoSection({ items, title = "Video Section", ctaLabel = "Watch All", ctaHref = "/news", limit = 4 }: VideoSectionProps) {
  const videoItems = items.slice(0, limit);

  return (
    <section aria-label="Video section" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">{title}</h2>
        <Link href={ctaHref} className="text-xs font-semibold uppercase tracking-wide text-sky-700 hover:text-sky-800">
          {ctaLabel}
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {videoItems.map((item, index) => (
          <article key={item.slug} className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition hover:shadow-md">
            <Link href={`/news/${item.slug}`} className="group block">
              <div className="relative h-32">
                <img src={item.image} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-slate-950/30 transition group-hover:bg-slate-950/40" />
                <span className="absolute left-2 top-2 rounded-full bg-slate-900/85 px-2 py-0.5 text-[10px] font-semibold text-white">
                  {getDuration(index)}
                </span>
                <span className="absolute inset-0 m-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-900">
                  <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4" fill="currentColor" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </div>
              <div className="p-3">
                <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 group-hover:text-sky-700">{item.title}</h3>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
