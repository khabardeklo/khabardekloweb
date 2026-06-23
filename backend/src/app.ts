import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import authRoutes from "./routes/auth.routes";
import newsRoutes from "./routes/news.routes";
import categoryRoutes from "./routes/category.routes";
import uploadRoutes from "./routes/upload.routes";
import adRoutes from "./routes/ad.routes";
import settingsRoutes from "./routes/settings.routes";
import pageRoutes from "./routes/page.routes";
import userRoutes from "./routes/user.routes";
import profileRoutes from "./routes/profile.routes";
import commentRoutes from "./routes/comment.routes";
import { env } from "./config/env";
import { errorHandler, notFound } from "./middleware/error";

export const app = express();

app.use(
  cors({
    origin: [env.frontendUrl, env.adminUrl],
    credentials: true,
  })
);
app.use(express.json({ limit: "15mb" }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "khabar-deklo-backend" });
});

app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/ads", adRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/pages", pageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/comments", commentRoutes);

app.use(notFound);
app.use(errorHandler);
