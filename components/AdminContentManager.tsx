"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { mergeBySlug } from "@/lib/cms-data";

export type AdminContentKind = "services" | "articles" | "promotions";
export type AdminContentRecord = {
  slug: string; title: string; description?: string; enabled?: boolean; number?: string; note?: string; href?: string;
  image?: string; imageAlt?: string; scopeTitle?: string; scope?: { title: string; description: string }[];
  steps?: { title: string; description: string }[]; price?: string; priceNote?: string; disclaimer?: string;
  category?: string; excerpt?: string; publishedAt?: string; readingTime?: string; coverImage?: string; coverImageAlt?: string;
  paragraphs?: string[]; eyebrow?: string; ctaLabel?: string; ctaHref?: string;
};

const labels = { services: { title: "บริการของบริษัท", add: "เพิ่มบริการ" }, articles: { title: "บทความ", add: "เขียนบทความ" }, promotions: { title: "โปรโมชั่นบนเว็บไซต์", add: "สร้างโปรโมชั่น" } };
const toLines = (items?: { title: string; description: string }[]) => items?.map((item) => `${item.title} | ${item.description}`).join("\n") ?? "";
const parseLines = (value: string) => value.split("\n").map((line) => { const [title, ...rest] = line.split("|"); return { title: title.trim(), description: rest.join("|").trim() }; }).filter((item) => item.title);
const automaticSlug = (title: string, kind: AdminContentKind) => {
  const latin = title.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
  return latin || `${kind === "services" ? "service" : kind === "articles" ? "article" : "promotion"}-${Date.now()}`;
};

type UploadPreview = {
  name: string;
  preview: string;
  status: "uploading" | "success" | "error";
  detail: string;
};

export function AdminContentManager({ kind, initial }: { kind: AdminContentKind; initial: AdminContentRecord[] }) {
  const [records, setRecords] = useState(initial); const [editing, setEditing] = useState<AdminContentRecord | null>(null);
  const [saving, setSaving] = useState(false); const [message, setMessage] = useState("");
  const [uploadPreview, setUploadPreview] = useState<UploadPreview | null>(null);
  useEffect(() => { fetch(`/.netlify/functions/admin-content?kind=${kind}`, { credentials: "same-origin", cache: "no-store" }).then(async (response) => { const body = await response.json(); if (response.ok && Array.isArray(body.records) && body.records.length) setRecords((current) => mergeBySlug(current, body.records)); }).catch(() => null); }, [kind]);
  const save = async (record: AdminContentRecord) => {
    setSaving(true); setMessage("");
    try { const response = await fetch(`/.netlify/functions/admin-content?kind=${kind}`, { method: "PUT", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify(record) }); const body = await response.json().catch(() => ({})); if (!response.ok || !body.record) throw new Error(body.error || "บันทึกไม่สำเร็จ"); setRecords((current) => current.some((item) => item.slug === body.record.slug) ? current.map((item) => item.slug === body.record.slug ? body.record : item) : [...current, body.record]); setEditing(null); setMessage("บันทึกและเชื่อมข้อมูลหน้าบ้านแล้ว"); }
    catch (reason) { setMessage(reason instanceof Error ? reason.message : "บันทึกไม่สำเร็จ"); } finally { setSaving(false); }
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const form = new FormData(event.currentTarget); const val = (name: string) => String(form.get(name) || "").trim();
    const title = val("title");
    const base: AdminContentRecord = { ...editing, slug: editing?.slug || automaticSlug(title, kind), title, description: val("description"), enabled: form.get("enabled") === "on" };
    if (kind === "services") Object.assign(base, { number: val("number"), note: val("note"), href: val("href"), image: val("image"), imageAlt: val("imageAlt"), scopeTitle: val("scopeTitle"), scope: parseLines(val("scope")), steps: parseLines(val("steps")), price: val("price"), priceNote: val("priceNote"), disclaimer: val("disclaimer") });
    if (kind === "articles") Object.assign(base, { category: val("category"), excerpt: val("excerpt"), publishedAt: val("publishedAt"), readingTime: val("readingTime"), coverImage: val("coverImage"), coverImageAlt: val("coverImageAlt"), paragraphs: val("paragraphs").split("\n\n").map((p) => p.trim()).filter(Boolean) });
    if (kind === "promotions") Object.assign(base, { eyebrow: val("eyebrow"), ctaLabel: val("ctaLabel"), ctaHref: val("ctaHref") });
    void save(base);
  };
  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; if (!file || !editing) return;
    if (file.size > 5 * 1024 * 1024) { setUploadPreview({ name: file.name, preview: "", status: "error", detail: "ไฟล์ใหญ่เกิน 5 MB" }); event.target.value = ""; return; }
    setSaving(true); setMessage("");
    let preview = "";
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error("อ่านไฟล์ไม่สำเร็จ")); reader.readAsDataURL(file); });
      preview = dataUrl; setUploadPreview({ name: file.name, preview, status: "uploading", detail: "กำลังอัปโหลดไปยังคลังรูป…" });
      const data = dataUrl.split(",")[1] || "";
      const response = await fetch("/.netlify/functions/admin-upload", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ filename: file.name, mimeType: file.type, data, folder: `${kind}-${editing.slug || "new"}` }) });
      const body = await response.json().catch(() => ({})); if (!response.ok || !body.url) throw new Error(body.error || "อัปโหลดรูปไม่สำเร็จ");
      setEditing((current) => current ? { ...current, ...(kind === "articles" ? { coverImage: body.url } : { image: body.url }) } : current);
      setUploadPreview({ name: file.name, preview, status: "success", detail: "อัปโหลดสำเร็จ — กรุณากดบันทึกข้อมูล" });
    }
    catch (reason) { const detail = reason instanceof Error ? reason.message : "อัปโหลดรูปไม่สำเร็จ"; setUploadPreview({ name: file.name, preview, status: "error", detail: `อัปโหลดไม่สำเร็จ: ${detail}` }); }
    finally { setSaving(false); event.target.value = ""; }
  };
  const openEditor = (record: AdminContentRecord) => { setMessage(""); setUploadPreview(null); setEditing({ ...record }); };
  const imageUpload = (label: string, currentImage?: string) => <div className="admin-content-uploader">
    <label>{label}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={upload}/></label>
    <p>รองรับ JPG, PNG, WebP, GIF ไม่เกิน 5 MB · จัดเก็บใน Netlify Blobs เดียวกับรูปที่ดิน</p>
    {(uploadPreview?.preview || currentImage) && <div className={`admin-content-upload-preview ${uploadPreview ? `is-${uploadPreview.status}` : "is-current"}`}>
      <Image src={uploadPreview?.preview || currentImage || ""} alt="ตัวอย่างรูปที่เลือก" width={180} height={120} unoptimized/>
      <div><strong>{uploadPreview?.name || "รูปที่ใช้อยู่บนเว็บไซต์"}</strong><span>{uploadPreview?.detail || "รูปปัจจุบัน — เลือกไฟล์ใหม่เมื่อต้องการเปลี่ยน"}</span></div>
    </div>}
    {!uploadPreview && !currentImage && <p className="admin-content-upload-empty">ยังไม่มีรูป กรุณากดเลือกไฟล์</p>}
  </div>;
  const blank: AdminContentRecord = { slug: "", title: "", description: "", enabled: true };
  return <section className="admin-panel"><div className="admin-panel-heading"><div><p>{kind.toUpperCase()}</p><h2>{labels[kind].title}</h2></div><button className="is-primary" type="button" onClick={() => openEditor(blank)}>＋ {labels[kind].add}</button></div>{message && <p className="admin-form-message" role="status">{message}</p>}<div className="admin-card-list">{records.map((record) => <article key={record.slug}><span>{record.number || "•"}</span><div><h3>{record.title}</h3><p>{record.description || record.excerpt}</p></div><button type="button" onClick={() => openEditor(record)}>แก้ไข</button></article>)}</div>
    {editing && <div className="admin-editor-backdrop"><section className="admin-editor" role="dialog" aria-modal="true"><div className="admin-panel-heading"><h2>{editing.slug ? `แก้ไข ${editing.title}` : labels[kind].add}</h2><button type="button" onClick={() => setEditing(null)}>ปิด</button></div><form onSubmit={submit}><div className="admin-form-grid"><label>ชื่อ URL (Slug)<input name="slug" defaultValue={editing.slug} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required readOnly={Boolean(editing.slug)}/><small>เช่น feng-shui หรือ article-name</small></label><label>ชื่อเรื่อง<input name="title" defaultValue={editing.title} required/></label><label className="admin-check"><input name="enabled" type="checkbox" defaultChecked={editing.enabled !== false}/> เปิดแสดงบนเว็บไซต์</label>{kind === "services" && <><label>ลำดับ<input name="number" defaultValue={editing.number}/></label><label>ชื่ออังกฤษสั้น<input name="note" defaultValue={editing.note}/></label><label>ลิงก์หน้า<input name="href" defaultValue={editing.href}/></label><label>ราคา<input name="price" defaultValue={editing.price}/></label><label>หัวข้อขอบเขต<input name="scopeTitle" defaultValue={editing.scopeTitle}/></label></>}{kind === "articles" && <><label>หมวดหมู่<input name="category" defaultValue={editing.category}/></label><label>วันที่เผยแพร่<input name="publishedAt" defaultValue={editing.publishedAt}/></label><label>เวลาอ่าน<input name="readingTime" defaultValue={editing.readingTime}/></label></>}{kind === "promotions" && <><label>ข้อความด้านบน<input name="eyebrow" defaultValue={editing.eyebrow}/></label><label>ข้อความปุ่ม<input name="ctaLabel" defaultValue={editing.ctaLabel}/></label><label>ลิงก์ปุ่ม<input name="ctaHref" defaultValue={editing.ctaHref}/></label></>}</div><label>รายละเอียด<textarea name="description" defaultValue={editing.description} rows={4}/></label>
      {kind === "services" && <><label>ขอบเขตบริการ — หัวข้อ | รายละเอียด<textarea name="scope" defaultValue={toLines(editing.scope)} rows={6}/></label><label>ขั้นตอน — หัวข้อ | รายละเอียด<textarea name="steps" defaultValue={toLines(editing.steps)} rows={6}/></label><label>หมายเหตุราคา<textarea name="priceNote" defaultValue={editing.priceNote}/></label><label>ข้อควรทราบ<textarea name="disclaimer" defaultValue={editing.disclaimer}/></label><input type="hidden" name="image" value={editing.image || ""}/>{imageUpload("รูปบริการ", editing.image)}<label>คำอธิบายรูป<input name="imageAlt" defaultValue={editing.imageAlt}/></label></>}
      {kind === "articles" && <><label>ข้อความสรุป<textarea name="excerpt" defaultValue={editing.excerpt}/></label><label>เนื้อหาบทความ — เว้นหนึ่งบรรทัดเพื่อขึ้นย่อหน้าใหม่<textarea name="paragraphs" defaultValue={editing.paragraphs?.join("\n\n")} rows={10}/></label><input type="hidden" name="coverImage" value={editing.coverImage || ""}/>{imageUpload("ภาพปกบทความ", editing.coverImage)}<label>คำอธิบายภาพ<input name="coverImageAlt" defaultValue={editing.coverImageAlt}/></label></>}
      <div className="admin-editor-actions"><button type="button" onClick={() => setEditing(null)}>ยกเลิก</button><button type="submit" disabled={saving}>{saving ? "กำลังบันทึก…" : "บันทึกข้อมูล"}</button></div></form></section></div>}
  </section>;
}
