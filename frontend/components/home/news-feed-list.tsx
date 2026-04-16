"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { HomeNewsItem } from "@/lib/home-content";
import { getPublishedNews } from "@/lib/home-api";
import styles from "./news-feed-list.module.css";

type NewsFeedListProps = {
  items: HomeNewsItem[];
};

export function NewsFeedList({ items: initialItems }: NewsFeedListProps) {
  const [items, setItems] = useState(initialItems);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialItems.length >= 10);
  const observerTarget = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) {
      return;
    }

    setIsLoading(true);

    try {
      const { news, hasMore: nextHasMore } = await getPublishedNews(items.length, 10);

      if (news.length > 0) {
        setItems((current) => [...current, ...news]);
        setHasMore(nextHasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more news:", error);
    } finally {
      setIsLoading(false);
    }
  }, [items.length, isLoading, hasMore]);

  useEffect(() => {
    if (!observerTarget.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerTarget.current);

    return () => {
      observer.disconnect();
    };
  }, [loadMore]);

  return (
    <section className={styles.panel} aria-label="Latest news feed">
      <div className={styles.headerRow}>
        <p className={styles.eyebrow}>Top Stories</p>
        <h1 className={styles.title}>Khabar Deklo News Feed</h1>
      </div>

      <div className={styles.list}>
        {items.map((item) => (
          <article key={item.slug} className={styles.card}>
            <Link href={`/news/${item.slug}`} className={styles.imageWrap}>
              <img src={item.image} alt={item.title} className={styles.image} loading="lazy" />
            </Link>
            <div className={styles.body}>
              <div className={styles.meta}>
                <span>{item.category}</span>
                <span className={styles.dot} />
                <span>{item.publishedAt}</span>
                {item.author && (
                  <>
                    <span className={styles.dot} />
                    <Link href={`/reporter/${item.author.id}`} className={styles.authorLink}>
                      {item.author.name}
                    </Link>
                  </>
                )}
              </div>
              <h2 className={styles.cardTitle}>
                <Link href={`/news/${item.slug}`} className={styles.titleLink}>
                  {item.title}
                </Link>
              </h2>
            </div>
          </article>
        ))}
      </div>

      {hasMore ? (
        <div ref={observerTarget} className={styles.loadingTrigger}>
          {isLoading ? <p className={styles.loadingText}>Loading more stories...</p> : null}
        </div>
      ) : (
        <p className={styles.endMessage}>No more stories available.</p>
      )}
    </section>
  );
}
