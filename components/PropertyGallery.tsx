"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

type PropertyGalleryProps = { images: string[]; propertyName: string };

export function PropertyGallery({ images, propertyName }: PropertyGalleryProps) {
  const [selected, setSelected] = useState(0);
  const previous = useCallback(() => setSelected((value) => (value - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setSelected((value) => (value + 1) % images.length), [images.length]);

  return <section className="property-gallery section" aria-labelledby="gallery-title">
    <div className="gallery-heading"><div><p className="kicker">PROPERTY GALLERY</p><h2 id="gallery-title">ภาพที่ดิน {propertyName}</h2></div><p aria-live="polite">ภาพ {selected + 1} จาก {images.length}</p></div>
    <div className="gallery-stage" tabIndex={0} aria-label={`แกลเลอรีภาพที่ดิน ${propertyName} ใช้ปุ่มลูกศรซ้ายและขวาเพื่อเปลี่ยนภาพ`} onKeyDown={(event) => { if (event.key === "ArrowLeft") previous(); if (event.key === "ArrowRight") next(); }}>
      <Image src={images[selected]} alt={`ภาพที่ดิน ${propertyName} ลำดับที่ ${selected + 1}`} fill priority={selected === 0} unoptimized={images[selected].startsWith("http")} sizes="(max-width: 900px) 100vw, 88vw" />
      {images.length > 1 && <><button className="gallery-control previous" type="button" onClick={previous} aria-label="ดูภาพก่อนหน้า">←</button><button className="gallery-control next" type="button" onClick={next} aria-label="ดูภาพถัดไป">→</button></>}
    </div>
    <div className="gallery-thumbnails" aria-label="เลือกภาพที่ดิน">{images.map((image, index) => <button key={image} type="button" className={selected === index ? "is-active" : ""} onClick={() => setSelected(index)} aria-label={`แสดงภาพที่ ${index + 1}`} aria-pressed={selected === index}><Image src={image} alt="" fill unoptimized={image.startsWith("http")} sizes="140px" /></button>)}</div>
  </section>;
}
