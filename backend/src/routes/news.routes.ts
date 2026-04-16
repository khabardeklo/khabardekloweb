import { Router } from "express";
import {
  createNews,
  deleteNews,
  getAllNews,
  getNewsBySlug,
  getPublishedNews,
  updateNews,
} from "../controllers/news.controller";
import { authorize, protect } from "../middleware/auth";
import { canEditDeleteNews } from "../middleware/ownership";

const router = Router();

router.get("/", getAllNews);
router.get("/published", getPublishedNews);
router.get("/:slug", getNewsBySlug);

router.post("/", protect, authorize("admin", "editor", "author", "reporter"), createNews);
router.patch("/:id", protect, canEditDeleteNews, updateNews);
router.delete("/:id", protect, canEditDeleteNews, deleteNews);

export default router;
