"use client";
import { useState } from "react";
import Link from "next/link";
import { promotionConfig } from "@/config/promotion";
import { usePublicContent } from "@/components/usePublicContent";
export function PromotionPopup() {
  const cmsPromotion = usePublicContent().promotions.find((item) => item.slug === "homepage-popup");
  const promotion = { ...promotionConfig, ...(cmsPromotion ?? {}) } as typeof promotionConfig;
  const [open, setOpen] = useState(promotionConfig.enabled);
  if (promotion.enabled === false) return null;
  if (!open) return null;
  return <div className="promotion-backdrop" role="dialog" aria-modal="true" aria-labelledby="promotion-title"><div className="promotion-modal"><button className="promotion-close" type="button" onClick={() => setOpen(false)} aria-label="ปิดโปรโมชัน">×</button><p className="kicker">{promotion.eyebrow}</p><h2 id="promotion-title">{promotion.title}</h2><p>{promotion.description}</p><Link className="button gold" href={promotion.ctaHref} onClick={() => setOpen(false)}>{promotion.ctaLabel}</Link></div></div>;
}
