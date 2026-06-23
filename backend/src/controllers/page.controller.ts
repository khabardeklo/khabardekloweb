import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import type { PagePayload, UpdatePagePayload } from "../types/page";
import {
  createPageItem,
  deletePageItem,
  getPublicPageBySlug,
  listPages,
  listPublicPages,
  updatePageItem,
} from "../services/page.service";
import { isValidPagePayload, isValidTemplateType } from "../validations/page.validation";
import { Page } from "../models/Page";

export const createPage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const payload = req.body as Partial<PagePayload>;

  if (!isValidPagePayload(payload)) {
    res.status(400).json({ message: "Invalid page payload" });
    return;
  }

  const result = await createPageItem(payload, req.user.userId);
  res.status(result.status).json(result);
};

export const getAllPages = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  const pages = await listPages();
  res.json(pages);
};

export const getPageById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const page = await Page.findById(id).populate("authorId", "name email role");

  if (!page) {
    res.status(404).json({ message: "Page not found" });
    return;
  }

  res.json(page);
};

export const getPublicPages = async (req: Request, res: Response): Promise<void> => {
  const templateType = req.query.templateType;

  if (typeof templateType !== "undefined" && !isValidTemplateType(templateType)) {
    res.status(400).json({ message: "Invalid template type" });
    return;
  }

  const pages = await listPublicPages(typeof templateType === "string" ? templateType : undefined);
  res.json(pages);
};

export const getPublicPage = async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;
  const page = await getPublicPageBySlug(slug);

  if (!page) {
    res.status(404).json({ message: "Page not found" });
    return;
  }

  res.json(page);
};

export const updatePage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const page = await updatePageItem(id, req.body as UpdatePagePayload);

  if (!page) {
    res.status(404).json({ message: "Page not found" });
    return;
  }

  res.json({ message: "Page updated", page });
};

export const deletePage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const deleted = await deletePageItem(id);

  if (!deleted) {
    res.status(404).json({ message: "Page not found" });
    return;
  }

  res.json({ message: "Page deleted" });
};