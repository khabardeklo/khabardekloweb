import mongoose, { Document, Schema } from "mongoose";

export interface INews extends Document {
  title: string;
  slug: string;
  content: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  isPublished: boolean;
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
    tags: [{ type: String }],
    imageUrl: { type: String },
    isPublished: { type: Boolean, default: false },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const News = mongoose.model<INews>("News", newsSchema);
