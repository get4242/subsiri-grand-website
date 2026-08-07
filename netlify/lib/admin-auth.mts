import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE_NAME = "subsiri_admin";
export const ADMIN_SESSION_TTL_SECONDS = 8 * 60 * 60;

export type AdminAuthConfig = {
  username: string;
  password: string;
  sessionSecret: string;
};

type AdminSession = {
  username: string;
  expiresAt: number;
};

const safeEqual = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
};

const sign = (payload: string, secret: string) => createHmac("sha256", secret).update(payload).digest("base64url");

export function getAdminAuthConfig(env: NodeJS.ProcessEnv = process.env): AdminAuthConfig | null {
  const username = env.ADMIN_USERNAME?.trim();
  const password = env.ADMIN_PASSWORD;
  const sessionSecret = env.ADMIN_SESSION_SECRET;

  if (!username || !password || !sessionSecret || sessionSecret.length < 32) return null;
  return { username, password, sessionSecret };
}

export function verifyAdminCredentials(username: string, password: string, config: AdminAuthConfig) {
  const usernameMatches = safeEqual(username.trim(), config.username);
  const passwordMatches = safeEqual(password, config.password);
  return usernameMatches && passwordMatches;
}

export async function createAdminSession(
  config: AdminAuthConfig,
  now = Date.now(),
  ttlSeconds = ADMIN_SESSION_TTL_SECONDS,
) {
  const session: AdminSession = { username: config.username, expiresAt: now + ttlSeconds * 1000 };
  const payload = Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
  return `${payload}.${sign(payload, config.sessionSecret)}`;
}

export async function readAdminSession(cookieHeader: string | null, config: AdminAuthConfig, now = Date.now()) {
  const cookies = Object.fromEntries((cookieHeader ?? "").split(";").map((part) => {
    const separator = part.indexOf("=");
    return separator < 0 ? [part.trim(), ""] : [part.slice(0, separator).trim(), part.slice(separator + 1)];
  }));
  const token = cookies[ADMIN_COOKIE_NAME];
  if (!token) return null;

  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra || !safeEqual(signature, sign(payload, config.sessionSecret))) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Partial<AdminSession>;
    if (session.username !== config.username || typeof session.expiresAt !== "number" || session.expiresAt <= now) return null;
    return session as AdminSession;
  } catch {
    return null;
  }
}

export const adminSessionCookie = (token: string) => `${ADMIN_COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${ADMIN_SESSION_TTL_SECONDS}`;
export const clearAdminSessionCookie = () => `${ADMIN_COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;

export async function requireAdmin(request: Request) {
  const config = getAdminAuthConfig();
  if (!config) return { configured: false as const, session: null };
  return { configured: true as const, session: await readAdminSession(request.headers.get("cookie"), config) };
}
