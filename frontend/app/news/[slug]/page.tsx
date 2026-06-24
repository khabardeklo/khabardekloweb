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
    <main className="min-h-screen bg-slate-50 overflow-x-hidden">
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

      <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-12 lg:px-8">
        <aside className="order-1 hidden lg:col-span-3 lg:block">
          <LatestHeadlines items={sideHeadlines} />
        </aside>

        <article className="order-2 lg:col-span-6">
          {news?.imageUrl && (
            <div className="mb-8 overflow-hidden rounded-3xl shadow-lg">
              <img src={news.imageUrl} alt={title} className="aspect-video w-full object-cover" />
            </div>
          )}

          <section className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2" aria-label="Related media">
            <VideoSection items={mediaItems} />
            <PhotosSection items={mediaItems} />
          </section>

          <CommentSection newsSlug={slug} />
        </article>

        <aside className="order-3 hidden lg:col-span-3 lg:block">
          <AdsRail items={sideAds} />
        </aside>
      </section>
    </main>
  );
}
