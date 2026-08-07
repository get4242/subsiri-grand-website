import { adminSessionCookie, createAdminSession, getAdminAuthConfig, verifyAdminCredentials } from "../lib/admin-auth.mts";

const json = (status: number, body: Record<string, unknown>, headers: HeadersInit = {}) => Response.json(body, {
  status,
  headers: { "Cache-Control": "no-store", ...headers },
});

export default async function adminLogin(request: Request) {
  if (request.method !== "POST") return json(405, { ok: false, error: "รองรับเฉพาะ POST" });
  const config = getAdminAuthConfig();
  if (!config) return json(503, { ok: false, error: "ระบบผู้ดูแลยังตั้งค่าไม่ครบ กรุณาตั้งค่า Netlify environment variables" });

  let input: { username?: unknown; password?: unknown };
  try {
    const raw = await request.text();
    if (raw.length > 5_000) return json(413, { ok: false, error: "ข้อมูลมีขนาดใหญ่เกินไป" });
    input = JSON.parse(raw);
  } catch {
    return json(400, { ok: false, error: "รูปแบบข้อมูลไม่ถูกต้อง" });
  }

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return json(400, { ok: false, error: "รูปแบบข้อมูลไม่ถูกต้อง" });
  }

  const username = typeof input.username === "string" ? input.username.slice(0, 120) : "";
  const password = typeof input.password === "string" ? input.password.slice(0, 300) : "";
  if (!verifyAdminCredentials(username, password, config)) {
    return json(401, { ok: false, error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
  }

  const token = await createAdminSession(config);
  return json(200, { ok: true, username: config.username }, { "Set-Cookie": adminSessionCookie(token) });
}
