export type HomeNewsItem = {
  title: string;
  slug: string;
  image: string;
  category: string;
  publishedAt: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
};

export type HeadlineItem = {
  title: string;
  slug: string;
};

export type AdBannerItem = {
  title: string;
  description: string;
  ctaLabel: string;
  targetUrl: string;
};

export const homeNewsFeed: HomeNewsItem[] = [
];

export const latestHeadlines: HeadlineItem[] = [
];

export const adBanners: AdBannerItem[] = [
];
