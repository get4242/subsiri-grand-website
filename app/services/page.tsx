import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { CmsServicesLanding } from "@/components/CmsServiceCatalog";
export const metadata: Metadata = { title: "บริการทั้งหมด", description: "บริการซื้อขายและจัดหาที่ดิน ดูฮวงจุ้ย ตั้งศาลและพิธีพราหมณ์ รวมถึงตรวจดวงชะตาไทย–จีน", alternates: { canonical: "/services" } };
export default function ServicesPage() { return <><PageHero kicker="OUR SERVICES" title="บริการที่ดูแลอย่างเป็นองค์รวม" description="เลือกดูรายละเอียดบริการด้านที่ดิน ชัยภูมิ พิธีกรรม และโหราศาสตร์ แต่ละงานเริ่มจากการรับฟังและยืนยันขอบเขต"/><section className="section services-landing"><CmsServicesLanding/></section></>; }
