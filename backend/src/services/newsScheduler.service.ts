import * as nodeCron from "node-cron";
import { ApiSource, IApiSource } from "../models/ApiSource";
import { createNewsItem } from "./news.service";
import { extractArticleFromUrl } from "./articleExtractor.service";

const extractArticles = (raw: unknown): Record<string, unknown>[] => {
  if (Array.isArray(raw)) return raw as Record<string, unknown>[];
  const obj = raw as Record<string, unknown>;
  if (Array.isArray(obj.articles)) return obj.articles as Record<string, unknown>[];
  if (Array.isArray(obj.results)) return obj.results as Record<string, unknown>[];
  if (Array.isArray(obj.data)) return obj.data as Record<string, unknown>[];
  return [];
};

const mapArticle = (a: Record<string, unknown>) => ({
  title: ((a.title as string) || "").trim(),
  content: (a.content as string) || (a.body as string) || (a.description as string) || "",
  description: (a.description as string) || "",
  imageUrl:
    (a.urlToImage as string) ||
    (a.image as string) ||
    (a.imageUrl as string) ||
    (a.thumbnail as string) ||
    undefined,
  sourceUrl:
    (a.url as string) ||
    (a.link as string) ||
    (a.sourceUrl as string) ||
    undefined,
});

export const runFetchForSource = async (source: IApiSource) => {
  // Always fetch fresh source data from DB to avoid stale intervals/settings
  const freshSource = await ApiSource.findById(source._id);
  if (!freshSource || !freshSource.isActive) {
    return { imported: 0, skipped: 0, errors: [], message: "Source is inactive or not found" };
  }

  // Only send header key if explicitly provided in the source's apiKey field.
  // Do NOT fall back to env.newsApiKey — if the key is already in the URL (e.g. GNews ?apikey=), sending a wrong header key causes 401.
  const explicitKey = freshSource.apiKey?.trim();
  const headers: Record<string, string> = {};
  if (explicitKey) headers["X-Api-Key"] = explicitKey;

  let imported = 0;
  let skipped = 0;
  const errors: string[] = [];

  try {
    const res = await fetch(freshSource.apiUrl, { headers });
    if (!res.ok) {
      const msg = `External API responded with ${res.status}`;
      await ApiSource.findByIdAndUpdate(freshSource._id, {
        lastFetchedAt: new Date(),
        lastFetchResult: `❌ ${msg}`,
      });
      return { imported: 0, skipped: 0, errors: [msg], message: msg };
    }

    const raw = (await res.json()) as unknown;
    const articles = extractArticles(raw);

    const { User } = await import("../models/User");
    const adminUser = await User.findOne({ role: "admin" }).select("_id");
    if (!adminUser) throw new Error("No admin user found for authorId");

    for (const article of articles.slice(0, 20)) {
      const { title, content, description, imageUrl, sourceUrl } = mapArticle(article as Record<string, unknown>);
      if (!title) {
        skipped++;
        continue;
      }

      // Fetch full article content from source URL — replaces truncated API content
      let finalContent = content;
      if (sourceUrl) {
        const extracted = await extractArticleFromUrl(sourceUrl);
        if (extracted.success && extracted.contentText.length > finalContent.length) {
          finalContent = extracted.contentHtml || extracted.contentText;
        }
      }

      const result = await createNewsItem(
        {
          title,
          content: finalContent,
          category: freshSource.category,
          description,
          imageUrl,
          sourceUrl,
          isPublished: freshSource.publishImmediately,
        },
        String(adminUser._id)
      );

      if (result.status === 201) imported++;
      else {
        skipped++;
        errors.push(`"${title}" — ${result.message}`);
      }
    }

    const resultMsg = `✅ ${imported} imported, ${skipped} skipped`;
    await ApiSource.findByIdAndUpdate(freshSource._id, {
      lastFetchedAt: new Date(),
      lastFetchResult: resultMsg,
    });

    return { imported, skipped, errors, message: resultMsg };
  } catch (err) {
    const msg = `Error: ${String(err)}`;
    await ApiSource.findByIdAndUpdate(freshSource._id, {
      lastFetchedAt: new Date(),
      lastFetchResult: `❌ ${msg}`,
    });
    return { imported, skipped, errors: [msg], message: msg };
  }
};

// Map: sourceId → active cron task
const activeJobs = new Map<string, nodeCron.ScheduledTask>();

const intervalToCron = (minutes: number): string => {
  if (minutes < 60) return `*/${minutes} * * * *`;
  const hours = Math.floor(minutes / 60);
  return `0 */${hours} * * *`;
};

export const startSchedulerForSource = (source: IApiSource) => {
  const id = String(source._id);
  stopSchedulerForSource(id);

  const cronExpr = intervalToCron(source.intervalMinutes);
  // Pass only the id so the cron callback always reads fresh data from DB
  const task = nodeCron.schedule(cronExpr, () => {
    console.log(`[Scheduler] Auto-fetching: ${source.name}`);
    void runFetchForSource(source);
  });

  activeJobs.set(id, task);
  console.log(`[Scheduler] Started "${source.name}" — cron: ${cronExpr}`);
};

export const stopSchedulerForSource = (id: string) => {
  const existing = activeJobs.get(id);
  if (existing) {
    existing.stop();
    activeJobs.delete(id);
    console.log(`[Scheduler] Stopped: ${id}`);
  }
};

// Called once at server startup
export const initSchedulers = async () => {
  const sources = await ApiSource.find({ isActive: true });
  console.log(`[Scheduler] Initializing ${sources.length} active source(s)`);
  for (const source of sources) {
    startSchedulerForSource(source);
  }
};
