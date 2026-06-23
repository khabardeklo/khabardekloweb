import mongoose, { Document, Schema } from "mongoose";

export interface INews extends Document {
  title: string;
  slug: string;
  content: string;
  category: string;
  description?: string;
  tags: string[];
  imageUrl?: string;
  isPublished: boolean;
  scheduledAt?: Date | null;
  facebookPostId?: string | null;
  facebookPostedAt?: Date | null;
  facebookPostError?: string | null;
  authorId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const newsSchema = new Schema<INews>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, trim: true, default: "" },
    tags: [{ type: String }],
    imageUrl: { type: String },
    isPublished: { type: Boolean, default: false },
    scheduledAt: { type: Date, default: null },
    facebookPostId: { type: String, default: null },
    facebookPostedAt: { type: Date, default: null },
    facebookPostError: { type: String, default: null },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

newsSchema.index({ title: "text", content: "text", tags: "text" });

export const News = mongoose.model<INews>("News", newsSchema);
