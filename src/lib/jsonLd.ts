import { siteIdentity } from "@config/site";

type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | JsonLdNode
  | readonly JsonLdValue[];

export interface JsonLdNode {
  readonly [propertyName: string]: JsonLdValue;
}

export function serializeJsonLd(graph: JsonLdNode): string {
  return JSON.stringify(graph).replaceAll("<", "\\u003c");
}

export const personSchemaId = new URL("#person", siteIdentity.canonicalOrigin)
  .href;

export const websiteSchemaId = new URL("#website", siteIdentity.canonicalOrigin)
  .href;

export function createGlobalJsonLd(): JsonLdNode {
  const sameAsUrls: string[] = [];

  for (const profile of siteIdentity.profiles) {
    sameAsUrls.push(profile.url);
  }

  const personSchema: JsonLdNode = {
    "@type": "Person",
    "@id": personSchemaId,
    name: siteIdentity.name,
    url: siteIdentity.canonicalOrigin.href,
    jobTitle: siteIdentity.professionalTitle,
    ...(sameAsUrls.length > 0 ? { sameAs: sameAsUrls } : {}),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      personSchema,
      {
        "@type": "WebSite",
        "@id": websiteSchemaId,
        url: siteIdentity.canonicalOrigin.href,
        name: siteIdentity.name,
        publisher: { "@id": personSchemaId },
      },
    ],
  };
}

export function createProfilePageJsonLd(canonicalUrl: URL): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${canonicalUrl.href}#profile-page`,
    url: canonicalUrl.href,
    name: `About ${siteIdentity.name}`,
    mainEntity: { "@id": personSchemaId },
  };
}

export interface BlogPostingInput {
  readonly canonicalUrl: URL;
  readonly title: string;
  readonly description: string;
  readonly publishedAt: Date;
  readonly updatedAt?: Date;
  readonly imageUrl?: URL;
}

export function createBlogPostingJsonLd(input: BlogPostingInput): JsonLdNode {
  const modifiedDate = input.updatedAt ?? input.publishedAt;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${input.canonicalUrl.href}#blog-posting`,
    headline: input.title,
    description: input.description,
    datePublished: input.publishedAt.toISOString(),
    dateModified: modifiedDate.toISOString(),
    url: input.canonicalUrl.href,
    mainEntityOfPage: input.canonicalUrl.href,
    author: { "@id": personSchemaId },
    publisher: { "@id": personSchemaId },
    ...(input.imageUrl === undefined ? {} : { image: input.imageUrl.href }),
  };
}
