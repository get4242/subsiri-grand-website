import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/data/properties";

export function PropertyCard({ property }: { property: Property }) {
  const isSold = property.status === "sold";
  return <article className={`property-card${isSold ? " is-sold" : ""}`}>
    <div className="property-image">
      <Image src={property.image} alt={`ภาพที่ดิน ${property.name}`} fill unoptimized={property.image.startsWith("http")} sizes="(max-width: 620px) 100vw, (max-width: 900px) 50vw, 33vw" />
      <span className={`status${isSold ? " sold-badge" : ""}`}>{isSold ? "SOLD OUT" : property.status}</span>
    </div>
    <div className="property-body">
      <p className="micro">{property.eyebrow}</p><h3>{property.name}</h3><p className="location">⌖ {property.location}</p>
      <div className="property-meta"><span><small>ขนาด</small>{property.area}</span><span><small>ราคา</small>{property.price}</span></div>
      {isSold && <p className="card-sold-note">แปลงนี้ขายแล้ว</p>}
      <Link className="text-link" href={`/land/${property.slug}`}>ดูรายละเอียด <span>→</span></Link>
    </div>
  </article>;
}
