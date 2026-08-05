import Image from "next/image";
import Link from "next/link";
import { ContactActions } from "@/components/ContactActions";
import { CeremonyGallery } from "@/components/CeremonyGallery";

type ServiceDetailProps = {
  kicker: string;
  title: string;
  description: string;
  scopeTitle: string;
  scope: { title: string; description: string }[];
  steps: { title: string; description: string }[];
  price: string;
  priceNote: string;
  disclaimer: string;
  heroImage?: string;
  heroImageAlt?: string;
  galleryImages?: string[];
  stepImages?: string[];
  additionalImages?: string[];
};

export function ServiceDetail({ kicker, title, description, scopeTitle, scope, steps, price, priceNote, disclaimer, heroImage, heroImageAlt, galleryImages, stepImages, additionalImages }: ServiceDetailProps) {
  return <>
    <section className="service-hero">
      <div className="service-hero-content">
        <p className="kicker">{kicker}</p>
        <h1>{title}</h1>
        <p>{description}</p>
        <ContactActions variant="hero" phoneLabel="โทรปรึกษาทีมงาน" className="service-contact-actions"/>
      </div>
      {heroImage ? <div className="service-hero-photo"><Image src={heroImage} alt={heroImageAlt ?? "ภาพผลงานบริการ"} fill priority sizes="(max-width: 900px) 100vw, 42vw" /><span>ผลงานจากสถานที่จริง</span></div> : <div className="service-symbol" aria-hidden="true"><span></span><b>สิริ</b></div>}
    </section>
    {galleryImages && <CeremonyGallery images={galleryImages} />}
    <section className="section service-scope">
      <div className="section-heading centered"><p className="kicker">SCOPE OF SERVICE</p><h2>{scopeTitle}</h2></div>
      <div className="scope-grid">{scope.map((item, index) => <article key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>
    </section>
    <section className="section service-process dark-section">
      <div className="process-heading"><p className="kicker">OUR PROCESS</p><h2>ขั้นตอนการให้บริการ</h2><p>เริ่มจากการรับฟังและยืนยันขอบเขตก่อนดำเนินงาน เพื่อให้ข้อมูลและการเตรียมการเหมาะกับแต่ละสถานที่</p></div>
      <ol className={stepImages ? "has-step-images" : undefined}>{steps.map((step, index) => <li key={step.title}>{stepImages?.[index] && <div className="process-step-image"><Image src={stepImages[index]} alt={`ภาพประกอบขั้นตอน ${step.title}`} fill sizes="(max-width: 900px) 100vw, 35vw" /></div>}<span>{String(index + 1).padStart(2, "0")}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></li>)}</ol>
    </section>
    <section className="section service-price">
      <div><p className="kicker">STARTING PRICE</p><h2>{price}</h2><p>{priceNote}</p></div>
      <aside><strong>ข้อมูลก่อนนัดหมาย</strong><p>{disclaimer}</p><p>ศาสตร์และพิธีกรรมเป็นเรื่องของความเชื่อส่วนบุคคล บริการนี้ไม่ใช่การรับรองผลลัพธ์ และไม่ทดแทนคำแนะนำด้านกฎหมาย วิศวกรรม หรือวิชาชีพที่เกี่ยวข้อง</p></aside>
    </section>
    {additionalImages && <section className="section ceremony-more" aria-labelledby="ceremony-more-title"><div className="section-heading centered"><p className="kicker">MORE WORKS</p><h2 id="ceremony-more-title">รายละเอียดจากผลงานเพิ่มเติม</h2></div><div className="ceremony-more-grid">{additionalImages.map((src, index) => <figure key={src}><Image src={src} alt={`รายละเอียดการจัดเตรียมพิธี ภาพที่ ${index + 1}`} fill sizes="(max-width: 620px) 100vw, 33vw" /></figure>)}</div></section>}
    <section className="contact-cta"><p className="kicker">BEGIN A CONVERSATION</p><h2>ปรึกษารายละเอียดกับทีมงาน</h2><p>แจ้งประเภทสถานที่ ทำเล ขนาดพื้นที่โดยประมาณ และช่วงเวลาที่สะดวก เพื่อให้ทีมงานประเมินขอบเขตเบื้องต้น</p><ContactActions variant="hero" phoneLabel="โทร 090-249-1459"/><a className="text-link contact-email-link" href="mailto:contact@subsiri.co.th">contact@subsiri.co.th</a><Link className="back-link" href="/">← กลับหน้าแรก</Link></section>
  </>;
}
