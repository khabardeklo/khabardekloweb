import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/tokens";
import { UserRole } from "../models/User";

export type AuthenticatedRequest = Request & {
  user?: { userId: string; role: UserRole };
};

export const protect = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const headerToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  const cookieToken = typeof req.cookies?.accessToken === "string" ? req.cookies.accessToken : null;
  const token = headerToken || cookieToken;

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { userId: payload.userId, role: payload.role };
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    next();
  };
};
