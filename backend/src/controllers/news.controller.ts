import { Request, Response } from "express";
import {
  createNewsItem,
  deleteNewsItem,
  getNewsBySlug as fetchNewsBySlug,
  listNews,
  listPublishedNews,
  countPublishedNews,
  updateNewsItem,
} from "../services/news.service";
import { isValidNewsPayload } from "../validations/news.validation";
import { AuthenticatedRequest } from "../middleware/auth";

export const createNews = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const payload = req.body as {
    title?: string;
    content?: string;
    category?: string;
    tags?: string[];
    imageUrl?: string;
    isPublished?: boolean;
  };

  if (!isValidNewsPayload(payload)) {
    res.status(400).json({ message: "Invalid news payload" });
    return;
  }

  const result = await createNewsItem(payload, req.user.userId);
  res.status(result.status).json(result);
};

export const getAllNews = async (_req: Request, res: Response): Promise<void> => {
  const news = await listNews();
  res.json(news);
};

export const getPublishedNews = async (req: Request, res: Response): Promise<void> => {
  const skip = Math.max(0, Number(req.query.skip) || 0);
  const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));

  const [news, total] = await Promise.all([listPublishedNews(skip, limit), countPublishedNews()]);

  res.json({
    data: news,
    pagination: {
      skip,
      limit,
      total,
      hasMore: skip + limit < total,
    },
  });
};

export const getNewsBySlug = async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;
  const news = await fetchNewsBySlug(slug);

  if (!news) {
    res.status(404).json({ message: "News not found" });
    return;
  }

  res.json(news);
};

export const updateNews = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const news = await updateNewsItem(id, req.body as { title?: string; content?: string; category?: string; tags?: string[]; imageUrl?: string; isPublished?: boolean });
  if (!news) {
    res.status(404).json({ message: "News not found" });
    return;
  }

  res.json({ message: "News updated", news });
};

export const deleteNews = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const deleted = await deleteNewsItem(id);
  if (!deleted) {
    res.status(404).json({ message: "News not found" });
    return;
  }

  res.json({ message: "News deleted" });
};
