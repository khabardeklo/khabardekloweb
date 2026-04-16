import type { AdPayload } from "../types/ad";

export const isValidAdPayload = (payload: Partial<AdPayload>): payload is AdPayload => {
  return Boolean(
    payload &&
      typeof payload.title === "string" &&
      payload.title.trim() &&
      typeof payload.description === "string" &&
      payload.description.trim() &&
      typeof payload.ctaLabel === "string" &&
      payload.ctaLabel.trim() &&
      typeof payload.targetUrl === "string" &&
      payload.targetUrl.trim()
  );
};
