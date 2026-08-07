import test from "node:test";
import assert from "node:assert/strict";

import { mergeBySlug, normalizePublicProperty } from "../lib/cms-data.ts";

test("sheet records override matching static records without removing untouched records", () => {
  const fallback = [{ slug: "one", name: "เดิม" }, { slug: "two", name: "คงเดิม" }];
  const merged = mergeBySlug(fallback, [{ slug: "one", name: "แก้แล้ว" }, { slug: "three", name: "เพิ่มใหม่" }]);
  assert.deepEqual(merged.map((item) => item.name), ["แก้แล้ว", "คงเดิม", "เพิ่มใหม่"]);
});

test("public property derives province and cover image safely", () => {
  const value = normalizePublicProperty({ slug: "land", name: "ที่ดิน", eyebrow: "ที่ดิน", location: "อ.เมือง จ.เชียงใหม่", area: "1 ไร่", price: "1 บาท", status: "พร้อมขาย", images: ["/one.jpg"] });
  assert.equal(value?.province, "เชียงใหม่");
  assert.equal(value?.image, "/one.jpg");
  assert.equal(value?.eyebrow, "");
});
