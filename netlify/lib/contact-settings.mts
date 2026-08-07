export type ContactSettings = { lineUrl: string; facebookUrl: string };
export const defaultContactSettings: ContactSettings = { lineUrl: "https://lin.ee/r8WhnWC", facebookUrl: "" };

const safeSocialUrl = (value: unknown, allowedHosts: string[]) => {
  if (typeof value !== "string" || !value.trim()) return "";
  try { const url = new URL(value.trim()); return url.protocol === "https:" && allowedHosts.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`)) ? url.toString() : ""; }
  catch { return ""; }
};

export function normalizeContactSettings(value: unknown): ContactSettings | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  const lineUrl = safeSocialUrl(input.lineUrl, ["lin.ee", "line.me"]);
  const facebookUrl = safeSocialUrl(input.facebookUrl, ["facebook.com", "fb.com"]);
  if (input.lineUrl && !lineUrl) return null;
  if (input.facebookUrl && !facebookUrl) return null;
  return { lineUrl, facebookUrl };
}
