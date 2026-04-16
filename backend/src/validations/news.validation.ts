import type { NewsPayload } from "../types/news";

export const isValidNewsPayload = (value: Partial<NewsPayload>): value is NewsPayload => {
  return (
    typeof value.title === "string" &&
    typeof value.content === "string" &&
    typeof value.category === "string"
  );
};
