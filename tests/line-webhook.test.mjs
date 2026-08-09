import test from "node:test";
import assert from "node:assert/strict";
import { notificationTargetFromEvents, notificationTargetsFromEvents, verifyLineSignature } from "../netlify/lib/line-webhook.mts";

test("captures a valid LINE groupId and ignores user chats", () => {
  const groupId = `C${"a".repeat(32)}`;
  assert.equal(notificationTargetFromEvents([{ source: { type: "group", groupId } }]), groupId);
  assert.equal(notificationTargetFromEvents([{ source: { type: "user", userId: `U${"b".repeat(32)}` } }]), null);
  assert.equal(notificationTargetFromEvents([{ source: { type: "group", groupId: "invalid" } }]), null);
});

test("keeps every unique valid group and room notification target", () => {
  const groupId = `C${"c".repeat(32)}`;
  const roomId = `R${"d".repeat(32)}`;
  assert.deepEqual(notificationTargetsFromEvents([{ source: { type: "group", groupId } }, { source: { type: "room", roomId } }, { source: { type: "group", groupId } }]), [groupId, roomId]);
});

test("validates LINE webhook signatures", async () => {
  const body = JSON.stringify({ destination: "test", events: [] });
  const secret = "channel-secret-for-test";
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signed = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  const signature = Buffer.from(signed).toString("base64");
  assert.equal(await verifyLineSignature(body, signature, secret), true);
  assert.equal(await verifyLineSignature(`${body}x`, signature, secret), false);
});
