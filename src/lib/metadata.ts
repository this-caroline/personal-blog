import { defaultTitleSuffix, homePageTitle, siteIdentity } from "@config/site";

export type OpenGraphType = "article" | "profile" | "website";

export interface PageMetadata {
  readonly title: string;
  readonly description: string;
  readonly canonicalUrl: URL;
  readonly imageUrl: URL;
  readonly imageType: `image/${string}` | undefined;
  readonly imageWidth: number | undefined;
  readonly imageHeight: number | undefined;
  readonly imageAlt: string | undefined;
  readonly openGraphType: OpenGraphType;
  readonly noindex: boolean;
}

export interface PageMetadataInput {
  readonly title?: string;
  readonly fullTitle?: string;
  readonly description?: string;
  readonly pathname: `/${string}`;
  readonly image?: string | URL;
  readonly imageType?: `image/${string}`;
  readonly imageWidth?: number;
  readonly imageHeight?: number;
  readonly imageAlt?: string;
  readonly noindex?: boolean;
  readonly type?: OpenGraphType;
}

export function createPageMetadata(input: PageMetadataInput): PageMetadata {
  const canonicalUrl = new URL(input.pathname, siteIdentity.canonicalOrigin);
  const title = resolvePageTitle(input);
  const description = input.description ?? siteIdentity.description;
  const imageUrl = resolveImageUrl(input, canonicalUrl);

  return {
    title,
    description,
    canonicalUrl,
    imageUrl,
    imageType:
      input.imageType ?? (input.image === undefined ? "image/png" : undefined),
    imageWidth:
      input.imageWidth ?? (input.image === undefined ? 1200 : undefined),
    imageHeight:
      input.imageHeight ?? (input.image === undefined ? 630 : undefined),
    imageAlt:
      input.imageAlt ??
      (input.image === undefined ? siteIdentity.socialImageAlt : undefined),
    openGraphType: input.type ?? "website",
    noindex: input.noindex ?? false,
  };
}

function resolvePageTitle(input: PageMetadataInput): string {
  if (input.fullTitle !== undefined) {
    return input.fullTitle;
  }

  if (input.title !== undefined) {
    return `${input.title} | ${defaultTitleSuffix}`;
  }

  return homePageTitle;
}

function resolveImageUrl(input: PageMetadataInput, canonicalUrl: URL): URL {
  if (input.image instanceof URL) {
    return input.image;
  }

  const imagePath = input.image ?? siteIdentity.socialImagePath;

  return new URL(imagePath, canonicalUrl);
}
