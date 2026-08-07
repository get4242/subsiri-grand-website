import { clearAdminSessionCookie } from "../lib/admin-auth.mts";

export default function adminLogout(request: Request) {
  if (request.method !== "POST") return Response.json({ ok: false }, { status: 405 });
  return Response.json({ ok: true }, {
    headers: { "Cache-Control": "no-store", "Set-Cookie": clearAdminSessionCookie() },
  });
}
