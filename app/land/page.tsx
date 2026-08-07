import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { CmsLandExplorer } from "@/components/CmsPropertyViews";
import { properties } from "@/data/properties";
export const metadata: Metadata = { title: "ที่ดินทั้งหมด" };
export default function LandPage() { return <><PageHero kicker="LAND COLLECTION" title="ที่ดินที่คัดสรร" description="ค้นหาตามชื่อ ทำเล จังหวัด และสถานะ พร้อมดูรายละเอียดของแต่ละแปลง"/><section className="section listing"><CmsLandExplorer fallback={properties}/><p className="disclaimer">ข้อมูล ราคา และสถานะอาจเปลี่ยนแปลงได้ โปรดตรวจสอบเอกสาร สิทธิในที่ดิน และรายละเอียดล่าสุดกับทีมงานก่อนตัดสินใจ</p></section></>; }
