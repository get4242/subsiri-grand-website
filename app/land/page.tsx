import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { CmsLandExplorer } from "@/components/CmsPropertyViews";
import { properties } from "@/data/properties";
export const metadata: Metadata = { title: "ที่ดินพร้อมขายและพร้อมโอน", description: "รวมรายการที่ดินคัดสรรในเขาค้อ เพชรบูรณ์ ปทุมธานี ประจวบคีรีขันธ์ และทำเลอื่น พร้อมรูปภาพ ราคา และรายละเอียดเบื้องต้น", keywords: ["ที่ดินพร้อมขาย", "ที่ดินพร้อมโอน", "ที่ดินเขาค้อ", "ที่ดินปทุมธานี", "ที่ดินประจวบคีรีขันธ์"], alternates: { canonical: "/land" } };
export default function LandPage() { return <><PageHero kicker="LAND COLLECTION" title="ที่ดินที่คัดสรร" description="ค้นหาตามชื่อ ทำเล จังหวัด และสถานะ พร้อมดูรายละเอียดของแต่ละแปลง"/><section className="section listing"><CmsLandExplorer fallback={properties}/><p className="disclaimer">ข้อมูล ราคา และสถานะอาจเปลี่ยนแปลงได้ โปรดตรวจสอบเอกสาร สิทธิในที่ดิน และรายละเอียดล่าสุดกับทีมงานก่อนตัดสินใจ</p></section></>; }
