import { AdsRail } from "./ads-rail";
import { LatestHeadlines } from "./latest-headlines";
import { NewsFeedList } from "./news-feed-list";
import type { AdBannerItem, HeadlineItem, HomeNewsItem } from "@/lib/home-content";
import styles from "./home-content-layout.module.css";

type HomeContentLayoutProps = {
  news: HomeNewsItem[];
  headlines: HeadlineItem[];
  ads: AdBannerItem[];
  tickerSpeed?: number;
};

export function HomeContentLayout({ news, headlines, ads, tickerSpeed = 24000 }: HomeContentLayoutProps) {
  return (
    <section className={styles.wrapper} aria-label="Homepage content columns">
      <LatestHeadlines items={headlines} speed={tickerSpeed} />
      <NewsFeedList items={news} />
      <AdsRail items={ads} />
    </section>
  );
}
