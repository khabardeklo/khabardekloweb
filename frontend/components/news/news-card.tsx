import Link from "next/link";
import type { NewsItem } from "@/types";

type NewsCardProps = {
  item: NewsItem;
};

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  politics: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  sports: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  technology: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  entertainment: { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
  business: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  health: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  default: { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
};

export function NewsCard({ item }: NewsCardProps) {
  const colors = categoryColors[item.category.toLowerCase()] || categoryColors.default;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Hero Image */}
      <div className="relative overflow-hidden bg-gradient-to-br from-sky-100 via-slate-50 to-slate-200">
        <div className="aspect-[16/10] transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col space-y-3 p-5">
        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center rounded-full ${colors.bg} ${colors.text} border ${colors.border} px-3 py-1 text-xs font-semibold uppercase tracking-wider`}>
            {item.category}
          </span>
          <span className="text-xs font-medium text-slate-500">
            <svg className="mr-1 inline-block h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            {item.readTime}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold leading-tight text-slate-950 transition-colors group-hover:text-sky-700">
          <Link href={`/news/${item.slug}`} className="line-clamp-2">
            {item.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">{item.excerpt}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {item.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200">
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-auto">
          <Link href={`/news/${item.slug}`} className="inline-flex items-center text-sm font-semibold text-sky-700 transition-colors hover:text-sky-900">
            Read more
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <div className="flex gap-2">
            <button title="Like this article" aria-label="Like this article" className="p-2 text-slate-400 transition-colors hover:text-red-500 hover:bg-red-50 rounded-lg">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
            </button>
            <button title="Bookmark this article" aria-label="Bookmark this article" className="p-2 text-slate-400 transition-colors hover:text-sky-500 hover:bg-sky-50 rounded-lg">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}