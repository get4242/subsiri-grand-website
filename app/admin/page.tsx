import type { Metadata } from "next";
import { AdminDashboard } from "@/components/AdminDashboard";
import { AdminPortal } from "@/components/AdminPortal";
import { articles } from "@/data/articles";
import { properties } from "@/data/properties";
import { serviceCatalog } from "@/data/services";

export const metadata: Metadata = {
  title: "Admin Preview",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminPortal><AdminDashboard
    properties={properties}
    services={serviceCatalog.map((service) => ({ ...service, slug: service.href.split("/").pop() || service.number, enabled: true }))}
    articles={articles.map((article) => ({ ...article, description: article.excerpt, enabled: true }))}
  /></AdminPortal>;
}
