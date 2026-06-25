import Link from "next/link";
import { getPublicSiteSettings } from "@/lib/site-settings-api";

type SearchPageProps = { searchParams?: Promise<{ q?: string; category?: string }> };

type SearchResultItem = {
  title?: string; slug?: string; imageUrl?: string;
  category?: string; createdAt?: string;
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

const QUICK_CATS = ["राजनीति", "खेल", "बिजनेस", "टेक्नोलॉजी", "हेल्थ", "मनोरंजन"];

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
      {/* Search Hero */}
      <div className="border-b border-slate-100 bg-white">
        <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sky-600 mb-2">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
            {sp.eyebrow}
          </p>
          <h1 className="text-3xl font-black text-slate-950">{sp.title}</h1>

          <form className="mt-6 flex gap-2.5" action="/search" method="get">
            <div className="relative flex-1">
              <svg
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
              </svg>
              <input
                defaultValue={query}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                name="q"
                placeholder={sp.placeholder}
                type="search"
                autoFocus={!hasSearch}
              />
            </div>
            <button
              className="rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 active:scale-95"
              type="submit"
            >
              {sp.buttonLabel}
            </button>
          </form>

          {/* Category chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {QUICK_CATS.map((cat) => (
              <Link
                key={cat}
                href={`/search?category=${encodeURIComponent(cat)}`}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  categoryFilter === cat
                    ? "border-sky-500 bg-sky-600 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:text-sky-600"
                }`}
              >
                {cat}
              </Link>
            ))}
            {categoryFilter && !QUICK_CATS.includes(categoryFilter) && (
              <span className="rounded-full border border-sky-500 bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white">
                {categoryFilter}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        {hasSearch && (
          <p className="mb-5 text-sm text-slate-500">
            {results.length > 0 ? (
              <>
                <span className="font-bold text-slate-900">{total}</span> result{total !== 1 ? "s" : ""} found
                {query && <> for <span className="font-bold text-slate-900">"{query}"</span></>}
                {categoryFilter && <> in <span className="font-bold text-slate-900">{categoryFilter}</span></>}
              </>
            ) : (
              "No results found. Try different keywords."
            )}
          </p>
        )}

        {!hasSearch && <p className="mb-6 text-sm text-slate-400">{sp.emptyStateText}</p>}

        {results.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {results.map((item, index) => (
              <article
                key={item.slug ?? index}
                className="group flex overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:border-sky-200"
              >
                <Link href={`/news/${item.slug}`} className="relative h-28 w-28 flex-shrink-0 overflow-hidden bg-slate-100">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.07]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-300">
                      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </Link>
                <div className="flex min-w-0 flex-1 flex-col justify-between p-3.5">
                  <span className="inline-block rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-700 border border-sky-100">
                    {item.category}
                  </span>
                  <h2 className="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug text-slate-900">
                    <Link href={`/news/${item.slug}`} className="hover:text-sky-700 transition-colors">
                      {item.title}
                    </Link>
                  </h2>
                  <span className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {toDateLabel(item.createdAt)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : hasSearch ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth={1.5} />
                <path d="m21 21-4.35-4.35" strokeLinecap="round" strokeWidth={1.5} />
              </svg>
            </div>
            <p className="text-base font-bold text-slate-700">No results found</p>
            <p className="mt-1 text-sm text-slate-400">Try different keywords or browse categories</p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 active:scale-95"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
          </div>
        ) : null}
      </div>
    </main>
  );
}
