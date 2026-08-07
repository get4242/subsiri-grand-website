import test from "node:test";
import assert from "node:assert/strict";

import {
  createAdminSession,
  readAdminSession,
  verifyAdminCredentials,
} from "../netlify/lib/admin-auth.mts";

const config = {
  username: "owner",
  password: "correct horse battery staple",
  sessionSecret: "a-session-secret-that-is-long-enough-for-tests",
};

test("accepts configured credentials and rejects incorrect credentials", () => {
  assert.equal(verifyAdminCredentials("owner", config.password, config), true);
  assert.equal(verifyAdminCredentials("owner", "wrong", config), false);
  assert.equal(verifyAdminCredentials("other", config.password, config), false);
});

test("creates a signed session that can be read from a cookie header", async () => {
  const token = await createAdminSession(config, 1_800_000_000_000);
  const session = await readAdminSession(`subsiri_admin=${token}`, config, 1_800_000_000_100);

  assert.equal(session?.username, "owner");
});

test("rejects tampered and expired sessions", async () => {
  const token = await createAdminSession(config, 1_800_000_000_000, 60);

  assert.equal(await readAdminSession(`subsiri_admin=${token}x`, config, 1_800_000_000_100), null);
  assert.equal(await readAdminSession(`subsiri_admin=${token}`, config, 1_800_000_061_000), null);
});
