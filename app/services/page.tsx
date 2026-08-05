import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { serviceCatalog } from "@/data/services";
export const metadata: Metadata = { title: "บริการทั้งหมด" };
export default function ServicesPage() { return <><PageHero kicker="OUR SERVICES" title="บริการที่ดูแลอย่างเป็นองค์รวม" description="เลือกดูรายละเอียดบริการด้านที่ดิน ชัยภูมิ พิธีกรรม และโหราศาสตร์ แต่ละงานเริ่มจากการรับฟังและยืนยันขอบเขต"/><section className="section services-landing"><div className="service-landing-grid">{serviceCatalog.map((service) => <Link key={service.href} href={service.href}><article><span>{service.number} · {service.note}</span><h2>{service.title}</h2><p>{service.description}</p><b>ดูรายละเอียด →</b></article></Link>)}</div></section></>; }
