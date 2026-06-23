import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import type { AuthPayload, LoginPayload } from "../types/auth";
import { getCurrentUser, loginUser, logoutUser, refreshUserSession, registerUser } from "../services/auth.service";
import { isValidAuthPayload, isValidLoginPayload } from "../validations/auth.validation";

const authCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: false,
  path: "/",
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const payload = req.body as Partial<AuthPayload>;
  if (!isValidAuthPayload(payload)) {
    res.status(400).json({ message: "Invalid registration payload" });
    return;
  }

  const result = await registerUser(payload);
  res.status(result.status).json(result);
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const payload = req.body as Partial<LoginPayload>;
  if (!isValidLoginPayload(payload)) {
    res.status(400).json({ message: "Invalid login payload" });
    return;
  }

  const result = await loginUser(payload);
  if (result.status === 200) {
    res.cookie("accessToken", result.accessToken, { ...authCookieOptions, maxAge: 15 * 60 * 1000 });
    res.cookie("refreshToken", result.refreshToken, { ...authCookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  }
  res.status(result.status).json(result);
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body as { refreshToken?: string };
  const token = refreshToken || req.cookies?.refreshToken;

  if (!token) {
    res.status(401).json({ message: "Refresh token missing" });
    return;
  }

  try {
    const result = await refreshUserSession(token);
    if (result.status === 200) {
      res.cookie("accessToken", result.accessToken, { ...authCookieOptions, maxAge: 15 * 60 * 1000 });
      res.cookie("refreshToken", result.refreshToken, { ...authCookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
    }
    res.status(result.status).json(result);
  } catch {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

export const me = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const user = await getCurrentUser(req.user.userId);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    approvalStatus: user.approvalStatus,
  });
};

export const logout = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  await logoutUser(req.user.userId);
  res.clearCookie("accessToken", authCookieOptions);
  res.clearCookie("refreshToken", authCookieOptions);
  res.json({ message: "Logged out" });
};
