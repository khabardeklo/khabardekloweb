import Link from "next/link";
import type { HomeNewsItem } from "@/lib/home-content";

type PhotosSectionProps = {
  items: HomeNewsItem[];
  title?: string;
  ctaLabel?: string;
  ctaHref?: string;
  limit?: number;
};

export function PhotosSection({ items, title = "Photos Section", ctaLabel = "View Gallery", ctaHref = "/news", limit = 6 }: PhotosSectionProps) {
  const photoItems = items.slice(0, limit);

  return (
    <section aria-label="Photos section" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">{title}</h2>
        <Link href={ctaHref} className="text-xs font-semibold uppercase tracking-wide text-sky-700 hover:text-sky-800">
          {ctaLabel}
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photoItems.map((item) => (
          <article key={item.slug} className="group overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            <Link href={`/news/${item.slug}`} className="block">
              <div className="relative h-28 sm:h-32">
                <img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" loading="lazy" />
              </div>
              <div className="p-2.5">
                <h3 className="line-clamp-2 text-xs font-semibold leading-4 text-slate-800 group-hover:text-sky-700">{item.title}</h3>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
