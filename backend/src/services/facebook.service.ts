import { env } from "../config/env";
import { getOrCreateSettings } from "./settings.service";

type NewsForFacebookPost = {
  title: string;
  slug: string;
  content: string;
  description?: string;
  imageUrl?: string;
  scheduledAt?: Date | null;
  facebookPostId?: string | null;
};

type FacebookPostResult =
  | { status: "skipped"; reason: string }
  | { status: "posted"; postId: string }
  | { status: "failed"; reason: string };

const stripHtml = (value: string): string => {
  return value
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const buildPostMessage = (news: NewsForFacebookPost): string => {
  const summary = news.description?.trim() || stripHtml(news.content).slice(0, 220);
  return [news.title.trim(), summary].filter(Boolean).join("\n\n");
};

export const postNewsToFacebookPage = async (news: NewsForFacebookPost): Promise<FacebookPostResult> => {
  if (news.facebookPostId) {
    return { status: "skipped", reason: "already-posted" };
  }

  if (news.scheduledAt && news.scheduledAt > new Date()) {
    return { status: "skipped", reason: "scheduled-for-later" };
  }

  const settings = await getOrCreateSettings();
  const facebookSettings = settings.socialMedia?.facebook;

  if (!facebookSettings?.autoPostEnabled) {
    return { status: "skipped", reason: "disabled" };
  }

  if (!facebookSettings.pageId || !facebookSettings.pageAccessToken) {
    return { status: "skipped", reason: "missing-credentials" };
  }

  const postUrl = `${env.frontendUrl.replace(/\/$/, "")}/news/${encodeURIComponent(news.slug)}`;
  const payload = new URLSearchParams();
  payload.set("message", buildPostMessage(news));
  payload.set("link", postUrl);
  payload.set("access_token", facebookSettings.pageAccessToken);

  if (news.imageUrl) {
    payload.set("picture", news.imageUrl);
  }

  const response = await fetch(`https://graph.facebook.com/v20.0/${facebookSettings.pageId}/feed`, {
    method: "POST",
    body: payload,
  });

  const data = (await response.json().catch(() => null)) as { id?: string; error?: { message?: string } } | null;

  if (!response.ok || data?.error) {
    return {
      status: "failed",
      reason: data?.error?.message || "Facebook auto-post failed",
    };
  }

  return {
    status: "posted",
    postId: data?.id || "",
  };
};