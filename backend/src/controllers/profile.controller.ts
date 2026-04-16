import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { User } from "../models/User";

export const getPublicProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select(
      "name email avatar bio phone location title socialLinks createdAt"
    );

    if (!user) {
      res.status(404).json({ message: "Reporter not found" });
      return;
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || null,
      bio: user.bio || null,
      phone: user.phone || null,
      location: user.location || null,
      title: user.title || null,
      socialLinks: user.socialLinks || {},
      memberSince: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { name, email, avatar, bio, phone, location, title, socialLinks } = req.body;

    const updateData: Record<string, any> = {};

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (bio !== undefined) updateData.bio = bio;
    if (phone !== undefined) updateData.phone = phone;
    if (location !== undefined) updateData.location = location;
    if (title !== undefined) updateData.title = title;
    if (socialLinks !== undefined) updateData.socialLinks = socialLinks;

    const user = await User.findByIdAndUpdate(req.user.userId, updateData, { new: true });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || null,
      bio: user.bio || null,
      phone: user.phone || null,
      location: user.location || null,
      title: user.title || null,
      socialLinks: user.socialLinks || {},
      message: "Profile updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};

export const getMyProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await User.findById(req.user.userId).select(
      "name email avatar bio phone location title socialLinks role approvalStatus"
    );

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || null,
      bio: user.bio || null,
      phone: user.phone || null,
      location: user.location || null,
      title: user.title || null,
      socialLinks: user.socialLinks || {},
      role: user.role,
      approvalStatus: user.approvalStatus,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};
