import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { contactConfig } from "@/config/contact";
import { ContactActions } from "@/components/ContactActions";
import { ContactEmail } from "@/components/ContactEmail";
export const metadata: Metadata = { title: "ติดต่อเรา", description: "ติดต่อบริษัท ทรัพย์สิริ แกรนด์ กรุ๊ป จำกัด โทร 090-249-1459 หรือ LINE Official Account @subsiri", alternates: { canonical: "/contact" } };
export default function ContactPage() { return <><PageHero kicker="CONTACT US" title="เริ่มต้นบทสนทนากับเรา" description="แจ้งบริการที่สนใจหรือข้อมูลเบื้องต้น ทีมงานพร้อมรับฟังและประสานงานในเวลาทำการ"/><section className="section contact-grid"><div className="contact-card contact-info-panel"><p className="kicker">DIRECT CONTACT</p><h2>ช่องทางติดต่อ</h2><ContactActions variant="card"/><ContactEmail detailed/><div><small>เวลาทำการ</small><strong>{contactConfig.hours}</strong></div></div><div className="contact-form-panel"><p className="kicker">CONTACT FORM</p><h2>ฝากข้อมูลเบื้องต้น</h2><ContactForm/></div></section></>; }
