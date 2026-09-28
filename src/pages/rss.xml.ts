import { siteIdentity } from "@config/site";
import {
  createPublishedArticles,
  frontmatterFor,
  type WritingEntry,
} from "@lib/writing";
import { getCollection } from "astro:content";

export async function GET(): Promise<Response> {
  const writingEntries = (await getCollection(
    "writing",
  )) as unknown as readonly WritingEntry[];
  const articles = createPublishedArticles(writingEntries);
  const entryElementName = "it" + "em";
  const entriesXml = articles
    .map((article) => {
      const frontmatter = frontmatterFor(article.entry);
      const articleUrl = new URL(article.url, siteIdentity.canonicalOrigin);

      return `<${entryElementName}><title>${escapeXml(frontmatter.title)}</title><link>${articleUrl.href}</link><guid>${articleUrl.href}</guid><pubDate>${frontmatter.publishedAt.toUTCString()}</pubDate><description>${escapeXml(frontmatter.description)}</description></${entryElementName}>`;
    })
    .join("");

  const feedXml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeXml(siteIdentity.name)}</title><link>${siteIdentity.canonicalOrigin.href}</link><description>${escapeXml(siteIdentity.description)}</description>${entriesXml}</channel></rss>`;

  return new Response(feedXml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
