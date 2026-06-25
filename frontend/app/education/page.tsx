import Link from "next/link";
import { getHomePageData } from "@/lib/home-api";

export const dynamic = "force-dynamic";
export const metadata = { title: "Education | Khabar Deklo", description: "Latest education news — exams, results, admissions, scholarships." };

const TOPICS = ["Exams", "Results", "Admissions", "Scholarships", "Govt Jobs", "Study Abroad", "School News", "University"];

export default async function EducationPage() {
  const { news } = await getHomePageData();
  const eduNews = (news as any[]).filter((n: any) =>
    n.category?.toLowerCase().includes("edu") || n.category?.toLowerCase().includes("शिक्षा")
  );
  const allNews = eduNews.length > 0 ? eduNews : (news as any[]).slice(0, 20);

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(circle at 25% 55%, rgba(16,185,129,0.2) 0%, transparent 55%), radial-gradient(circle at 80% 25%, rgba(6,182,212,0.18) 0%, transparent 55%)" }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-300 ring-1 ring-emerald-500/30">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Education
          </span>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl" style={{ fontFamily: "'Poppins',sans-serif" }}>
            Education Hub
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-emerald-200 sm:text-base">
            Exams, results, admissions, scholarships — everything students need.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Topics Pills */}
        <div className="mb-8 flex flex-wrap gap-2">
          {TOPICS.map((topic) => (
            <button key={topic} className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-[13px] font-semibold text-emerald-700 transition hover:bg-emerald-100">
              {topic}
            </button>
          ))}
        </div>

        {allNews.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-slate-400">
            <svg className="h-12 w-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="font-medium">No education news yet.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {allNews.map((item: any, i: number) => (
              <Link
                key={item._id || i}
                href={`/news/${item.slug || item._id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {item.imageUrl && (
                  <div className="relative h-40 overflow-hidden">
                    <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-4">
                  <span className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-emerald-600">{item.category || "Education"}</span>
                  <h2 className="line-clamp-2 text-[14px] font-bold leading-snug text-slate-900 transition-colors group-hover:text-emerald-700">{item.title}</h2>
                  {item.createdAt && (
                    <p className="mt-auto pt-3 text-[11px] text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
