import { describe, expect, it } from "vitest";

import { siteIdentity } from "../src/config/site";
import { GET } from "../src/pages/robots.txt";

describe("robots endpoint", () => {
  it("allows crawling and advertises the canonical absolute sitemap URL", async () => {
    const response = GET();
    const sitemapUrl = new URL(
      "/sitemap-index.xml",
      siteIdentity.canonicalOrigin,
    );
    expect(response.headers.get("Content-Type")).toBe(
      "text/plain; charset=utf-8",
    );
    expect(await response.text()).toBe(
      `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl.href}\n`,
    );
  });
});
