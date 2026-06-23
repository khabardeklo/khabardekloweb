import type { NewsPayload } from "../types/news";

const isValidScheduleValue = (value: unknown): boolean => {
  if (value === undefined || value === null || value === "") {
    return true;
  }

  if (typeof value !== "string") {
    return false;
  }

  return !Number.isNaN(new Date(value).getTime());
};

export const isValidNewsPayload = (value: Partial<NewsPayload>): value is NewsPayload => {
  return (
    typeof value.title === "string" &&
    typeof value.content === "string" &&
    typeof value.category === "string" &&
    (value.description === undefined || typeof value.description === "string") &&
    isValidScheduleValue(value.scheduledAt)
  );
};
