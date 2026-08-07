export type ContactSettings = { companyName: string; phone: string; email: string; lineUrl: string; facebookUrl: string };
export const defaultContactSettings: ContactSettings = { companyName: "บริษัท ทรัพย์สิริ แกรนด์ กรุ๊ป จำกัด", phone: "090-249-1459", email: "contact@subsiri.co.th", lineUrl: "https://lin.ee/r8WhnWC", facebookUrl: "" };

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
  const companyName = typeof input.companyName === "string" && input.companyName.trim() ? input.companyName.trim().slice(0, 160) : defaultContactSettings.companyName;
  const phone = typeof input.phone === "string" && /^[+\d][\d\s()-]{7,29}$/.test(input.phone.trim()) ? input.phone.trim() : defaultContactSettings.phone;
  const email = typeof input.email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim()) ? input.email.trim().slice(0, 160) : defaultContactSettings.email;
  if ("companyName" in input && (!input.companyName || typeof input.companyName !== "string" || !input.companyName.trim())) return null;
  if ("phone" in input && phone === defaultContactSettings.phone && input.phone !== defaultContactSettings.phone) return null;
  if ("email" in input && email === defaultContactSettings.email && input.email !== defaultContactSettings.email) return null;
  if (input.lineUrl && !lineUrl) return null;
  if (input.facebookUrl && !facebookUrl) return null;
  return { companyName, phone, email, lineUrl, facebookUrl };
}
