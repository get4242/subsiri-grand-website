"use client";

import { FormEvent, useState } from "react";

type SubmitState = "idle" | "loading" | "success" | "error";

type ApiResponse = {
  ok?: boolean;
  message?: string;
  error?: string;
  warning?: string;
};

export function ContactForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [notice, setNotice] = useState("");

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setState("loading");
    setNotice("กำลังส่งข้อมูล กรุณารอสักครู่…");

    try {
      const response = await fetch("/.netlify/functions/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          phone: formData.get("phone"),
          email: formData.get("email"),
          interest: formData.get("interest"),
          message: formData.get("message"),
          company: formData.get("company"),
          sourceUrl: window.location.href,
          timestamp: new Date().toISOString(),
        }),
      });
      const result = await response.json().catch(() => ({})) as ApiResponse;

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "ไม่สามารถส่งข้อมูลได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง");
      }

      setState("success");
      setNotice(result.warning || result.message || "ส่งข้อมูลเรียบร้อยแล้ว ทีมงานจะติดต่อกลับโดยเร็วที่สุด");
      form.reset();
    } catch (error) {
      setState("error");
      setNotice(error instanceof Error ? error.message : "ไม่สามารถส่งข้อมูลได้ กรุณาติดต่อทีมงานทางโทรศัพท์");
    }
  }

  return <form className="contact-form" onSubmit={submitLead}>
    <div className="form-row">
      <label>ชื่อ–นามสกุล<input name="name" autoComplete="name" maxLength={120} required /></label>
      <label>เบอร์โทรศัพท์<input name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={30} required /></label>
    </div>
    <label>อีเมล <span className="optional-label">(ไม่บังคับ)</span><input name="email" type="email" autoComplete="email" maxLength={160} /></label>
    <label>สนใจบริการหรือที่ดิน<select name="interest" defaultValue="" required><option value="" disabled>เลือกหัวข้อที่สนใจ</option><option>ซื้อ–ขายหรือจัดหาที่ดิน</option><option>สอบถามที่ดินที่ประกาศ</option><option>ดูฮวงจุ้ย</option><option>ตั้งศาลหรือพิธีพราหมณ์</option><option>ตรวจดวงชะตา</option><option>อื่น ๆ</option></select></label>
    <label>รายละเอียด<textarea name="message" rows={5} maxLength={2000} required placeholder="แจ้งชื่อแปลงที่ดิน บริการ หรือข้อมูลเบื้องต้นที่ต้องการให้ทีมงานทราบ" /></label>
    <label className="lead-honeypot" aria-hidden="true">ชื่อบริษัท<input name="company" tabIndex={-1} autoComplete="off" /></label>
    <p className="form-warning">เมื่อส่งแบบฟอร์ม ข้อมูลจะถูกส่งให้ทีมงานเพื่อใช้ติดต่อกลับ โปรดหลีกเลี่ยงการส่งข้อมูลอ่อนไหวหรือเอกสารสำคัญผ่านช่องนี้</p>
    <button className="button gold" type="submit" disabled={state === "loading"}>{state === "loading" ? "กำลังส่ง…" : "ส่งข้อมูลให้ทีมงาน"}</button>
    {notice && <p className={`form-notice is-${state}`} role={state === "error" ? "alert" : "status"} aria-live="polite">{notice}</p>}
  </form>;
}
