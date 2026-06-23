import Link from "next/link";
import { LatestHeadlines } from "@/components/home/latest-headlines";
import { AdsRail } from "@/components/home/ads-rail";
import { VideoSection } from "@/components/home/video-section";
import { PhotosSection } from "@/components/home/photos-section";
import { CommentSection } from "@/components/news/comment-section";
import { getHomePageData } from "@/lib/home-api";

type NewsPageProps = {
  params: Promise<{ slug: string }>;
};

type NewsDetail = {
  title?: string;
  slug?: string;
  content?: string;
  category?: string;
  imageUrl?: string;
  createdAt?: string;
  authorId?: {
    _id?: string;
    name?: string;
    avatar?: string;
    title?: string;
  };
};

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000/api";

const toDateLabel = (value?: string): string => {
  if (!value) {
    return "Latest";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Latest";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const estimateReadTime = (content?: string): number => {
  if (!content) return 1;
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

const fetchNewsDetail = async (slug: string): Promise<NewsDetail | null> => {
  try {
    const response = await fetch(`${backendUrl}/news/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as NewsDetail;
  } catch {
    return null;
  }
};

const categoryColors: Record<string, string> = {
  politics: "bg-amber-100 text-amber-800 border-amber-200",
  sports: "bg-emerald-100 text-emerald-800 border-emerald-200",
  technology: "bg-blue-100 text-blue-800 border-blue-200",
  entertainment: "bg-pink-100 text-pink-800 border-pink-200",
  business: "bg-purple-100 text-purple-800 border-purple-200",
  health: "bg-rose-100 text-rose-800 border-rose-200",
};

export default async function NewsDetailPage({ params }: NewsPageProps) {
  const { slug } = await params;
  const [news, homepageData] = await Promise.all([fetchNewsDetail(slug), getHomePageData()]);

  const title = news?.title || slug;
  const category = news?.category || "Article";
  const publishedAt = toDateLabel(news?.createdAt);
  const readTime = estimateReadTime(news?.content);
  const content = news?.content || "<p>Story details are not available right now.</p>";
  const categoryColor = categoryColors[category.toLowerCase()] || "bg-sky-100 text-sky-800 border-sky-200";
  const sideHeadlines = homepageData.headlines.slice(0, 10);
  const sideAds = homepageData.ads.slice(0, 2);
  const mediaItems = homepageData.news.filter((item) => item.slug !== slug);

  return (
    <main className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Breadcrumb */}
      <div className="border-b border-slate-200 bg-white overflow-x-hidden">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm overflow-x-auto pb-2">
            <Link href="/" className="font-medium text-sky-700 hover:text-sky-900 transition-colors whitespace-nowrap">
              Home
            </Link>
            <span className="text-slate-400 whitespace-nowrap">/</span>
            <span className="font-medium text-slate-600 whitespace-nowrap">{category}</span>
            <span className="text-slate-400 whitespace-nowrap">/</span>
            <span className="text-slate-500 line-clamp-1">{title}</span>
          </div>
        </div>
      </div>

      <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-12 lg:px-8">
        <aside className="order-1 hidden lg:col-span-3 lg:block">
          <LatestHeadlines items={sideHeadlines} />
        </aside>

        <article className="order-2 lg:col-span-6">
          {/* Hero Image */}
          {news?.imageUrl && (
            <div className="mb-8 overflow-hidden rounded-3xl shadow-lg">
              <img src={news.imageUrl} alt={title} className="aspect-video w-full object-cover" />
            </div>
          )}

          {/* Header Section */}
          <div className="mb-8 space-y-4">
            {/* Category Badge */}
            <div className={`inline-block rounded-full border px-4 py-2 text-sm font-semibold uppercase tracking-wide ${categoryColor}`}>
              {category}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-5xl break-words">{title}</h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 border-b border-slate-200 pb-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                </svg>
                <span className="font-medium">{publishedAt}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{readTime} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Updated today</span>
              </div>
              {news?.authorId?._id && (
                <>
                  <div className="h-1 w-1 rounded-full bg-slate-400" />
                  <Link href={`/reporter/${news.authorId._id}`} className="font-medium text-sky-700 transition-colors hover:text-sky-900">
                    By {news.authorId.name || "Reporter"}
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Share Buttons */}
          <div className="mb-8 flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-600">Share:</span>
            <button title="Share on Facebook" aria-label="Share on Facebook" className="inline-flex items-center justify-center rounded-full bg-blue-600 p-3 text-white transition-all hover:bg-blue-700 hover:shadow-lg">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
            <button title="Share on Twitter" aria-label="Share on Twitter" className="inline-flex items-center justify-center rounded-full bg-sky-500 p-3 text-white transition-all hover:bg-sky-600 hover:shadow-lg">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 11-3.14 1.53 4.48 4.48 0 00-8.86 2.26v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.45 7-7 7-7" />
              </svg>
            </button>
            <button title="Copy link" aria-label="Copy article link" className="inline-flex items-center justify-center rounded-full bg-red-600 p-3 text-white transition-all hover:bg-red-700 hover:shadow-lg">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </button>
          </div>

          {/* Article Content */}
          <div className="article-prose mb-12 overflow-x-hidden">
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>

          {/* CTA Section */}
          <div className="rounded-3xl border border-sky-200 bg-gradient-to-r from-sky-50 to-blue-50 p-8 md:p-12">
            <h3 className="mb-2 text-2xl font-bold text-slate-950">Stay Updated</h3>
            <p className="mb-6 text-slate-600">Get the latest news delivered to your inbox.</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button className="rounded-lg bg-sky-600 px-6 py-3 font-semibold text-white transition-all hover:bg-sky-700 hover:shadow-lg">
                Subscribe
              </button>
            </div>
          </div>

          {/* Video and Photos Section */}
          <section className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2" aria-label="Related media">
            <VideoSection items={mediaItems} />
            <PhotosSection items={mediaItems} />
          </section>

          {/* Comments */}
          <CommentSection newsSlug={slug} />

          {/* Back Button */}
          <div className="mt-12 flex justify-center">
            <Link href="/" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition-all hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to home
            </Link>
          </div>
        </article>

        <aside className="order-3 hidden lg:col-span-3 lg:block">
          <AdsRail items={sideAds} />
        </aside>
      </section>
    </main>
  );
}