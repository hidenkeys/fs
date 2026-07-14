import type { MetadataRoute } from "next";
import { getApprovedTributes } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fs-seven-liard.vercel.app";
  const tributes = await getApprovedTributes();

  return [
    {
      url: baseUrl,
      lastModified: new Date()
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date()
    },
    {
      url: `${baseUrl}/tributes`,
      lastModified: new Date()
    },
    ...tributes.map((tribute) => ({
      url: `${baseUrl}/tributes/${tribute.slug}`,
      lastModified: new Date(tribute.createdAt)
    }))
  ];
}
