import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settings.controller";
import { authorize, protect } from "../middleware/auth";

const router = Router();

router.get("/", getSettings);
router.patch("/", protect, authorize("admin"), updateSettings);

export default router;
