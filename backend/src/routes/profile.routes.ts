import { Router } from "express";
import { protect } from "../middleware/auth";
import { getPublicProfile, getMyProfile, updateProfile } from "../controllers/profile.controller";

const router = Router();

router.get("/public/:userId", getPublicProfile);
router.get("/me", protect, getMyProfile);
router.patch("/me", protect, updateProfile);

export default router;
