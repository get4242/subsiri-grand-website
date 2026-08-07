import type { Metadata } from "next";
import { getProperty, properties } from "@/data/properties";
import { CmsPropertyDetail } from "@/components/CmsPropertyViews";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const property = getProperty((await params).slug);
  return { title: property?.name ?? "รายละเอียดที่ดิน" };
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  return <CmsPropertyDetail slug={(await params).slug} fallback={properties}/>;
}
