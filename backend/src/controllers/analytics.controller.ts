import type { Request, Response } from "express";
import { News } from "../models/News";
import { User } from "../models/User";
import { Comment } from "../models/Comment";

export const getAnalyticsOverview = async (_req: Request, res: Response): Promise<void> => {
  const now = new Date();

  // Last 6 weeks start dates (oldest first)
  const weeks = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (5 - i) * 7);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const weeklyPublished = await Promise.all(
    weeks.map((start, i) => {
      const end = i < 5 ? weeks[i + 1] : now;
      return News.countDocuments({ isPublished: true, createdAt: { $gte: start, $lt: end } });
    })
  );

  // Top reporters by published post count
  const topReporters = await News.aggregate([
    { $match: { isPublished: true } },
    { $group: { _id: "$authorId", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: { path: "$user", preserveNullAndEmptyArrays: false } },
    {
      $project: {
        _id: 0,
        id: { $toString: "$_id" },
        name: "$user.name",
        role: "$user.role",
        publishedCount: "$count",
      },
    },
  ]);

  const [totalPublished, totalDrafts, totalReporters, totalComments, pendingComments] =
    await Promise.all([
      News.countDocuments({ isPublished: true }),
      News.countDocuments({ isPublished: false }),
      User.countDocuments({ role: "reporter" }),
      Comment.countDocuments(),
      Comment.countDocuments({ isApproved: false }),
    ]);

  res.json({
    weeklyPublished,
    weekLabels: weeks.map((d) =>
      d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
    ),
    topReporters,
    totals: {
      totalPublished,
      totalDrafts,
      totalReporters,
      totalComments,
      pendingComments,
    },
  });
};
