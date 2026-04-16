import { PlatformSettings } from "../models/PlatformSettings";
import type { PlatformSettingsPayload } from "../types/settings";

export const getOrCreateSettings = async () => {
  let settings = await PlatformSettings.findOne();

  if (!settings) {
    settings = await PlatformSettings.create({
      tickerSpeed: 24000,
      maxNewsPerPage: 10,
    });
  }

  return settings;
};

export const updateSettingsItem = async (payload: PlatformSettingsPayload) => {
  const settings = await getOrCreateSettings();
  return PlatformSettings.findByIdAndUpdate(settings._id, payload, { new: true });
};
