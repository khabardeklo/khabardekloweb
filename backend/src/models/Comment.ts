import mongoose, { Document, Schema } from "mongoose";

export interface IComment extends Document {
  newsId: mongoose.Types.ObjectId;
  newsSlug: string;
  name: string;
  email: string;
  content: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    newsId: { type: Schema.Types.ObjectId, ref: "News", required: true },
    newsSlug: { type: String, required: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true },
    content: { type: String, required: true, trim: true, maxlength: 1000 },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

commentSchema.index({ newsId: 1, isApproved: 1 });
commentSchema.index({ newsSlug: 1, isApproved: 1 });

export const Comment = mongoose.model<IComment>("Comment", commentSchema);
