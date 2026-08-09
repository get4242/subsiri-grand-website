import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { CmsArticlesListing } from "@/components/CmsArticleViews";
export const metadata: Metadata = { title: "บทความที่ดิน ฮวงจุ้ย และพิธีกรรม", description: "บทความและความรู้เบื้องต้นเกี่ยวกับการเลือกซื้อที่ดิน ฮวงจุ้ย การตั้งศาล และพิธีพราหมณ์", alternates: { canonical: "/articles" } };
export default function ArticlesPage() { return <><PageHero kicker="KNOWLEDGE & STORIES" title="เรื่องราวและความรู้" description="บทความเกี่ยวกับที่ดิน ชัยภูมิ และการเตรียมพิธี เพื่อเป็นข้อมูลเบื้องต้นก่อนพูดคุยกับผู้เชี่ยวชาญ"/><section className="section articles-listing"><CmsArticlesListing/><p className="disclaimer">บทความเป็นข้อมูลทั่วไป ไม่ใช่คำรับรองหรือคำปรึกษาเฉพาะทาง</p></section></>; }
