import Link from "next/link";
import { getHomePageData } from "@/lib/home-api";

export const dynamic = "force-dynamic";
export const metadata = { title: "Articles | Khabar Deklo", description: "In-depth articles on politics, business, technology and more." };

export default async function ArticlesPage() {
  const { news } = await getHomePageData();
  const articles = (news as any[]).slice(0, 30);

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(circle at 20% 50%, rgba(14,165,233,0.18) 0%, transparent 55%), radial-gradient(circle at 80% 20%, rgba(99,102,241,0.15) 0%, transparent 55%)" }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-sky-500/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sky-300 ring-1 ring-sky-500/30">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-400" />
            Articles
          </span>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl" style={{ fontFamily: "'Poppins',sans-serif" }}>
            In-Depth Articles
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-slate-400 sm:text-base">
            Detailed coverage, analysis and insights on what matters most.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-slate-400">
            <svg className="h-12 w-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" />
            </svg>
            <p className="font-medium">No articles yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((item: any, i: number) => (
              <Link
                key={item._id || i}
                href={`/news/${item.slug || item._id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {item.imageUrl && (
                  <div className="relative h-48 overflow-hidden">
                    <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    {item.category && (
                      <span className="absolute left-3 top-3 rounded-full bg-sky-600 px-2.5 py-0.5 text-[11px] font-bold text-white shadow">
                        {item.category}
                      </span>
                    )}
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="mb-2 line-clamp-2 text-[15px] font-bold leading-snug text-slate-900 transition-colors group-hover:text-sky-700">
                    {item.title}
                  </h2>
                  {item.description && (
                    <p className="line-clamp-2 flex-1 text-[13px] leading-relaxed text-slate-500">{item.description}</p>
                  )}
                  <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{item.authorId?.name || "Khabar Deklo"}</span>
                    {item.createdAt && (
                      <span className="flex items-center gap-1">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" /></svg>
                        {new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
