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
  readonly socialImageAlt: string;
  readonly profiles: readonly SocialProfile[];
}

export const siteIdentity: SiteIdentity = {
  name: "Caroline Marques",
  professionalTitle: "Software Engineer",
  location: "Munich, Germany",
  canonicalOrigin: new URL("https://caroline-marques.com"),
  description:
    "Software engineering notes, personal projects, experiments, and other things from Caroline Marques.",
  socialImagePath: "/social-preview.png",
  socialImageAlt:
    "Caroline Marques social preview for caroline-marques.com with a software engineering theme.",
  profiles: [
    { label: "GitHub", url: "https://github.com/this-caroline" },
    { label: "BoardGameGeek", url: "https://boardgamegeek.com/profile/ex_emo" },
  ],
};

export const homePageTitle = `${siteIdentity.name} — ${siteIdentity.professionalTitle}`;
export const defaultTitleSuffix = siteIdentity.name;

export const navigationLinks = [
  { label: "Home", pathname: "/" },
  { label: "Projects", pathname: "/projects" },
  { label: "About", pathname: "/about" },
] as const;
