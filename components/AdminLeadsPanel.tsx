"use client";

import { useState } from "react";

export type AdminLead = { id: number; timestamp: string; name: string; phone: string; email: string; interest: string; message: string; status: string };
const statuses = ["ใหม่", "กำลังติดตาม", "นัดหมายแล้ว", "ปิดการขาย", "ไม่สนใจ"];

export function AdminLeadsPanel({ leads, compact = false, onChange }: { leads: AdminLead[]; compact?: boolean; onChange: (leads: AdminLead[]) => void }) {
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const shown = compact ? leads.slice(0, 5) : leads;

  const updateStatus = async (lead: AdminLead, status: string) => {
    setSavingId(lead.id); setError("");
    try {
      const response = await fetch("/.netlify/functions/admin-leads", { method: "PATCH", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: lead.id, status }) });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "บันทึกสถานะไม่สำเร็จ");
      onChange(leads.map((item) => item.id === lead.id ? { ...item, status } : item));
    } catch (reason) { setError(reason instanceof Error ? reason.message : "บันทึกสถานะไม่สำเร็จ"); }
    finally { setSavingId(null); }
  };

  if (!shown.length) return <div className="admin-empty-card"><h3>ยังไม่มีลูกค้าจากแบบฟอร์ม</h3><p>รายการใหม่จะแสดงที่นี่อัตโนมัติเมื่อมีผู้ส่งแบบฟอร์มติดต่อ</p></div>;
  return <>
    {error && <p className="admin-login-error" role="alert">{error}</p>}
    <div className="admin-table-wrap"><table><thead><tr><th>ลูกค้า</th><th>สนใจ</th><th>โทรศัพท์</th><th>สถานะติดตาม</th><th>วันที่รับข้อมูล</th></tr></thead><tbody>
      {shown.map((lead) => <tr key={lead.id}><td><strong>{lead.name}</strong><small>{lead.email || "ไม่ระบุอีเมล"}</small></td><td>{lead.interest}</td><td><a href={`tel:${lead.phone}`}>{lead.phone}</a></td><td>{compact ? <span className="admin-status is-progress">{lead.status || "ใหม่"}</span> : <select aria-label={`สถานะของ ${lead.name}`} value={lead.status || "ใหม่"} disabled={savingId === lead.id} onChange={(event) => updateStatus(lead, event.target.value)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select>}</td><td>{new Intl.DateTimeFormat("th-TH", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Bangkok" }).format(new Date(lead.timestamp))}</td></tr>)}
    </tbody></table></div>
  </>;
}
