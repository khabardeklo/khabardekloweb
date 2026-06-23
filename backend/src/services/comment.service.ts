import { Comment } from "../models/Comment";
import { News } from "../models/News";

export const listAllComments = (skip = 0, limit = 50) =>
  Comment.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

export const countAllComments = () => Comment.countDocuments();

export const listApprovedCommentsForNews = (newsSlug: string) =>
  Comment.find({ newsSlug, isApproved: true }).sort({ createdAt: 1 });

export const createComment = async (payload: {
  newsSlug: string;
  name: string;
  email: string;
  content: string;
}) => {
  const news = await News.findOne({ slug: payload.newsSlug, isPublished: true });
  if (!news) return { status: 404, message: "News article not found" };

  const comment = await Comment.create({
    newsId: news._id,
    newsSlug: payload.newsSlug,
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    content: payload.content.trim(),
  });

  return { status: 201, message: "Comment submitted for review", comment };
};

export const approveComment = async (id: string) => {
  const comment = await Comment.findByIdAndUpdate(id, { isApproved: true }, { new: true });
  if (!comment) return null;
  return comment;
};

export const deleteComment = (id: string) => Comment.findByIdAndDelete(id);
