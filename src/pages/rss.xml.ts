import { getCollection } from "astro:content";

import { buildRssFeedXml } from "@lib/rss";

export async function GET(): Promise<Response> {
  const writingEntries = await getCollection("writing");

  return new Response(buildRssFeedXml(writingEntries), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
