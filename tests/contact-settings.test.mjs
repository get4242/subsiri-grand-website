import test from "node:test";
import assert from "node:assert/strict";
import { normalizeContactSettings } from "../netlify/lib/contact-settings.mts";

test("accepts official LINE and Facebook links", () => {
  assert.deepEqual(normalizeContactSettings({ lineUrl: "https://lin.ee/r8WhnWC", facebookUrl: "https://www.facebook.com/subsiri" }), {
    companyName: "บริษัท ทรัพย์สิริ แกรนด์ กรุ๊ป จำกัด", phone: "090-249-1459", email: "contact@subsiri.co.th",
    lineUrl: "https://lin.ee/r8WhnWC", facebookUrl: "https://www.facebook.com/subsiri",
  });
});

test("accepts editable company contact details", () => {
  const settings = normalizeContactSettings({ companyName: "บริษัท ตัวอย่าง จำกัด", phone: "02-123-4567", email: "hello@example.com", lineUrl: "https://lin.ee/r8WhnWC", facebookUrl: "" });
  assert.equal(settings?.companyName, "บริษัท ตัวอย่าง จำกัด");
  assert.equal(settings?.phone, "02-123-4567");
  assert.equal(settings?.email, "hello@example.com");
  assert.equal(normalizeContactSettings({ companyName: "บริษัท ตัวอย่าง จำกัด", phone: "ไม่ใช่เบอร์", email: "hello@example.com", lineUrl: "", facebookUrl: "" }), null);
});

test("rejects unsafe or unrelated social links", () => {
  assert.equal(normalizeContactSettings({ lineUrl: "javascript:alert(1)", facebookUrl: "" }), null);
  assert.equal(normalizeContactSettings({ lineUrl: "https://lin.ee/r8WhnWC", facebookUrl: "https://example.com/fake" }), null);
});
