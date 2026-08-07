# ตั้งค่าระบบหลังบ้าน Subsiri

ระบบหลังบ้านใช้ Netlify Functions สำหรับ session/API และ Google Sheets + Apps Script สำหรับจัดเก็บข้อมูล โดยไม่ใช้ Supabase

## 1. สร้าง Google Sheet

1. สร้าง Google Sheet ใหม่สำหรับระบบเว็บไซต์
2. เปิด Extensions → Apps Script
3. คัดลอกโค้ดจาก `google-apps-script/Code.gs` ไปวางใน `Code.gs`
4. เปิด Project Settings → Script properties และเพิ่ม `SHARED_SECRET` เป็นข้อความสุ่มยาวที่เก็บเป็นความลับ
5. Deploy → New deployment → Web app
6. Execute as: Me และตั้ง Who has access เป็น **Anyone** เพื่อให้ Netlify Function เรียก Web App ได้ โดยทุก action ยังถูกป้องกันด้วย `SHARED_SECRET`
7. คัดลอก URL ที่ลงท้าย `/exec`

Apps Script จะสร้างแท็บ `Leads` และ `Properties` พร้อมหัวตารางเมื่อมีการเรียกใช้งานครั้งแรก

## 2. ตั้งค่า Netlify environment variables

ใน Netlify ไปที่ Project configuration → Environment variables แล้วเพิ่ม:

- `GOOGLE_APPS_SCRIPT_URL` — URL `/exec` จากขั้นตอนก่อนหน้า
- `LEADS_SHARED_SECRET` — secret เดียวกับ `SHARED_SECRET` ใน Apps Script
- `ADMIN_DATA_SHARED_SECRET` — จะใช้ค่าเดียวกันหรือตั้งแยกก็ได้ หากไม่ใส่ระบบจะใช้ `LEADS_SHARED_SECRET`
- `ADMIN_USERNAME` — ชื่อผู้ใช้สำหรับเจ้าของระบบ
- `ADMIN_PASSWORD` — รหัสผ่านที่คาดเดายากและไม่ใช้ซ้ำกับบริการอื่น
- `ADMIN_SESSION_SECRET` — ข้อความสุ่มอย่างน้อย 32 ตัวอักษรสำหรับลงนาม session

อย่าใส่ค่าจริงลง `.env.example`, GitHub หรือไฟล์ source ใด ๆ

## 3. Deploy และทดสอบ

1. Deploy เว็บไซต์หลังตั้งค่า variables
2. เปิด `/admin`
3. ตรวจว่าผู้ที่ยังไม่ login เห็นเฉพาะหน้าเข้าสู่ระบบ
4. Login แล้วตรวจแถบสถานะ หากเชื่อมสำเร็จต้องแสดง “เชื่อมต่อแล้ว”
5. Logout และยืนยันว่าไม่สามารถกลับเข้า Dashboard ได้โดยไม่มี session

## สถานะการพัฒนา

- พร้อมแล้ว: login, signed HttpOnly cookie, logout, session validation, อ่านรายการที่ดินจาก Google Sheets และ API upsert ฝั่ง server
- กำลังทำเฟสถัดไป: ฟอร์มเพิ่ม/แก้ไขที่ดินจริง, การจัดการรูป และเชื่อมข้อมูล public ให้เปลี่ยนตามหลังบ้าน
