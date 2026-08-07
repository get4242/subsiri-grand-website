"use client";

import { ChangeEvent, FormEvent, useState } from "react";

export type AdminPropertyRow = {
  slug: string;
  name: string;
  location: string;
  area: string;
  price: string;
  status: "พร้อมขาย" | "พร้อมโอน" | "sold";
  eyebrow?: string;
  description?: string;
  titleDeed?: string;
  roadAccess?: string;
  electricity?: string;
  mapUrl?: string;
  youtubeUrl?: string;
  images?: string[];
  highlights?: string[];
};

type Props = {
  properties: AdminPropertyRow[];
  onChange: (properties: AdminPropertyRow[]) => void;
};

const blankProperty: AdminPropertyRow = {
  slug: "", name: "", location: "", area: "", price: "", status: "พร้อมขาย",
  eyebrow: "", description: "", titleDeed: "", roadAccess: "", electricity: "",
  mapUrl: "", youtubeUrl: "", images: [], highlights: [],
};

export function AdminPropertiesPanel({ properties, onChange }: Props) {
  const [editing, setEditing] = useState<AdminPropertyRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [imageValues, setImageValues] = useState<string[]>([]);

  const openEditor = (property: AdminPropertyRow) => {
    setMessage("");
    setEditing({ ...property });
    setImageValues(property.images ?? []);
  };

  const uploadImages = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = [...(event.target.files ?? [])];
    if (!files.length) return;
    setSaving(true); setMessage("กำลังอัปโหลดรูป…");
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        const data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
          reader.onerror = () => reject(new Error("อ่านไฟล์ไม่สำเร็จ"));
          reader.readAsDataURL(file);
        });
        const response = await fetch("/.netlify/functions/admin-upload", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ filename: file.name, mimeType: file.type, data, folder: editing?.slug || "new-property" }) });
        const body = await response.json().catch(() => ({}));
        if (!response.ok || !body.url) throw new Error(body.error || "อัปโหลดรูปไม่สำเร็จ");
        uploaded.push(body.url);
      }
      setImageValues((current) => [...current, ...uploaded]);
      setMessage(`อัปโหลดรูปแล้ว ${uploaded.length} รูป กรุณากดบันทึกข้อมูล`);
    } catch (reason) { setMessage(reason instanceof Error ? reason.message : "อัปโหลดรูปไม่สำเร็จ"); }
    finally { setSaving(false); event.target.value = ""; }
  };

  const save = async (property: AdminPropertyRow) => {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/.netlify/functions/admin-properties", {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(property),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || !body.property) throw new Error(body.error || "ไม่สามารถบันทึกข้อมูลได้");
      const next = properties.some((item) => item.slug === body.property.slug)
        ? properties.map((item) => item.slug === body.property.slug ? body.property : item)
        : [...properties, body.property];
      onChange(next);
      setEditing(null);
      setMessage("บันทึกข้อมูลที่ดินเรียบร้อยแล้ว");
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : "ไม่สามารถบันทึกข้อมูลได้");
    } finally {
      setSaving(false);
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = (name: string) => String(form.get(name) || "").trim();
    void save({
      slug: value("slug"), name: value("name"), location: value("location"), area: value("area"),
      price: value("price"), status: value("status") as AdminPropertyRow["status"],
      eyebrow: editing?.eyebrow || value("name"), description: value("description"), titleDeed: value("titleDeed"),
      roadAccess: value("roadAccess"), electricity: value("electricity"), mapUrl: value("mapUrl"),
      youtubeUrl: value("youtubeUrl"),
      images: imageValues,
      highlights: value("highlights").split("\n").map((item) => item.trim()).filter(Boolean),
    });
  };

  const changeStatus = (property: AdminPropertyRow) => {
    const status = property.status === "sold" ? "พร้อมขาย" : "sold";
    void save({ ...property, status });
  };

  return <section className="admin-panel">
    <div className="admin-panel-heading"><div><p>PROPERTY MANAGEMENT</p><h2>รายการที่ดิน</h2></div><button className="is-primary" type="button" onClick={() => openEditor({ ...blankProperty })}>＋ เพิ่มที่ดิน</button></div>
    {message && <p className="admin-form-message" role="status">{message}</p>}
    <div className="admin-table-wrap"><table><thead><tr><th>ชื่อแปลง</th><th>ทำเล</th><th>เนื้อที่</th><th>ราคา</th><th>สถานะ</th><th>จัดการ</th></tr></thead><tbody>{properties.map((property) => <tr key={property.slug}><td><strong>{property.name}</strong><small>/{property.slug}</small></td><td>{property.location}</td><td>{property.area}</td><td>{property.price}</td><td><span className={`admin-status ${property.status === "sold" ? "is-muted" : "is-progress"}`}>{property.status === "sold" ? "ขายแล้ว" : property.status}</span></td><td><div className="admin-row-actions"><button type="button" onClick={() => openEditor(property)}>แก้ไข</button><button type="button" disabled={saving} onClick={() => changeStatus(property)}>{property.status === "sold" ? "เปิดขายอีกครั้ง" : "ตั้งเป็นขายแล้ว"}</button></div></td></tr>)}</tbody></table></div>

    {editing && <div className="admin-editor-backdrop" role="presentation"><section className="admin-editor" role="dialog" aria-modal="true" aria-labelledby="property-editor-title"><div className="admin-panel-heading"><div><p>PROPERTY EDITOR</p><h2 id="property-editor-title">{editing.slug ? `แก้ไข ${editing.name}` : "เพิ่มที่ดิน"}</h2></div><button type="button" onClick={() => setEditing(null)}>ปิด</button></div><form onSubmit={submit}>
      <div className="admin-form-grid"><label>ชื่อ URL (Slug)<input name="slug" defaultValue={editing.slug} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" placeholder="เช่น blue-diamond" required readOnly={Boolean(editing.slug)}/><small>ใช้ในลิงก์หน้าเว็บ ใส่ภาษาอังกฤษ ตัวเลข หรือขีดกลาง</small></label><label>ชื่อแปลง<input name="name" defaultValue={editing.name} required/></label><label>ทำเล<input name="location" defaultValue={editing.location} required/></label><label>เนื้อที่<input name="area" defaultValue={editing.area} required/></label><label>ราคา<input name="price" defaultValue={editing.price} required/></label><label>สถานะ<select name="status" defaultValue={editing.status}><option value="พร้อมขาย">พร้อมขาย</option><option value="พร้อมโอน">พร้อมโอน</option><option value="sold">ขายแล้ว</option></select></label><label>โฉนด<input name="titleDeed" defaultValue={editing.titleDeed}/></label><label>ถนน<input name="roadAccess" defaultValue={editing.roadAccess}/></label><label>ไฟฟ้า<input name="electricity" defaultValue={editing.electricity}/></label><label>Google Maps<input name="mapUrl" type="url" defaultValue={editing.mapUrl}/></label><label>YouTube<input name="youtubeUrl" type="url" defaultValue={editing.youtubeUrl}/></label></div>
      <label>รายละเอียด<textarea name="description" defaultValue={editing.description} rows={4}/></label><label>จุดเด่น — หนึ่งรายการต่อบรรทัด<textarea name="highlights" defaultValue={editing.highlights?.join("\n")} rows={4}/></label>
      <div className="admin-image-uploader"><label>รูปที่ดิน<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple onChange={uploadImages} disabled={saving}/></label><p>กดเลือกรูปจากเครื่องได้หลายรูป รูปแรกจะเป็นภาพปก</p>{imageValues.length > 0 && <ol>{imageValues.map((url, index) => <li key={`${url}-${index}`}><span>รูปที่ {index + 1}</span><button type="button" onClick={() => setImageValues((items) => items.filter((_, itemIndex) => itemIndex !== index))}>นำออก</button></li>)}</ol>}</div>
      <div className="admin-editor-actions"><button type="button" onClick={() => setEditing(null)}>ยกเลิก</button><button className="is-primary" type="submit" disabled={saving}>{saving ? "กำลังบันทึก…" : "บันทึกข้อมูล"}</button></div>
    </form></section></div>}
  </section>;
}
