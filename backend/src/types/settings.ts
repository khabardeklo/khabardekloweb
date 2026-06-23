export type SettingsLink = {
  label: string;
  href: string;
  isActive: boolean;
  icon?: string;
  badge?: string;
};

export type PlatformLayoutSettings = {
  showHeader: boolean;
  showFooter: boolean;
  showCategoryMenu: boolean;
  showBreakingTicker: boolean;
  maxHeaderLinks: number;
  maxFooterLinks: number;
  maxSideMenuLinks: number;
};

export type PlatformAdminSettings = {
  headerTitle: string;
  footerText: string;
  sidebarLinks: SettingsLink[];
};

export type PlatformFacebookSettings = {
  autoPostEnabled: boolean;
  pageId: string;
  pageAccessToken: string;
};

export type PlatformSocialMediaSettings = {
  facebook: Partial<PlatformFacebookSettings>;
};

export type PlatformThemeSettings = {
  accentColor: string;
  headerBackground: string;
  footerBackground: string;
};

export type PlatformHomepageSettings = {
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

export type PlatformCategoryPageSettings = {
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

export type PlatformSearchPageSettings = {
  eyebrow: string;
  title: string;
  placeholder: string;
  buttonLabel: string;
  emptyStateText: string;
  resultsLabel: string;
};

export type PlatformNewsPageSettings = {
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

export type PlatformSettingsPayload = {
  tickerSpeed?: number;
  maxNewsPerPage?: number;
  siteName?: string;
  siteTagline?: string;
  siteDescription?: string;
  logoEnglishUrl?: string;
  logoHindiUrl?: string;
  copyrightText?: string;
  layout?: Partial<PlatformLayoutSettings>;
  homepage?: Partial<PlatformHomepageSettings>;
  categoryPage?: Partial<PlatformCategoryPageSettings>;
  searchPage?: Partial<PlatformSearchPageSettings>;
  newsPage?: Partial<PlatformNewsPageSettings>;
  primaryNavLinks?: SettingsLink[];
  headerQuickLinks?: SettingsLink[];
  footerLinks?: SettingsLink[];
  sideMenuLinks?: SettingsLink[];
  admin?: Partial<PlatformAdminSettings>;
  socialMedia?: Partial<PlatformSocialMediaSettings>;
  theme?: Partial<PlatformThemeSettings>;
};
