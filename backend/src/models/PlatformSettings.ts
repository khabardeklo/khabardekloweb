import mongoose, { Document, Schema } from "mongoose";

type SettingsLink = {
  label: string;
  href: string;
  isActive: boolean;
  icon?: string;
  badge?: string;
};

type FacebookSettings = {
  autoPostEnabled: boolean;
  pageId: string;
  pageAccessToken: string;
};

type HomepageSettings = {
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

type CategoryPageSettings = {
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

type SearchPageSettings = {
  eyebrow: string;
  title: string;
  placeholder: string;
  buttonLabel: string;
  emptyStateText: string;
  resultsLabel: string;
};

type NewsPageSettings = {
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

export interface IPlatformSettings extends Document {
  tickerSpeed: number; // milliseconds per scroll cycle
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
    facebook: FacebookSettings;
  };
  theme: {
    accentColor: string;
    headerBackground: string;
    footerBackground: string;
  };
}

const linkSchema = new Schema<SettingsLink>(
  {
    label: { type: String, required: true, trim: true },
    href: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
    icon: { type: String, trim: true },
    badge: { type: String, trim: true },
  },
  { _id: false }
);

const platformSettingsSchema = new Schema<IPlatformSettings>(
  {
    tickerSpeed: { type: Number, default: 24000 },
    maxNewsPerPage: { type: Number, default: 10 },
    siteName: { type: String, default: "Khabar Deklo" },
    siteTagline: { type: String, default: "Fast, trusted, and readable news." },
    siteDescription: { type: String, default: "Daily news, analysis, and breaking stories from Khabar Deklo." },
    logoEnglishUrl: { type: String, default: "/logo%20english.png" },
    logoHindiUrl: { type: String, default: "/logo%20hindi.png" },
    copyrightText: { type: String, default: "© 2026 Khabar Deklo. All rights reserved." },
    layout: {
      type: {
        showHeader: { type: Boolean, default: true },
        showFooter: { type: Boolean, default: true },
        showCategoryMenu: { type: Boolean, default: true },
        showBreakingTicker: { type: Boolean, default: true },
        maxHeaderLinks: { type: Number, default: 5 },
        maxFooterLinks: { type: Number, default: 8 },
        maxSideMenuLinks: { type: Number, default: 16 },
      },
      default: () => ({
        showHeader: true,
        showFooter: true,
        showCategoryMenu: true,
        showBreakingTicker: true,
        maxHeaderLinks: 5,
        maxFooterLinks: 8,
        maxSideMenuLinks: 16,
      }),
    },
    homepage: {
      type: {
        blockOrder: { type: [String], default: ["bigNewsGrid", "topStories", "mediaHighlights", "contentColumns", "newsIn30Seconds", "newsForStudents", "aiNewsChat"] },
        showBigNewsGrid: { type: Boolean, default: true },
        showTopStories: { type: Boolean, default: true },
        showMediaHighlights: { type: Boolean, default: true },
        showContentColumns: { type: Boolean, default: true },
        showHeadlinesRail: { type: Boolean, default: true },
        showAdsRail: { type: Boolean, default: true },
        bigNewsTitle: { type: String, default: "बड़ी खबरें" },
        bigNewsCtaLabel: { type: String, default: "सभी खबरें" },
        bigNewsCtaHref: { type: String, default: "/news" },
        topStoriesTitle: { type: String, default: "Top Story" },
        topStoriesCtaLabel: { type: String, default: "More Stories" },
        topStoriesCtaHref: { type: String, default: "/news" },
        videoSectionTitle: { type: String, default: "Video Section" },
        videoSectionCtaLabel: { type: String, default: "Watch All" },
        videoSectionCtaHref: { type: String, default: "/news" },
        photosSectionTitle: { type: String, default: "Photos Section" },
        photosSectionCtaLabel: { type: String, default: "View Gallery" },
        photosSectionCtaHref: { type: String, default: "/news" },
        newsFeedEyebrow: { type: String, default: "Top Stories" },
        newsFeedTitle: { type: String, default: "Khabar Deklo News Feed" },
        headlinesTitle: { type: String, default: "ताज़ा खबरें" },
        adsTitle: { type: String, default: "Sponsored" },
        bigNewsLimit: { type: Number, default: 9 },
        topStoriesLimit: { type: Number, default: 5 },
        videoSectionLimit: { type: Number, default: 4 },
        photosSectionLimit: { type: Number, default: 6 },
        headlinesLimit: { type: Number, default: 12 },
        adsLimit: { type: Number, default: 4 },
        showNewsIn30Seconds: { type: Boolean, default: true },
        newsIn30SecondsTitle: { type: String, default: "News in 30 Seconds" },
        newsIn30SecondsLimit: { type: Number, default: 6 },
        showNewsForStudents: { type: Boolean, default: true },
        newsForStudentsTitle: { type: String, default: "News for Students" },
        newsForStudentsLimit: { type: Number, default: 8 },
        showAiNewsChat: { type: Boolean, default: true },
        aiNewsChatTitle: { type: String, default: "AI News Chat" },
      },
      default: () => ({
    categoryPage: {
      type: {
        titlePrefix: { type: String, default: "Stories in" },
        introText: { type: String, default: "Browse the latest stories in this category." },
        browseAllLabel: { type: String, default: "Browse all stories" },
        browseAllHref: { type: String, default: "/" },
        showSidebarWidgets: { type: Boolean, default: true },
        sidebarHeadlinesTitle: { type: String, default: "ताज़ा खबरें" },
        sidebarAdsTitle: { type: String, default: "Sponsored" },
        sidebarHeadlinesLimit: { type: Number, default: 8 },
        sidebarAdsLimit: { type: Number, default: 2 },
      },
      default: () => ({
        titlePrefix: "Stories in",
        introText: "Browse the latest stories in this category.",
        browseAllLabel: "Browse all stories",
        browseAllHref: "/",
        showSidebarWidgets: true,
        sidebarHeadlinesTitle: "ताज़ा खबरें",
        sidebarAdsTitle: "Sponsored",
        sidebarHeadlinesLimit: 8,
        sidebarAdsLimit: 2,
      }),
    },
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
      }),
    },
    searchPage: {
      type: {
        eyebrow: { type: String, default: "Search" },
        title: { type: String, default: "Search news" },
        placeholder: { type: String, default: "Search news, topics, authors..." },
        buttonLabel: { type: String, default: "Search" },
        emptyStateText: { type: String, default: "Type a keyword to search the latest stories." },
        resultsLabel: { type: String, default: "Results will appear after you search." },
      },
      default: () => ({
        eyebrow: "Search",
        title: "Search news",
        placeholder: "Search news, topics, authors...",
        buttonLabel: "Search",
        emptyStateText: "Type a keyword to search the latest stories.",
        resultsLabel: "Results will appear after you search.",
      }),
    },
    newsPage: {
      type: {
        breadcrumbHomeLabel: { type: String, default: "Home" },
        sidebarHeadlinesTitle: { type: String, default: "ताज़ा खबरें" },
        sidebarAdsTitle: { type: String, default: "Sponsored" },
        sidebarHeadlinesLimit: { type: Number, default: 10 },
        sidebarAdsLimit: { type: Number, default: 2 },
        stayUpdatedTitle: { type: String, default: "Stay Updated" },
        stayUpdatedDescription: { type: String, default: "Get the latest news delivered to your inbox." },
        subscribePlaceholder: { type: String, default: "Enter your email" },
        subscribeButtonLabel: { type: String, default: "Subscribe" },
        backToHomeLabel: { type: String, default: "Back to home" },
        relatedMediaTitle: { type: String, default: "Related Media" },
        videoSectionTitle: { type: String, default: "Video Section" },
        photoSectionTitle: { type: String, default: "Photos Section" },
        videoSectionCtaLabel: { type: String, default: "Watch All" },
        photoSectionCtaLabel: { type: String, default: "View Gallery" },
        relatedMediaHref: { type: String, default: "/news" },
      },
      default: () => ({
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
      }),
    },
    primaryNavLinks: {
      type: [linkSchema],
      default: () => [
        { label: "Home", href: "/", isActive: true },
        { label: "Search", href: "/search", isActive: true },
        { label: "Profile", href: "/profile", isActive: true },
      ],
    },
    headerQuickLinks: {
      type: [linkSchema],
      default: () => [],
    },
    footerLinks: {
      type: [linkSchema],
      default: () => [],
    },
    sideMenuLinks: {
      type: [linkSchema],
      default: () => [],
    },
    admin: {
      type: {
        headerTitle: { type: String, default: "Khabar Deklo Admin" },
        footerText: { type: String, default: "Khabar Deklo Admin Dashboard" },
        sidebarLinks: {
          type: [linkSchema],
          default: () => [
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
      },
      default: () => ({
        headerTitle: "Khabar Deklo Admin",
        footerText: "Khabar Deklo Admin Dashboard",
      }),
    },
    socialMedia: {
      type: {
        facebook: {
          autoPostEnabled: { type: Boolean, default: false },
          pageId: { type: String, default: "" },
          pageAccessToken: { type: String, default: "" },
        },
      },
      default: () => ({
        facebook: {
          autoPostEnabled: false,
          pageId: "",
          pageAccessToken: "",
        },
      }),
    },
    theme: {
      type: {
        accentColor: { type: String, default: "#0284c7" },
        headerBackground: { type: String, default: "#ffffff" },
        footerBackground: { type: String, default: "#ffffff" },
      },
      default: () => ({
        accentColor: "#0284c7",
        headerBackground: "#ffffff",
        footerBackground: "#ffffff",
      }),
    },
  },
  { timestamps: true }
);

export const PlatformSettings = mongoose.model<IPlatformSettings>("PlatformSettings", platformSettingsSchema);
