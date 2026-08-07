"use client";

import { contactConfig } from "@/config/contact";
import { phoneHref, usePublicContactSettings } from "@/components/usePublicContactSettings";

type ContactActionsProps = {
  variant?: "compact" | "hero" | "card" | "footer" | "header" | "dock";
  phoneLabel?: string;
  className?: string;
  onPhoneClick?: () => void;
};

function PhoneIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>;
}

function LineIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10.5c0-4-3.7-7.2-8.2-7.2S3.6 6.5 3.6 10.5c0 3.6 3 6.6 7.1 7.1.3.1.7.1 1 .1l2.1 2.6c.3.4.9.2.9-.3v-2.5c3.6-.8 6.3-3.5 6.3-6.9Z"/><path d="M7.4 9v3.2h2M10.2 9v3.2M12 12.2V9l2.2 3.2V9M17.2 9h-2v3.2h2"/></svg>;
}

function FacebookIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14.3 21v-8h2.8l.4-3h-3.2V8.1c0-.9.3-1.5 1.6-1.5h1.8V3.9c-.3 0-1.4-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H8.2v3H11v8h3.3Z"/></svg>;
}

export function ContactActions({ variant = "compact", phoneLabel, className = "", onPhoneClick }: ContactActionsProps) {
  const settings = usePublicContactSettings();
  return <div className={`contact-actions contact-actions--${variant} ${className}`.trim()} aria-label="ช่องทางติดต่อ โทรศัพท์ LINE และ Facebook">
    <a className="contact-action contact-action--phone" href={phoneHref(settings.phone)} onClick={onPhoneClick} aria-label={`โทร ${settings.phone}`}><PhoneIcon/><span>{phoneLabel ?? settings.phone}</span></a>
    <a className="contact-action contact-action--line" href={settings.lineUrl} target="_blank" rel="noreferrer" aria-label={`${contactConfig.line.display} เปิดในแท็บใหม่`}><LineIcon/><span>LINE</span></a>
    {settings.facebookUrl ? <a className="contact-action contact-action--facebook" href={settings.facebookUrl} target="_blank" rel="noreferrer" aria-label="Facebook เปิดในแท็บใหม่"><FacebookIcon/><span>Facebook</span></a> : <button className="contact-action contact-action--pending" type="button" disabled title={contactConfig.facebook.pendingLabel} aria-label={`Facebook ${contactConfig.facebook.pendingLabel}`}><FacebookIcon/><span>Facebook</span><small>{contactConfig.facebook.pendingLabel}</small></button>}
  </div>;
}
