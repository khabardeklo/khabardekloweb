import * as cheerio from "cheerio";

// Tags/selectors to strip before content extraction
const NOISE_SELECTORS = [
  "script", "style", "noscript", "iframe", "form", "button",
  "nav", "header", "footer", "aside",
  "[class*='nav']", "[class*='menu']", "[class*='sidebar']",
  "[class*='footer']", "[class*='header']",
  "[class*='ad']", "[class*='ads']", "[class*='advertisement']",
  "[class*='promo']", "[class*='banner']", "[class*='popup']",
  "[class*='modal']", "[class*='cookie']", "[class*='subscribe']",
  "[class*='newsletter']", "[class*='related']", "[class*='recommend']",
  "[class*='social']", "[class*='share']", "[class*='comment']",
  "[class*='widget']",
  "[id*='nav']", "[id*='menu']", "[id*='sidebar']",
  "[id*='footer']", "[id*='header']", "[id*='ad']",
  "[id*='comment']", "[id*='social']", "[id*='share']",
];

// Priority-ordered CSS selectors for article body
const CONTENT_SELECTORS = [
  "article[class*='article']",
  "article[class*='story']",
  "article[class*='post']",
  "article",
  "[class*='article-body']",
  "[class*='article-content']",
  "[class*='article__body']",
  "[class*='article__content']",
  "[class*='story-body']",
  "[class*='story-content']",
  "[class*='post-body']",
  "[class*='post-content']",
  "[class*='entry-content']",
  "[class*='entry-body']",
  "[class*='main-content']",
  "[class*='content-body']",
  "[class*='news-body']",
  "[class*='news-content']",
  "[itemprop='articleBody']",
  "[itemprop='text']",
  ".content", "#content",
  "main",
];

export type ExtractedArticle = {
  title: string | null;
  contentHtml: string;
  contentText: string;
  success: boolean;
  error?: string;
};

export const extractArticleFromUrl = async (url: string): Promise<ExtractedArticle> => {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
      },
      signal: AbortSignal.timeout(12000),
    });

    if (!res.ok) {
      return { title: null, contentHtml: "", contentText: "", success: false, error: `HTTP ${res.status}` };
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // Extract page title from meta/title tags
    const title =
      $('meta[property="og:title"]').attr("content")?.trim() ||
      $('meta[name="twitter:title"]').attr("content")?.trim() ||
      $("title").text().trim() ||
      null;

    // Strip noise elements
    NOISE_SELECTORS.forEach((sel) => $(sel).remove());

    // Try each content selector in priority order
    let contentHtml = "";
    let contentText = "";

    for (const sel of CONTENT_SELECTORS) {
      const el = $(sel).first();
      const text = el.text().trim();
      if (el.length && text.length > 200) {
        // Resolve relative image/link URLs
        const origin = new URL(url).origin;
        el.find("img[src]").each((_i, node) => {
          const src = $(node).attr("src") || "";
          if (src.startsWith("/")) $(node).attr("src", origin + src);
        });
        el.find("a[href]").each((_i, node) => {
          const href = $(node).attr("href") || "";
          if (href.startsWith("/")) $(node).attr("href", origin + href);
        });

        contentHtml = el.html()?.trim() ?? "";
        contentText = text.replace(/\s+/g, " ").trim();
        break;
      }
    }

    // Fallback: score all div/section blocks by text density and pick best
    if (!contentText) {
      let bestScore = 0;
      let bestHtml = "";
      let bestText = "";

      $("div, section").each((_i, node) => {
        const el = $(node);
        const text = el.text().trim();
        const words = text.split(/\s+/).filter(Boolean).length;
        const paragraphs = el.find("p").length;
        const links = el.find("a").length;
        const score = words + paragraphs * 20 - links * 5;

        if (score > bestScore) {
          bestScore = score;
          bestHtml = el.html()?.trim() ?? "";
          bestText = text.replace(/\s+/g, " ").trim();
        }
      });

      contentHtml = bestHtml;
      contentText = bestText;
    }

    if (contentText.length < 100) {
      return {
        title,
        contentHtml: "",
        contentText: "",
        success: false,
        error: "Could not extract meaningful content from this URL",
      };
    }

    return { title, contentHtml, contentText, success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { title: null, contentHtml: "", contentText: "", success: false, error: message };
  }
};
