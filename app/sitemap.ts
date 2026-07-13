import type { MetadataRoute } from "next";
import { siteUrl } from "./site-config";
import { routePaths } from "./content/page-records";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...routePaths.map((path) => ({ url: `${siteUrl}${path}`, changeFrequency: "monthly" as const, priority: path.startsWith("/guides/") ? 0.8 : 0.7 })),
  ];
}
