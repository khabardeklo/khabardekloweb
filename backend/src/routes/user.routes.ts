import { Router } from "express";
import { getReporterProfileWithContent, getReporters, reviewReporter } from "../controllers/user.controller";
import { protect, authorize } from "../middleware/auth";

const router = Router();

router.get("/reporters", protect, authorize("admin"), getReporters);
router.get("/reporters/:id/profile", protect, authorize("admin"), getReporterProfileWithContent);
router.patch("/reporters/:id", protect, authorize("admin"), reviewReporter);

export default router;