import Link from "next/link";
import type { NewsItem } from "@/types";

type NewsCardProps = { item: NewsItem & { imageUrl?: string } };

const categoryColors: Record<string, { pill: string }> = {
  politics:      { pill: "bg-amber-50 text-amber-700 border-amber-200" },
  sports:        { pill: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  technology:    { pill: "bg-blue-50 text-blue-700 border-blue-200" },
  entertainment: { pill: "bg-pink-50 text-pink-700 border-pink-200" },
  business:      { pill: "bg-purple-50 text-purple-700 border-purple-200" },
  health:        { pill: "bg-rose-50 text-rose-700 border-rose-200" },
  default:       { pill: "bg-sky-50 text-sky-700 border-sky-200" },
};

export function NewsCard({ item }: NewsCardProps) {
  const colors = categoryColors[item.category.toLowerCase()] || categoryColors.default;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card card-lift glow-card">
      {/* Image */}
      <Link href={`/news/${item.slug}`} className="relative block aspect-video overflow-hidden bg-slate-100">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-600 group-hover:scale-[1.06]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-200">
            <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {/* Category overlay badge */}
        <div className="absolute left-3 top-3">
          <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${colors.pill}`}>
            {item.category}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Meta */}
        <div className="mb-2.5 flex items-center gap-2 text-xs text-slate-400">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">{item.readTime}</span>
          <span className="h-1 w-1 rounded-full bg-indigo-200" />
          <span className="font-medium">Just now</span>
        </div>

        {/* Title */}
        <h3 className="mb-2.5 line-clamp-2 text-base font-bold leading-snug text-slate-950 transition-colors group-hover:text-indigo-700">
          <Link href={`/news/${item.slug}`}>{item.title}</Link>
        </h3>

        {/* Excerpt */}
        <p className="flex-1 line-clamp-3 text-sm leading-relaxed text-slate-500">{item.excerpt}</p>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="rounded-full bg-slate-50 border border-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200 transition-colors cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3.5">
          <Link
            href={`/news/${item.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 transition-all hover:text-indigo-900 group/link"
          >
            Read more
            <svg className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <div className="flex gap-0.5">
            <button
              title="Like"
              aria-label="Like this article"
              className="rounded-lg p-2 text-slate-300 transition hover:text-red-500 hover:bg-red-50 active:scale-95"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
            </button>
            <button
              title="Bookmark"
              aria-label="Bookmark this article"
              className="rounded-lg p-2 text-slate-300 transition hover:text-sky-500 hover:bg-sky-50 active:scale-95"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
