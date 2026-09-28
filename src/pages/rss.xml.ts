import { siteIdentity } from "@config/site";
import { createPublishedArticles, type WritingEntry } from "@lib/writing";

export async function GET(): Promise<Response> {
  const { getCollection } = await import("astro:content");
  const writingEntries = await getCollection("writing");

  return new Response(buildRssFeedXml(writingEntries), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}

export function buildRssFeedXml(entries: readonly WritingEntry[]): string {
  const articles = createPublishedArticles(entries);
  const entryElementName = "item";
  const entriesXml = articles
    .map((article) => {
      const frontmatter = article.entry.data;
      const articleUrl = new URL(article.url, siteIdentity.canonicalOrigin);

      return `<${entryElementName}><title>${escapeXml(frontmatter.title)}</title><link>${articleUrl.href}</link><guid>${articleUrl.href}</guid><pubDate>${frontmatter.publishedAt.toUTCString()}</pubDate><description>${escapeXml(frontmatter.description)}</description></${entryElementName}>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeXml(siteIdentity.name)}</title><link>${siteIdentity.canonicalOrigin.href}</link><description>${escapeXml(siteIdentity.description)}</description>${entriesXml}</channel></rss>`;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
