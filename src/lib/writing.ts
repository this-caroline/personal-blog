import type { CollectionEntry } from "astro:content";

export type WritingEntry = CollectionEntry<"writing">;

export interface PublishedArticle {
  readonly entry: WritingEntry;
  readonly url: `/writing/${string}`;
  readonly readingMinutes: number;
}

export function createPublishedArticles(
  entries: readonly WritingEntry[],
): PublishedArticle[] {
  return entries
    .filter((entry) => !entry.data.draft)
    .sort(
      (firstArticle, secondArticle) =>
        secondArticle.data.publishedAt.getTime() -
        firstArticle.data.publishedAt.getTime(),
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

export function frontmatterFor(entry: WritingEntry) {
  return entry.data;
}
