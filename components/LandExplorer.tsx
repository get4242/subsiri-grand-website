"use client";
import { useMemo, useState } from "react";
import { PropertyCard } from "@/components/PropertyCard";
import type { Property } from "@/data/properties";

export function LandExplorer({ properties }: { properties: Property[] }) {
  const [query, setQuery] = useState(""); const [province, setProvince] = useState("ทั้งหมด"); const [status, setStatus] = useState("ทั้งหมด");
  const provinces = useMemo(() => [...new Set(properties.map((item) => item.province))], [properties]);
  const filtered = useMemo(() => properties.filter((item) => {
    const text = `${item.name} ${item.location} ${item.highlights.join(" ")}`.toLowerCase();
    const matchesQuery = text.includes(query.trim().toLowerCase());
    const matchesProvince = province === "ทั้งหมด" || item.province === province;
    const matchesStatus = status === "ทั้งหมด" || (status === "พร้อมขาย" ? item.status !== "sold" : item.status === "sold");
    return matchesQuery && matchesProvince && matchesStatus;
  }), [properties, query, province, status]);
  return <>
    <div className="land-filters" aria-label="ค้นหาและกรองที่ดิน">
      <label><span>คำค้น</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ชื่อแปลง ทำเล หรือจุดเด่น" /></label>
      <label><span>จังหวัด</span><select value={province} onChange={(event) => setProvince(event.target.value)}><option>ทั้งหมด</option>{provinces.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label><span>สถานะ</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option>ทั้งหมด</option><option>พร้อมขาย</option><option value="sold">ขายแล้ว</option></select></label>
      <button type="button" onClick={() => { setQuery(""); setProvince("ทั้งหมด"); setStatus("ทั้งหมด"); }}>ล้างตัวกรอง</button>
    </div>
    <div className="listing-bar"><span>พบ {filtered.length} รายการ</span><span>กรองจากข้อมูลที่ดินปัจจุบัน</span></div>
    {filtered.length > 0 ? <div className="property-grid">{filtered.map((property) => <PropertyCard key={property.slug} property={property} />)}</div> : <div className="empty-state"><h3>ไม่พบที่ดินที่ตรงกับตัวกรอง</h3><p>ลองเปลี่ยนคำค้น จังหวัด หรือสถานะ</p></div>}
  </>;
}
