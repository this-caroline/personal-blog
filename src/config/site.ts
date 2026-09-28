export interface SocialProfile {
  readonly label: string;
  readonly url: string;
}

export interface SiteIdentity {
  readonly name: string;
  readonly professionalTitle: string;
  readonly location: string;
  readonly canonicalOrigin: URL;
  readonly description: string;
  readonly socialImagePath: `/${string}`;
  readonly profiles: readonly SocialProfile[];
}

export const siteIdentity: SiteIdentity = {
  name: "Caroline Marques",
  professionalTitle: "Software Engineer",
  location: "Munich, Germany",
  canonicalOrigin: new URL("https://caroline-marques.com"),
  description:
    "Software engineering notes, personal projects, experiments, and other things from Caroline Marques.",
  socialImagePath: "/social-preview.svg",
  profiles: [
    { label: "BoardGameGeek", url: "https://boardgamegeek.com/profile/ex_emo" },
  ],
};

export const homePageTitle = `${siteIdentity.name} — ${siteIdentity.professionalTitle}`;
export const defaultTitleSuffix = siteIdentity.name;

export const navigationLinks = [
  { label: "Home", pathname: "/" },
  { label: "Writing", pathname: "/writing" },
  { label: "Projects", pathname: "/projects" },
  { label: "About", pathname: "/about" },
] as const;
