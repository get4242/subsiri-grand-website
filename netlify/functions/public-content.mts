const json = (status: number, body: Record<string, unknown>) => Response.json(body, { status, headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=120" } });
export default async function publicContent(request: Request) {
  if (request.method !== "GET") return json(405, { ok: false, error: "Method ไม่ถูกต้อง" });
  const googleUrl = process.env.GOOGLE_APPS_SCRIPT_URL; const secret = process.env.ADMIN_DATA_SHARED_SECRET || process.env.LEADS_SHARED_SECRET;
  if (!googleUrl || !secret) return json(200, { ok: true, properties: [], services: [], articles: [], promotions: [] });
  try {
    const response = await fetch(googleUrl, { method: "POST", redirect: "follow", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ secret, action: "getPublicContent" }) });
    const result = await response.json().catch(() => null) as Record<string, unknown> | null;
    if (!response.ok || !result?.ok) return json(502, { ok: false, error: "ไม่สามารถโหลดข้อมูลล่าสุดได้" });
    return json(200, result);
  } catch { return json(502, { ok: false, error: "ไม่สามารถโหลดข้อมูลล่าสุดได้" }); }
}
