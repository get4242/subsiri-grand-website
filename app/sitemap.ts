import type { MetadataRoute } from "next";
import { articles } from "@/data/articles";
import { properties } from "@/data/properties";

const siteUrl = "https://subsiri.co.th";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "", "/land", "/services", "/services/property", "/services/feng-shui", "/services/ceremonies",
    "/services/horoscope", "/articles", "/about", "/contact",
  ];
  const staticPages = routes.map((route) => ({ url: `${siteUrl}${route}`, changeFrequency: route === "" ? "weekly" as const : "monthly" as const, priority: route === "" ? 1 : 0.8 }));
  const propertyPages = properties.map((property) => ({ url: `${siteUrl}/land/${property.slug}`, changeFrequency: "weekly" as const, priority: 0.9 }));
  const articlePages = articles.map((article) => ({ url: `${siteUrl}/articles/${article.slug}`, changeFrequency: "monthly" as const, priority: 0.7 }));
  return [...staticPages, ...propertyPages, ...articlePages];
}
