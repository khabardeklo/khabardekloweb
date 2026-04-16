import { Router } from "express";
import { protect, authorize } from "../middleware/auth";
import { uploadImage } from "../controllers/upload.controller";

const router = Router();

router.post("/image", protect, authorize("admin", "editor", "author", "reporter"), uploadImage);

export default router;
