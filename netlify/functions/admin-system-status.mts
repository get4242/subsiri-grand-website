import { requireAdmin } from "../lib/admin-auth.mts";
import { getAdminSystemStatus } from "../lib/admin-system-status.mts";

export default async function adminSystemStatus(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.session) return Response.json({ ok: false, error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  if (request.method !== "GET") return Response.json({ ok: false, error: "Method ไม่ถูกต้อง" }, { status: 405 });
  return Response.json({ ok: true, integrations: getAdminSystemStatus(process.env) }, { headers: { "Cache-Control": "no-store" } });
}
