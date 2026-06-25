import { LatestHeadlines } from "@/components/home/latest-headlines";
import { AdsRail } from "@/components/home/ads-rail";
import { VideoSection } from "@/components/home/video-section";
import { PhotosSection } from "@/components/home/photos-section";
import { CommentSection } from "@/components/news/comment-section";
import { NewsDetailClient } from "@/components/news/news-detail-client";
import { getHomePageData } from "@/lib/home-api";

type NewsPageProps = {
  params: Promise<{ slug: string }>;
};

type NewsDetail = {
  title?: string;
  slug?: string;
  content?: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  sourceUrl?: string;
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
  if (!value) return "Latest";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Latest";
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const estimateReadTime = (content?: string): number => {
  if (!content) return 1;
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

const fetchNewsDetail = async (slug: string): Promise<NewsDetail | null> => {
  try {
    const response = await fetch(`${backendUrl}/news/${slug}`, { next: { revalidate: 60 } });
    if (!response.ok) return null;
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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30 overflow-x-hidden">
      <div className="w-full max-w-none px-0">
        <NewsDetailClient
          slug={slug}
          title={title}
          category={category}
          publishedAt={publishedAt}
          readTime={readTime}
          content={content}
          description={news?.description}
          sourceUrl={news?.sourceUrl}
          authorId={news?.authorId}
          categoryColor={categoryColor}
        />
      </div>

      <section className="w-full bg-white/50 backdrop-blur-sm border-t border-slate-200/50">
        <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-8 px-6 py-12 lg:grid-cols-12 xl:px-12">
          <aside className="order-1 lg:col-span-3">
            <div className="sticky top-8">
              <LatestHeadlines items={sideHeadlines} />
            </div>
          </aside>

          <article className="order-2 lg:col-span-6 space-y-10">
            {news?.imageUrl && (
              <div className="overflow-hidden rounded-3xl shadow-2xl ring-1 ring-slate-200/50">
                <img src={news.imageUrl} alt={title} className="aspect-video w-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
            )}

            <section className="grid grid-cols-1 gap-6 md:grid-cols-2" aria-label="Related media">
              <div className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm border border-slate-200/50">
                <VideoSection items={mediaItems} />
              </div>
              <div className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm border border-slate-200/50">
                <PhotosSection items={mediaItems} />
              </div>
            </section>

            <div className="rounded-2xl bg-white/80 p-8 shadow-lg backdrop-blur-sm border border-slate-200/50">
              <CommentSection newsSlug={slug} />
            </div>
          </article>

          <aside className="order-3 lg:col-span-3">
            <div className="sticky top-8">
              <AdsRail items={sideAds} />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
