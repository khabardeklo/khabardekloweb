import { NextFunction, Request, Response } from "express";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

const uploadsDir = path.join(process.cwd(), "public", "uploads");

type UploadBody = {
  imageData?: string;
  fileName?: string;
  mimeType?: string;
};

const getExtensionFromMimeType = (mimeType: string): string => {
  if (mimeType === "image/png") return ".png";
  if (mimeType === "image/webp") return ".webp";
  if (mimeType === "image/gif") return ".gif";
  if (mimeType === "image/jpeg") return ".jpg";
  return ".png";
};

export const uploadImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { imageData, fileName, mimeType } = req.body as UploadBody;

    if (!imageData || typeof imageData !== "string") {
      res.status(400).json({ message: "Image data is required" });
      return;
    }

    const normalizedData = imageData.includes(",") ? imageData.split(",")[1] : imageData;
    const buffer = Buffer.from(normalizedData, "base64");

    if (buffer.length === 0) {
      res.status(400).json({ message: "Invalid image data" });
      return;
    }

    const safeName = typeof fileName === "string" && fileName.trim() ? fileName.trim().replace(/[^a-z0-9._-]/gi, "-") : "cover";
    const extension = typeof mimeType === "string" ? getExtensionFromMimeType(mimeType) : ".png";
    const uniqueName = `${safeName}-${Date.now()}-${crypto.randomBytes(4).toString("hex")}${extension}`;

    await mkdir(uploadsDir, { recursive: true });
    await writeFile(path.join(uploadsDir, uniqueName), buffer);

    res.status(201).json({
      message: "Image uploaded",
      url: `/uploads/${uniqueName}`,
    });
  } catch (error) {
    next(error);
  }
};
