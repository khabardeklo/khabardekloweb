import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "./auth";
import { News } from "../models/News";
import { Page } from "../models/Page";

export const canEditDeleteNews = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const { id } = req.params;
  const isAdmin = req.user.role === "admin";

  if (isAdmin) {
    next();
    return;
  }

  const news = await News.findById(id);
  if (!news) {
    res.status(404).json({ message: "Post not found" });
    return;
  }

  if (news.authorId.toString() !== req.user.userId) {
    res.status(403).json({ message: "You can only edit/delete your own posts" });
    return;
  }

  next();
};

export const canEditDeletePage = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const { id } = req.params;
  const isAdmin = req.user.role === "admin";

  if (isAdmin) {
    next();
    return;
  }

  const page = await Page.findById(id);
  if (!page) {
    res.status(404).json({ message: "Page not found" });
    return;
  }

  if (page.authorId.toString() !== req.user.userId) {
    res.status(403).json({ message: "You can only edit/delete your own pages" });
    return;
  }

  next();
};
