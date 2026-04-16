import { Router } from "express";
import { login, logout, me, refresh, register } from "../controllers/auth.controller";
import { protect } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.get("/me", protect, me);
router.post("/logout", protect, logout);

export default router;
