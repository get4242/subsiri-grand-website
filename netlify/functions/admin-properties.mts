import { requireAdmin } from "../lib/admin-auth.mts";
import { normalizeAdminProperty } from "../lib/admin-properties.mts";

const json = (status: number, body: Record<string, unknown>) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export default async function adminProperties(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.configured) return json(503, { ok: false, error: "ระบบผู้ดูแลยังตั้งค่าไม่ครบ" });
  if (!auth.session) return json(401, { ok: false, error: "กรุณาเข้าสู่ระบบ" });
  if (!['GET', 'PUT'].includes(request.method)) return json(405, { ok: false, error: "Method ไม่ถูกต้อง" });

  const googleUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  const sharedSecret = process.env.ADMIN_DATA_SHARED_SECRET || process.env.LEADS_SHARED_SECRET;
  if (!googleUrl || !sharedSecret) return json(503, { ok: false, error: "ยังไม่ได้เชื่อม Google Apps Script สำหรับระบบหลังบ้าน" });

  let body: Record<string, unknown> = { secret: sharedSecret, action: "listProperties" };
  if (request.method === "PUT") {
    let input: unknown;
    try {
      const raw = await request.text();
      if (raw.length > 50_000) return json(413, { ok: false, error: "ข้อมูลมีขนาดใหญ่เกินไป" });
      input = JSON.parse(raw);
    } catch {
      return json(400, { ok: false, error: "รูปแบบข้อมูลไม่ถูกต้อง" });
    }
    const normalized = normalizeAdminProperty(input);
    if (!normalized.ok) return json(400, { ok: false, error: normalized.error });
    body = { secret: sharedSecret, action: "upsertProperty", property: normalized.property };
  }

  try {
    const response = await fetch(googleUrl, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await response.json().catch(() => null) as Record<string, unknown> | null;
    if (!response.ok || !result?.ok) return json(502, { ok: false, error: "Google Sheets ไม่ยืนยันการทำรายการ" });
    return json(200, result);
  } catch {
    return json(502, { ok: false, error: "ไม่สามารถเชื่อมต่อ Google Apps Script ได้" });
  }
}
