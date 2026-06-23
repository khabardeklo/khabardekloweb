import { Page, type PageTemplateType } from "../models/Page";
import type { PagePayload, UpdatePagePayload } from "../types/page";
import { env } from "../config/env";

const triggerFrontendRevalidation = async (slug?: string) => {
  try {
    const paths = ["/", slug ? `/pages/${slug}` : null].filter(Boolean);
    await fetch(`${env.frontendUrl}/api/revalidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-revalidate-secret": env.revalidateSecret },
      body: JSON.stringify({ paths }),
    });
  } catch {
    // Non-critical
  }
};

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export const createPageItem = async (payload: PagePayload, authorId: string) => {
  const slug = slugify(payload.slug || payload.title);
  const existing = await Page.findOne({ slug });

  if (existing) {
    return { status: 409, message: "Page with similar title already exists" };
  }

  const highestOrderPage = await Page.findOne({ templateType: payload.templateType }).sort({ displayOrder: -1 }).select("displayOrder");
  const nextDisplayOrder = typeof payload.displayOrder === "number"
    ? payload.displayOrder
    : (highestOrderPage?.displayOrder ?? -1) + 1;

  const page = await Page.create({
    title: payload.title,
    slug,
    templateType: payload.templateType,
    displayOrder: nextDisplayOrder,
    menuLabel: payload.menuLabel,
    content: payload.content,
    isPublished: payload.isPublished ?? true,
    authorId,
  });

  if (page.isPublished) {
    void triggerFrontendRevalidation(page.slug);
  }

  return { status: 201, message: "Page created", page };
};

export const listPages = () => {
  return Page.find().sort({ templateType: 1, displayOrder: 1, createdAt: -1 }).populate("authorId", "name email role");
};

export const listPublicPages = (templateType?: PageTemplateType) => {
  const filter = templateType ? { isPublished: true, templateType } : { isPublished: true };
  return Page.find(filter).sort({ templateType: 1, displayOrder: 1, createdAt: -1 });
};

export const getPublicPageBySlug = (slug: string) => {
  return Page.findOne({ slug, isPublished: true });
};

export const updatePageItem = async (id: string, payload: UpdatePagePayload) => {
  const nextPayload: Record<string, unknown> = { ...payload };

  if (typeof payload.slug === "string" && payload.slug.trim()) {
    nextPayload.slug = slugify(payload.slug);
  } else if (typeof payload.title === "string") {
    nextPayload.slug = slugify(payload.title);
  }

  if (typeof payload.templateType === "undefined") {
    delete nextPayload.templateType;
  }

  if (typeof payload.displayOrder !== "number") {
    delete nextPayload.displayOrder;
  }

  const updated = await Page.findByIdAndUpdate(id, nextPayload, { new: true });

  if (updated) {
    void triggerFrontendRevalidation(updated.slug);
  }

  return updated;
};

export const deletePageItem = (id: string) => {
  return Page.findByIdAndDelete(id);
};