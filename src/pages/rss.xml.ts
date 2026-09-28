import { buildRssFeedXml } from "@lib/rss";
import { getCollection } from "astro:content";

export async function GET(): Promise<Response> {
  const writingEntries = await getCollection("writing");

  return new Response(buildRssFeedXml(writingEntries), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
