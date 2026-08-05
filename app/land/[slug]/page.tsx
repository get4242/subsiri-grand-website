import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProperty, properties } from "@/data/properties";
import { PropertyGallery } from "@/components/PropertyGallery";
import { ContactActions } from "@/components/ContactActions";

function getYoutubeId(url: string | null) {
  if (!url) return null;
  const parsed = new URL(url);
  return parsed.hostname === "youtu.be"
    ? parsed.pathname.slice(1) || null
    : parsed.searchParams.get("v");
}

export function generateStaticParams() { return properties.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const property = getProperty((await params).slug);
  return { title: property?.name ?? "ไม่พบที่ดิน" };
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const property = getProperty((await params).slug);
  if (!property) notFound();
  const isSold = property.status === "sold";
  const youtubeId = getYoutubeId(property.youtubeUrl);
  return <div className={`property-page${isSold ? " is-sold" : ""}`}>
    <section className="property-hero">
      <div className="property-detail-image">
        <Image src={property.images[0]} alt={`ภาพที่ดิน ${property.name}`} fill priority sizes="(max-width: 900px) 100vw, 60vw" />
        <span className={`status${isSold ? " sold-badge" : ""}`}>{isSold ? "SOLD OUT" : property.status}</span>
        <span className="image-note">ภาพตัวอย่าง</span>
      </div>
      <div className="property-title"><Link href="/land">← ที่ดินทั้งหมด</Link><p className="kicker">{property.eyebrow}</p><h1>{property.name}</h1><p>⌖ {property.location}</p></div>
    </section>
    <PropertyGallery images={property.images} propertyName={property.name} />
    <section className="section detail-grid">
      <div><p className="kicker">PROPERTY OVERVIEW</p><h2>ภาพรวมของที่ดิน</h2><p className="lead-copy">{property.description}</p><div className="highlight-list">{property.highlights.map((item) => <span key={item}>✓ {item}</span>)}</div><div className="notice"><strong>หมายเหตุสำคัญ</strong><p>ข้อมูล ราคา และสถานะอาจเปลี่ยนแปลงได้ โปรดตรวจสอบเอกสารสิทธิ์ ขอบเขตที่ดิน และรายละเอียดล่าสุดกับทีมงานก่อนตัดสินใจ</p></div></div>
      <aside className="property-facts">
        <div><small>ขนาดที่ดิน</small><strong>{property.area}</strong></div><div><small>ราคาเสนอ</small><strong>{property.price}</strong></div><div><small>เอกสารสิทธิ์</small><strong>{property.titleDeed}</strong></div><div><small>สถานะ</small><strong>{isSold ? "ขายแล้ว" : property.status}</strong></div>
        {isSold ? <div className="sold-message" role="status">แปลงนี้ขายแล้ว</div> : <ContactActions variant="card" phoneLabel="สอบถามแปลงนี้"/>}
        {property.mapUrl ? <a className="outline-link" href={property.mapUrl} target="_blank" rel="noreferrer">เปิด Google Maps ↗</a> : <span className="outline-link disabled-link" aria-disabled="true">รอเพิ่มลิงก์แผนที่</span>}
        {property.youtubeUrl ? <a className="outline-link" href={property.youtubeUrl} target="_blank" rel="noreferrer">ชมวิดีโอบน YouTube ↗</a> : <span className="outline-link disabled-link" aria-disabled="true">ยังไม่มีวิดีโอสำหรับแปลงนี้</span>}
      </aside>
    </section>
    {youtubeId && property.youtubeUrl && <section className="property-video section" aria-labelledby="property-video-title"><div className="video-copy"><p className="kicker">PROPERTY VIDEO</p><h2 id="property-video-title">ชมบรรยากาศของ {property.name}</h2><p>วิดีโอจากรายการ YouTube ที่ลูกค้าให้ไว้ ไม่มีการเล่นอัตโนมัติ</p></div><div className="video-frame"><iframe src={`https://www.youtube-nocookie.com/embed/${youtubeId}`} title={`วิดีโอที่ดิน ${property.name}`} loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div><a className="text-link" href={property.youtubeUrl} target="_blank" rel="noreferrer">เปิดวิดีโอบน YouTube ↗</a></section>}
  </div>;
}
