import test from "node:test";
import assert from "node:assert/strict";

import adminLogin from "../netlify/functions/admin-login.mts";
import adminSession from "../netlify/functions/admin-session.mts";

const originalEnv = { ...process.env };

test.beforeEach(() => {
  process.env.ADMIN_USERNAME = "owner";
  process.env.ADMIN_PASSWORD = "strong-test-password";
  process.env.ADMIN_SESSION_SECRET = "a-session-secret-that-is-long-enough-for-tests";
});

test.after(() => {
  process.env = originalEnv;
});

test("login rejects non-object JSON and invalid credentials without setting a cookie", async () => {
  const invalidBody = await adminLogin(new Request("https://example.test/.netlify/functions/admin-login", { method: "POST", body: "null" }));
  assert.equal(invalidBody.status, 400);

  const invalidCredentials = await adminLogin(new Request("https://example.test/.netlify/functions/admin-login", {
    method: "POST",
    body: JSON.stringify({ username: "owner", password: "wrong" }),
  }));
  assert.equal(invalidCredentials.status, 401);
  assert.equal(invalidCredentials.headers.get("set-cookie"), null);
});

test("successful login cookie authenticates the session endpoint", async () => {
  const login = await adminLogin(new Request("https://example.test/.netlify/functions/admin-login", {
    method: "POST",
    body: JSON.stringify({ username: "owner", password: "strong-test-password" }),
  }));
  assert.equal(login.status, 200);
  const cookie = login.headers.get("set-cookie");
  assert.match(cookie ?? "", /HttpOnly/);
  assert.match(cookie ?? "", /SameSite=Strict/);

  const session = await adminSession(new Request("https://example.test/.netlify/functions/admin-session", {
    headers: { cookie: cookie?.split(";")[0] ?? "" },
  }));
  assert.equal(session.status, 200);
  assert.equal((await session.json()).ok, true);
});
