export type AdminPropertyStatus = "พร้อมขาย" | "พร้อมโอน" | "sold";

export type AdminProperty = {
  slug: string;
  name: string;
  location: string;
  area: string;
  price: string;
  status: AdminPropertyStatus;
  eyebrow: string;
  description: string;
  titleDeed: string;
  roadAccess: string;
  electricity: string;
  mapUrl: string;
  youtubeUrl: string;
  images: string[];
  highlights: string[];
};

const statuses = new Set<AdminPropertyStatus>(["พร้อมขาย", "พร้อมโอน", "sold"]);
const text = (value: unknown, max = 500) => typeof value === "string" ? value.trim().slice(0, max) : "";

const url = (value: unknown) => {
  const result = text(value, 1_000);
  if (!result) return "";
  if (result.startsWith("/")) return result;
  try {
    const parsed = new URL(result);
    return ["http:", "https:"].includes(parsed.protocol) ? result : null;
  } catch {
    return null;
  }
};

const stringList = (value: unknown, map: (item: unknown) => string | null = (item) => text(item, 500)) => {
  if (!Array.isArray(value) || value.length > 30) return null;
  const items = value.map(map);
  return items.some((item) => item === null) ? null : items.filter(Boolean) as string[];
};

export function normalizeAdminProperty(value: unknown): { ok: boolean; property?: AdminProperty; error?: string } {
  if (!value || typeof value !== "object") return { ok: false, error: "ข้อมูลที่ดินไม่ถูกต้อง" };
  const input = value as Record<string, unknown>;
  const slug = text(input.slug, 100).toLowerCase();
  const name = text(input.name, 180);
  const location = text(input.location, 300);
  const area = text(input.area, 120);
  const price = text(input.price, 160);
  const status = text(input.status, 30) as AdminPropertyStatus;
  const images = stringList(input.images ?? [], url);
  const highlights = stringList(input.highlights ?? [], (item) => text(item, 200));

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return { ok: false, error: "Slug ต้องเป็นภาษาอังกฤษ ตัวเลข และขีดกลางเท่านั้น" };
  if (!name || !location || !area || !price) return { ok: false, error: "กรุณากรอกชื่อ ทำเล เนื้อที่ และราคา" };
  if (!statuses.has(status)) return { ok: false, error: "สถานะที่ดินไม่ถูกต้อง" };
  if (!images) return { ok: false, error: "ลิงก์รูปภาพไม่ถูกต้อง" };
  if (!highlights) return { ok: false, error: "รายการจุดเด่นไม่ถูกต้อง" };

  const mapUrl = url(input.mapUrl);
  const youtubeUrl = url(input.youtubeUrl);
  if (mapUrl === null || youtubeUrl === null) return { ok: false, error: "ลิงก์แผนที่หรือ YouTube ไม่ถูกต้อง" };

  return { ok: true, property: {
    slug, name, location, area, price, status,
    eyebrow: text(input.eyebrow, 180),
    description: text(input.description, 4_000),
    titleDeed: text(input.titleDeed, 180),
    roadAccess: text(input.roadAccess, 300),
    electricity: text(input.electricity, 180),
    mapUrl, youtubeUrl, images, highlights,
  } };
}
