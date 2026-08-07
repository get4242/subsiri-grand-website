import { getStore } from "@netlify/blobs";
import { requireAdmin } from "../lib/admin-auth.mts";
import { defaultContactSettings, normalizeContactSettings } from "../lib/contact-settings.mts";

const json = (status: number, body: Record<string, unknown>) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
export default async function adminContactSettings(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.session) return json(401, { ok: false, error: "กรุณาเข้าสู่ระบบ" });
  const store = getStore({ name: "site-settings", consistency: "strong" });
  if (request.method === "GET") {
    const saved = await store.get("contact", { type: "json" }).catch(() => null);
    return json(200, { ok: true, settings: normalizeContactSettings(saved) || defaultContactSettings });
  }
  if (request.method !== "PUT") return json(405, { ok: false, error: "Method ไม่ถูกต้อง" });
  const settings = normalizeContactSettings(await request.json().catch(() => null));
  if (!settings) return json(400, { ok: false, error: "กรุณาใส่ลิงก์ LINE หรือ Facebook ที่ถูกต้องและขึ้นต้นด้วย https://" });
  await store.setJSON("contact", settings);
  return json(200, { ok: true, settings });
}
