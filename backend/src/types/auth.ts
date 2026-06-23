import type { UserRole } from "../models/User";

export type JwtUser = {
  userId: string;
  role: UserRole;
};

export type AuthPayload = {
  name?: string;
  email: string;
  password: string;
  role?: UserRole;
};

export type LoginPayload = {
  email: string;
  password: string;
  role: UserRole;
};
