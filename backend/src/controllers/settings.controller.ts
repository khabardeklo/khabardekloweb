import { Request, Response } from "express";
import { getOrCreateSettings, updateSettingsItem } from "../services/settings.service";
import { backfillFacebookPostsForPublishedNews } from "../services/news.service";
import type { PlatformSettingsPayload } from "../types/settings";

export const getSettings = async (_req: Request, res: Response): Promise<void> => {
  const settings = await getOrCreateSettings();
  const publicSettings = settings.toObject ? settings.toObject() : settings;

  res.json({
    ...publicSettings,
    socialMedia: {
      ...(publicSettings as { socialMedia?: { facebook?: Record<string, unknown> } }).socialMedia,
      facebook: {
        ...((publicSettings as { socialMedia?: { facebook?: Record<string, unknown> } }).socialMedia?.facebook ?? {}),
        pageAccessToken: undefined,
      },
    },
  });
};

export const getAdminSettings = async (_req: Request, res: Response): Promise<void> => {
  const settings = await getOrCreateSettings();
  res.json(settings);
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  const payload = req.body as PlatformSettingsPayload;
  const settings = await updateSettingsItem(payload);

  const facebookSettings = settings.socialMedia?.facebook;
  const canBackfillFacebookPosts =
    facebookSettings?.autoPostEnabled === true &&
    typeof facebookSettings.pageId === "string" &&
    facebookSettings.pageId.trim().length > 0 &&
    typeof facebookSettings.pageAccessToken === "string" &&
    facebookSettings.pageAccessToken.trim().length > 0;

  if (canBackfillFacebookPosts) {
    const facebookBackfill = await backfillFacebookPostsForPublishedNews(25);
    res.json({
      message: "Settings updated and Facebook auto-post sync executed",
      settings,
      facebookBackfill,
    });
    return;
  }

  res.json({ message: "Settings updated", settings });
};
