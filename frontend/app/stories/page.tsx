import Link from "next/link";
import { getHomePageData } from "@/lib/home-api";

export const dynamic = "force-dynamic";
export const metadata = { title: "Stories | Khabar Deklo", description: "Quick visual stories — swipe through the latest news in seconds." };

export default async function StoriesPage() {
  const { news } = await getHomePageData();
  const stories = (news as any[]).slice(0, 24);

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-900 via-purple-900 to-pink-900 py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(circle at 30% 60%, rgba(167,139,250,0.2) 0%, transparent 55%), radial-gradient(circle at 75% 20%, rgba(236,72,153,0.18) 0%, transparent 55%)" }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-pink-500/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-pink-300 ring-1 ring-pink-500/30">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-pink-400" />
            Stories
          </span>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl" style={{ fontFamily: "'Poppins',sans-serif" }}>
            Web Stories
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-purple-200 sm:text-base">
            Quick visual stories — swipe through the latest news in seconds.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {stories.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-slate-400">
            <svg className="h-12 w-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.07A1 1 0 0121 8.876V15.5a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
            </svg>
            <p className="font-medium">No stories yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {stories.map((item: any, i: number) => (
              <Link
                key={item._id || i}
                href={`/news/${item.slug || item._id}`}
                className="group relative flex aspect-[9/16] overflow-hidden rounded-2xl bg-gradient-to-br from-violet-900 to-pink-900 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                {item.category && (
                  <span className="absolute left-2 top-2 rounded-full bg-pink-600 px-2 py-0.5 text-[10px] font-bold text-white">
                    {item.category}
                  </span>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="line-clamp-3 text-[12px] font-bold leading-snug text-white">{item.title}</p>
                </div>
                <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
