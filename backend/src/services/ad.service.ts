import { AdBanner } from "../models/AdBanner";
import type { AdPayload, ReorderAdsPayload } from "../types/ad";

export const listPublicAds = () => {
  return AdBanner.find({ isActive: true }).sort({ position: 1, updatedAt: -1 });
};

export const listAllAds = () => {
  return AdBanner.find().sort({ position: 1, updatedAt: -1 });
};

export const createAdItem = async (payload: AdPayload) => {
  const maxPosition = await AdBanner.findOne().sort({ position: -1 }).select("position");
  const nextPosition = (maxPosition?.position ?? -1) + 1;

  return AdBanner.create({
    title: payload.title,
    description: payload.description,
    ctaLabel: payload.ctaLabel,
    targetUrl: payload.targetUrl,
    isActive: payload.isActive ?? true,
    position: payload.position ?? nextPosition,
  });
};

export const updateAdItem = (id: string, payload: Partial<AdPayload>) => {
  return AdBanner.findByIdAndUpdate(id, payload, { new: true });
};

export const deleteAdItem = (id: string) => {
  return AdBanner.findByIdAndDelete(id);
};

export const reorderAds = async (payload: ReorderAdsPayload) => {
  const updates = payload.ads.map((ad) =>
    AdBanner.findByIdAndUpdate(ad.id, { position: ad.position }, { new: true })
  );

  return Promise.all(updates);
};
