import type { Metadata } from "next";
import { AdminDashboard } from "@/components/AdminDashboard";
import { articles } from "@/data/articles";
import { properties } from "@/data/properties";
import { serviceCatalog } from "@/data/services";

export const metadata: Metadata = {
  title: "Admin Preview",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminDashboard
    properties={properties.map(({ slug, name, location, area, price, status }) => ({ slug, name, location, area, price, status }))}
    services={serviceCatalog.map(({ number, title, note }) => ({ number, title, note }))}
    articles={articles.map(({ slug, title, category, publishedAt }) => ({ slug, title, category, publishedAt }))}
  />;
}
