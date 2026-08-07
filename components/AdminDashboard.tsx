"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AdminPropertiesPanel, type AdminPropertyRow } from "@/components/AdminPropertiesPanel";
import { AdminLeadsPanel, type AdminLead } from "@/components/AdminLeadsPanel";
import { AdminContentManager, type AdminContentRecord } from "@/components/AdminContentManager";
import { AdminContactSettings } from "@/components/AdminContactSettings";
import { AdminCompanySettings } from "@/components/AdminCompanySettings";
import { mergeBySlug } from "@/lib/cms-data";

type AdminTab = "dashboard" | "properties" | "services" | "articles" | "customers" | "promotions" | "settings";
type PropertyRow = AdminPropertyRow;
type ServiceRow = AdminContentRecord;
type ArticleRow = AdminContentRecord;
type IntegrationStatus = { googleSheets: boolean; lineOA: boolean; login: boolean; imageUploads: boolean };

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

export function AdminDashboard({ properties, services, articles }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [notice, setNotice] = useState("");
  const [propertyRows, setPropertyRows] = useState(properties);
  const [dataMode, setDataMode] = useState<"loading" | "connected" | "fallback">("loading");
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [integrations, setIntegrations] = useState<IntegrationStatus>({ googleSheets: false, lineOA: false, login: true, imageUploads: false });
  const available = useMemo(() => propertyRows.filter((item) => item.status !== "sold").length, [propertyRows]);
  const sold = propertyRows.length - available;

  useEffect(() => {
    fetch("/.netlify/functions/admin-properties", { credentials: "same-origin", cache: "no-store" })
      .then(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (!response.ok || !Array.isArray(body.properties)) throw new Error("not connected");
        if (body.properties.length > 0) setPropertyRows((current) => mergeBySlug(current, body.properties));
        setDataMode("connected");
      })
      .catch(() => setDataMode("fallback"));
  }, []);

  useEffect(() => {
    fetch("/.netlify/functions/admin-system-status", { credentials: "same-origin", cache: "no-store" })
      .then(async (response) => { const body = await response.json().catch(() => ({})); if (response.ok && body.integrations) setIntegrations(body.integrations); })
      .catch(() => null);
  }, []);

  useEffect(() => {
    fetch("/.netlify/functions/admin-leads", { credentials: "same-origin", cache: "no-store" })
      .then(async (response) => { const body = await response.json().catch(() => ({})); if (!response.ok || !Array.isArray(body.leads)) throw new Error(); setLeads(body.leads); })
      .catch(() => setLeads([]));
  }, []);

  const uiOnly = (message: string) => {
    setNotice(`${message} — ปุ่มนี้เป็น UI ตัวอย่างและยังไม่บันทึกข้อมูล`);
    window.setTimeout(() => setNotice(""), 3200);
  };

  return <div className="admin-shell">
    <aside className="admin-sidebar">
      <div className="admin-brand"><span>SG</span><div><strong>SUBSIRI</strong><small>ADMIN SYSTEM</small></div></div>
      <nav aria-label="เมนูผู้ดูแลตัวอย่าง">{tabs.map((tab) => <button key={tab.id} type="button" className={activeTab === tab.id ? "is-active" : ""} onClick={() => setActiveTab(tab.id)}><span aria-hidden="true">{tab.icon}</span>{tab.label}</button>)}</nav>
      <Link className="admin-back-link" href="/">← กลับหน้าบ้าน</Link>
    </aside>

    <div className="admin-main">
      <div className="admin-demo-alert" role="status"><strong>{dataMode === "connected" ? "เชื่อมต่อแล้ว" : "โหมดสำรอง"}</strong><span>{dataMode === "loading" ? "— กำลังโหลดข้อมูล Google Sheets" : dataMode === "connected" ? "— เข้าสู่ระบบแล้ว และกำลังใช้ข้อมูลจาก Google Sheets" : "— เข้าสู่ระบบแล้ว แต่ยังใช้ข้อมูลในเว็บไซต์จนกว่าจะตั้งค่า Apps Script"}</span></div>
      <header className="admin-topbar"><div><p>SUBSIRI GRAND GROUP</p><h1>{tabs.find((tab) => tab.id === activeTab)?.label}</h1></div><div className="admin-profile"><span>ผด</span><div><strong>ผู้ดูแลระบบ</strong><small>{dataMode === "connected" ? "ข้อมูลระบบจริง" : "โหมดสำรอง"}</small></div></div></header>

      <main className="admin-content">
        {activeTab === "dashboard" && <>
          <section className="admin-summary" aria-label="ข้อมูลสรุป">
            {[{ label: "ที่ดินพร้อมขาย", value: available, note: `จากทั้งหมด ${propertyRows.length} แปลง` }, { label: "ขายแล้ว", value: sold, note: "สถานะจากข้อมูลปัจจุบัน" }, { label: "ลีดใหม่", value: leads.filter((lead) => !lead.status || lead.status === "ใหม่").length, note: `จากลูกค้าทั้งหมด ${leads.length} ราย` }, { label: "บทความ", value: articles.length, note: "เผยแพร่ในเว็บไซต์" }].map((item) => <article key={item.label}><span>{item.label}</span><strong>{item.value}</strong><small>{item.note}</small></article>)}
          </section>
          <section className="admin-panel"><div className="admin-panel-heading"><div><p>RECENT LEADS</p><h2>ลูกค้าที่ต้องติดตาม</h2></div><button type="button" onClick={() => setActiveTab("customers")}>ดูทั้งหมด</button></div><AdminLeadsPanel leads={leads} compact onChange={setLeads}/></section>
          <div className="admin-dashboard-grid"><section className="admin-panel"><div className="admin-panel-heading"><div><p>PROPERTY STATUS</p><h2>สถานะที่ดิน</h2></div></div><div className="admin-progress"><div><span>พร้อมขาย</span><strong>{available}</strong></div><progress max={Math.max(propertyRows.length, 1)} value={available}/><div><span>ขายแล้ว</span><strong>{sold}</strong></div><progress max={Math.max(propertyRows.length, 1)} value={sold}/></div></section><section className="admin-panel"><div className="admin-panel-heading"><div><p>QUICK ACTIONS</p><h2>เมนูลัด</h2></div></div><div className="admin-quick-actions"><button type="button" onClick={() => { setActiveTab("properties"); uiOnly("เปิดฟอร์มเพิ่มที่ดิน"); }}>＋ เพิ่มที่ดิน</button><button type="button" onClick={() => setActiveTab("articles")}>▤ จัดการบทความ</button><button type="button" onClick={() => setActiveTab("promotions")}>％ ตั้งค่าโปรโมชั่น</button></div></section></div>
        </>}

        {activeTab === "properties" && (
          <AdminPropertiesPanel properties={propertyRows} onChange={setPropertyRows} />
        )}

        {activeTab === "services" && <AdminContentManager kind="services" initial={services}/>}

        {activeTab === "articles" && <AdminContentManager kind="articles" initial={articles}/>}

        {activeTab === "customers" && <section className="admin-panel"><div className="admin-panel-heading"><div><p>LEAD PIPELINE</p><h2>ลูกค้าและการติดตาม</h2></div></div><AdminLeadsPanel leads={leads} onChange={setLeads}/></section>}

        {activeTab === "promotions" && <AdminContentManager kind="promotions" initial={[{ slug: "homepage-popup", title: "ปรึกษาข้อมูลที่ดินเบื้องต้น", description: "แจ้งทำเล ขนาดพื้นที่ และวัตถุประสงค์ ทีมงานพร้อมรับฟัง", eyebrow: "SPECIAL UPDATE", ctaLabel: "ติดต่อทีมงาน", ctaHref: "/contact", enabled: true }]}/>}

        {activeTab === "settings" && <section className="admin-settings-grid"><AdminCompanySettings integrations={integrations}/><AdminContactSettings/></section>}
      </main>
      {notice && <div className="admin-toast" role="status">{notice}</div>}
    </div>
  </div>;
}
