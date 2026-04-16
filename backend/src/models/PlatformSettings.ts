import mongoose, { Document, Schema } from "mongoose";

export interface IPlatformSettings extends Document {
  tickerSpeed: number; // milliseconds per scroll cycle
  maxNewsPerPage: number;
}

const platformSettingsSchema = new Schema<IPlatformSettings>(
  {
    tickerSpeed: { type: Number, default: 24000 },
    maxNewsPerPage: { type: Number, default: 10 },
  },
  { timestamps: true }
);

export const PlatformSettings = mongoose.model<IPlatformSettings>("PlatformSettings", platformSettingsSchema);
