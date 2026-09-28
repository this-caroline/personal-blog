import { siteIdentity, siteTitle } from "@config/site";

export interface PageMetadata {
  readonly title: string;
  readonly description: string;
  readonly canonicalUrl: URL;
  readonly openGraphTitle: string;
  readonly openGraphDescription: string;
}

export interface PageMetadataInput {
  readonly title?: string;
  readonly description?: string;
  readonly pathname: `/${string}`;
}

export function createPageMetadata(input: PageMetadataInput): PageMetadata {
  const canonicalUrl = new URL(input.pathname, siteIdentity.canonicalOrigin);
  const title =
    input.title === undefined ? siteTitle : `${input.title} | ${siteTitle}`;
  const description = input.description ?? siteIdentity.description;

  return {
    title,
    description,
    canonicalUrl,
    openGraphTitle: title,
    openGraphDescription: description,
  };
}
