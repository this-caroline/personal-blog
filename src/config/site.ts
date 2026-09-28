export interface SocialProfile {
  readonly label: string;
  readonly url: string;
}

export interface SiteIdentity {
  readonly name: string;
  readonly professionalTitle: string;
  readonly canonicalOrigin: URL;
  readonly description: string;
  readonly profiles: readonly SocialProfile[];
}

export const siteIdentity = {
  name: "Caroline Marques",
  professionalTitle: "Software Engineer",
  canonicalOrigin: new URL("https://caroline-marques.com"),
  description:
    "Personal publishing hub for Caroline Marques",
  profiles: [],
} satisfies SiteIdentity;

export const siteTitle = `${siteIdentity.name}, ${siteIdentity.professionalTitle}`;
