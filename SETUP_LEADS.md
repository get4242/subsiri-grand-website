# ตั้งค่าระบบ Lead: Google Sheets และ LINE OA

โค้ดเว็บไซต์พร้อมเชื่อมระบบแล้ว แต่จะยังส่งข้อมูลจริงไม่ได้จนกว่าจะสร้าง Google Apps Script, เปิด Messaging API และตั้งค่า secrets ใน Netlify ครบทั้ง 4 ค่า ห้ามนำ token หรือ shared secret ใส่ในโค้ดฝั่งหน้าเว็บ

## ภาพรวมการทำงาน

1. ฟอร์มส่งข้อมูลไปที่ `/.netlify/functions/submit-lead`
2. Netlify Function ตรวจสอบข้อมูลและส่ง Lead ไปยัง Google Apps Script โดยแนบ shared secret
3. Apps Script ตรวจ secret แล้วเพิ่มแถวใน Google Sheet
4. เมื่อบันทึกสำเร็จ Function ส่ง Push message ไปยัง LINE user/group/room ที่กำหนด

ข้อมูลแต่ละรายการประกอบด้วย ชื่อ, โทรศัพท์, อีเมล (ถ้ามี), บริการหรือที่ดินที่สนใจ, ข้อความ, URL ต้นทาง และเวลาที่ server รับข้อมูล

## 1. สร้าง Google Sheet

1. สร้าง Google Sheet ใหม่ เช่น `Subsiri Leads`
2. เปลี่ยนชื่อชีตย่อยเป็น `Leads`
3. ใส่หัวคอลัมน์แถวแรกตามลำดับ:

   `Timestamp | Name | Phone | Email | Interest | Message | Source URL`

4. คัดลอก Spreadsheet ID จาก URL ซึ่งเป็นข้อความระหว่าง `/d/` และ `/edit`

## 2. สร้าง Google Apps Script

เปิด Google Sheet แล้วเลือก **Extensions → Apps Script** จากนั้นวางโค้ดตัวอย่างนี้:

```javascript
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || "{}");
    const properties = PropertiesService.getScriptProperties();
    const expectedSecret = properties.getProperty("LEADS_SHARED_SECRET");
    const sheetId = properties.getProperty("SHEET_ID");

    if (!expectedSecret || body.secret !== expectedSecret) {
      return jsonResponse({ ok: false, error: "unauthorized" });
    }

    const lead = body.lead || {};
    const sheet = SpreadsheetApp.openById(sheetId).getSheetByName("Leads");
    if (!sheet) throw new Error("Leads sheet not found");

    sheet.appendRow([
      lead.timestamp || new Date().toISOString(),
      lead.name || "",
      lead.phone || "",
      lead.email || "",
      lead.interest || "",
      lead.message || "",
      lead.sourceUrl || "",
    ]);

    return jsonResponse({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, error: "internal_error" });
  }
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
```

ใน Apps Script ให้เปิด **Project Settings → Script Properties** แล้วเพิ่ม:

- `SHEET_ID` = Spreadsheet ID ที่คัดลอกไว้
- `LEADS_SHARED_SECRET` = ข้อความสุ่มยาวและเดายาก ต้องใช้ค่าเดียวกับที่ตั้งใน Netlify

อย่าใส่ shared secret ลงในเซลล์ของ Sheet หรือโค้ดที่เผยแพร่สาธารณะ

## 3. Deploy Apps Script เป็น Web App

1. เลือก **Deploy → New deployment**
2. เลือกประเภท **Web app**
3. ตั้ง **Execute as** เป็นบัญชีผู้ deploy เพื่อให้เขียน Sheet ได้
4. ตั้งสิทธิ์การเข้าถึงให้ Netlify Function เรียกได้ โดยเลือกตัวเลือกที่รองรับผู้ใช้ภายนอก/ไม่ต้องล็อกอินตามนโยบายบัญชี Google Workspace
5. กด Deploy และอนุญาตสิทธิ์ที่จำเป็น
6. คัดลอก URL เวอร์ชันใช้งานจริงที่ลงท้ายด้วย `/exec` ไปใช้เป็น `GOOGLE_APPS_SCRIPT_URL` อย่าใช้ URL ทดสอบ `/dev`

เมื่อแก้โค้ด Apps Script ภายหลัง ต้องสร้าง deployment version ใหม่หรือแก้ deployment ให้ชี้ไปยังเวอร์ชันล่าสุด

## 4. เปิด LINE OA Messaging API

1. สร้างหรือเลือก LINE Official Account
2. เปิดใช้งาน Messaging API และเชื่อมกับ Provider/Channel ใน LINE Developers Console
3. ในหน้า Messaging API ของ Channel ออก Channel access token สำหรับใช้งานฝั่ง server
4. เก็บ token เป็น `LINE_CHANNEL_ACCESS_TOKEN` ใน Netlify เท่านั้น ไม่ใส่ใน React, `.env` ที่ commit หรือเอกสารสาธารณะ

### หา `LINE_TARGET_ID`

- ส่งเข้าผู้ใช้ของผู้ดูแล: ดู **Your user ID** ในแท็บ **Basic settings** ของ Messaging API Channel ผู้รับต้องเป็นผู้ใช้ที่ส่งข้อความถึง OA/เพิ่ม OA เป็นเพื่อนและยังรับข้อความได้
- ส่งเข้ากลุ่ม: เปิด **Allow bot to join group chats**, เชิญ OA เข้ากลุ่ม แล้วอ่าน `source.groupId` จาก webhook event เมื่อสมาชิกส่งข้อความในกลุ่ม
- ส่งเข้าห้องแบบ multi-person chat: อ่าน `source.roomId` จาก webhook event

LINE ID ที่ผู้ใช้ตั้งให้ค้นหาได้ เช่น `@ชื่อบัญชี` ไม่ใช่ `userId` และใช้แทน `LINE_TARGET_ID` ไม่ได้ สำหรับกลุ่มหรือห้อง จำเป็นต้องมี webhook receiver ชั่วคราวหรือระบบ webhook ของโครงการเพื่อบันทึก ID จาก event อย่างปลอดภัย

## 5. ตั้งค่า Environment Variables ใน Netlify

ที่ Netlify เลือก Site → **Project configuration → Environment variables** แล้วเพิ่ม:

- `GOOGLE_APPS_SCRIPT_URL`
- `LEADS_SHARED_SECRET`
- `LINE_CHANNEL_ACCESS_TOKEN`
- `LINE_TARGET_ID`

ถ้าบัญชีรองรับการกำหนด Scope ให้เปิดอย่างน้อย **Functions** ค่าเหล่านี้ต้องตั้งผ่าน Netlify UI/CLI/API ไม่ควรใส่ secret ใน `netlify.toml` หลังแก้ environment variables ให้ deploy ใหม่เพื่อให้ Function ใช้ค่าล่าสุด

## 6. ทดสอบ

1. Deploy ไปยัง environment ทดสอบของ Netlify หลังตั้งค่าครบ
2. ส่ง Lead ทดสอบโดยใช้ข้อมูลที่ไม่อ่อนไหว
3. ตรวจว่ามีแถวใหม่ในชีต `Leads`
4. ตรวจว่า LINE เป้าหมายได้รับข้อความ
5. ตรวจ Function logs และ Apps Script Executions หากขั้นตอนใดล้มเหลว

การรัน `vinext dev` อย่างเดียวไม่จำลอง Netlify Functions สำหรับการทดสอบ local แบบ end-to-end ต้องใช้ Netlify local development flow พร้อมไฟล์ environment ที่ไม่ commit หรือทดสอบบน Netlify environment ที่จำกัดสิทธิ์

## พฤติกรรมเมื่อเกิดปัญหา

- ตั้งค่าไม่ครบ: ฟอร์มแสดงข้อความให้ติดต่อทางโทรศัพท์/อีเมล โดยไม่เปิดเผยชื่อหรือค่าของ secret
- Google Sheets บันทึกไม่สำเร็จ: Function คืนข้อผิดพลาดและไม่แจ้ง LINE ว่ามี Lead สำเร็จ
- Google Sheets บันทึกแล้ว แต่ LINE ส่งไม่สำเร็จ: Function ถือว่ารับ Lead สำเร็จพร้อมคำเตือน เพื่อลดโอกาสเกิดรายการซ้ำจากการกดส่งใหม่

## เอกสารทางการ

- Google Apps Script Web Apps: https://developers.google.com/apps-script/guides/web
- Netlify Functions environment variables: https://docs.netlify.com/build/functions/environment-variables/
- LINE Messaging API — Send messages: https://developers.line.biz/en/docs/messaging-api/sending-messages/
- LINE Messaging API — Get user IDs: https://developers.line.biz/en/docs/messaging-api/getting-user-ids/
- LINE group chats: https://developers.line.biz/en/docs/messaging-api/group-chats/
