import mongoose, { Document, Schema } from "mongoose";

export interface IApiSource extends Document {
  name: string;
  apiUrl: string;
  apiKey?: string;
  category: string;
  intervalMinutes: number; // fetch interval: 30, 60, 120, 360, 720, 1440
  publishImmediately: boolean;
  isActive: boolean;
  lastFetchedAt?: Date;
  lastFetchResult?: string;
  createdAt: Date;
  updatedAt: Date;
}

const apiSourceSchema = new Schema<IApiSource>(
  {
    name: { type: String, required: true, trim: true },
    apiUrl: { type: String, required: true },
    apiKey: { type: String, default: "" },
    category: { type: String, required: true },
    intervalMinutes: { type: Number, default: 60 },
    publishImmediately: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    lastFetchedAt: { type: Date },
    lastFetchResult: { type: String },
  },
  { timestamps: true }
);

export const ApiSource = mongoose.model<IApiSource>("ApiSource", apiSourceSchema);
