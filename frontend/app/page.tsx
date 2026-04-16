import { HomeContentLayout } from "@/components/home/home-content-layout";
import { getHomePageData } from "@/lib/home-api";

export default async function HomePage() {
  const { news, headlines, ads, settings } = await getHomePageData();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <HomeContentLayout news={news} headlines={headlines} ads={ads} tickerSpeed={settings.tickerSpeed} />
    </main>
  );
}
