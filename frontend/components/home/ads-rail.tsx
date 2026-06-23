import type { AdBannerItem } from "@/lib/home-content";
import styles from "./ads-rail.module.css";

type AdsRailProps = {
  items: AdBannerItem[];
  title?: string;
};

export function AdsRail({ items, title = "Sponsored" }: AdsRailProps) {
  return (
    <aside className={styles.rail} aria-label="Sponsored ad banners">
      {items.map((ad, index) => (
        <article key={ad.title} className={styles.card}>
          <p className={styles.tag}>{title}</p>
          <h3 className={styles.title}>{ad.title}</h3>
          <p className={styles.description}>{ad.description}</p>
          <a className={styles.cta} href={ad.targetUrl} target="_blank" rel="noreferrer">
            {ad.ctaLabel}
          </a>
          <div className={`${styles.graphic} ${index % 2 === 0 ? styles.graphicOne : styles.graphicTwo}`} aria-hidden="true" />
        </article>
      ))}
    </aside>
  );
}
