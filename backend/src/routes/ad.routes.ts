import { Router } from "express";
import { createAd, deleteAd, getAllAds, getPublicAds, reorderAdBanners, updateAd } from "../controllers/ad.controller";
import { authorize, protect } from "../middleware/auth";

const router = Router();

router.get("/public", getPublicAds);
router.get("/", protect, authorize("admin"), getAllAds);
router.post("/", protect, authorize("admin"), createAd);
router.post("/reorder", protect, authorize("admin"), reorderAdBanners);
router.patch("/:id", protect, authorize("admin"), updateAd);
router.delete("/:id", protect, authorize("admin"), deleteAd);

export default router;
