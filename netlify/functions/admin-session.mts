import { requireAdmin } from "../lib/admin-auth.mts";

export default async function adminSession(request: Request) {
  if (request.method !== "GET") return Response.json({ ok: false }, { status: 405 });
  const auth = await requireAdmin(request);
  if (!auth.configured) return Response.json({ ok: false, configured: false }, { status: 503, headers: { "Cache-Control": "no-store" } });
  if (!auth.session) return Response.json({ ok: false, configured: true }, { status: 401, headers: { "Cache-Control": "no-store" } });
  return Response.json({ ok: true, configured: true, username: auth.session.username }, { headers: { "Cache-Control": "no-store" } });
}
