import Link from "next/link";
import type { HeadlineItem } from "@/lib/home-content";
import styles from "./latest-headlines.module.css";

type LatestHeadlinesProps = {
  items: HeadlineItem[];
  speed?: number;
};

export function LatestHeadlines({ items, speed = 24000 }: LatestHeadlinesProps) {
  const tickerItems = items.length > 0 ? [...items, ...items] : [];
  const animationDuration = `${speed}ms`;

  return (
    <aside className={styles.panel} aria-label="Taza khabrein">
      <div className={styles.header}>ताज़ा खबरें</div>
      <div className={styles.viewport}>
        <ul className={styles.list} style={{ "--ticker-duration": animationDuration } as React.CSSProperties}>
          {tickerItems.map((headline, index) => (
            <li key={`${headline.slug}-${index}`} className={styles.item}>
              <Link className={styles.link} href={`/news/${headline.slug}`}>
                {headline.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
