import { siteIdentity } from "@config/site";

export function GET(): Response {
  const sitemapUrl = new URL(
    "/sitemap-index.xml",
    siteIdentity.canonicalOrigin,
  );

  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl.href}\n`,
    {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    },
  );
}
