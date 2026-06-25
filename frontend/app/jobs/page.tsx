import Link from "next/link";
import { getHomePageData } from "@/lib/home-api";

export const dynamic = "force-dynamic";
export const metadata = { title: "Jobs | Khabar Deklo", description: "Latest job notifications — government jobs, private sector, and more." };

const JOB_TYPES = ["Govt Jobs", "Private Jobs", "Banking", "Railway", "Defence", "Teaching", "IT Jobs", "Internship"];

export default async function JobsPage() {
  const { news } = await getHomePageData();
  const jobNews = (news as any[]).filter((n: any) =>
    n.category?.toLowerCase().includes("job") || n.tags?.some((t: string) => t.toLowerCase().includes("job"))
  );
  const allNews = jobNews.length > 0 ? jobNews : (news as any[]).slice(0, 18);

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-900 via-amber-900 to-slate-900 py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(circle at 30% 60%, rgba(251,146,60,0.2) 0%, transparent 55%), radial-gradient(circle at 80% 25%, rgba(245,158,11,0.18) 0%, transparent 55%)" }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-500/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-orange-300 ring-1 ring-orange-500/30">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" />
            Jobs
          </span>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl" style={{ fontFamily: "'Poppins',sans-serif" }}>
            Job Notifications
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-orange-200 sm:text-base">
            Latest government &amp; private sector job notifications, admit cards, and results.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Filter Chips */}
        <div className="mb-8 flex flex-wrap gap-2">
          {JOB_TYPES.map((type) => (
            <button key={type} className="rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-[13px] font-semibold text-orange-700 transition hover:bg-orange-100">
              {type}
            </button>
          ))}
        </div>

        {allNews.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-slate-400">
            <svg className="h-12 w-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="font-medium">No job notifications yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allNews.map((item: any, i: number) => (
              <Link
                key={item._id || i}
                href={`/news/${item.slug || item._id}`}
                className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-orange-500">{item.category || "Jobs"}</span>
                  <h2 className="line-clamp-2 text-[14px] font-bold leading-snug text-slate-900 transition-colors group-hover:text-orange-700">{item.title}</h2>
                  {item.createdAt && (
                    <p className="mt-2 text-[11px] text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  )}
                </div>
                <svg className="h-4 w-4 flex-shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
