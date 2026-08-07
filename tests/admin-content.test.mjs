import test from "node:test";
import assert from "node:assert/strict";

import { normalizeContentRecord, sanitizeUpload } from "../netlify/lib/admin-content.mts";

test("normalizes editable service, article, and promotion records", () => {
  const service = normalizeContentRecord("services", {
    slug: "feng-shui", title: "ดูฮวงจุ้ย", description: "รายละเอียด", enabled: true,
    scope: [{ title: "สำรวจ", description: "ตรวจสถานที่" }], steps: [],
  });
  assert.equal(service.ok, true);
  assert.equal(service.record?.slug, "feng-shui");

  const article = normalizeContentRecord("articles", {
    slug: "sample-article", title: "บทความ", category: "ที่ดิน", excerpt: "สรุป",
    paragraphs: ["ย่อหน้าแรก"], enabled: true,
  });
  assert.equal(article.ok, true);

  const promotion = normalizeContentRecord("promotions", {
    slug: "homepage-popup", title: "โปรโมชัน", description: "รายละเอียด", enabled: false,
  });
  assert.equal(promotion.ok, true);
});

test("rejects unsafe slugs and oversized or non-image uploads", () => {
  assert.equal(normalizeContentRecord("services", { slug: "ไม่ถูก", title: "x" }).ok, false);
  assert.equal(sanitizeUpload({ filename: "x.pdf", mimeType: "application/pdf", data: "AAAA" }).ok, false);
  assert.equal(sanitizeUpload({ filename: "x.jpg", mimeType: "image/jpeg", data: "A".repeat(7_000_001) }).ok, false);
});
