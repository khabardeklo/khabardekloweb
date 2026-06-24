import { Request, Response } from "express";
import {
  createNewsItem,
  deleteNewsItem,
  getNewsBySlug as fetchNewsBySlug,
  listNews,
  listPublishedNews,
  countPublishedNews,
  searchPublishedNews,
  countSearchPublishedNews,
  updateNewsItem,
} from "../services/news.service";
import { extractArticleFromUrl } from "../services/articleExtractor.service";
import { isValidNewsPayload } from "../validations/news.validation";
import { AuthenticatedRequest } from "../middleware/auth";
import { News } from "../models/News";

export const createNews = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const payload = req.body as {
    title?: string;
    content?: string;
    category?: string;
    description?: string;
    tags?: string[];
    imageUrl?: string;
    isPublished?: boolean;
    scheduledAt?: string | null;
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

export const getNewsById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const news = await News.findById(id).populate("authorId", "name email role");

  if (!news) {
    res.status(404).json({ message: "News not found" });
    return;
  }

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
  const news = await updateNewsItem(
    id,
    req.body as {
      title?: string;
      content?: string;
      category?: string;
      description?: string;
      tags?: string[];
      imageUrl?: string;
      isPublished?: boolean;
      scheduledAt?: string | null;
    }
  );
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

// Helper: normalize articles from different API shapes
const extractArticles = (raw: unknown): Record<string, unknown>[] => {
  if (Array.isArray(raw)) return raw as Record<string, unknown>[];
  const obj = raw as Record<string, unknown>;
  if (Array.isArray(obj.articles)) return obj.articles as Record<string, unknown>[];
  if (Array.isArray(obj.results)) return obj.results as Record<string, unknown>[];
  if (Array.isArray(obj.data)) return obj.data as Record<string, unknown>[];
  return [];
};

// Helper: build article payload from raw API article object
const mapArticle = (a: Record<string, unknown>) => ({
  title: ((a.title as string) || "").trim(),
  content: (a.content as string) || (a.body as string) || (a.description as string) || "",
  description: (a.description as string) || "",
  imageUrl: (a.urlToImage as string) || (a.image as string) || (a.imageUrl as string) || (a.thumbnail as string) || undefined,
  sourceUrl: (a.url as string) || (a.link as string) || (a.sourceUrl as string) || undefined,
});

// GET /api/news/preview-from-api — fetch & return articles WITHOUT saving (admin only)
export const previewFromApi = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) { res.status(401).json({ message: "Unauthorized" }); return; }

  const apiUrl = (req.query.apiUrl as string)?.trim();
  // Only use explicitly provided key — never fall back to env key, as it may break URL-key APIs like GNews
  const apiKey = (req.query.apiKey as string)?.trim();

  if (!apiUrl) { res.status(400).json({ message: "apiUrl query param is required" }); return; }

  try {
    const headers: Record<string, string> = {};
    if (apiKey) headers["X-Api-Key"] = apiKey;

    const externalRes = await fetch(apiUrl, { headers });
    if (!externalRes.ok) {
      res.status(502).json({ message: `External API responded with ${externalRes.status}` });
      return;
    }

    const raw = await externalRes.json() as unknown;
    const articles = extractArticles(raw);
    const previews = articles.slice(0, 20).map(mapArticle);

    res.json({ total: articles.length, previews });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch from external API", error: String(err) });
  }
};

// POST /api/news/import-from-api — fetch & save articles (admin only)
export const importFromApi = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) { res.status(401).json({ message: "Unauthorized" }); return; }

  const { apiUrl, apiKey, category, publishImmediately, selectedIndexes } = req.body as {
    apiUrl?: string;
    apiKey?: string;
    category?: string;
    publishImmediately?: boolean;
    selectedIndexes?: number[]; // if provided, only import these article indexes
  };

  if (!apiUrl || !category) {
    res.status(400).json({ message: "apiUrl and category are required" });
    return;
  }

  // Only use explicitly provided key — never fall back to env key, as it may break URL-key APIs like GNews
  const explicitApiKey = apiKey?.trim();

  try {
    const headers: Record<string, string> = {};
    if (explicitApiKey) headers["X-Api-Key"] = explicitApiKey;

    const externalRes = await fetch(apiUrl, { headers });
    if (!externalRes.ok) {
      res.status(502).json({ message: `External API responded with ${externalRes.status}` });
      return;
    }

    const raw = await externalRes.json() as unknown;
    const allArticles = extractArticles(raw);

    // If selectedIndexes provided, only import those; otherwise import all
    const toImport = selectedIndexes && selectedIndexes.length > 0
      ? selectedIndexes.map((i) => allArticles[i]).filter(Boolean)
      : allArticles;

    if (toImport.length === 0) {
      res.json({ message: "No articles to import", imported: 0, skipped: 0, errors: [] });
      return;
    }

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const article of toImport) {
      const { title, content, description, imageUrl, sourceUrl } = mapArticle(article as Record<string, unknown>);

      if (!title) {
        skipped += 1;
        errors.push(`Skipped: "no title" — missing title`);
        continue;
      }

      // Fetch full article content from source URL — replaces truncated API content
      let finalContent = content;
      if (sourceUrl) {
        const extracted = await extractArticleFromUrl(sourceUrl);
        if (extracted.success && extracted.contentText.length > finalContent.length) {
          finalContent = extracted.contentHtml || extracted.contentText;
        }
      }

      const result = await createNewsItem(
        { title, content: finalContent, category: category.trim(), description, imageUrl, sourceUrl, isPublished: Boolean(publishImmediately) },
        req.user.userId
      );

      if (result.status === 201) {
        imported += 1;
      } else {
        skipped += 1;
        errors.push(`Skipped: "${title}" — ${result.message}`);
      }
    }

    res.json({
      message: `Import complete: ${imported} saved, ${skipped} skipped`,
      imported,
      skipped,
      errors,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch from external API", error: String(err) });
  }
};

export const searchNews = async (req: Request, res: Response): Promise<void> => {
  const q = ((req.query.q as string) || "").trim();
  const category = ((req.query.category as string) || "").trim();
  const skip = Math.max(0, Number(req.query.skip) || 0);
  const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 20));

  const [news, total] = await Promise.all([
    searchPublishedNews(q, category, skip, limit),
    countSearchPublishedNews(q, category),
  ]);

  res.json({
    data: news,
    pagination: { skip, limit, total, hasMore: skip + limit < total },
  });
};
