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
  {
    title: "Budget 2026: Tax slab me bade badlav, middle class ko relief",
    slug: "budget-2026-tax-slab-relief-middle-class",
    image: "/news/news-1.svg",
    category: "Politics",
    publishedAt: "15 April 2026"
  },
  {
    title: "Monsoon forecast normal, krishi sector ko mil sakta hai boost",
    slug: "monsoon-forecast-normal-krishi-sector-boost",
    image: "/news/news-2.svg",
    category: "Environment",
    publishedAt: "15 April 2026"
  },
  {
    title: "AI startup ne 200 crore funding raise ki, 500 jobs announce",
    slug: "ai-startup-funding-raise-jobs-announcement",
    image: "/news/news-3.svg",
    category: "Business",
    publishedAt: "14 April 2026"
  },
  {
    title: "Metro phase-3 route approved, 18 naye stations banenge",
    slug: "metro-phase-3-route-approved-new-stations",
    image: "/news/news-4.svg",
    category: "City",
    publishedAt: "14 April 2026"
  },
  {
    title: "India vs Australia T20 series ke liye squad ka elan",
    slug: "india-vs-australia-t20-series-squad-announced",
    image: "/news/news-5.svg",
    category: "Sports",
    publishedAt: "13 April 2026"
  },
  {
    title: "Digital health mission me naya patient app nationwide launch",
    slug: "digital-health-mission-patient-app-nationwide-launch",
    image: "/news/news-6.svg",
    category: "Health",
    publishedAt: "13 April 2026"
  }
];

export const latestHeadlines: HeadlineItem[] = [
  {
    title: "Sensex 900 points chadha, banking stocks me tezi",
    slug: "sensex-900-points-rise-banking-stocks"
  },
  {
    title: "NEET registration deadline do din aur badhi",
    slug: "neet-registration-deadline-extended"
  },
  {
    title: "Delhi me heatwave alert, schools ko advisory",
    slug: "delhi-heatwave-alert-school-advisory"
  },
  {
    title: "UP me expressway par smart toll system shuru",
    slug: "up-expressway-smart-toll-system-start"
  },
  {
    title: "Railway ne summer special trains ka schedule jari kiya",
    slug: "railway-summer-special-trains-schedule"
  },
  {
    title: "Gold prices all-time high ke paas, jewellers ki demand badhi",
    slug: "gold-prices-near-all-time-high-jewellers-demand"
  },
  {
    title: "State board result date announce, website par notice upload",
    slug: "state-board-result-date-announced"
  },
  {
    title: "Cyber fraud ke naye pattern par police ne public alert diya",
    slug: "cyber-fraud-new-pattern-public-alert"
  }
];

export const adBanners: AdBannerItem[] = [
  {
    title: "Biz Booster Ads",
    description: "Apne business ko local audience tak pahunchao. Premium ad slots available.",
    ctaLabel: "Book Slot",
    targetUrl: "https://example.com/book-slot"
  },
  {
    title: "Festival Offer",
    description: "Display campaign par 30% tak discount. Limited period creative package.",
    ctaLabel: "View Plans",
    targetUrl: "https://example.com/plans"
  }
];
