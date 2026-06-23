import { PlatformSettings } from "../models/PlatformSettings";
import type { PlatformSettingsPayload, SettingsLink } from "../types/settings";

const normalizeLinks = (links: SettingsLink[]): SettingsLink[] => {
  return links
    .filter((item) => typeof item?.label === "string" && typeof item?.href === "string")
    .map((item) => ({
      label: item.label.trim(),
      href: item.href.trim(),
      isActive: item.isActive !== false,
      icon: item.icon?.trim() || undefined,
      badge: item.badge?.trim() || undefined,
    }));
};

const normalizeFacebookSettings = (
  facebookSettings: PlatformSettingsPayload["socialMedia"],
  existingFacebookSettings: { autoPostEnabled?: boolean; pageId?: string; pageAccessToken?: string }
) => {
  const nextFacebookSettings = facebookSettings?.facebook;

  return {
    facebook: {
      autoPostEnabled:
        typeof nextFacebookSettings?.autoPostEnabled === "boolean"
          ? nextFacebookSettings.autoPostEnabled
          : existingFacebookSettings.autoPostEnabled === true,
      pageId:
        typeof nextFacebookSettings?.pageId === "string"
          ? nextFacebookSettings.pageId.trim()
          : typeof existingFacebookSettings.pageId === "string"
            ? existingFacebookSettings.pageId
            : "",
      pageAccessToken:
        typeof nextFacebookSettings?.pageAccessToken === "string"
          ? nextFacebookSettings.pageAccessToken.trim()
          : typeof existingFacebookSettings.pageAccessToken === "string"
            ? existingFacebookSettings.pageAccessToken
            : "",
    },
  };
};

export const getOrCreateSettings = async () => {
  let settings = await PlatformSettings.findOne();

  if (!settings) {
    settings = await PlatformSettings.create({});
  }

  return settings;
};

export const updateSettingsItem = async (payload: PlatformSettingsPayload) => {
  const settings = await getOrCreateSettings();
  const settingsDoc = settings as any;

  if (typeof payload.tickerSpeed === "number") {
    settingsDoc.tickerSpeed = payload.tickerSpeed;
  }

  if (typeof payload.maxNewsPerPage === "number") {
    settingsDoc.maxNewsPerPage = payload.maxNewsPerPage;
  }

  if (typeof payload.siteName === "string") {
    settingsDoc.siteName = payload.siteName;
  }

  if (typeof payload.siteTagline === "string") {
    settingsDoc.siteTagline = payload.siteTagline;
  }

  if (typeof payload.siteDescription === "string") {
    settingsDoc.siteDescription = payload.siteDescription;
  }

  if (typeof payload.logoEnglishUrl === "string") {
    settingsDoc.logoEnglishUrl = payload.logoEnglishUrl;
  }

  if (typeof payload.logoHindiUrl === "string") {
    settingsDoc.logoHindiUrl = payload.logoHindiUrl;
  }

  if (typeof payload.copyrightText === "string") {
    settingsDoc.copyrightText = payload.copyrightText;
  }

  if (payload.layout) {
    settingsDoc.layout = {
      ...(settingsDoc.layout?.toObject?.() ?? settingsDoc.layout ?? {}),
      ...payload.layout,
    };
  }

  if (payload.homepage) {
    settingsDoc.homepage = {
      ...(settingsDoc.homepage?.toObject?.() ?? settingsDoc.homepage ?? {}),
      ...payload.homepage,
    };
  }

  if (payload.categoryPage) {
    settingsDoc.categoryPage = {
      ...(settingsDoc.categoryPage?.toObject?.() ?? settingsDoc.categoryPage ?? {}),
      ...payload.categoryPage,
    };
  }

  if (payload.searchPage) {
    settingsDoc.searchPage = {
      ...(settingsDoc.searchPage?.toObject?.() ?? settingsDoc.searchPage ?? {}),
      ...payload.searchPage,
    };
  }

  if (Array.isArray(payload.primaryNavLinks)) {
    settingsDoc.primaryNavLinks = normalizeLinks(payload.primaryNavLinks);
  }

  if (Array.isArray(payload.headerQuickLinks)) {
    settingsDoc.headerQuickLinks = normalizeLinks(payload.headerQuickLinks);
  }

  if (Array.isArray(payload.footerLinks)) {
    settingsDoc.footerLinks = normalizeLinks(payload.footerLinks);
  }

  if (Array.isArray(payload.sideMenuLinks)) {
    settingsDoc.sideMenuLinks = normalizeLinks(payload.sideMenuLinks);
  }

  if (payload.admin) {
    const mergedAdmin = {
      ...(settingsDoc.admin?.toObject?.() ?? settingsDoc.admin ?? {}),
      ...payload.admin,
    };

    if (Array.isArray(payload.admin.sidebarLinks)) {
      mergedAdmin.sidebarLinks = normalizeLinks(payload.admin.sidebarLinks);
    }

    settingsDoc.admin = mergedAdmin;
  }

  if (payload.socialMedia) {
    const existingSocialMedia = settingsDoc.socialMedia?.toObject?.() ?? settingsDoc.socialMedia ?? {};
    const existingFacebookSettings = existingSocialMedia.facebook ?? {};
    settingsDoc.socialMedia = {
      ...existingSocialMedia,
      facebook: {
        ...normalizeFacebookSettings(payload.socialMedia, existingFacebookSettings).facebook,
      },
    };
  }

  if (payload.theme) {
    settingsDoc.theme = {
      ...(settingsDoc.theme?.toObject?.() ?? settingsDoc.theme ?? {}),
      ...payload.theme,
    };
  }

  await settingsDoc.save();
  return settingsDoc;
};
