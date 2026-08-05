import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { contactConfig } from "@/config/contact";
import { ContactActions } from "@/components/ContactActions";
export const metadata: Metadata = { title: "ติดต่อเรา" };
export default function ContactPage() { return <><PageHero kicker="CONTACT US" title="เริ่มต้นบทสนทนากับเรา" description="แจ้งบริการที่สนใจหรือข้อมูลเบื้องต้น ทีมงานพร้อมรับฟังและประสานงานในเวลาทำการ"/><section className="section contact-grid"><div className="contact-card"><p className="kicker">DIRECT CONTACT</p><h2>ช่องทางติดต่อ</h2><ContactActions variant="card" phoneLabel={contactConfig.phone.display}/><a href={contactConfig.email.href}><span className="contact-icon" aria-hidden="true">✉</span><small>อีเมล</small><strong>{contactConfig.email.display}</strong></a><div><small>เวลาทำการ</small><strong>{contactConfig.hours}</strong></div></div><div><p className="kicker">CONTACT FORM</p><h2>ฝากข้อมูลเบื้องต้น</h2><ContactForm/></div></section></>; }
