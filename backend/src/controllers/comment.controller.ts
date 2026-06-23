import type { Request, Response } from "express";
import {
  approveComment,
  countAllComments,
  createComment,
  deleteComment,
  listAllComments,
  listApprovedCommentsForNews,
} from "../services/comment.service";

export const getComments = async (req: Request, res: Response): Promise<void> => {
  const skip = Math.max(0, Number(req.query.skip) || 0);
  const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 50));
  const [comments, total] = await Promise.all([listAllComments(skip, limit), countAllComments()]);
  res.json({ data: comments, pagination: { skip, limit, total, hasMore: skip + limit < total } });
};

export const getCommentsForNews = async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;
  const comments = await listApprovedCommentsForNews(slug);
  res.json(comments);
};

export const postComment = async (req: Request, res: Response): Promise<void> => {
  const { newsSlug, name, email, content } = req.body as {
    newsSlug?: string;
    name?: string;
    email?: string;
    content?: string;
  };

  if (!newsSlug || !name?.trim() || !email?.trim() || !content?.trim()) {
    res.status(400).json({ message: "newsSlug, name, email, and content are required" });
    return;
  }

  const result = await createComment({ newsSlug, name, email, content });
  res.status(result.status).json(result);
};

export const approve = async (req: Request, res: Response): Promise<void> => {
  const comment = await approveComment(req.params.id);
  if (!comment) { res.status(404).json({ message: "Comment not found" }); return; }
  res.json({ message: "Comment approved", comment });
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const deleted = await deleteComment(req.params.id);
  if (!deleted) { res.status(404).json({ message: "Comment not found" }); return; }
  res.json({ message: "Comment deleted" });
};
