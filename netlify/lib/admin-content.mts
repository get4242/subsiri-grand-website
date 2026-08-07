export type ContentKind = "services" | "articles" | "promotions";

const text = (value: unknown, max = 4_000) => typeof value === "string" ? value.trim().slice(0, max) : "";
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const safeUrl = (value: unknown) => {
  const result = text(value, 1_000);
  if (!result || result.startsWith("/")) return result;
  try { const parsed = new URL(result); return ["http:", "https:"].includes(parsed.protocol) ? result : ""; }
  catch { return ""; }
};
const objectList = (value: unknown) => Array.isArray(value) ? value.slice(0, 30).map((item) => ({
  title: text((item as Record<string, unknown>)?.title, 200),
  description: text((item as Record<string, unknown>)?.description, 1_000),
})).filter((item) => item.title) : [];
const stringList = (value: unknown) => Array.isArray(value) ? value.slice(0, 50).map((item) => text(item, 4_000)).filter(Boolean) : [];

export function normalizeContentRecord(kind: ContentKind, value: unknown) {
  if (!value || typeof value !== "object" || !["services", "articles", "promotions"].includes(kind)) return { ok: false, error: "ข้อมูลไม่ถูกต้อง" };
  const input = value as Record<string, unknown>;
  const slug = text(input.slug, 100).toLowerCase();
  const title = text(input.title, 240);
  if (!slugPattern.test(slug)) return { ok: false, error: "ชื่อ URL ต้องเป็นภาษาอังกฤษ ตัวเลข และขีดกลางเท่านั้น" };
  if (!title) return { ok: false, error: "กรุณากรอกชื่อเรื่อง" };
  const common = { slug, title, description: text(input.description), enabled: input.enabled !== false, updatedAt: new Date().toISOString() };
  if (kind === "services") return { ok: true, record: {
    ...common, number: text(input.number, 10), note: text(input.note, 100), href: safeUrl(input.href) || `/services/${slug}`,
    image: safeUrl(input.image), imageAlt: text(input.imageAlt, 300), scopeTitle: text(input.scopeTitle, 300),
    scope: objectList(input.scope), steps: objectList(input.steps), price: text(input.price, 300),
    priceNote: text(input.priceNote), disclaimer: text(input.disclaimer),
  }};
  if (kind === "articles") return { ok: true, record: {
    ...common, category: text(input.category, 120), excerpt: text(input.excerpt, 600), publishedAt: text(input.publishedAt, 120),
    readingTime: text(input.readingTime, 120), coverImage: safeUrl(input.coverImage), coverImageAlt: text(input.coverImageAlt, 300),
    paragraphs: stringList(input.paragraphs), temporaryVisual: false,
  }};
  return { ok: true, record: {
    ...common, eyebrow: text(input.eyebrow, 120), ctaLabel: text(input.ctaLabel, 160), ctaHref: safeUrl(input.ctaHref) || "/contact",
  }};
}

export function sanitizeUpload(value: unknown) {
  if (!value || typeof value !== "object") return { ok: false, error: "ไฟล์ไม่ถูกต้อง" };
  const input = value as Record<string, unknown>;
  const filename = text(input.filename, 180).replace(/[^a-zA-Z0-9._-]/g, "-");
  const mimeType = text(input.mimeType, 80);
  const data = text(input.data, 7_000_001);
  if (!/^image\/(jpeg|png|webp|gif)$/.test(mimeType)) return { ok: false, error: "รองรับเฉพาะไฟล์ JPG, PNG, WebP หรือ GIF" };
  if (!data || data.length > 7_000_000) return { ok: false, error: "รูปต้องมีขนาดไม่เกินประมาณ 5 MB" };
  return { ok: true, upload: { filename: filename || `image-${Date.now()}.jpg`, mimeType, data, folder: text(input.folder, 100) || "general" } };
}
