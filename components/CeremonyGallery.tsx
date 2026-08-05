"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type CeremonyGalleryProps = {
  images: string[];
};

export function CeremonyGallery({ images }: CeremonyGalleryProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const close = useCallback(() => setSelected(null), []);
  const previous = useCallback(() => {
    setSelected((current) => current === null ? null : (current - 1 + images.length) % images.length);
  }, [images.length]);
  const next = useCallback(() => {
    setSelected((current) => current === null ? null : (current + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (selected === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [close, next, previous, selected]);

  return <section className="section ceremony-gallery" aria-labelledby="ceremony-gallery-title">
    <div className="section-heading centered">
      <p className="kicker">SELECTED WORKS</p>
      <h2 id="ceremony-gallery-title">ภาพผลงานพิธีและการจัดเตรียม</h2>
      <p>ภาพจากผลงานจริงที่ลูกค้าให้ไว้ กดที่ภาพเพื่อดูขนาดใหญ่</p>
    </div>
    <div className="ceremony-gallery-grid">
      {images.map((src, index) => <button type="button" key={src} onClick={() => setSelected(index)} aria-label={`เปิดภาพผลงานที่ ${index + 1}`}>
        <Image src={src} alt={`ผลงานตั้งศาลและพิธีพราหมณ์ ภาพที่ ${index + 1}`} fill sizes="(max-width: 620px) 100vw, (max-width: 1000px) 50vw, 33vw" />
      </button>)}
    </div>
    {selected !== null && <div className="ceremony-lightbox" role="dialog" aria-modal="true" aria-label={`ภาพผลงานที่ ${selected + 1} จาก ${images.length}`} onClick={close}>
      <button className="ceremony-lightbox-close" type="button" onClick={close} aria-label="ปิดภาพขนาดใหญ่">×</button>
      <button className="ceremony-lightbox-control previous" type="button" onClick={(event) => { event.stopPropagation(); previous(); }} aria-label="ดูภาพก่อนหน้า">←</button>
      <div className="ceremony-lightbox-image" onClick={(event) => event.stopPropagation()}>
        <Image src={images[selected]} alt={`ผลงานตั้งศาลและพิธีพราหมณ์ ภาพที่ ${selected + 1}`} fill sizes="95vw" priority />
        <span>{selected + 1} / {images.length}</span>
      </div>
      <button className="ceremony-lightbox-control next" type="button" onClick={(event) => { event.stopPropagation(); next(); }} aria-label="ดูภาพถัดไป">→</button>
    </div>}
  </section>;
}
