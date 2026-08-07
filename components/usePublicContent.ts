"use client";
import { useEffect, useState } from "react";
export type PublicContent = { properties: unknown[]; services: Record<string, unknown>[]; articles: Record<string, unknown>[]; promotions: Record<string, unknown>[] };
const empty: PublicContent = { properties: [], services: [], articles: [], promotions: [] };
let cached: PublicContent | null = null;
export function usePublicContent() {
  const [content, setContent] = useState<PublicContent>(cached ?? empty);
  useEffect(() => { if (cached) return; fetch("/.netlify/functions/public-content", { cache: "no-store" }).then(async (response) => { const body = await response.json(); if (!response.ok || !body.ok) return; cached = { properties: body.properties ?? [], services: body.services ?? [], articles: body.articles ?? [], promotions: body.promotions ?? [] }; setContent(cached); }).catch(() => null); }, []);
  return content;
}
