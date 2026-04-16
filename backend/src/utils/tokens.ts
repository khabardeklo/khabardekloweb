import jwt from "jsonwebtoken";
import { env } from "../config/env";

export type JwtPayload = {
  userId: string;
  role: "admin" | "editor" | "author" | "reporter";
};

export const signAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.accessTokenSecret, { expiresIn: env.accessTokenExpires as jwt.SignOptions["expiresIn"] });
};

export const signRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.refreshTokenSecret, { expiresIn: env.refreshTokenExpires as jwt.SignOptions["expiresIn"] });
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.accessTokenSecret) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.refreshTokenSecret) as JwtPayload;
};
