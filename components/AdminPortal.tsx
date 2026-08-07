"use client";

import { FormEvent, ReactNode, useEffect, useState } from "react";
import Link from "next/link";

type SessionState = "loading" | "guest" | "authenticated" | "unconfigured";

export function AdminPortal({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>("loading");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/.netlify/functions/admin-session", { credentials: "same-origin", cache: "no-store" })
      .then(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (response.ok && body.ok) setState("authenticated");
        else setState(body.configured === false ? "unconfigured" : "guest");
      })
      .catch(() => setState("guest"));
  }, []);

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/.netlify/functions/admin-login", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.get("username"), password: form.get("password") }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "ไม่สามารถเข้าสู่ระบบได้");
      setState("authenticated");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "ไม่สามารถเข้าสู่ระบบได้");
    } finally {
      setSubmitting(false);
    }
  };

  const logout = async () => {
    await fetch("/.netlify/functions/admin-logout", { method: "POST", credentials: "same-origin" }).catch(() => null);
    setState("guest");
  };

  if (state === "authenticated") return <div className="admin-authenticated">{children}<button className="admin-logout-button" type="button" onClick={logout}>ออกจากระบบ</button></div>;

  return <main className="admin-login-shell">
    <section className="admin-login-card" aria-busy={state === "loading"}>
      <div className="admin-login-brand"><span>SG</span><div><strong>SUBSIRI</strong><small>ADMINISTRATION</small></div></div>
      <p className="admin-login-kicker">SECURE ACCESS</p>
      <h1>เข้าสู่ระบบผู้ดูแล</h1>
      {state === "loading" ? <p className="admin-login-message">กำลังตรวจสอบสถานะการเข้าสู่ระบบ…</p> : <>
        {state === "unconfigured" && <p className="admin-login-warning">ระบบยังตั้งค่าไม่ครบ กรุณาเพิ่ม ADMIN_USERNAME, ADMIN_PASSWORD และ ADMIN_SESSION_SECRET ใน Netlify ก่อนใช้งาน</p>}
        <form onSubmit={login}>
          <label>ชื่อผู้ใช้<input name="username" autoComplete="username" required disabled={submitting || state === "unconfigured"}/></label>
          <label>รหัสผ่าน<input name="password" type="password" autoComplete="current-password" required disabled={submitting || state === "unconfigured"}/></label>
          <button type="submit" disabled={submitting || state === "unconfigured"}>{submitting ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}</button>
        </form>
        {error && <p className="admin-login-error" role="alert">{error}</p>}
      </>}
      <Link href="/">← กลับหน้าเว็บไซต์</Link>
    </section>
  </main>;
}
