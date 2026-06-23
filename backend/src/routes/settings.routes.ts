import { Router } from "express";
import { getAdminSettings, getSettings, updateSettings } from "../controllers/settings.controller";
import { authorize, protect } from "../middleware/auth";

const router = Router();

router.get("/", getSettings);
router.get("/admin", protect, authorize("admin"), getAdminSettings);
router.patch("/", protect, authorize("admin"), updateSettings);

export default router;
