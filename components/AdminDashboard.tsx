"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AdminPropertiesPanel, type AdminPropertyRow } from "@/components/AdminPropertiesPanel";

type AdminTab = "dashboard" | "properties" | "services" | "articles" | "customers" | "promotions" | "settings";
type PropertyRow = AdminPropertyRow;
type ServiceRow = { number: string; title: string; note: string };
type ArticleRow = { slug: string; title: string; category: string; publishedAt: string };

type AdminDashboardProps = {
  properties: PropertyRow[];
  services: ServiceRow[];
  articles: ArticleRow[];
};

const tabs: { id: AdminTab; label: string; icon: string }[] = [
  { id: "dashboard", label: "ภาพรวม", icon: "⌂" },
  { id: "properties", label: "ที่ดิน", icon: "◇" },
  { id: "services", label: "บริการ", icon: "✦" },
  { id: "articles", label: "บทความ", icon: "▤" },
  { id: "customers", label: "ลูกค้า", icon: "◎" },
  { id: "promotions", label: "โปรโมชั่น", icon: "％" },
  { id: "settings", label: "ตั้งค่า", icon: "⚙" },
];

const mockCustomers = [
  { name: "คุณพิมพ์ชนก", interest: "ที่ดินสามร้อยยอด", phone: "090-xxx-2481", status: "ติดต่อใหม่", date: "วันนี้ 10:24" },
  { name: "คุณวรเมธ", interest: "ดูฮวงจุ้ยโครงการ", phone: "081-xxx-9570", status: "กำลังติดตาม", date: "เมื่อวาน 16:40" },
  { name: "คุณสุภาวดี", interest: "ตั้งศาลพระภูมิ", phone: "089-xxx-4302", status: "นัดหมายแล้ว", date: "4 ส.ค. 2569" },
  { name: "คุณกิตติ", interest: "ที่ดินรามอินทรา 58", phone: "086-xxx-7128", status: "รอข้อมูลเพิ่ม", date: "3 ส.ค. 2569" },
];

function StatusPill({ status }: { status: string }) {
  const tone = status === "sold" ? "muted" : status === "ติดต่อใหม่" ? "new" : status === "นัดหมายแล้ว" ? "success" : "progress";
  return <span className={`admin-status is-${tone}`}>{status === "sold" ? "ขายแล้ว" : status}</span>;
}

export function AdminDashboard({ properties, services, articles }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [notice, setNotice] = useState("");
  const [propertyRows, setPropertyRows] = useState(properties);
  const [dataMode, setDataMode] = useState<"loading" | "connected" | "fallback">("loading");
  const available = useMemo(() => propertyRows.filter((item) => item.status !== "sold").length, [propertyRows]);
  const sold = propertyRows.length - available;

  useEffect(() => {
    fetch("/.netlify/functions/admin-properties", { credentials: "same-origin", cache: "no-store" })
      .then(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (!response.ok || !Array.isArray(body.properties)) throw new Error("not connected");
        if (body.properties.length > 0) setPropertyRows(body.properties);
        setDataMode("connected");
      })
      .catch(() => setDataMode("fallback"));
  }, []);

  const uiOnly = (message: string) => {
    setNotice(`${message} — ปุ่มนี้เป็น UI ตัวอย่างและยังไม่บันทึกข้อมูล`);
    window.setTimeout(() => setNotice(""), 3200);
  };

  return <div className="admin-shell">
    <aside className="admin-sidebar">
      <div className="admin-brand"><span>SG</span><div><strong>SUBSIRI</strong><small>ADMIN PREVIEW</small></div></div>
      <nav aria-label="เมนูผู้ดูแลตัวอย่าง">{tabs.map((tab) => <button key={tab.id} type="button" className={activeTab === tab.id ? "is-active" : ""} onClick={() => setActiveTab(tab.id)}><span aria-hidden="true">{tab.icon}</span>{tab.label}</button>)}</nav>
      <Link className="admin-back-link" href="/">← กลับหน้าบ้าน</Link>
    </aside>

    <div className="admin-main">
      <div className="admin-demo-alert" role="status"><strong>{dataMode === "connected" ? "เชื่อมต่อแล้ว" : "โหมดสำรอง"}</strong><span>{dataMode === "loading" ? "— กำลังโหลดข้อมูล Google Sheets" : dataMode === "connected" ? "— เข้าสู่ระบบแล้ว และกำลังใช้ข้อมูลจาก Google Sheets" : "— เข้าสู่ระบบแล้ว แต่ยังใช้ข้อมูลในเว็บไซต์จนกว่าจะตั้งค่า Apps Script"}</span></div>
      <header className="admin-topbar"><div><p>SUBSIRI GRAND GROUP</p><h1>{tabs.find((tab) => tab.id === activeTab)?.label}</h1></div><div className="admin-profile"><span>ผด</span><div><strong>ผู้ดูแลระบบ</strong><small>ข้อมูลจำลอง</small></div></div></header>

      <main className="admin-content">
        {activeTab === "dashboard" && <>
          <section className="admin-summary" aria-label="ข้อมูลสรุป">
            {[{ label: "ที่ดินพร้อมขาย", value: available, note: `จากทั้งหมด ${propertyRows.length} แปลง` }, { label: "ขายแล้ว", value: sold, note: "สถานะจากข้อมูลปัจจุบัน" }, { label: "ลีดใหม่", value: 7, note: "รอติดต่อกลับ 3 ราย" }, { label: "บทความ", value: articles.length, note: "เผยแพร่ในเว็บไซต์" }].map((item) => <article key={item.label}><span>{item.label}</span><strong>{item.value}</strong><small>{item.note}</small></article>)}
          </section>
          <section className="admin-panel"><div className="admin-panel-heading"><div><p>RECENT LEADS</p><h2>ลูกค้าที่ต้องติดตาม</h2></div><button type="button" onClick={() => setActiveTab("customers")}>ดูทั้งหมด</button></div><CustomerTable /></section>
          <div className="admin-dashboard-grid"><section className="admin-panel"><div className="admin-panel-heading"><div><p>PROPERTY STATUS</p><h2>สถานะที่ดิน</h2></div></div><div className="admin-progress"><div><span>พร้อมขาย</span><strong>{available}</strong></div><progress max={Math.max(propertyRows.length, 1)} value={available}/><div><span>ขายแล้ว</span><strong>{sold}</strong></div><progress max={Math.max(propertyRows.length, 1)} value={sold}/></div></section><section className="admin-panel"><div className="admin-panel-heading"><div><p>QUICK ACTIONS</p><h2>เมนูลัด</h2></div></div><div className="admin-quick-actions"><button type="button" onClick={() => { setActiveTab("properties"); uiOnly("เปิดฟอร์มเพิ่มที่ดิน"); }}>＋ เพิ่มที่ดิน</button><button type="button" onClick={() => setActiveTab("articles")}>▤ จัดการบทความ</button><button type="button" onClick={() => setActiveTab("promotions")}>％ ตั้งค่าโปรโมชั่น</button></div></section></div>
        </>}

        {activeTab === "properties" && (
          <AdminPropertiesPanel properties={propertyRows} onChange={setPropertyRows} />
        )}

        {activeTab === "services" && <section className="admin-panel"><div className="admin-panel-heading"><div><p>SERVICES</p><h2>บริการของบริษัท</h2></div></div><div className="admin-card-list">{services.map((service) => <article key={service.number}><span>{service.number}</span><div><h3>{service.title}</h3><p>{service.note}</p></div><button type="button" onClick={() => uiOnly(`แก้ไขบริการ ${service.title}`)}>แก้ไข</button></article>)}</div></section>}

        {activeTab === "articles" && <section className="admin-panel"><div className="admin-panel-heading"><div><p>CONTENT</p><h2>บทความ</h2></div><button className="is-primary" type="button" onClick={() => uiOnly("สร้างบทความใหม่")}>＋ เขียนบทความ</button></div><div className="admin-table-wrap"><table><thead><tr><th>หัวข้อ</th><th>หมวดหมู่</th><th>สถานะ</th><th>จัดการ</th></tr></thead><tbody>{articles.map((article) => <tr key={article.slug}><td><strong>{article.title}</strong><small>/{article.slug}</small></td><td>{article.category}</td><td><StatusPill status="เผยแพร่แล้ว"/></td><td><button className="admin-text-button" type="button" onClick={() => uiOnly(`แก้ไขบทความ ${article.title}`)}>แก้ไข</button></td></tr>)}</tbody></table></div></section>}

        {activeTab === "customers" && <section className="admin-panel"><div className="admin-panel-heading"><div><p>LEAD PIPELINE</p><h2>ลูกค้าและการติดตาม</h2></div><button type="button" onClick={() => uiOnly("ส่งออกรายชื่อลูกค้า")}>ส่งออก</button></div><CustomerTable actions onAction={uiOnly}/></section>}

        {activeTab === "promotions" && <section className="admin-panel"><div className="admin-panel-heading"><div><p>PROMOTIONS</p><h2>โปรโมชั่นบนเว็บไซต์</h2></div><button className="is-primary" type="button" onClick={() => uiOnly("สร้างโปรโมชั่น")}>＋ สร้างโปรโมชั่น</button></div><div className="admin-empty-card"><span>％</span><h3>โปรโมชันปรึกษาข้อมูลที่ดินเบื้องต้น</h3><p>ตัวอย่าง popup ที่แสดงอยู่บนหน้าบ้าน ปัจจุบันเป็นข้อมูลจาก config ในโค้ด</p><StatusPill status="เปิดใช้งาน"/><button type="button" onClick={() => uiOnly("แก้ไขโปรโมชั่น")}>แก้ไขตัวอย่าง</button></div></section>}

        {activeTab === "settings" && <section className="admin-settings-grid"><article className="admin-panel"><p>COMPANY PROFILE</p><h2>ข้อมูลบริษัท</h2><label>ชื่อบริษัท<input value="บริษัท ทรัพย์สิริ แกรนด์ กรุ๊ป จำกัด" readOnly/></label><label>เบอร์โทร<input value="090-249-1459" readOnly/></label><label>อีเมล<input value="contact@subsiri.co.th" readOnly/></label><button type="button" onClick={() => uiOnly("บันทึกข้อมูลบริษัท")}>บันทึกตัวอย่าง</button></article><article className="admin-panel"><p>INTEGRATIONS</p><h2>การเชื่อมต่อ</h2><div className="admin-integration"><span>Google Sheets</span><StatusPill status="ยังไม่เชื่อมต่อ"/></div><div className="admin-integration"><span>LINE OA</span><StatusPill status="ยังไม่เชื่อมต่อ"/></div><div className="admin-integration"><span>ระบบเข้าสู่ระบบ</span><StatusPill status="ยังไม่ติดตั้ง"/></div></article></section>}
      </main>
      {notice && <div className="admin-toast" role="status">{notice}</div>}
    </div>
  </div>;
}

function CustomerTable({ actions = false, onAction = () => {} }: { actions?: boolean; onAction?: (message: string) => void }) {
  return <div className="admin-table-wrap"><table><thead><tr><th>ลูกค้า</th><th>สนใจ</th><th>โทรศัพท์</th><th>สถานะติดตาม</th><th>อัปเดต</th>{actions && <th>จัดการ</th>}</tr></thead><tbody>{mockCustomers.map((customer) => <tr key={customer.phone}><td><strong>{customer.name}</strong></td><td>{customer.interest}</td><td>{customer.phone}</td><td><StatusPill status={customer.status}/></td><td>{customer.date}</td>{actions && <td><button className="admin-text-button" type="button" onClick={() => onAction(`อัปเดตการติดตาม ${customer.name}`)}>อัปเดต</button></td>}</tr>)}</tbody></table></div>;
}
