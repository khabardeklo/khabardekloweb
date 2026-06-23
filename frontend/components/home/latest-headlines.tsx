import Link from "next/link";
import type { HeadlineItem } from "@/lib/home-content";
import styles from "./latest-headlines.module.css";

type LatestHeadlinesProps = {
  items: HeadlineItem[];
  title?: string;
};

export function LatestHeadlines({ items, title = "ताज़ा खबरें" }: LatestHeadlinesProps) {
  return (
    <aside className={styles.panel} aria-label="Taza khabrein">
      <div className={styles.header}>{title}</div>
      <ul className={styles.list}>
        {items.map((headline) => (
          <li key={headline.slug} className={styles.item}>
            <Link className={styles.link} href={`/news/${headline.slug}`}>
              {headline.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
