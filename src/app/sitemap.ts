/**
 * sitemap.xml generator
 * SEO: Help search engines discover pages
 */

import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Public pages only
  const publicPages = [
    "",
    "/login",
    "/register",
    "/forgot-password",
  ];

  return publicPages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: page === "" ? "daily" : "monthly",
    priority: page === "" ? 1 : 0.8,
  }));
}
