import { describe, expect, it } from "vitest";

import { createGlobalJsonLd, createBlogPostingJsonLd } from "../src/lib/jsonLd";
import { createPageMetadata } from "../src/lib/metadata";
import { buildRssFeedXml } from "../src/lib/rss";
import {
  createPublishedArticles,
  estimateReadingMinutes,
  type WritingEntry,
} from "../src/lib/writing";

interface ArticleOverrides {
  readonly id?: string;
  readonly body?: string;
  readonly data?: Partial<WritingEntry["data"]>;
}

function createEntry(overrides: ArticleOverrides = {}): WritingEntry {
  return {
    id: overrides.id ?? "sample-post",
    collection: "writing",
    body: overrides.body ?? "one two three four five six seven eight nine ten",
    data: {
      title: "Sample post",
      description: "Example description",
      publishedAt: new Date("2024-01-02T00:00:00.000Z"),
      draft: false,
      tags: ["engineering"],
      ...overrides.data,
    },
  };
}

describe("writing logic", () => {
  it("includes drafts in development", () => {
    const draft = createEntry({ id: "draft", data: { draft: true } });
    expect(createPublishedArticles([draft], { dev: true })[0]?.entry).toBe(
      draft,
    );
  });

  it("handles an empty collection", () => {
    expect(createPublishedArticles([], { dev: false })).toEqual([]);
  });

  it("treats a missing body as a one-minute article", () => {
    const entry = createEntry();
    delete entry.body;
    expect(
      createPublishedArticles([entry], { dev: false })[0]?.readingMinutes,
    ).toBe(1);
  });

  it.each([false, true])("does not mutate inputs when dev is %s", (dev) => {
    const older = createEntry({
      id: "older",
      data: { publishedAt: new Date("2020-01-01") },
    });
    const newer = createEntry({
      id: "newer",
      data: { publishedAt: new Date("2025-01-01") },
    });
    const entries = Object.freeze([older, newer]);
    Object.freeze(older.data);
    Object.freeze(newer.data);
    Object.freeze(older);
    Object.freeze(newer);
    const articles = createPublishedArticles(entries, { dev });
    expect(articles.map((article) => article.entry.id)).toEqual([
      "newer",
      "older",
    ]);
    expect(entries).toEqual([older, newer]);
  });

  it.each([
    ["", 1],
    ["   \n\t", 1],
    ["word ".repeat(220), 1],
    ["word ".repeat(221), 2],
    ["word ".repeat(440), 2],
    ["word ".repeat(441), 3],
  ])("estimates reading minutes at word-count boundaries", (body, minutes) => {
    expect(estimateReadingMinutes(body)).toBe(minutes);
  });

  it("excludes drafts and sorts newest-first with id as a tiebreaker", () => {
    const entries = [
      createEntry({
        id: "older",
        data: { publishedAt: new Date("2023-01-01T00:00:00.000Z") },
      }),
      createEntry({
        id: "draft",
        data: {
          draft: true,
          publishedAt: new Date("2025-01-01T00:00:00.000Z"),
        },
      }),
      createEntry({
        id: "newer",
        data: { publishedAt: new Date("2025-02-01T00:00:00.000Z") },
      }),
      createEntry({
        id: "zebra",
        data: { publishedAt: new Date("2025-02-01T00:00:00.000Z") },
      }),
      createEntry({
        id: "alpha",
        data: { publishedAt: new Date("2025-02-01T00:00:00.000Z") },
      }),
    ];

    const articles = createPublishedArticles(entries, {
      dev: false,
    });

    expect(articles.map((article) => article.entry.id)).toEqual([
      "alpha",
      "newer",
      "zebra",
      "older",
    ]);
  });

  it("generates article urls from entry ids", () => {
    const articles = createPublishedArticles(
      [createEntry({ id: "hello-world" })],
      { dev: false },
    );

    expect(articles[0]?.url).toBe("/writing/hello-world");
  });

  it("estimates reading time sensibly", () => {
    expect(
      estimateReadingMinutes(
        "one two three four five six seven eight nine ten",
      ),
    ).toBe(1);
    expect(estimateReadingMinutes("one ".repeat(440))).toBe(2);
  });
});

describe("metadata", () => {
  it("uses the default social image and exposes image metadata", () => {
    const metadata = createPageMetadata({ pathname: "/about" });

    expect(metadata.imageUrl.href).toContain("/social-preview.png");
    expect(metadata.imageType).toBe("image/png");
    expect(metadata.imageWidth).toBe(1200);
    expect(metadata.imageHeight).toBe(630);
    expect(metadata.imageAlt).toContain("Caroline Marques");
  });

  it("allows a custom social image to override the default", () => {
    const metadata = createPageMetadata({
      pathname: "/writing/hello-world",
      image: "https://example.com/custom-preview.png",
    });

    expect(metadata.imageUrl.href).toBe(
      "https://example.com/custom-preview.png",
    );
  });
});

describe("JSON-LD", () => {
  it("keeps the person entity stable and references it from blog posts", () => {
    const globalJsonLd = createGlobalJsonLd();
    const postJsonLd = createBlogPostingJsonLd({
      canonicalUrl: new URL("https://caroline-marques.com/writing/test-post"),
      title: "A test post",
      description: "Example article description",
      publishedAt: new Date("2024-02-01T00:00:00.000Z"),
      updatedAt: new Date("2024-02-03T00:00:00.000Z"),
      imageUrl: new URL("https://caroline-marques.com/social-preview.png"),
    });
    expect(globalJsonLd["@graph"]).toContainEqual(
      expect.objectContaining({
        "@id": "https://caroline-marques.com/#person",
      }),
    );
    expect(postJsonLd.author).toEqual({
      "@id": "https://caroline-marques.com/#person",
    });
    expect(postJsonLd.datePublished).toBe("2024-02-01T00:00:00.000Z");
    expect(postJsonLd.dateModified).toBe("2024-02-03T00:00:00.000Z");
  });
});

describe("RSS feed", () => {
  it("escapes XML-sensitive content, omits drafts, and includes feed metadata", () => {
    const xml = buildRssFeedXml(
      [
        createEntry({
          id: "escape-test",
          data: {
            title: "Special & <tag>",
            description: 'A "quoted" post',
            publishedAt: new Date("2024-03-01T00:00:00.000Z"),
          },
        }),
        createEntry({ id: "draft-post", data: { draft: true } }),
      ],
      { dev: false },
    );

    expect(xml).toContain("Special &amp; &lt;tag&gt;");
    expect(xml).toContain("A &quot;quoted&quot; post");
    expect(xml).not.toContain("draft-post");
    expect(xml).toContain("https://caroline-marques.com/writing/escape-test");
    expect(xml).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
    expect(xml).toContain(
      '<atom:link href="https://caroline-marques.com/rss.xml" rel="self" type="application/rss+xml" />',
    );
    expect(xml).toContain("<lastBuildDate>");
    expect(xml).toContain("<language>en</language>");
  });
});
