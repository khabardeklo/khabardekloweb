import { adBanners, homeNewsFeed, latestHeadlines } from "@/lib/home-content";
import type { AdBannerItem, HeadlineItem, HomeNewsItem } from "@/lib/home-content";

type BackendNewsItem = {
  title?: string;
  slug?: string;
  imageUrl?: string;
  category?: string;
  createdAt?: string;
  authorId?: {
    _id?: string;
    name?: string;
    avatar?: string;
  };
};

type BackendNewsResponse = {
  data?: BackendNewsItem[];
  pagination?: {
    skip: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
};

type BackendAdItem = {
  _id?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  targetUrl?: string;
  isActive?: boolean;
  position?: number;
};

type BackendSettings = {
  tickerSpeed?: number;
  maxNewsPerPage?: number;
};

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000/api";

const toDateLabel = (value?: string): string => {
  if (!value) {
    return "Today";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Today";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const mapNews = (items: BackendNewsItem[]): HomeNewsItem[] => {
  return items
    .filter((item) => typeof item.title === "string" && typeof item.slug === "string")
    .map((item, index) => ({
      title: item.title || "Untitled",
      slug: item.slug || `news-${index + 1}`,
      image: item.imageUrl || homeNewsFeed[index % homeNewsFeed.length]?.image || "/news/news-1.svg",
      category: item.category || "General",
      publishedAt: toDateLabel(item.createdAt),
      author: item.authorId ? {
        id: item.authorId._id || "",
        name: item.authorId.name || "Unknown",
        avatar: item.authorId.avatar || undefined,
      } : undefined,
    }));
};

const mapHeadlines = (items: HomeNewsItem[]): HeadlineItem[] => {
  return items.slice(0, 12).map((item) => ({
    title: item.title,
    slug: item.slug,
  }));
};

const mapAds = (items: BackendAdItem[]): AdBannerItem[] => {
  return items
    .filter((item) => item.isActive !== false)
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .slice(0, 4)
    .map((item) => ({
      title: item.title || "Sponsored",
      description: item.description || "Promote your brand with high visibility.",
      ctaLabel: item.ctaLabel || "Learn More",
      targetUrl: item.targetUrl || "https://example.com",
    }));
};

const fetchJson = async <T>(url: string): Promise<T | null> => {
  try {
    const response = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
};

export const getHomePageData = async (): Promise<{
  news: HomeNewsItem[];
  headlines: HeadlineItem[];
  ads: AdBannerItem[];
  settings: BackendSettings;
}> => {
  const [newsResponse, adsResponse, settingsResponse] = await Promise.all([
    fetchJson<BackendNewsResponse>(`${backendUrl}/news/published?skip=0&limit=10`),
    fetchJson<BackendAdItem[]>(`${backendUrl}/ads/public`),
    fetchJson<BackendSettings>(`${backendUrl}/settings`),
  ]);

  const mappedNews = newsResponse?.data?.length ? mapNews(newsResponse.data) : homeNewsFeed;
  const mappedHeadlines = mappedNews.length ? mapHeadlines(mappedNews) : latestHeadlines;
  const mappedAds = adsResponse?.length ? mapAds(adsResponse) : adBanners;

  return {
    news: mappedNews,
    headlines: mappedHeadlines,
    ads: mappedAds,
    settings: settingsResponse || {},
  };
};

export const getPublishedNews = async (skip: number = 0, limit: number = 10): Promise<{ news: HomeNewsItem[]; hasMore: boolean }> => {
  const response = await fetchJson<BackendNewsResponse>(`${backendUrl}/news/published?skip=${skip}&limit=${limit}`);

  if (!response?.data) {
    return { news: [], hasMore: false };
  }

  return {
    news: mapNews(response.data),
    hasMore: response.pagination?.hasMore ?? false,
  };
};
