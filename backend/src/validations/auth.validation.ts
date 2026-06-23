import type { AuthPayload, LoginPayload } from "../types/auth";

const validRoles = new Set(["admin", "editor", "author", "reporter"]);

export const isValidAuthPayload = (value: Partial<AuthPayload>): value is AuthPayload => {
  if (typeof value.email !== "string" || typeof value.password !== "string") {
    return false;
  }

  return value.role === undefined || validRoles.has(value.role);
};

export const isValidLoginPayload = (value: Partial<LoginPayload>): value is LoginPayload => {
  return (
    typeof value.email === "string" &&
    typeof value.password === "string" &&
    typeof value.role === "string" &&
    validRoles.has(value.role)
  );
};
