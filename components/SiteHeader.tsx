"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { serviceCatalog } from "@/data/services";
import { ContactActions } from "@/components/ContactActions";

const mainLinks = [["หน้าแรก", "/"], ["ที่ดิน", "/land"], ["บทความ", "/articles"], ["เกี่ยวกับเรา", "/about"], ["ติดต่อ", "/contact"]];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const serviceMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => { setMenuOpen(false); setServiceOpen(false); });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") { setMenuOpen(false); setServiceOpen(false); } };
    const closeOnOutsideClick = (event: PointerEvent) => { if (serviceOpen && serviceMenuRef.current && !serviceMenuRef.current.contains(event.target as Node)) setServiceOpen(false); };
    window.addEventListener("keydown", closeOnEscape); document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => { window.removeEventListener("keydown", closeOnEscape); document.removeEventListener("pointerdown", closeOnOutsideClick); };
  }, [serviceOpen]);
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [menuOpen]);

  const closeAll = () => { setMenuOpen(false); setServiceOpen(false); };
  return <header className="site-header"><div className="nav-shell">
    <Link className="brand brand-logo" href="/" aria-label="ทรัพย์สิริ แกรนด์ กรุ๊ป หน้าแรก" onClick={closeAll}><Image src="/subsiri-logo.png" alt="โลโก้บริษัท ทรัพย์สิริ แกรนด์ กรุ๊ป จำกัด" width={64} height={64} priority /></Link>
    <nav className="desktop-nav" aria-label="เมนูหลัก">
      <Link href="/" onClick={closeAll}>หน้าแรก</Link><Link href="/land" onClick={closeAll}>ที่ดิน</Link>
      <div className="nav-services" ref={serviceMenuRef}><button type="button" aria-expanded={serviceOpen} aria-controls="desktop-services-menu" onClick={() => setServiceOpen((open) => !open)}>บริการ</button>{serviceOpen && <div id="desktop-services-menu" className="desktop-services-menu"><Link className="all-services" href="/services" onClick={closeAll}>บริการทั้งหมด</Link>{serviceCatalog.map((service) => <Link key={service.href} href={service.href} onClick={closeAll}>{service.title}</Link>)}</div>}</div>
      <Link href="/articles" onClick={closeAll}>บทความ</Link><Link href="/about" onClick={closeAll}>เกี่ยวกับเรา</Link><Link href="/contact" onClick={closeAll}>ติดต่อ</Link>
    </nav>
    <ContactActions variant="header"/>
    <button className={`menu-toggle${menuOpen ? " is-open" : ""}`} type="button" aria-label={menuOpen ? "ปิดเมนู" : "เปิดเมนู"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen((open) => !open)}><span></span><span></span><span></span></button>
    {menuOpen && <div className="mobile-overlay"><button className="mobile-backdrop" type="button" onClick={closeAll} aria-label="ปิดเมนู"></button><aside className="mobile-panel" id="mobile-navigation" aria-label="เมนูมือถือ"><div className="mobile-panel-head"><span>เมนู</span><button type="button" onClick={closeAll} aria-label="ปิดเมนู">×</button></div><nav>{mainLinks.slice(0,2).map(([label,href]) => <Link key={href} href={href} onClick={closeAll}>{label}</Link>)}<p>บริการ</p><Link href="/services" onClick={closeAll}>บริการทั้งหมด</Link>{serviceCatalog.map((service) => <Link className="mobile-sub-link" key={service.href} href={service.href} onClick={closeAll}>{service.title}</Link>)}{mainLinks.slice(2).map(([label,href]) => <Link key={href} href={href} onClick={closeAll}>{label}</Link>)}</nav><ContactActions variant="compact" className="mobile-menu-contacts" onPhoneClick={closeAll}/></aside></div>}
  </div></header>;
}
