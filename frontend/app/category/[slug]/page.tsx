import Link from "next/link";
import { AdsRail } from "@/components/home/ads-rail";
import { LatestHeadlines } from "@/components/home/latest-headlines";
import { getHomePageData } from "@/lib/home-api";
import { getPublicSiteSettings } from "@/lib/site-settings-api";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

const BADGE_COLORS: Record<string, string> = {
  politics: "bg-amber-100 text-amber-800 border-amber-200",
  sports: "bg-emerald-100 text-emerald-800 border-emerald-200",
  technology: "bg-blue-100 text-blue-800 border-blue-200",
  entertainment: "bg-pink-100 text-pink-800 border-pink-200",
  business: "bg-purple-100 text-purple-800 border-purple-200",
  health: "bg-rose-100 text-rose-800 border-rose-200",
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const [{ news, headlines, ads }, settings] = await Promise.all([
    getHomePageData(),
    getPublicSiteSettings(),
  ]);

  const categoryPage = settings.categoryPage;
  const sideHeadlines = headlines.slice(0, categoryPage.sidebarHeadlinesLimit || 10);
  const sideAds = ads.slice(0, categoryPage.sidebarAdsLimit || 2);

  // Filter news matching this category
  const categoryNews = news.filter(
    (item) => item.category?.toLowerCase() === decodedSlug.toLowerCase()
  );

  const badgeClass =
    BADGE_COLORS[decodedSlug.toLowerCase()] ?? "bg-sky-100 text-sky-800 border-sky-200";

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Category Hero Banner */}
      <div className="border-b border-slate-100 bg-white">
        <div className="w-full px-4 py-8 sm:px-6 xl:px-10">
          <div className="mx-auto max-w-[1400px]">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-2 text-sm">
            <Link href="/" className="font-medium text-sky-700 hover:text-sky-900 transition-colors">
              Home
            </Link>
            <span className="text-slate-400">/</span>
            <span className="font-medium text-slate-600">{decodedSlug}</span>
          </nav>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className={`inline-block rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${badgeClass}`}>
                Category
              </span>
              <h1
                className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {decodedSlug}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                {categoryNews.length > 0
                  ? `${categoryNews.length} stories found`
                  : categoryPage.introText || "Explore the latest stories"}
              </p>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full px-4 py-8 sm:px-6 xl:px-10">
        <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* News Grid */}
          <div className="lg:col-span-8">
            {categoryNews.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {categoryNews.map((item) => (
                  <article
                    key={item.slug}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
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
                    <div className="flex flex-1 flex-col p-4">
                      <span className="mb-2 text-[11px] font-bold uppercase tracking-wider text-sky-700">
                        {item.category}
                      </span>
                      <h2 className="line-clamp-2 flex-1 text-base font-bold leading-snug text-slate-900">
                        <Link href={`/news/${item.slug}`} className="hover:text-sky-700 transition-colors">
                          {item.title}
                        </Link>
                      </h2>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-slate-400">{item.publishedAt}</span>
                        {item.author && (
                          <Link
                            href={`/reporter/${item.author.id}`}
                            className="text-xs font-semibold text-sky-700 hover:text-sky-900 transition-colors"
                          >
                            {item.author.name}
                          </Link>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
                <svg className="mb-4 h-14 w-14 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V9a2 2 0 012-2h.5" />
                </svg>
                <p className="text-lg font-bold text-slate-600">No stories yet</p>
                <p className="mt-1 text-sm text-slate-400">Check back later for {decodedSlug} news</p>
                <Link
                  href="/"
                  className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
                >
                  ← Back to Home
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          {categoryPage.showSidebarWidgets !== false && (
            <aside className="grid gap-4 lg:col-span-4">
              <LatestHeadlines items={sideHeadlines} title={categoryPage.sidebarHeadlinesTitle || "ताज़ा खबरें"} />
              <AdsRail items={sideAds} title={categoryPage.sidebarAdsTitle || "Sponsored"} />
            </aside>
          )}
        </div>
        </div>
      </div>
    </main>
  );
}
