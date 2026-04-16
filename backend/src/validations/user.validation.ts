import type { UserApprovalStatus } from "../models/User";

export const isValidUserApprovalStatus = (value: string | undefined): value is UserApprovalStatus => {
  return value === "active" || value === "rejected";
};