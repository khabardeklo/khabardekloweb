import { backendUrl } from "@/lib/config";

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
  showNewsIn30Seconds: boolean;
  newsIn30SecondsTitle: string;
  newsIn30SecondsLimit: number;
  showNewsForStudents: boolean;
  newsForStudentsTitle: string;
  newsForStudentsLimit: number;
  showAiNewsChat: boolean;
  aiNewsChatTitle: string;
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

export type SiteSettings = {
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
  admin: {
    headerTitle: string;
    footerText: string;
    sidebarLinks: SettingsLink[];
  };
  socialMedia: {
    facebook: {
      autoPostEnabled: boolean;
      pageId: string;
      pageAccessToken: string;
    };
  };
  theme: {
    accentColor: string;
    headerBackground: string;
    footerBackground: string;
  };
};

export const defaultSiteSettings: SiteSettings = {
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
    blockOrder: ["bigNewsGrid", "topStories", "mediaHighlights", "contentColumns", "newsIn30Seconds", "newsForStudents", "aiNewsChat"],
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
    showNewsIn30Seconds: true,
    newsIn30SecondsTitle: "News in 30 Seconds",
    newsIn30SecondsLimit: 6,
    showNewsForStudents: true,
    newsForStudentsTitle: "News for Students",
    newsForStudentsLimit: 8,
    showAiNewsChat: true,
    aiNewsChatTitle: "AI News Chat",
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
  footerLinks: [
    { label: "About", href: "/pages/about", isActive: true },
    { label: "Contact", href: "/pages/contact", isActive: true },
  ],
  sideMenuLinks: [],
  admin: {
    headerTitle: "Khabar Deklo Admin",
    footerText: "Khabar Deklo Admin Dashboard",
    sidebarLinks: [
      { label: "Posts", href: "/posts", icon: "📝", isActive: true },
      { label: "Pages", href: "/pages", icon: "📄", isActive: true },
      { label: "Comments", href: "/comments", icon: "💬", isActive: true },
      { label: "Users", href: "/users", icon: "👥", isActive: true },
      { label: "Reporter Management", href: "/reporter-management", icon: "🧾", isActive: true },
      { label: "Stats", href: "/analytics", icon: "📈", isActive: true },
      { label: "Earnings", href: "/earnings", icon: "💰", isActive: true },
      { label: "Layout", href: "/layout", icon: "🎨", isActive: true },
      { label: "Theme", href: "/theme", icon: "🌈", isActive: true },
      { label: "Settings", href: "/settings", icon: "⚙️", isActive: true },
    ],
  },
  socialMedia: {
    facebook: {
      autoPostEnabled: false,
      pageId: "",
      pageAccessToken: "",
    },
  },
  theme: {
    accentColor: "#0284c7",
    headerBackground: "#ffffff",
    footerBackground: "#ffffff",
  },
};

const normalizeSettings = (payload: Partial<SiteSettings> | null): SiteSettings => {
  if (!payload) {
    return defaultSiteSettings;
  }

  return {
    ...defaultSiteSettings,
    ...payload,
    layout: { ...defaultSiteSettings.layout, ...(payload.layout || {}) },
    homepage: { ...defaultSiteSettings.homepage, ...(payload.homepage || {}) },
    categoryPage: { ...defaultSiteSettings.categoryPage, ...(payload.categoryPage || {}) },
    searchPage: { ...defaultSiteSettings.searchPage, ...(payload.searchPage || {}) },
    newsPage: { ...defaultSiteSettings.newsPage, ...(payload.newsPage || {}) },
    admin: {
      ...defaultSiteSettings.admin,
      ...(payload.admin || {}),
      sidebarLinks: payload.admin?.sidebarLinks || defaultSiteSettings.admin.sidebarLinks,
    },
    socialMedia: {
      ...defaultSiteSettings.socialMedia,
      ...(payload.socialMedia || {}),
      facebook: {
        ...defaultSiteSettings.socialMedia.facebook,
        ...(payload.socialMedia?.facebook || {}),
      },
    },
    theme: { ...defaultSiteSettings.theme, ...(payload.theme || {}) },
    primaryNavLinks: payload.primaryNavLinks || defaultSiteSettings.primaryNavLinks,
    headerQuickLinks: payload.headerQuickLinks || defaultSiteSettings.headerQuickLinks,
    footerLinks: payload.footerLinks || defaultSiteSettings.footerLinks,
    sideMenuLinks: payload.sideMenuLinks || defaultSiteSettings.sideMenuLinks,
  };
};

const requestWithRefresh = async (url: string, init: RequestInit = {}): Promise<Response> => {
  const response = await fetch(url, {
    ...init,
    credentials: "include",
  });

  if (response.status !== 401) {
    return response;
  }

  const refreshResponse = await fetch(`${backendUrl}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!refreshResponse.ok) {
    return response;
  }

  return fetch(url, {
    ...init,
    credentials: "include",
  });
};

export const getPublicSiteSettings = async (): Promise<SiteSettings> => {
  try {
    const response = typeof window === "undefined"
      ? await fetch(`${backendUrl}/settings`, { next: { revalidate: 60 } })
      : await fetch(`${backendUrl}/settings`);

    if (!response.ok) {
      return defaultSiteSettings;
    }

    return normalizeSettings((await response.json()) as Partial<SiteSettings>);
  } catch {
    return defaultSiteSettings;
  }
};

export const getSettingsForAdmin = async (): Promise<SiteSettings> => {
  const response = await requestWithRefresh(`${backendUrl}/settings/admin`);

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(data?.message || "Unable to load settings");
  }

  return normalizeSettings((await response.json()) as Partial<SiteSettings>);
};

export const updateSiteSettings = async (payload: Partial<SiteSettings>): Promise<SiteSettings> => {
  const response = await requestWithRefresh(`${backendUrl}/settings`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => null)) as { message?: string; settings?: Partial<SiteSettings> } | null;

  if (!response.ok || !data?.settings) {
    throw new Error(data?.message || "Unable to update settings");
  }

  return normalizeSettings(data.settings);
};
