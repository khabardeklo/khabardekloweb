import { Router } from "express";
import { approve, getComments, getCommentsForNews, postComment, remove } from "../controllers/comment.controller";
import { authorize, protect } from "../middleware/auth";

const router = Router();

// Public
router.get("/news/:slug", getCommentsForNews);
router.post("/", postComment);

// Admin
router.get("/", protect, authorize("admin", "editor"), getComments);
router.patch("/:id/approve", protect, authorize("admin", "editor"), approve);
router.delete("/:id", protect, authorize("admin", "editor"), remove);

export default router;
