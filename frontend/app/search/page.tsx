import Link from "next/link";
import { getPublicSiteSettings } from "@/lib/site-settings-api";

type SearchPageProps = {
  searchParams?: Promise<{ q?: string; category?: string }>;
};

type SearchResultItem = {
  title?: string;
  slug?: string;
  imageUrl?: string;
  category?: string;
  createdAt?: string;
  authorId?: { _id?: string; name?: string };
};

type SearchResponse = {
  data?: SearchResultItem[];
  pagination?: { total: number; hasMore: boolean };
};

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000/api";

const toDateLabel = (value?: string): string => {
  if (!value) return "Today";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? "Today"
    : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolved = (await searchParams) ?? {};
  const query = (resolved.q ?? "").trim();
  const categoryFilter = (resolved.category ?? "").trim();
  const hasSearch = query.length > 0 || categoryFilter.length > 0;

  const [settings, searchResponse] = await Promise.all([
    getPublicSiteSettings(),
    hasSearch
      ? fetch(
          `${backendUrl}/news/search?q=${encodeURIComponent(query)}&category=${encodeURIComponent(categoryFilter)}&limit=40`,
          { next: { revalidate: 30 } }
        )
          .then((r) => (r.ok ? (r.json() as Promise<SearchResponse>) : null))
          .catch(() => null)
      : Promise.resolve(null),
  ]);

  const sp = settings.searchPage;
  const results = searchResponse?.data ?? [];
  const total = searchResponse?.pagination?.total ?? results.length;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Search Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-sky-700">{sp.eyebrow}</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">{sp.title}</h1>

          <form className="mt-6 flex gap-3" action="/search" method="get">
            <div className="relative flex-1">
              <svg
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" strokeLinecap="round" />
              </svg>
              <input
                defaultValue={query}
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                name="q"
                placeholder={sp.placeholder}
                type="search"
                autoFocus={!hasSearch}
              />
            </div>
            <button
              className="rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 active:scale-95"
              type="submit"
            >
              {sp.buttonLabel}
            </button>
          </form>

          {/* Quick category filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            {["राजनीति", "खेल", "बिजनेस", "टेक्नोलॉजी", "हेल्थ", "मनोरंजन"].map((cat) => (
              <Link
                key={cat}
                href={`/search?category=${encodeURIComponent(cat)}`}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  categoryFilter === cat
                    ? "border-sky-500 bg-sky-50 text-sky-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:text-sky-700"
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {hasSearch && (
          <p className="mb-6 text-sm text-slate-500">
            {results.length > 0 ? (
              <>
                <span className="font-semibold text-slate-900">{total}</span> result
                {total !== 1 ? "s" : ""} found
                {query && (
                  <> for <span className="font-semibold text-slate-900">"{query}"</span></>
                )}
                {categoryFilter && (
                  <> in <span className="font-semibold text-slate-900">{categoryFilter}</span></>
                )}
              </>
            ) : (
              <>No results found. Try different keywords.</>
            )}
          </p>
        )}

        {!hasSearch && (
          <p className="mb-6 text-sm text-slate-400">{sp.emptyStateText}</p>
        )}

        {results.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {results.map((item, index) => (
              <article
                key={item.slug ?? index}
                className="group flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <Link
                  href={`/news/${item.slug}`}
                  className="h-28 w-28 flex-shrink-0 overflow-hidden bg-slate-100"
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-300">
                      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </Link>
                <div className="flex min-w-0 flex-1 flex-col justify-between p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700">
                    {item.category}
                  </span>
                  <h2 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-slate-900">
                    <Link href={`/news/${item.slug}`} className="hover:text-sky-700 transition-colors">
                      {item.title}
                    </Link>
                  </h2>
                  <span className="mt-1 text-[11px] text-slate-400">{toDateLabel(item.createdAt)}</span>
                </div>
              </article>
            ))}
          </div>
        ) : hasSearch ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
            <svg className="mb-4 h-14 w-14 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" strokeWidth={1.5} />
              <path d="m21 21-4.35-4.35" strokeLinecap="round" strokeWidth={1.5} />
            </svg>
            <p className="text-lg font-bold text-slate-600">No results found</p>
            <p className="mt-1 text-sm text-slate-400">Try different keywords or browse categories</p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              ← Back to Home
            </Link>
          </div>
        ) : null}
      </div>
    </main>
  );
}
