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

function formatLineMessage(lead: LeadRecord) {
  return [
    "มี Lead ใหม่จากเว็บไซต์ทรัพย์สิริ",
    `ชื่อ: ${lead.name}`,
    `โทร: ${lead.phone}`,
    `อีเมล: ${lead.email || "ไม่ระบุ"}`,
    `สนใจ: ${lead.interest}`,
    `ข้อความ: ${lead.message}`,
    `หน้าเว็บ: ${lead.sourceUrl || "ไม่ระบุ"}`,
    `เวลา: ${lead.timestamp}`,
  ].join("\n").slice(0, 4900);
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
  const lineTarget = process.env.LINE_TARGET_ID;

  if (!googleUrl || !sharedSecret || !lineToken || !lineTarget) {
    return json(503, {
      ok: false,
      error: "ระบบรับข้อมูลยังตั้งค่าไม่ครบ กรุณาโทร 090-249-1459 หรือติดต่อ contact@subsiri.co.th",
    });
  }

  try {
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

    const lineResponse = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lineToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: lineTarget,
        messages: [{ type: "text", text: formatLineMessage(lead) }],
      }),
    });

    if (!lineResponse.ok) {
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
