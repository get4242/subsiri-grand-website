import { getStore } from "@netlify/blobs";
import { requireAdmin } from "../lib/admin-auth.mts";
import { sanitizeUpload } from "../lib/admin-content.mts";
const json = (status: number, body: Record<string, unknown>) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
export default async function adminUpload(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.session) return json(401, { ok: false, error: "กรุณาเข้าสู่ระบบ" });
  if (request.method !== "POST") return json(405, { ok: false, error: "Method ไม่ถูกต้อง" });
  const raw = await request.text(); if (raw.length > 7_500_000) return json(413, { ok: false, error: "รูปมีขนาดใหญ่เกินไป" });
  let input: unknown; try { input = JSON.parse(raw); } catch { return json(400, { ok: false, error: "ไฟล์ไม่ถูกต้อง" }); }
  const clean = sanitizeUpload(input); if (!clean.ok) return json(400, { ok: false, error: clean.error ?? "ไฟล์ไม่ถูกต้อง" });
  try {
    const folder = clean.upload.folder.replace(/[^a-zA-Z0-9_-]/g, "-");
    const filename = clean.upload.filename.replace(/[^a-zA-Z0-9._-]/g, "-");
    const key = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${filename}`;
    const bytes = Uint8Array.from(Buffer.from(clean.upload.data, "base64"));
    const store = getStore({ name: "property-images", consistency: "strong" });
    await store.set(key, new Blob([bytes], { type: clean.upload.mimeType }), {
      metadata: { contentType: clean.upload.mimeType, filename, uploadedAt: new Date().toISOString() },
      onlyIfNew: true,
    });
    return json(200, { ok: true, key, url: `/.netlify/functions/property-image?key=${encodeURIComponent(key)}` });
  } catch (reason) {
    console.error("Netlify Blob upload failed", reason);
    return json(502, { ok: false, error: "Netlify ไม่สามารถบันทึกรูปได้ กรุณาลองใหม่อีกครั้ง" });
  }
}
