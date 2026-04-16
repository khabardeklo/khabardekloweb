import { Request, Response } from "express";
import { getOrCreateSettings, updateSettingsItem } from "../services/settings.service";
import type { PlatformSettingsPayload } from "../types/settings";

export const getSettings = async (_req: Request, res: Response): Promise<void> => {
  const settings = await getOrCreateSettings();
  res.json(settings);
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  const payload = req.body as PlatformSettingsPayload;
  const settings = await updateSettingsItem(payload);
  res.json({ message: "Settings updated", settings });
};
