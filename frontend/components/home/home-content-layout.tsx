import { AdsRail } from "./ads-rail";
import { LatestHeadlines } from "./latest-headlines";
import { NewsFeedList } from "./news-feed-list";
import type { AdBannerItem, HeadlineItem, HomeNewsItem } from "@/lib/home-content";
import styles from "./home-content-layout.module.css";

type HomeContentLayoutProps = {
  news: HomeNewsItem[];
  headlines: HeadlineItem[];
  ads: AdBannerItem[];
  showHeadlinesRail?: boolean;
  showNewsFeed?: boolean;
  showAdsRail?: boolean;
  headlinesTitle?: string;
  newsFeedEyebrow?: string;
  newsFeedTitle?: string;
  adsTitle?: string;
  headlinesLimit?: number;
  adsLimit?: number;
};

export function HomeContentLayout({
  news,
  headlines,
  ads,
  showHeadlinesRail = true,
  showNewsFeed = true,
  showAdsRail = true,
  headlinesTitle = "ताज़ा खबरें",
  newsFeedEyebrow = "Top Stories",
  newsFeedTitle = "Khabar Deklo News Feed",
  adsTitle = "Sponsored",
  headlinesLimit,
  adsLimit,
}: HomeContentLayoutProps) {
  return (
    <section className={styles.wrapper} aria-label="Homepage content columns">
      {showHeadlinesRail ? <LatestHeadlines items={headlines.slice(0, headlinesLimit ?? headlines.length)} title={headlinesTitle} /> : null}
      {showNewsFeed ? <NewsFeedList items={news} eyebrow={newsFeedEyebrow} title={newsFeedTitle} /> : null}
      {showAdsRail ? <AdsRail items={ads.slice(0, adsLimit ?? ads.length)} title={adsTitle} /> : null}
    </section>
  );
}
