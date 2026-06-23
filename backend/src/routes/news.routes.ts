import { Router } from "express";
import {
  createNews,
  deleteNews,
  getAllNews,
  getNewsById,
  getNewsBySlug,
  getPublishedNews,
  searchNews,
  updateNews,
} from "../controllers/news.controller";
import { authorize, protect } from "../middleware/auth";
import { canEditDeleteNews } from "../middleware/ownership";

const router = Router();

router.get("/published", getPublishedNews);
router.get("/search", searchNews);
router.get("/admin/:id", protect, authorize("admin", "editor", "author", "reporter"), getNewsById);
router.get("/:slug", getNewsBySlug);

router.get("/", protect, authorize("admin", "editor", "author", "reporter"), getAllNews);
router.post("/", protect, authorize("admin", "editor", "author", "reporter"), createNews);
router.patch("/:id", protect, canEditDeleteNews, updateNews);
router.delete("/:id", protect, canEditDeleteNews, deleteNews);

export default router;
