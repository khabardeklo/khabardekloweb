import { News } from "../models/News";
import type { NewsPayload } from "../types/news";
import { postNewsToFacebookPage } from "./facebook.service";
import { env } from "../config/env";

const triggerFrontendRevalidation = async (slug?: string) => {
  try {
    const paths = ["/", slug ? `/news/${slug}` : null].filter(Boolean);
    await fetch(`${env.frontendUrl}/api/revalidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-revalidate-secret": env.revalidateSecret },
      body: JSON.stringify({ paths }),
    });
  } catch {
    // Non-critical — revalidation failure should not block the response
  }
};

const canAutoPostToFacebook = (news: { isPublished: boolean; scheduledAt?: Date | null; facebookPostId?: string | null }) => {
  if (!news.isPublished) {
    return false;
  }

  if (news.facebookPostId) {
    return false;
  }

  if (news.scheduledAt && news.scheduledAt > new Date()) {
    return false;
  }

  return true;
};

const buildPublicPublishFilter = () => {
  const now = new Date();
  return {
    isPublished: true,
    $or: [{ scheduledAt: { $exists: false } }, { scheduledAt: null }, { scheduledAt: { $lte: now } }],
  };
};

const parseScheduledAt = (value: string | null | undefined): Date | null => {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

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
    description: payload.description?.trim() || "",
    tags: payload.tags || [],
    imageUrl: payload.imageUrl,
    sourceUrl: payload.sourceUrl || null,
    isPublished: Boolean(payload.isPublished),
    scheduledAt: parseScheduledAt(payload.scheduledAt),
    authorId,
  });

  if (canAutoPostToFacebook(news)) {
    const socialPostResult = await postNewsToFacebookPage(news);

    if (socialPostResult.status === "posted") {
      news.facebookPostId = socialPostResult.postId || null;
      news.facebookPostedAt = new Date();
      news.facebookPostError = null;
      await news.save();
    } else if (socialPostResult.status === "failed") {
      news.facebookPostError = socialPostResult.reason;
      await news.save();
    }
  }

  if (news.isPublished) {
    void triggerFrontendRevalidation(news.slug);
  }

  return { status: 201, message: "News created", news };
};

export const listNews = () => {
  return News.find().sort({ createdAt: -1 }).populate("authorId", "name email role");
};

export const listPublishedNews = (skip: number = 0, limit: number = 10) => {
  return News.find(buildPublicPublishFilter())
    .sort({ scheduledAt: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("authorId", "name email avatar title");
};

export const countPublishedNews = () => {
  return News.countDocuments(buildPublicPublishFilter());
};

export const getNewsBySlug = (slug: string) => {
  return News.findOne({ slug, ...buildPublicPublishFilter() }).populate("authorId", "name email avatar title role");
};

export const updateNewsItem = async (id: string, payload: Partial<NewsPayload>) => {
  const existingNews = await News.findById(id);
  if (!existingNews) {
    return null;
  }

  const nextPayload = { ...payload } as Record<string, unknown>;

  if (typeof nextPayload.title === "string") {
    nextPayload.slug = slugify(nextPayload.title);
  }

  if (Object.prototype.hasOwnProperty.call(nextPayload, "scheduledAt")) {
    nextPayload.scheduledAt = parseScheduledAt(nextPayload.scheduledAt as string | null | undefined);
  }

  if (typeof nextPayload.description === "string") {
    nextPayload.description = nextPayload.description.trim();
  }

  const updatedNews = await News.findByIdAndUpdate(id, nextPayload, { new: true });

  if (updatedNews && canAutoPostToFacebook(updatedNews)) {
    const socialPostResult = await postNewsToFacebookPage(updatedNews);

    if (socialPostResult.status === "posted") {
      updatedNews.facebookPostId = socialPostResult.postId || null;
      updatedNews.facebookPostedAt = new Date();
      updatedNews.facebookPostError = null;
      await updatedNews.save();
    } else if (socialPostResult.status === "failed") {
      updatedNews.facebookPostError = socialPostResult.reason;
      await updatedNews.save();
    }
  }

  if (updatedNews) {
    void triggerFrontendRevalidation(updatedNews.slug);
  }

  return updatedNews;
};

export const deleteNewsItem = (id: string) => {
  return News.findByIdAndDelete(id);
};

export const searchPublishedNews = (q: string, category: string, skip: number, limit: number) => {
  const filter: Record<string, unknown> = buildPublicPublishFilter();

  if (q) {
    filter.$text = { $search: q };
  }

  if (category) {
    filter.category = { $regex: new RegExp(`^${category}$`, "i") };
  }

  return News.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("authorId", "name email avatar title");
};

export const countSearchPublishedNews = (q: string, category: string) => {
  const filter: Record<string, unknown> = buildPublicPublishFilter();

  if (q) {
    filter.$text = { $search: q };
  }

  if (category) {
    filter.category = { $regex: new RegExp(`^${category}$`, "i") };
  }

  return News.countDocuments(filter);
};

export const backfillFacebookPostsForPublishedNews = async (limit = 20) => {
  const candidates = await News.find({
    ...buildPublicPublishFilter(),
    $or: [{ facebookPostId: { $exists: false } }, { facebookPostId: null }, { facebookPostId: "" }],
  })
    .sort({ createdAt: -1 })
    .limit(limit);

  let posted = 0;
  let failed = 0;
  let skipped = 0;

  for (const news of candidates) {
    const socialPostResult = await postNewsToFacebookPage(news);

    if (socialPostResult.status === "posted") {
      news.facebookPostId = socialPostResult.postId || null;
      news.facebookPostedAt = new Date();
      news.facebookPostError = null;
      posted += 1;
      await news.save();
      continue;
    }

    if (socialPostResult.status === "failed") {
      news.facebookPostError = socialPostResult.reason;
      failed += 1;
      await news.save();
      continue;
    }

    skipped += 1;
  }

  return {
    scanned: candidates.length,
    posted,
    failed,
    skipped,
  };
};
