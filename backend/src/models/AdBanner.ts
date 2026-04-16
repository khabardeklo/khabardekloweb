import mongoose, { Document, Schema } from "mongoose";

export interface IAdBanner extends Document {
  title: string;
  description: string;
  ctaLabel: string;
  targetUrl: string;
  isActive: boolean;
  position: number;
}

const adBannerSchema = new Schema<IAdBanner>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    ctaLabel: { type: String, required: true, trim: true },
    targetUrl: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
    position: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const AdBanner = mongoose.model<IAdBanner>("AdBanner", adBannerSchema);
