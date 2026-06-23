import { Router } from "express";
import {
  createPage,
  deletePage,
  getAllPages,
  getPageById,
  getPublicPage,
  getPublicPages,
  updatePage,
} from "../controllers/page.controller";
import { authorize, protect } from "../middleware/auth";
import { canEditDeletePage } from "../middleware/ownership";

const router = Router();

router.get("/public", getPublicPages);
router.get("/public/:slug", getPublicPage);

router.get("/", protect, authorize("admin"), getAllPages);
router.get("/admin/:id", protect, authorize("admin", "reporter"), getPageById);
router.post("/", protect, authorize("admin", "reporter"), createPage);
router.patch("/:id", protect, canEditDeletePage, updatePage);
router.delete("/:id", protect, canEditDeletePage, deletePage);

export default router;