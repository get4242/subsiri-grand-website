import { getStore } from "@netlify/blobs";

const validKey = /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9._-]+$/;

export default async function propertyImage(request: Request) {
  if (request.method !== "GET") return new Response("Method not allowed", { status: 405 });
  const key = new URL(request.url).searchParams.get("key") || "";
  if (!validKey.test(key)) return new Response("Invalid image key", { status: 400 });

  const store = getStore({ name: "property-images", consistency: "strong" });
  const entry = await store.getWithMetadata(key, { type: "arrayBuffer" });
  if (!entry?.data) return new Response("Image not found", { status: 404 });

  const metadata = entry.metadata as { contentType?: string } | undefined;
  return new Response(entry.data as ArrayBuffer, {
    headers: {
      "Content-Type": metadata?.contentType || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
