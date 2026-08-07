import { requireAdmin } from "../lib/admin-auth.mts";
import { normalizeContentRecord, type ContentKind } from "../lib/admin-content.mts";

const json = (status: number, body: Record<string, unknown>) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
const kinds = new Set<ContentKind>(["services", "articles", "promotions"]);

export default async function adminContent(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.configured) return json(503, { ok: false, error: "ระบบผู้ดูแลยังตั้งค่าไม่ครบ" });
  if (!auth.session) return json(401, { ok: false, error: "กรุณาเข้าสู่ระบบ" });
  if (!["GET", "PUT"].includes(request.method)) return json(405, { ok: false, error: "Method ไม่ถูกต้อง" });
  const googleUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  const secret = process.env.ADMIN_DATA_SHARED_SECRET || process.env.LEADS_SHARED_SECRET;
  if (!googleUrl || !secret) return json(503, { ok: false, error: "ยังไม่ได้เชื่อม Google Apps Script" });
  const url = new URL(request.url);
  const kind = url.searchParams.get("kind") as ContentKind;
  if (!kinds.has(kind)) return json(400, { ok: false, error: "หมวดข้อมูลไม่ถูกต้อง" });
  let payload: Record<string, unknown> = { secret, action: "listContent", kind };
  if (request.method === "PUT") {
    const raw = await request.text();
    if (raw.length > 80_000) return json(413, { ok: false, error: "ข้อมูลมีขนาดใหญ่เกินไป" });
    let input: unknown;
    try { input = JSON.parse(raw); } catch { return json(400, { ok: false, error: "รูปแบบข้อมูลไม่ถูกต้อง" }); }
    const normalized = normalizeContentRecord(kind, input);
    if (!normalized.ok) return json(400, { ok: false, error: normalized.error ?? "ข้อมูลไม่ถูกต้อง" });
    payload = { secret, action: "upsertContent", kind, record: normalized.record };
  }
  try {
    const response = await fetch(googleUrl, { method: "POST", redirect: "follow", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const result = await response.json().catch(() => null) as Record<string, unknown> | null;
    if (!response.ok || !result?.ok) return json(502, { ok: false, error: "Google Sheets ไม่ยืนยันการทำรายการ" });
    return json(200, result);
  } catch { return json(502, { ok: false, error: "ไม่สามารถเชื่อมต่อ Google Apps Script ได้" }); }
}
