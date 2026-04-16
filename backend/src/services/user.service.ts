import { User, type UserApprovalStatus } from "../models/User";
import { News } from "../models/News";
import { Page } from "../models/Page";

export type ReporterRow = {
  id: string;
  name: string;
  email: string;
  role: "reporter";
  approvalStatus: UserApprovalStatus;
  createdAt: Date;
  updatedAt: Date;
  reviewedAt: Date | null;
};

export type ReporterDetailResponse = {
  reporter: {
    id: string;
    name: string;
    email: string;
    role: "reporter";
    approvalStatus: UserApprovalStatus;
    avatar?: string | null;
    bio?: string | null;
    phone?: string | null;
    location?: string | null;
    title?: string | null;
    socialLinks?: Record<string, string>;
    createdAt: Date;
    reviewedAt: Date | null;
  };
  posts: Array<{
    id: string;
    title: string;
    slug: string;
    category: string;
    isPublished: boolean;
    createdAt: Date;
  }>;
  pages: Array<{
    id: string;
    title: string;
    slug: string;
    templateType: string;
    isPublished: boolean;
    createdAt: Date;
  }>;
};

export const listReporterApplications = async (): Promise<ReporterRow[]> => {
  const reporters = await User.find({ role: "reporter" }).sort({ createdAt: -1 });

  return reporters.map((reporter) => ({
    id: reporter.id,
    name: reporter.name,
    email: reporter.email,
    role: "reporter" as const,
    approvalStatus: reporter.approvalStatus || "active",
    createdAt: reporter.createdAt,
    updatedAt: reporter.updatedAt,
    reviewedAt: reporter.reviewedAt ?? null,
  }));
};

export const reviewReporterApplication = async (userId: string, approvalStatus: UserApprovalStatus) => {
  const reporter = await User.findById(userId);

  if (!reporter || reporter.role !== "reporter") {
    return { status: 404, message: "Reporter not found" };
  }

  reporter.approvalStatus = approvalStatus;
  reporter.reviewedAt = new Date();
  reporter.refreshToken = null;
  await reporter.save();

  return {
    status: 200,
    message: approvalStatus === "active" ? "Reporter approved" : "Reporter rejected",
    reporter: {
      id: reporter.id,
      name: reporter.name,
      email: reporter.email,
      role: reporter.role,
      approvalStatus: reporter.approvalStatus,
      reviewedAt: reporter.reviewedAt,
    },
  };
};
export const getReporterDetail = async (userId: string): Promise<{ status: number; message?: string; data?: ReporterDetailResponse }> => {
  const reporter = await User.findById(userId);

  if (!reporter || reporter.role !== "reporter") {
    return { status: 404, message: "Reporter not found" };
  }

  const [posts, pages] = await Promise.all([
    News.find({ authorId: reporter._id }).sort({ createdAt: -1 }).select("title slug category isPublished createdAt"),
    Page.find({ authorId: reporter._id }).sort({ createdAt: -1 }).select("title slug templateType isPublished createdAt"),
  ]);

  return {
    status: 200,
    data: {
      reporter: {
        id: reporter.id,
        name: reporter.name,
        email: reporter.email,
        role: "reporter",
        approvalStatus: reporter.approvalStatus,
        avatar: reporter.avatar || null,
        bio: reporter.bio || null,
        phone: reporter.phone || null,
        location: reporter.location || null,
        title: reporter.title || null,
        socialLinks: (reporter.socialLinks || {}) as Record<string, string>,
        createdAt: reporter.createdAt,
        reviewedAt: reporter.reviewedAt ?? null,
      },
      posts: posts.map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        category: post.category,
        isPublished: post.isPublished,
        createdAt: post.createdAt,
      })),
      pages: pages.map((page) => ({
        id: page.id,
        title: page.title,
        slug: page.slug,
        templateType: page.templateType,
        isPublished: page.isPublished,
        createdAt: page.createdAt,
      })),
    },
  };
};
