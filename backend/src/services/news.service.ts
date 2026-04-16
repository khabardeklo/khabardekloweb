import { News } from "../models/News";
import type { NewsPayload } from "../types/news";

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export const createNewsItem = async (payload: NewsPayload, authorId: string) => {
  const slug = slugify(payload.title);
  const existing = await News.findOne({ slug });

  if (existing) {
    return { status: 409, message: "News with similar title already exists" };
  }

  const news = await News.create({
    title: payload.title,
    slug,
    content: payload.content,
    category: payload.category,
    tags: payload.tags || [],
    imageUrl: payload.imageUrl,
    isPublished: Boolean(payload.isPublished),
    authorId,
  });

  return { status: 201, message: "News created", news };
};

export const listNews = () => {
  return News.find().sort({ createdAt: -1 }).populate("authorId", "name email role");
};

export const listPublishedNews = (skip: number = 0, limit: number = 10) => {
  return News.find({ isPublished: true })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("authorId", "name email avatar title");
};

export const countPublishedNews = () => {
  return News.countDocuments({ isPublished: true });
};

export const getNewsBySlug = (slug: string) => {
  return News.findOne({ slug }).populate("authorId", "name email avatar title role");
};

export const updateNewsItem = async (id: string, payload: Partial<NewsPayload>) => {
  const nextPayload = { ...payload } as Record<string, unknown>;

  if (typeof nextPayload.title === "string") {
    nextPayload.slug = slugify(nextPayload.title);
  }

  return News.findByIdAndUpdate(id, nextPayload, { new: true });
};

export const deleteNewsItem = (id: string) => {
  return News.findByIdAndDelete(id);
};
