import { describe, expect, it } from "vitest";

import { createGlobalJsonLd, createBlogPostingJsonLd } from "../src/lib/jsonLd";
import { createPageMetadata } from "../src/lib/metadata";
import {
  createPublishedArticles,
  estimateReadingMinutes,
} from "../src/lib/writing";
import { buildRssFeedXml } from "../src/pages/rss.xml";

interface MockArticleData {
  readonly title: string;
  readonly description: string;
  readonly publishedAt: Date;
  readonly updatedAt: Date | undefined;
  readonly draft: boolean;
  readonly tags: readonly string[];
  readonly image: string | undefined;
  readonly featured: boolean;
}

interface MockArticleEntry {
  readonly id: string;
  readonly body: string;
  readonly data: MockArticleData;
}

interface MockArticleOverrides {
  readonly id?: string;
  readonly body?: string;
  readonly data?: Partial<MockArticleData>;
  readonly title?: string;
  readonly description?: string;
  readonly publishedAt?: Date;
  readonly updatedAt?: Date;
  readonly draft?: boolean;
  readonly tags?: readonly string[];
  readonly image?: string;
  readonly featured?: boolean;
}

function createEntry(overrides: MockArticleOverrides = {}): MockArticleEntry {
  const baseData: MockArticleData = {
    title: "Sample post",
    description: "Example description",
    publishedAt: new Date("2024-01-02T00:00:00.000Z"),
    updatedAt: undefined,
    draft: false,
    tags: ["engineering"],
    image: undefined,
    featured: false,
  };

  const data: MockArticleData = {
    ...baseData,
    ...overrides.data,
    ...(overrides.title !== undefined ? { title: overrides.title } : {}),
    ...(overrides.description !== undefined
      ? { description: overrides.description }
      : {}),
    ...(overrides.publishedAt !== undefined
      ? { publishedAt: overrides.publishedAt }
      : {}),
    ...(overrides.updatedAt !== undefined
      ? { updatedAt: overrides.updatedAt }
      : {}),
    ...(overrides.draft !== undefined ? { draft: overrides.draft } : {}),
    ...(overrides.tags !== undefined ? { tags: overrides.tags } : {}),
    ...(overrides.image !== undefined ? { image: overrides.image } : {}),
    ...(overrides.featured !== undefined
      ? { featured: overrides.featured }
      : {}),
  };

  return {
    id: overrides.id ?? "sample-post",
    body: overrides.body ?? "one two three four five six seven eight nine ten",
    data,
  };
}

describe("writing logic", () => {
  it("excludes drafts and sorts newest-first", () => {
    const entries = [
      createEntry({
        id: "older",
        publishedAt: new Date("2023-01-01T00:00:00.000Z"),
      }),
      createEntry({
        id: "draft",
        draft: true,
        publishedAt: new Date("2025-01-01T00:00:00.000Z"),
      }),
      createEntry({
        id: "newer",
        publishedAt: new Date("2025-02-01T00:00:00.000Z"),
      }),
    ];

    const articles = createPublishedArticles(entries as never[]);

    expect(articles.map((article) => article.entry.id)).toEqual([
      "newer",
      "older",
    ]);
  });

  it("generates article urls from entry ids", () => {
    const articles = createPublishedArticles([
      createEntry({ id: "hello-world" }),
    ] as never[]);

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
    const graph = globalJsonLd as {
      "@graph": readonly [{ "@id": string }];
    };
    const personSchema = graph["@graph"][0];

    expect(personSchema["@id"]).toBe("https://caroline-marques.com/#person");
    expect(postJsonLd.author).toEqual({
      "@id": "https://caroline-marques.com/#person",
    });
    expect(postJsonLd.datePublished).toBe("2024-02-01T00:00:00.000Z");
    expect(postJsonLd.dateModified).toBe("2024-02-03T00:00:00.000Z");
  });
});

describe("RSS feed", () => {
  it("escapes XML-sensitive content and omits drafts", () => {
    const xml = buildRssFeedXml([
      createEntry({
        id: "escape-test",
        title: "Special & <tag>",
        description: 'A "quoted" post',
        publishedAt: new Date("2024-03-01T00:00:00.000Z"),
      }),
      createEntry({ id: "draft-post", draft: true }),
    ] as never[]);

    expect(xml).toContain("Special &amp; &lt;tag&gt;");
    expect(xml).toContain("A &quot;quoted&quot; post");
    expect(xml).not.toContain("draft-post");
    expect(xml).toContain("https://caroline-marques.com/writing/escape-test");
  });
});
