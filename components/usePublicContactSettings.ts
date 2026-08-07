"use client";

import { contactConfig } from "@/config/contact";
import { useEffect, useState } from "react";

export type PublicContactSettings = {
  companyName: string;
  phone: string;
  email: string;
  lineUrl: string;
  facebookUrl: string;
};

export const defaultPublicContactSettings: PublicContactSettings = {
  companyName: "บริษัท ทรัพย์สิริ แกรนด์ กรุ๊ป จำกัด",
  phone: contactConfig.phone.display,
  email: contactConfig.email.display,
  lineUrl: contactConfig.line.href,
  facebookUrl: contactConfig.facebook.href || "",
};

export function phoneHref(phone: string) {
  const cleaned = phone.replace(/[^\d+]/g, "");
  return cleaned.startsWith("0") ? `tel:+66${cleaned.slice(1)}` : `tel:${cleaned}`;
}

export function usePublicContactSettings() {
  const [settings, setSettings] = useState(defaultPublicContactSettings);
  useEffect(() => { fetch("/.netlify/functions/public-contact-settings", { cache: "no-store" }).then(async (response) => { if (!response.ok) return; const value = await response.json(); setSettings({ ...defaultPublicContactSettings, ...value }); }).catch(() => null); }, []);
  return settings;
}
