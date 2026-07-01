import type { MetadataRoute } from "next";
import { tributes } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://fs-tribute.example.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date()
    },
    ...tributes.map((tribute) => ({
      url: `${baseUrl}/tributes/${tribute.slug}`,
      lastModified: new Date(tribute.createdAt)
    }))
  ];
}
