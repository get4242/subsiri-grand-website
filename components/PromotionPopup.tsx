"use client";
import { useState } from "react";
import Link from "next/link";
import { promotionConfig } from "@/config/promotion";
export function PromotionPopup() {
  const [open, setOpen] = useState(promotionConfig.enabled);
  if (!open) return null;
  return <div className="promotion-backdrop" role="dialog" aria-modal="true" aria-labelledby="promotion-title"><div className="promotion-modal"><button className="promotion-close" type="button" onClick={() => setOpen(false)} aria-label="ปิดโปรโมชัน">×</button><p className="kicker">{promotionConfig.eyebrow}</p><h2 id="promotion-title">{promotionConfig.title}</h2><p>{promotionConfig.description}</p><Link className="button gold" href={promotionConfig.ctaHref} onClick={() => setOpen(false)}>{promotionConfig.ctaLabel}</Link></div></div>;
}
