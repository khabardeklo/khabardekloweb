import type { AuthPayload } from "../types/auth";

export const isValidAuthPayload = (value: Partial<AuthPayload>): value is AuthPayload => {
  return typeof value.email === "string" && typeof value.password === "string";
};
