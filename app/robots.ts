import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/.netlify/"] },
    sitemap: "https://subsiri.co.th/sitemap.xml",
    host: "https://subsiri.co.th",
  };
}
