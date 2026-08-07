import { requireAdmin } from "../lib/admin-auth.mts";
import { sanitizeUpload } from "../lib/admin-content.mts";
const json = (status: number, body: Record<string, unknown>) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
const appsScriptError = (result: Record<string, unknown> | null) => {
  const code = typeof result?.error === "string" ? result.error.slice(0, 180) : "";
  if (code === "unknown_action") return "Apps Script ที่เผยแพร่อยู่ยังเป็นเวอร์ชันเก่า กรุณา Deploy เวอร์ชันใหม่ที่รองรับ uploadImage";
  if (code === "unauthorized") return "รหัสเชื่อมต่อ Apps Script ไม่ตรงกับ Netlify";
  if (code === "invalid_upload") return "Apps Script ได้รับข้อมูลรูปไม่ครบ";
  if (/permission|access|sharing|authorized|drive/i.test(code)) return `Google Drive ไม่อนุญาตให้อัปโหลดหรือแชร์ไฟล์ (${code})`;
  return code ? `Google Apps Script แจ้งว่า: ${code}` : "อัปโหลดรูปไป Google Drive ไม่สำเร็จ และ Apps Script ไม่ได้ส่งสาเหตุกลับมา";
};
export default async function adminUpload(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.session) return json(401, { ok: false, error: "กรุณาเข้าสู่ระบบ" });
  if (request.method !== "POST") return json(405, { ok: false, error: "Method ไม่ถูกต้อง" });
  const googleUrl = process.env.GOOGLE_APPS_SCRIPT_URL; const secret = process.env.ADMIN_DATA_SHARED_SECRET || process.env.LEADS_SHARED_SECRET;
  if (!googleUrl || !secret) return json(503, { ok: false, error: "ยังไม่ได้เชื่อม Google Apps Script" });
  const raw = await request.text(); if (raw.length > 7_500_000) return json(413, { ok: false, error: "รูปมีขนาดใหญ่เกินไป" });
  let input: unknown; try { input = JSON.parse(raw); } catch { return json(400, { ok: false, error: "ไฟล์ไม่ถูกต้อง" }); }
  const clean = sanitizeUpload(input); if (!clean.ok) return json(400, { ok: false, error: clean.error ?? "ไฟล์ไม่ถูกต้อง" });
  try {
    const response = await fetch(googleUrl, { method: "POST", redirect: "follow", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ secret, action: "uploadImage", upload: clean.upload }) });
    const result = await response.json().catch(() => null) as Record<string, unknown> | null;
    if (!response.ok || !result?.ok || !result.url) return json(502, { ok: false, error: appsScriptError(result) });
    return json(200, result);
  } catch { return json(502, { ok: false, error: "ไม่สามารถเชื่อมต่อระบบเก็บรูปได้" }); }
}
