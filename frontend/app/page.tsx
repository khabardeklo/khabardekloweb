import { HomeContentLayout } from "@/components/home/home-content-layout";
import { BigNewsGrid } from "@/components/home/big-news-grid";
import { TopStoriesSection } from "@/components/home/top-stories-section";
import { VideoSection } from "@/components/home/video-section";
import { PhotosSection } from "@/components/home/photos-section";
import { getHomePageData } from "@/lib/home-api";

export default async function HomePage() {
  const { news, headlines, ads, settings } = await getHomePageData();
  const homepage = settings.homepage;
  const blockOrder = homepage?.blockOrder || ["bigNewsGrid", "topStories", "mediaHighlights", "contentColumns"];

  const renderBlock = (blockKey: string) => {
    switch (blockKey) {
      case "bigNewsGrid":
        if (homepage?.showBigNewsGrid === false) return null;
        return (
          <BigNewsGrid
            items={news}
            title={homepage?.bigNewsTitle}
            ctaLabel={homepage?.bigNewsCtaLabel}
            ctaHref={homepage?.bigNewsCtaHref}
            limit={homepage?.bigNewsLimit}
          />
        );
      case "topStories":
        if (homepage?.showTopStories === false) return null;
        return (
          <TopStoriesSection
            items={news}
            title={homepage?.topStoriesTitle}
            ctaLabel={homepage?.topStoriesCtaLabel}
            ctaHref={homepage?.topStoriesCtaHref}
            limit={homepage?.topStoriesLimit}
          />
        );
      case "mediaHighlights":
        if (homepage?.showMediaHighlights === false) return null;
        return (
          <section className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2" aria-label="Media highlights">
            <VideoSection
              items={news}
              title={homepage?.videoSectionTitle}
              ctaLabel={homepage?.videoSectionCtaLabel}
              ctaHref={homepage?.videoSectionCtaHref}
              limit={homepage?.videoSectionLimit}
            />
            <PhotosSection
              items={news}
              title={homepage?.photosSectionTitle}
              ctaLabel={homepage?.photosSectionCtaLabel}
              ctaHref={homepage?.photosSectionCtaHref}
              limit={homepage?.photosSectionLimit}
            />
          </section>
        );
      case "contentColumns":
        if (homepage?.showContentColumns === false) return null;
        return (
          <HomeContentLayout
            news={news}
            headlines={headlines}
            ads={ads}
            showHeadlinesRail={homepage?.showHeadlinesRail !== false}
            showNewsFeed
            showAdsRail={homepage?.showAdsRail !== false}
            headlinesTitle={homepage?.headlinesTitle}
            newsFeedEyebrow={homepage?.newsFeedEyebrow}
            newsFeedTitle={homepage?.newsFeedTitle}
            adsTitle={homepage?.adsTitle}
            headlinesLimit={homepage?.headlinesLimit}
            adsLimit={homepage?.adsLimit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {blockOrder.map((blockKey) => (
        <div key={blockKey}>{renderBlock(blockKey)}</div>
      ))}
    </main>
  );
}
