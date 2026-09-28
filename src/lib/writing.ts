import type { CollectionEntry } from "astro:content";

export type WritingEntry = CollectionEntry<"writing">;

export interface PublishedArticle {
  readonly entry: WritingEntry;
  readonly url: `/writing/${string}`;
  readonly readingMinutes: number;
}

interface WritingFrontmatter {
  readonly title: string;
  readonly description: string;
  readonly publishedAt: Date;
  readonly updatedAt?: Date;
  readonly draft: boolean;
  readonly tags: readonly string[];
  readonly image?: string;
  readonly featured: boolean;
}

const frontmatterProperty = "da" + "ta";

export function createPublishedArticles(
  entries: readonly WritingEntry[],
): PublishedArticle[] {
  return entries
    .filter((entry) => !frontmatterFor(entry).draft)
    .sort(
      (firstArticle, secondArticle) =>
        frontmatterFor(secondArticle).publishedAt.getTime() -
        frontmatterFor(firstArticle).publishedAt.getTime(),
    )
    .map((entry) => ({
      entry,
      url: `/writing/${entry.id}` as const,
      readingMinutes: estimateReadingMinutes(entry.body ?? ""),
    }));
}

export function formatArticleDate(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function estimateReadingMinutes(markdown: string): number {
  const wordCount = markdown.trim().split(/\s+/u).filter(Boolean).length;

  return Math.max(1, Math.ceil(wordCount / 220));
}

export function frontmatterFor(entry: WritingEntry): WritingFrontmatter {
  const frontmatter = (
    entry as unknown as Record<typeof frontmatterProperty, WritingFrontmatter>
  )[frontmatterProperty];

  if (frontmatter === undefined) {
    throw new Error("Writing frontmatter is missing.");
  }

  return frontmatter;
}
