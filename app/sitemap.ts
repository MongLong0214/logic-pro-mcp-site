import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://logic-pro-mcp.monglong.chatgpt.site",
      lastModified: new Date("2026-07-13"),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
