"use client";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import type { Property } from "@/data/properties";
import { mergeBySlug, normalizePublicProperty } from "@/lib/cms-data";
import { usePublicContent } from "@/components/usePublicContent";
import { PropertyCard } from "@/components/PropertyCard";
import { LandExplorer } from "@/components/LandExplorer";
import { PropertyGallery } from "@/components/PropertyGallery";
import { ContactActions } from "@/components/ContactActions";

function useProperties(fallback: Property[]) { const content = usePublicContent(); return useMemo(() => mergeBySlug(fallback, content.properties.map(normalizePublicProperty).filter((item): item is Property => Boolean(item))), [fallback, content.properties]); }
export function CmsPropertyGrid({ fallback }: { fallback: Property[] }) { const properties = useProperties(fallback); return <div className="property-grid">{properties.map((property) => <PropertyCard key={property.slug} property={property}/>)}</div>; }
export function CmsLandExplorer({ fallback }: { fallback: Property[] }) { return <LandExplorer properties={useProperties(fallback)}/>; }
function youtubeId(url: string | null) { if (!url) return null; try { const parsed = new URL(url); return parsed.hostname === "youtu.be" ? parsed.pathname.slice(1) : parsed.searchParams.get("v"); } catch { return null; } }
export function CmsPropertyDetail({ slug, fallback }: { slug: string; fallback: Property[] }) {
  const property = useProperties(fallback).find((item) => item.slug === slug);
  if (!property) return <section className="section empty-state"><h1>ไม่พบข้อมูลที่ดิน</h1><Link href="/land">กลับไปดูที่ดินทั้งหมด</Link></section>;
  const sold = property.status === "sold"; const video = youtubeId(property.youtubeUrl); const cover = property.images[0];
  return <div className={`property-page${sold ? " is-sold" : ""}`}><section className="property-hero"><div className="property-detail-image"><Image src={cover} alt={`ภาพที่ดิน ${property.name}`} fill priority unoptimized={cover.startsWith("http")} sizes="(max-width: 900px) 100vw, 60vw"/><span className={`status${sold ? " sold-badge" : ""}`}>{sold ? "SOLD OUT" : property.status}</span></div><div className="property-title"><Link href="/land">← ที่ดินทั้งหมด</Link><p className="kicker">{property.eyebrow}</p><h1>{property.name}</h1><p>⌖ {property.location}</p></div></section><PropertyGallery images={property.images} propertyName={property.name}/><section className="section detail-grid"><div><p className="kicker">PROPERTY OVERVIEW</p><h2>ภาพรวมของที่ดิน</h2><p className="lead-copy">{property.description}</p><div className="highlight-list">{property.highlights.map((item) => <span key={item}>✓ {item}</span>)}</div><div className="notice"><strong>หมายเหตุสำคัญ</strong><p>ข้อมูล ราคา และสถานะอาจเปลี่ยนแปลงได้ โปรดตรวจสอบรายละเอียดล่าสุดกับทีมงานก่อนตัดสินใจ</p></div></div><aside className="property-facts"><div><small>ขนาดที่ดิน</small><strong>{property.area}</strong></div><div><small>ราคาเสนอ</small><strong>{property.price}</strong></div><div><small>เอกสารสิทธิ์</small><strong>{property.titleDeed}</strong></div><div><small>สถานะ</small><strong>{sold ? "ขายแล้ว" : property.status}</strong></div>{sold ? <div className="sold-message">แปลงนี้ขายแล้ว</div> : <ContactActions variant="card" phoneLabel="สอบถามแปลงนี้"/>}{property.mapUrl ? <a className="outline-link" href={property.mapUrl} target="_blank" rel="noreferrer">เปิด Google Maps ↗</a> : <span className="outline-link disabled-link">รอเพิ่มลิงก์แผนที่</span>}{property.youtubeUrl ? <a className="outline-link" href={property.youtubeUrl} target="_blank" rel="noreferrer">ชมวิดีโอบน YouTube ↗</a> : <span className="outline-link disabled-link">ยังไม่มีวิดีโอสำหรับแปลงนี้</span>}</aside></section>{video && <section className="property-video section"><div className="video-copy"><p className="kicker">PROPERTY VIDEO</p><h2>ชมบรรยากาศของ {property.name}</h2></div><div className="video-frame"><iframe src={`https://www.youtube-nocookie.com/embed/${video}`} title={`วิดีโอที่ดิน ${property.name}`} loading="lazy" allowFullScreen/></div></section>}</div>;
}
