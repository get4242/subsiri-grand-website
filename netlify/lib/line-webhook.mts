export type LineWebhookEvent = {
  type?: unknown;
  source?: { type?: unknown; groupId?: unknown; roomId?: unknown; userId?: unknown };
};

export function isLineNotificationTarget(value: unknown): value is string {
  return typeof value === "string" && /^[CR][0-9a-f]{32}$/i.test(value);
}

export function notificationTargetsFromEvents(events: unknown): string[] {
  if (!Array.isArray(events)) return [];
  const targetIds = new Set<string>();
  for (const event of events as LineWebhookEvent[]) {
    const source = event?.source;
    const targetId = source?.type === "group" ? source.groupId : source?.type === "room" ? source.roomId : null;
    if (isLineNotificationTarget(targetId)) targetIds.add(targetId);
  }
  return [...targetIds];
}

export function notificationTargetFromEvents(events: unknown): string | null {
  return notificationTargetsFromEvents(events)[0] || null;
}

function base64(bytes: ArrayBuffer) {
  let binary = "";
  for (const byte of new Uint8Array(bytes)) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export async function verifyLineSignature(rawBody: string, signature: string, channelSecret: string) {
  if (!signature || !channelSecret) return false;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(channelSecret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const digest = await crypto.subtle.sign("HMAC", key, encoder.encode(rawBody));
  const expected = base64(digest);
  if (expected.length !== signature.length) return false;
  let difference = 0;
  for (let index = 0; index < expected.length; index += 1) difference |= expected.charCodeAt(index) ^ signature.charCodeAt(index);
  return difference === 0;
}
