import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://logic-pro-mcp.monglong.chatgpt.site",
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
