import test from "node:test";
import assert from "node:assert/strict";

import { normalizeAdminProperty } from "../netlify/lib/admin-properties.mts";

test("normalizes a valid property record", () => {
  const result = normalizeAdminProperty({
    slug: "new-land",
    name: "ที่ดินตัวอย่าง",
    location: "กรุงเทพมหานคร",
    area: "2 ไร่",
    price: "10,000,000 บาท",
    status: "พร้อมขาย",
    images: ["https://example.com/one.jpg"],
    highlights: ["ติดถนน"],
  });

  assert.equal(result.ok, true);
  assert.equal(result.property?.slug, "new-land");
  assert.deepEqual(result.property?.images, ["https://example.com/one.jpg"]);
});

test("rejects invalid slugs, statuses, and non-http image URLs", () => {
  assert.equal(normalizeAdminProperty({ slug: "ไม่ถูก", name: "x", location: "x", area: "x", price: "x", status: "พร้อมขาย" }).ok, false);
  assert.equal(normalizeAdminProperty({ slug: "valid", name: "x", location: "x", area: "x", price: "x", status: "unknown" }).ok, false);
  assert.equal(normalizeAdminProperty({ slug: "valid", name: "x", location: "x", area: "x", price: "x", status: "sold", images: ["javascript:alert(1)"] }).ok, false);
});
