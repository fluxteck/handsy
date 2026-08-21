import type { MetadataRoute } from "next";
import { categorySlugLabels } from "@/db/menuList";

// TODO: replace with the real production domain (or set NEXT_PUBLIC_SITE_URL).
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://your-domain.com";

const staticRoutes = [
  "",
  "/about-us",
  "/b2b",
  "/interior-solutions",
  "/vendor",
  "/contact-us",
  "/faq",
  "/privacy-policy",
  "/terms-conditions",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const categoryRoutes = Object.keys(categorySlugLabels).map((slug) => `/category/${slug}`);

  return [...staticRoutes, ...categoryRoutes].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));
}
