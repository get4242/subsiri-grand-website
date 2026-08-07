import test from "node:test";
import assert from "node:assert/strict";
import { normalizeContactSettings } from "../netlify/lib/contact-settings.mts";

test("accepts official LINE and Facebook links", () => {
  assert.deepEqual(normalizeContactSettings({ lineUrl: "https://lin.ee/r8WhnWC", facebookUrl: "https://www.facebook.com/subsiri" }), {
    lineUrl: "https://lin.ee/r8WhnWC", facebookUrl: "https://www.facebook.com/subsiri",
  });
});

test("rejects unsafe or unrelated social links", () => {
  assert.equal(normalizeContactSettings({ lineUrl: "javascript:alert(1)", facebookUrl: "" }), null);
  assert.equal(normalizeContactSettings({ lineUrl: "https://lin.ee/r8WhnWC", facebookUrl: "https://example.com/fake" }), null);
});
