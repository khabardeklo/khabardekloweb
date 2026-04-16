import mongoose, { Document, Schema } from "mongoose";

export type UserRole = "admin" | "editor" | "author" | "reporter";
export type UserApprovalStatus = "pending" | "active" | "rejected";

export interface ISocialLinks {
  twitter?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  website?: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  approvalStatus: UserApprovalStatus;
  reviewedAt?: Date | null;
  refreshToken?: string | null;
  avatar?: string;
  bio?: string;
  phone?: string;
  location?: string;
  title?: string;
  socialLinks?: ISocialLinks;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "editor", "author", "reporter"], default: "author" },
    approvalStatus: { type: String, enum: ["pending", "active", "rejected"], default: "active" },
    reviewedAt: { type: Date, default: null },
    refreshToken: { type: String, default: null },
    avatar: { type: String, default: null },
    bio: { type: String, default: null },
    phone: { type: String, default: null },
    location: { type: String, default: null },
    title: { type: String, default: null },
    socialLinks: {
      type: {
        twitter: String,
        facebook: String,
        instagram: String,
        linkedin: String,
        youtube: String,
        website: String,
      },
      default: {},
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
