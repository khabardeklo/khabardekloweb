import { Request, Response } from "express";
import { createAdItem, deleteAdItem, listAllAds, listPublicAds, updateAdItem, reorderAds } from "../services/ad.service";
import { isValidAdPayload } from "../validations/ad.validation";
import type { AdPayload, ReorderAdsPayload } from "../types/ad";

export const getPublicAds = async (_req: Request, res: Response): Promise<void> => {
  const ads = await listPublicAds();
  res.json(ads);
};

export const getAllAds = async (_req: Request, res: Response): Promise<void> => {
  const ads = await listAllAds();
  res.json(ads);
};

export const createAd = async (req: Request, res: Response): Promise<void> => {
  const payload = req.body as Partial<AdPayload>;

  if (!isValidAdPayload(payload)) {
    res.status(400).json({ message: "Invalid ad payload" });
    return;
  }

  const ad = await createAdItem(payload);
  res.status(201).json({ message: "Ad created", ad });
};

export const updateAd = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const payload = req.body as Partial<AdPayload>;
  const ad = await updateAdItem(id, payload);

  if (!ad) {
    res.status(404).json({ message: "Ad not found" });
    return;
  }

  res.json({ message: "Ad updated", ad });
};

export const deleteAd = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const deleted = await deleteAdItem(id);

  if (!deleted) {
    res.status(404).json({ message: "Ad not found" });
    return;
  }

  res.json({ message: "Ad deleted" });
};

export const reorderAdBanners = async (req: Request, res: Response): Promise<void> => {
  const payload = req.body as ReorderAdsPayload;

  if (!payload || !Array.isArray(payload.ads)) {
    res.status(400).json({ message: "Invalid reorder payload" });
    return;
  }

  const updated = await reorderAds(payload);
  res.json({ message: "Ads reordered", ads: updated });
};
