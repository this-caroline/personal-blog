import { siteIdentity } from "@config/site";
import {
  createPublishedArticles,
  type CreatePublishedArticlesOptions,
  type WritingEntry,
} from "@lib/writing";

export function buildRssFeedXml(
  entries: readonly WritingEntry[],
  options: CreatePublishedArticlesOptions = {},
): string {
  const articles = createPublishedArticles(entries, options);
  const entriesXml = articles
    .map((article) => {
      const frontmatter = article.entry.data;
      const articleUrl = new URL(article.url, siteIdentity.canonicalOrigin);

      return `<item><title>${escapeXml(frontmatter.title)}</title><link>${articleUrl.href}</link><guid>${articleUrl.href}</guid><pubDate>${frontmatter.publishedAt.toUTCString()}</pubDate><description>${escapeXml(frontmatter.description)}</description></item>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteIdentity.name)}</title>
    <link>${siteIdentity.canonicalOrigin.href}</link>
    <atom:link href="${siteIdentity.canonicalOrigin.href}rss.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml(siteIdentity.description)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${entriesXml}
  </channel>
</rss>`;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
