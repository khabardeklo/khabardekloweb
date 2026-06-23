import Link from "next/link";
import type { HomeNewsItem } from "@/lib/home-content";

type TopStoriesSectionProps = {
  items: HomeNewsItem[];
  title?: string;
  ctaLabel?: string;
  ctaHref?: string;
  limit?: number;
};

export function TopStoriesSection({ items, title = "Top Story", ctaLabel = "More Stories", ctaHref = "/news", limit = 5 }: TopStoriesSectionProps) {
  const [featured, ...rest] = items.slice(0, limit);

  if (!featured) {
    return null;
  }

  return (
    <section aria-label="Top story" className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">{title}</h2>
        <Link
          href={ctaHref}
          className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
        >
          {ctaLabel}
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <article className="relative overflow-hidden rounded-xl lg:col-span-7">
          <Link href={`/news/${featured.slug}`} className="block h-60 sm:h-72">
            <img src={featured.image} alt={featured.title} className="h-full w-full object-cover" loading="eager" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
              <span className="mb-2 inline-flex rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-800">
                {featured.category}
              </span>
              <h3 className="line-clamp-2 text-lg font-bold leading-tight text-white sm:text-2xl">{featured.title}</h3>
              <p className="mt-1 text-xs text-slate-200">{featured.publishedAt}</p>
            </div>
          </Link>
        </article>

        <div className="grid gap-3 lg:col-span-5">
          {rest.map((item) => (
            <article key={item.slug} className="rounded-lg border border-slate-200 bg-slate-50 p-3 transition hover:bg-slate-100">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-700">{item.category}</p>
              <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-slate-900">
                <Link href={`/news/${item.slug}`} className="hover:text-sky-700">
                  {item.title}
                </Link>
              </h3>
              <p className="mt-1 text-[11px] text-slate-500">{item.publishedAt}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
