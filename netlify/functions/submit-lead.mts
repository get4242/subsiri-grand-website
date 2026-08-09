import { getStore } from "@netlify/blobs";

type LeadInput = {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  interest?: unknown;
  message?: unknown;
  company?: unknown;
  sourceUrl?: unknown;
  timestamp?: unknown;
};

type LeadRecord = {
  name: string;
  phone: string;
  email: string;
  interest: string;
  message: string;
  sourceUrl: string;
  timestamp: string;
};

const json = (status: number, payload: Record<string, unknown>) => Response.json(payload, {
  status,
  headers: {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
  },
});

const text = (value: unknown, maxLength: number) => typeof value === "string" ? value.trim().slice(0, maxLength) : "";

function validateLead(input: LeadInput): { lead?: LeadRecord; error?: string } {
  if (text(input.company, 100)) return { error: "ไม่สามารถรับข้อมูลรายการนี้ได้" };

  const name = text(input.name, 120);
  const phone = text(input.phone, 30);
  const email = text(input.email, 160);
  const interest = text(input.interest, 160);
  const message = text(input.message, 2000);
  const sourceUrl = text(input.sourceUrl, 500);

  if (!name || !phone || !interest || !message) {
    return { error: "กรุณากรอกชื่อ เบอร์โทร หัวข้อที่สนใจ และรายละเอียดให้ครบ" };
  }
  if (!/^[+\d][\d\s()+-]{7,29}$/.test(phone)) {
    return { error: "รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง" };
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "รูปแบบอีเมลไม่ถูกต้อง" };
  }
  if (sourceUrl) {
    try {
      const parsed = new URL(sourceUrl);
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error("invalid protocol");
    } catch {
      return { error: "ข้อมูลหน้าต้นทางไม่ถูกต้อง" };
    }
  }

  return {
    lead: {
      name,
      phone,
      email,
      interest,
      message,
      sourceUrl,
      timestamp: new Date().toISOString(),
    },
  };
}

function formatThaiTimestamp(timestamp: string) {
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Bangkok",
  }).format(new Date(timestamp));
}

function lineDetailRow(label: string, value: string) {
  return {
    type: "box",
    layout: "baseline",
    spacing: "sm",
    contents: [
      { type: "text", text: label, color: "#9A7A3A", size: "sm", weight: "bold", flex: 2 },
      { type: "text", text: value, color: "#172B3A", size: "sm", wrap: true, flex: 5 },
    ],
  };
}

function buildLineMessage(lead: LeadRecord) {
  return {
    type: "flex",
    altText: `มีลูกค้าใหม่จากเว็บไซต์: ${lead.name}`,
    contents: {
      type: "bubble",
      styles: {
        header: { backgroundColor: "#071B2B" },
        footer: { separator: true, separatorColor: "#D8C28F" },
      },
      header: {
        type: "box",
        layout: "vertical",
        paddingAll: "20px",
        contents: [
          { type: "text", text: "มีลูกค้าใหม่จากเว็บไซต์", color: "#D8B968", size: "lg", weight: "bold", wrap: true },
          { type: "text", text: "ทรัพย์สิริ แกรนด์ กรุ๊ป", color: "#FFFFFF", size: "xs", margin: "sm" },
        ],
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        paddingAll: "20px",
        contents: [
          lineDetailRow("ชื่อ", lead.name),
          lineDetailRow("โทร", lead.phone),
          lineDetailRow("อีเมล", lead.email || "ไม่ระบุ"),
          lineDetailRow("สนใจ", lead.interest),
          { type: "separator", color: "#E8DFC9", margin: "md" },
          { type: "text", text: "ข้อความจากลูกค้า", color: "#9A7A3A", size: "xs", weight: "bold" },
          { type: "text", text: lead.message, color: "#172B3A", size: "sm", wrap: true },
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        paddingAll: "14px",
        contents: [
          { type: "text", text: `รับข้อมูลเมื่อ ${formatThaiTimestamp(lead.timestamp)} น.`, color: "#7A8791", size: "xs", align: "center" },
        ],
      },
    },
  };
}

export default async function submitLead(request: Request) {
  if (request.method !== "POST") {
    return json(405, { ok: false, error: "รองรับเฉพาะการส่งข้อมูลแบบ POST" });
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 25_000) return json(413, { ok: false, error: "ข้อมูลมีขนาดใหญ่เกินไป" });

  let input: LeadInput;
  try {
    const raw = await request.text();
    if (raw.length > 25_000) return json(413, { ok: false, error: "ข้อมูลมีขนาดใหญ่เกินไป" });
    input = JSON.parse(raw) as LeadInput;
  } catch {
    return json(400, { ok: false, error: "รูปแบบข้อมูลไม่ถูกต้อง" });
  }

  const { lead, error } = validateLead(input);
  if (!lead || error) return json(400, { ok: false, error });

  const googleUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  const sharedSecret = process.env.LEADS_SHARED_SECRET;
  const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const fallbackLineTarget = process.env.LINE_TARGET_ID;

  if (!googleUrl || !sharedSecret || !lineToken || !fallbackLineTarget) {
    return json(503, {
      ok: false,
      error: "ระบบรับข้อมูลยังตั้งค่าไม่ครบ กรุณาโทร 090-249-1459 หรือติดต่อ contact@subsiri.co.th",
    });
  }

  try {
    const settingsStore = getStore({ name: "site-settings", consistency: "strong" });
    const savedTargets = await settingsStore.get("line-notification-targets", { type: "json" }).catch(() => null) as { targetIds?: unknown } | null;
    const legacyTarget = await settingsStore.get("line-notification-target", { type: "json" }).catch(() => null) as { targetId?: unknown } | null;
    const persistedTargets = Array.isArray(savedTargets?.targetIds) ? savedTargets.targetIds.filter((target): target is string => typeof target === "string" && /^[CR][0-9a-f]{32}$/i.test(target)) : [];
    if (legacyTarget && typeof legacyTarget.targetId === "string" && /^[CR][0-9a-f]{32}$/i.test(legacyTarget.targetId)) persistedTargets.push(legacyTarget.targetId);
    const lineTargets = [...new Set(persistedTargets)];
    if (!lineTargets.length) lineTargets.push(fallbackLineTarget);
    const sheetResponse = await fetch(googleUrl, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: sharedSecret, lead }),
    });
    if (!sheetResponse.ok) {
      return json(502, { ok: false, error: "ไม่สามารถบันทึกข้อมูลได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง" });
    }
    const sheetResult = await sheetResponse.json().catch(() => null) as { ok?: boolean } | null;
    if (!sheetResult?.ok) {
      return json(502, { ok: false, error: "Google Sheets ไม่ยืนยันการบันทึกข้อมูล กรุณาตรวจสอบ Apps Script" });
    }

    const lineResponses = await Promise.all(lineTargets.map((targetId) => fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lineToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to: targetId, messages: [buildLineMessage(lead)] }),
    }).then((response) => response.ok).catch(() => false)));

    if (lineResponses.some((sent) => !sent)) {
      return json(202, {
        ok: true,
        warning: "บันทึกข้อมูลแล้ว แต่การแจ้งเตือนทีมงานขัดข้อง ทีมงานจะตรวจสอบจากรายการ Lead",
      });
    }

    return json(200, { ok: true, message: "ส่งข้อมูลเรียบร้อยแล้ว ทีมงานจะติดต่อกลับโดยเร็วที่สุด" });
  } catch {
    return json(502, { ok: false, error: "ระบบเชื่อมต่อภายนอกขัดข้อง กรุณาลองใหม่อีกครั้ง" });
  }
}
