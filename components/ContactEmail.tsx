"use client";

import { usePublicContactSettings } from "@/components/usePublicContactSettings";

export function ContactEmail({ className = "", detailed = false }: { className?: string; detailed?: boolean }) {
  const { email } = usePublicContactSettings();
  return <a className={className} href={`mailto:${email}`}>{detailed ? <><span className="contact-icon" aria-hidden="true">✉</span><small>อีเมล</small><strong>{email}</strong></> : <>✉ {email}</>}</a>;
}
