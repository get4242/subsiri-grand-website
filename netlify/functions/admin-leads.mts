import { requireAdmin } from "../lib/admin-auth.mts";

const json = (status: number, body: Record<string, unknown>) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
const allowedStatuses = new Set(["ใหม่", "กำลังติดตาม", "นัดหมายแล้ว", "ปิดการขาย", "ไม่สนใจ"]);

export default async function adminLeads(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.configured) return json(503, { ok: false, error: "ระบบผู้ดูแลยังตั้งค่าไม่ครบ" });
  if (!auth.session) return json(401, { ok: false, error: "กรุณาเข้าสู่ระบบ" });
  if (!["GET", "PATCH"].includes(request.method)) return json(405, { ok: false, error: "Method ไม่ถูกต้อง" });

  const googleUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  const sharedSecret = process.env.ADMIN_DATA_SHARED_SECRET || process.env.LEADS_SHARED_SECRET;
  if (!googleUrl || !sharedSecret) return json(503, { ok: false, error: "ยังไม่ได้เชื่อม Google Apps Script" });

  let payload: Record<string, unknown> = { secret: sharedSecret, action: "listLeads" };
  if (request.method === "PATCH") {
    let input: { id?: unknown; status?: unknown };
    try { input = JSON.parse(await request.text()); }
    catch { return json(400, { ok: false, error: "รูปแบบข้อมูลไม่ถูกต้อง" }); }
    const id = Number(input.id);
    const status = typeof input.status === "string" ? input.status : "";
    if (!Number.isInteger(id) || id < 2 || !allowedStatuses.has(status)) return json(400, { ok: false, error: "ข้อมูลสถานะไม่ถูกต้อง" });
    payload = { secret: sharedSecret, action: "updateLeadStatus", id, status };
  }

  try {
    const response = await fetch(googleUrl, { method: "POST", redirect: "follow", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const result = await response.json().catch(() => null) as Record<string, unknown> | null;
    if (!response.ok || !result?.ok) return json(502, { ok: false, error: "Google Sheets ไม่ยืนยันการทำรายการ" });
    return json(200, result);
  } catch {
    return json(502, { ok: false, error: "ไม่สามารถเชื่อมต่อ Google Apps Script ได้" });
  }
}
