import mongoose, { Document, Schema } from "mongoose";

export type PageTemplateType = "frontend-header" | "frontend-footer" | "header-menu" | "custom";

export interface IPage extends Document {
  title: string;
  slug: string;
  templateType: PageTemplateType;
  displayOrder: number;
  menuLabel?: string;
  content: string;
  isPublished: boolean;
  authorId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const pageSchema = new Schema<IPage>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    templateType: {
      type: String,
      enum: ["frontend-header", "frontend-footer", "header-menu", "custom"],
      required: true,
    },
    displayOrder: { type: Number, default: 0, index: true },
    menuLabel: { type: String, trim: true },
    content: { type: String, required: true },
    isPublished: { type: Boolean, default: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

pageSchema.index({ templateType: 1, isPublished: 1, displayOrder: 1, createdAt: -1 });

export const Page = mongoose.model<IPage>("Page", pageSchema);