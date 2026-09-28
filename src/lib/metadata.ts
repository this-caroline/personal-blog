import { defaultTitleSuffix, homePageTitle, siteIdentity } from "@config/site";

export type OpenGraphType = "article" | "profile" | "website";

export interface PageMetadata {
  readonly title: string;
  readonly description: string;
  readonly canonicalUrl: URL;
  readonly imageUrl: URL;
  readonly openGraphTitle: string;
  readonly openGraphDescription: string;
  readonly openGraphType: OpenGraphType;
  readonly noindex: boolean;
}

export interface PageMetadataInput {
  readonly title?: string;
  readonly fullTitle?: string;
  readonly description?: string;
  readonly pathname: `/${string}`;
  readonly canonical?: URL;
  readonly image?: string | URL;
  readonly noindex?: boolean;
  readonly type?: OpenGraphType;
}

export function createPageMetadata(input: PageMetadataInput): PageMetadata {
  const canonicalUrl =
    input.canonical ?? new URL(input.pathname, siteIdentity.canonicalOrigin);
  const title =
    input.fullTitle ??
    (input.title === undefined
      ? homePageTitle
      : `${input.title} | ${defaultTitleSuffix}`);
  const description = input.description ?? siteIdentity.description;
  const imageUrl =
    input.image instanceof URL
      ? input.image
      : new URL(input.image ?? siteIdentity.socialImagePath, canonicalUrl);

  return {
    title,
    description,
    canonicalUrl,
    imageUrl,
    openGraphTitle: title,
    openGraphDescription: description,
    openGraphType: input.type ?? "website",
    noindex: input.noindex ?? false,
  };
}
