import type { Property } from "@/data/properties";

export function mergeBySlug<T extends { slug: string }>(fallback: T[], overrides: Partial<T>[]) {
  const bySlug = new Map(fallback.map((item) => [item.slug, item]));
  for (const override of overrides) {
    if (!override.slug) continue;
    const base = bySlug.get(override.slug);
    bySlug.set(override.slug, { ...(base ?? {}), ...override } as T);
  }
  return [...bySlug.values()];
}

const provinceFromLocation = (location: string) => {
  const match = location.match(/จ\.\s*([^\s,]+)/);
  return match?.[1] ?? "อื่น ๆ";
};

export function normalizePublicProperty(value: unknown): Property | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  const string = (key: string) => typeof item[key] === "string" ? item[key] as string : "";
  const slug = string("slug"); const name = string("name"); const location = string("location");
  if (!slug || !name || !location) return null;
  const images = Array.isArray(item.images) ? item.images.filter((entry): entry is string => typeof entry === "string" && Boolean(entry)) : [];
  return {
    slug, name, location, area: string("area"), price: string("price"),
    province: string("province") || provinceFromLocation(location), titleDeed: string("titleDeed") || "กรุณาสอบถามทีมงาน",
    eyebrow: string("eyebrow") || "ที่ดินจากรายการปัจจุบัน", description: string("description"),
    highlights: Array.isArray(item.highlights) ? item.highlights.filter((entry): entry is string => typeof entry === "string") : [],
    status: (["พร้อมขาย", "พร้อมโอน", "sold"].includes(string("status")) ? string("status") : "พร้อมขาย") as Property["status"],
    image: images[0] || string("image") || "/temporary/services/property-ai-temporary.png", images: images.length ? images : ["/temporary/services/property-ai-temporary.png"],
    mapUrl: string("mapUrl") || null, youtubeUrl: string("youtubeUrl") || null,
  };
}
