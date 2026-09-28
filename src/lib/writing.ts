import type { CollectionEntry } from "astro:content";

export type WritingEntry = CollectionEntry<"writing">;

export interface PublishedArticle {
  readonly entry: WritingEntry;
  readonly url: `/writing/${string}`;
  readonly readingMinutes: number;
}

export interface CreatePublishedArticlesOptions {
  readonly dev?: boolean;
}

export function createPublishedArticles(
  entries: readonly WritingEntry[],
  options: CreatePublishedArticlesOptions = {},
): PublishedArticle[] {
  const isDevelopment = options.dev ?? import.meta.env.DEV;
  const visibleEntries = isDevelopment
    ? [...entries]
    : entries.filter((entry) => !entry.data.draft);

  return visibleEntries
    .sort((firstArticle, secondArticle) => {
      const publishedAtDifference =
        secondArticle.data.publishedAt.getTime() -
        firstArticle.data.publishedAt.getTime();

      if (publishedAtDifference !== 0) {
        return publishedAtDifference;
      }

      return firstArticle.id.localeCompare(secondArticle.id);
    })
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
    timeZone: "UTC",
  }).format(date);
}

export function estimateReadingMinutes(markdown: string): number {
  const wordCount = markdown.trim().split(/\s+/u).filter(Boolean).length;

  return Math.max(1, Math.ceil(wordCount / 220));
}
