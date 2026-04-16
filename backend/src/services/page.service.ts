import { Page, type PageTemplateType } from "../models/Page";
import type { PagePayload, UpdatePagePayload } from "../types/page";

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

  const page = await Page.create({
    title: payload.title,
    slug,
    templateType: payload.templateType,
    menuLabel: payload.menuLabel,
    content: payload.content,
    isPublished: payload.isPublished ?? true,
    authorId,
  });

  return { status: 201, message: "Page created", page };
};

export const listPages = () => {
  return Page.find().sort({ createdAt: -1 }).populate("authorId", "name email role");
};

export const listPublicPages = (templateType?: PageTemplateType) => {
  const filter = templateType ? { isPublished: true, templateType } : { isPublished: true };
  return Page.find(filter).sort({ createdAt: -1 });
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

  return Page.findByIdAndUpdate(id, nextPayload, { new: true });
};

export const deletePageItem = (id: string) => {
  return Page.findByIdAndDelete(id);
};