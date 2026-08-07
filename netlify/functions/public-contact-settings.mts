import { getStore } from "@netlify/blobs";
import { defaultContactSettings, normalizeContactSettings } from "../lib/contact-settings.mts";

export default async function publicContactSettings(request: Request) {
  if (request.method !== "GET") return new Response("Method not allowed", { status: 405 });
  const store = getStore({ name: "site-settings", consistency: "strong" });
  const saved = await store.get("contact", { type: "json" }).catch(() => null);
  return Response.json(normalizeContactSettings(saved) || defaultContactSettings, { headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=120" } });
}
