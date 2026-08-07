import test from "node:test";
import assert from "node:assert/strict";
import { getAdminSystemStatus } from "../netlify/lib/admin-system-status.mts";

test("reports integrations from configuration without exposing secret values", () => {
  const status = getAdminSystemStatus({
    GOOGLE_APPS_SCRIPT_URL: "https://script.google.com/example",
    LEADS_SHARED_SECRET: "secret",
    LINE_CHANNEL_ACCESS_TOKEN: "token",
    LINE_TARGET_ID: "target",
  });
  assert.deepEqual(status, { googleSheets: true, lineOA: true, login: true, imageUploads: true });
  assert.equal(JSON.stringify(status).includes("secret"), false);
});

test("reports missing integrations accurately", () => {
  assert.deepEqual(getAdminSystemStatus({}), { googleSheets: false, lineOA: false, login: true, imageUploads: false });
});
