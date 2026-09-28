import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

import { siteIdentity } from "./src/config/site";

export default defineConfig({
  site: siteIdentity.canonicalOrigin.toString(),
  integrations: [mdx(), sitemap()],
});
