import type { Metadata } from "next";
import { getProperty, properties } from "@/data/properties";
import { CmsPropertyDetail } from "@/components/CmsPropertyViews";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const property = getProperty((await params).slug);
  if (!property) return { title: "รายละเอียดที่ดิน" };
  const description = `${property.name} ${property.area} ${property.price} ${property.location} — ตรวจสอบรายละเอียด รูปภาพ และสถานะล่าสุดกับทีมงานทรัพย์สิริ`;
  return {
    title: `${property.name} | ที่ดิน${property.province}`,
    description,
    keywords: [property.name, `ที่ดิน${property.province}`, property.location, property.area, "ซื้อที่ดิน", "ทรัพย์สิริ"],
    alternates: { canonical: `/land/${property.slug}` },
    openGraph: { type: "website", url: `/land/${property.slug}`, title: property.name, description, images: [{ url: property.image, alt: `ภาพที่ดิน ${property.name}` }] },
  };
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  return <CmsPropertyDetail slug={(await params).slug} fallback={properties}/>;
}
