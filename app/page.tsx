import Image from "next/image";
import Link from "next/link";
import { CmsPropertyGrid } from "@/components/CmsPropertyViews";
import { properties } from "@/data/properties";
import { homeHeroAsset } from "@/config/assets";
import { HeroWireMesh } from "@/components/HeroWireMesh";
import { ContactActions } from "@/components/ContactActions";
import { CmsHomeServices } from "@/components/CmsServiceCatalog";
import { CmsHomeArticles } from "@/components/CmsArticleViews";

type BenefitIconName = "map-pin" | "mountain" | "compass" | "landmark";

function BenefitIcon({ name }: { name: BenefitIconName }) {
  const paths: Record<BenefitIconName, React.ReactNode> = {
    "map-pin": <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    mountain: <><path d="m3 20 7-12 4 7 2-3 5 8Z"/><path d="m8.6 10.4 2.2 1.8 1.6-1.4"/></>,
    compass: <><circle cx="12" cy="12" r="9"/><path d="m15.7 8.3-2.1 5.3-5.3 2.1 2.1-5.3Z"/><circle cx="12" cy="12" r="1"/></>,
    landmark: <><path d="M3 9h18L12 3 3 9Z"/><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18M2 18h20"/></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths[name]}</svg>;
}

export default function Home() {
  return <>
    <section className="lux-hero">
      <div className="hero-photo"><Image src={homeHeroAsset.src} alt={homeHeroAsset.alt} fill priority sizes="100vw" data-temporary-ai-visual={homeHeroAsset.temporary} /></div>
      <div className="hero-shade"></div>
      <div className="plot-pin" aria-hidden="true"><i></i></div>
      <HeroWireMesh />
      <div className="lux-hero-content"><p className="kicker">SUBSIRI GRAND GROUP</p><h1>คุณค่าของผืนดิน<br/><em>เริ่มจากความเข้าใจ</em></h1><p>ดูแลทุกมิติของที่ดิน ชัยภูมิ และพิธีสำคัญ ด้วยข้อมูลที่ชัดเจน ความละเอียดรอบคอบ และความเคารพในศาสตร์ดั้งเดิม</p><div className="hero-actions"><Link className="button gold" href="/land">ชมที่ดินแนะนำ</Link><Link className="button ghost" href="/contact">ปรึกษาทีมงาน</Link></div><ContactActions variant="compact" phoneLabel="โทรหาเรา"/></div>
      <aside className="hero-benefits" aria-label="จุดเด่นของบริการ"><p className="kicker">OUR EXPERTISE</p><div><span><BenefitIcon name="map-pin"/></span><strong>ทำเลดี เดินทางสะดวก</strong></div><div><span><BenefitIcon name="mountain"/></span><strong>ที่ดินคัดสรรคุณภาพ</strong></div><div><span><BenefitIcon name="compass"/></span><strong>ฮวงจุ้ยเสริมพลัง</strong></div><div><span><BenefitIcon name="landmark"/></span><strong>ติดตั้งศาลพระภูมิ</strong></div></aside>
      <div className="hero-scroll">เลื่อนลงเพื่อสำรวจ <span>↓</span></div>
    </section>

    <section className="lux-intro section"><div className="intro-monogram">S</div><div><p className="kicker">OUR PHILOSOPHY</p><h2>ผืนดินที่ดี<br/>เริ่มจากการมองให้รอบด้าน</h2></div><div><p>เราเชื่อว่าที่ดินทุกผืนมีทั้งคุณค่า โอกาส และบริบทที่ต่างกัน การตัดสินใจจึงควรเริ่มจากการรับฟัง สำรวจ และตรวจสอบข้อมูลที่เกี่ยวข้องอย่างละเอียด</p><Link className="text-link" href="/about">รู้จักทรัพย์สิริ แกรนด์ กรุ๊ป <span>→</span></Link></div></section>

    <section className="lux-services section">
      <div className="gold-flow section-flow" aria-hidden="true"><i></i><i></i><i></i></div>
      <div className="section-heading centered"><p className="kicker">OUR SERVICES</p><h2>บริการที่ดูแลอย่างเป็นองค์รวม</h2><p>จากการค้นหาผืนดิน ไปจนถึงการวางรากฐานเพื่อความสบายใจในช่วงเวลาสำคัญ</p></div>
      <CmsHomeServices/>
      <div className="center-action"><Link className="button gold" href="/services">ดูบริการทั้งหมด</Link></div>
    </section>

    <section className="featured-land section"><div className="section-heading split"><div><p className="kicker">SELECTED LAND</p><h2>ที่ดินแนะนำ</h2><p>ข้อมูลจริงจากรายการปัจจุบัน พร้อมรายละเอียดและวิดีโอของแต่ละแปลง</p></div><Link className="text-link" href="/land">ค้นหาที่ดินทั้งหมด <span>→</span></Link></div><CmsPropertyGrid fallback={properties}/><p className="disclaimer">ข้อมูล ราคา และสถานะอาจเปลี่ยนแปลงได้ โปรดตรวจสอบรายละเอียดล่าสุดกับทีมงานก่อนตัดสินใจ</p></section>

    <section className="lux-promo"><div className="promo-image"><Image src="/land/paradise.jpg" alt="ภาพมุมสูงที่ดิน Paradise" fill sizes="(max-width: 900px) 100vw, 50vw" /></div><div className="promo-copy"><p className="kicker">PERSONAL CONSULTATION</p><h2>เริ่มต้นจาก<br/><em>บทสนทนาที่เข้าใจคุณ</em></h2><p>แจ้งทำเล ขนาดพื้นที่ และสิ่งที่คุณกำลังมองหา ทีมงานพร้อมรับฟังและช่วยจัดลำดับข้อมูลเบื้องต้น</p><Link className="button gold" href="/contact">นัดหมายพูดคุย</Link></div></section>

    <section className="article-strip section"><div className="section-heading split"><div><p className="kicker">KNOWLEDGE & STORIES</p><h2>เรื่องราวน่ารู้</h2></div><Link className="text-link" href="/articles">อ่านทั้งหมด <span>→</span></Link></div><CmsHomeArticles/></section>

    <section className="contact-cta"><div className="gold-flow cta-flow" aria-hidden="true"><i></i><i></i><i></i></div><p className="kicker">BEGIN A CONVERSATION</p><h2>ให้เราเริ่มต้นจากการรับฟัง</h2><p>ไม่ว่าคุณกำลังมองหาที่ดิน ต้องการคำปรึกษาเรื่องชัยภูมิ หรือเตรียมพิธีสำคัญ ทีมงานพร้อมให้ข้อมูลเบื้องต้น</p><ContactActions variant="hero" phoneLabel="โทร 090-249-1459"/><Link className="text-link contact-page-link" href="/contact">ดูข้อมูลติดต่อทั้งหมด →</Link></section>
  </>;
}
