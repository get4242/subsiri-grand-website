import { getStore } from "@netlify/blobs";
import { isLineNotificationTarget, notificationTargetsFromEvents, verifyLineSignature } from "../lib/line-webhook.mts";

const noStore = { "Cache-Control": "no-store" };

export default async function lineWebhook(request: Request) {
  if (request.method !== "POST") return Response.json({ ok: false }, { status: 405, headers: noStore });
  const channelSecret = process.env.LINE_CHANNEL_SECRET;
  if (!channelSecret) return Response.json({ ok: false }, { status: 503, headers: noStore });

  const rawBody = await request.text();
  if (rawBody.length > 250_000) return Response.json({ ok: false }, { status: 413, headers: noStore });
  const signature = request.headers.get("x-line-signature") || "";
  if (!await verifyLineSignature(rawBody, signature, channelSecret)) return Response.json({ ok: false }, { status: 401, headers: noStore });

  const payload = await Promise.resolve().then(() => JSON.parse(rawBody) as { events?: unknown }).catch(() => null);
  if (!payload) return Response.json({ ok: false }, { status: 400, headers: noStore });
  const receivedTargetIds = notificationTargetsFromEvents(payload.events);
  if (receivedTargetIds.length) {
    const store = getStore({ name: "site-settings", consistency: "strong" });
    const existing = await store.get("line-notification-targets", { type: "json" }).catch(() => null) as { targetIds?: unknown } | null;
    const legacy = await store.get("line-notification-target", { type: "json" }).catch(() => null) as { targetId?: unknown } | null;
    const currentTargetIds = Array.isArray(existing?.targetIds) ? existing.targetIds.filter(isLineNotificationTarget) : [];
    if (isLineNotificationTarget(legacy?.targetId)) currentTargetIds.push(legacy.targetId);
    const targetIds = [...new Set([...currentTargetIds, ...receivedTargetIds])];
    await store.setJSON("line-notification-targets", { targetIds, updatedAt: new Date().toISOString() });
  }
  return Response.json({ ok: true }, { status: 200, headers: noStore });
}
