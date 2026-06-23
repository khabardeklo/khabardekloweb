export type SettingsLink = {
  label: string;
  href: string;
  isActive: boolean;
  icon?: string;
  badge?: string;
};

export type HomepageSettings = {
  blockOrder: string[];
  showBigNewsGrid: boolean;
  showTopStories: boolean;
  showMediaHighlights: boolean;
  showContentColumns: boolean;
  showHeadlinesRail: boolean;
  showAdsRail: boolean;
  bigNewsTitle: string;
  bigNewsCtaLabel: string;
  bigNewsCtaHref: string;
  topStoriesTitle: string;
  topStoriesCtaLabel: string;
  topStoriesCtaHref: string;
  videoSectionTitle: string;
  videoSectionCtaLabel: string;
  videoSectionCtaHref: string;
  photosSectionTitle: string;
  photosSectionCtaLabel: string;
  photosSectionCtaHref: string;
  newsFeedEyebrow: string;
  newsFeedTitle: string;
  headlinesTitle: string;
  adsTitle: string;
  bigNewsLimit: number;
  topStoriesLimit: number;
  videoSectionLimit: number;
  photosSectionLimit: number;
  headlinesLimit: number;
  adsLimit: number;
};

export type CategoryPageSettings = {
  titlePrefix: string;
  introText: string;
  browseAllLabel: string;
  browseAllHref: string;
  showSidebarWidgets: boolean;
  sidebarHeadlinesTitle: string;
  sidebarAdsTitle: string;
  sidebarHeadlinesLimit: number;
  sidebarAdsLimit: number;
};

export type SearchPageSettings = {
  eyebrow: string;
  title: string;
  placeholder: string;
  buttonLabel: string;
  emptyStateText: string;
  resultsLabel: string;
};

export type NewsPageSettings = {
  breadcrumbHomeLabel: string;
  sidebarHeadlinesTitle: string;
  sidebarAdsTitle: string;
  sidebarHeadlinesLimit: number;
  sidebarAdsLimit: number;
  stayUpdatedTitle: string;
  stayUpdatedDescription: string;
  subscribePlaceholder: string;
  subscribeButtonLabel: string;
  backToHomeLabel: string;
  relatedMediaTitle: string;
  videoSectionTitle: string;
  photoSectionTitle: string;
  videoSectionCtaLabel: string;
  photoSectionCtaLabel: string;
  relatedMediaHref: string;
};

export type PublicSiteSettings = {
  tickerSpeed: number;
  maxNewsPerPage: number;
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  logoEnglishUrl: string;
  logoHindiUrl: string;
  copyrightText: string;
  layout: {
    showHeader: boolean;
    showFooter: boolean;
    showCategoryMenu: boolean;
    showBreakingTicker: boolean;
    maxHeaderLinks: number;
    maxFooterLinks: number;
    maxSideMenuLinks: number;
  };
  homepage: HomepageSettings;
  categoryPage: CategoryPageSettings;
  searchPage: SearchPageSettings;
  newsPage: NewsPageSettings;
  primaryNavLinks: SettingsLink[];
  headerQuickLinks: SettingsLink[];
  footerLinks: SettingsLink[];
  sideMenuLinks: SettingsLink[];
  socialMedia?: {
    facebook?: {
      autoPostEnabled: boolean;
      pageId: string;
    };
  };
  theme: {
    accentColor: string;
    headerBackground: string;
    footerBackground: string;
  };
};

const defaultSettings: PublicSiteSettings = {
  tickerSpeed: 24000,
  maxNewsPerPage: 10,
  siteName: "Khabar Deklo",
  siteTagline: "Fast, trusted, and readable news.",
  siteDescription: "Daily news, analysis, and breaking stories from Khabar Deklo.",
  logoEnglishUrl: "/logo%20english.png",
  logoHindiUrl: "/logo%20hindi.png",
  copyrightText: "© 2026 Khabar Deklo. All rights reserved.",
  layout: {
    showHeader: true,
    showFooter: true,
    showCategoryMenu: true,
    showBreakingTicker: true,
    maxHeaderLinks: 5,
    maxFooterLinks: 8,
    maxSideMenuLinks: 16,
  },
  homepage: {
    blockOrder: ["bigNewsGrid", "topStories", "mediaHighlights", "contentColumns"],
    showBigNewsGrid: true,
    showTopStories: true,
    showMediaHighlights: true,
    showContentColumns: true,
    showHeadlinesRail: true,
    showAdsRail: true,
    bigNewsTitle: "बड़ी खबरें",
    bigNewsCtaLabel: "सभी खबरें",
    bigNewsCtaHref: "/news",
    topStoriesTitle: "Top Story",
    topStoriesCtaLabel: "More Stories",
    topStoriesCtaHref: "/news",
    videoSectionTitle: "Video Section",
    videoSectionCtaLabel: "Watch All",
    videoSectionCtaHref: "/news",
    photosSectionTitle: "Photos Section",
    photosSectionCtaLabel: "View Gallery",
    photosSectionCtaHref: "/news",
    newsFeedEyebrow: "Top Stories",
    newsFeedTitle: "Khabar Deklo News Feed",
    headlinesTitle: "ताज़ा खबरें",
    adsTitle: "Sponsored",
    bigNewsLimit: 9,
    topStoriesLimit: 5,
    videoSectionLimit: 4,
    photosSectionLimit: 6,
    headlinesLimit: 12,
    adsLimit: 4,
  },
  categoryPage: {
    titlePrefix: "Stories in",
    introText: "Browse the latest stories in this category.",
    browseAllLabel: "Browse all stories",
    browseAllHref: "/",
    showSidebarWidgets: true,
    sidebarHeadlinesTitle: "ताज़ा खबरें",
    sidebarAdsTitle: "Sponsored",
    sidebarHeadlinesLimit: 8,
    sidebarAdsLimit: 2,
  },
  searchPage: {
    eyebrow: "Search",
    title: "Search news",
    placeholder: "Search news, topics, authors...",
    buttonLabel: "Search",
    emptyStateText: "Type a keyword to search the latest stories.",
    resultsLabel: "Results will appear after you search.",
  },
  newsPage: {
    breadcrumbHomeLabel: "Home",
    sidebarHeadlinesTitle: "ताज़ा खबरें",
    sidebarAdsTitle: "Sponsored",
    sidebarHeadlinesLimit: 10,
    sidebarAdsLimit: 2,
    stayUpdatedTitle: "Stay Updated",
    stayUpdatedDescription: "Get the latest news delivered to your inbox.",
    subscribePlaceholder: "Enter your email",
    subscribeButtonLabel: "Subscribe",
    backToHomeLabel: "Back to home",
    relatedMediaTitle: "Related Media",
    videoSectionTitle: "Video Section",
    photoSectionTitle: "Photos Section",
    videoSectionCtaLabel: "Watch All",
    photoSectionCtaLabel: "View Gallery",
    relatedMediaHref: "/news",
  },
  primaryNavLinks: [
    { label: "Home", href: "/", isActive: true },
    { label: "Search", href: "/search", isActive: true },
    { label: "Profile", href: "/profile", isActive: true },
  ],
  headerQuickLinks: [],
  footerLinks: [],
  sideMenuLinks: [],
  socialMedia: {
    facebook: {
      autoPostEnabled: false,
      pageId: "",
    },
  },
  theme: {
    accentColor: "#0284c7",
    headerBackground: "#ffffff",
    footerBackground: "#ffffff",
  },
};

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000/api";

const fetchJson = async <T>(url: string): Promise<T | null> => {
  try {
    const response = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
};

const cleanLinks = (links: SettingsLink[] | undefined): SettingsLink[] => {
  if (!Array.isArray(links)) {
    return [];
  }

  return links.filter((link) => link && typeof link.label === "string" && typeof link.href === "string" && link.isActive !== false);
};

const cleanLinksOrDefault = (links: SettingsLink[] | undefined, fallback: SettingsLink[]): SettingsLink[] => {
  const cleaned = cleanLinks(links);
  return cleaned.length > 0 ? cleaned : fallback;
};

export const getPublicSiteSettings = async (): Promise<PublicSiteSettings> => {
  const response = await fetchJson<Partial<PublicSiteSettings>>(`${backendUrl}/settings`);

  if (!response) {
    return defaultSettings;
  }

  return {
    ...defaultSettings,
    ...response,
    layout: {
      ...defaultSettings.layout,
      ...(response.layout || {}),
    },
    homepage: {
      ...defaultSettings.homepage,
      ...(response.homepage || {}),
    },
    categoryPage: {
      ...defaultSettings.categoryPage,
      ...(response.categoryPage || {}),
    },
    searchPage: {
      ...defaultSettings.searchPage,
      ...(response.searchPage || {}),
    },
    newsPage: {
      ...defaultSettings.newsPage,
      ...(response.newsPage || {}),
    },
    theme: {
      ...defaultSettings.theme,
      ...(response.theme || {}),
    },
    primaryNavLinks: cleanLinksOrDefault(response.primaryNavLinks, defaultSettings.primaryNavLinks),
    headerQuickLinks: cleanLinks(response.headerQuickLinks),
    footerLinks: cleanLinksOrDefault(response.footerLinks, defaultSettings.footerLinks),
    sideMenuLinks: cleanLinks(response.sideMenuLinks),
  };
};
