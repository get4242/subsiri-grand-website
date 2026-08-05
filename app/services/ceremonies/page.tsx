import type { Metadata } from "next";
import { ServiceDetail } from "@/components/ServiceDetail";

export const metadata: Metadata = { title: "ตั้งศาลและพิธีพราหมณ์" };

export default function CeremoniesPage() {
  return <ServiceDetail
    kicker="BRAHMIN CEREMONIES"
    title="ตั้งศาลพระภูมิและพิธีพราหมณ์"
    description="ดูแลการวางแผนและประสานพิธีให้เหมาะกับสถานที่ ความเชื่อ และความพร้อมของเจ้าภาพ โดยยืนยันรายละเอียดทุกครั้งก่อนดำเนินงาน"
    scopeTitle="บริการพิธีกรรมและการตั้งศาล"
    scope={[
      { title: "ตั้งศาลพระภูมิ", description: "วางแผนตำแหน่ง วันเวลา และลำดับพิธีตามรายละเอียดของสถานที่และความต้องการของเจ้าภาพ" },
      { title: "ศาลตา–ยาย", description: "เตรียมการตั้งศาลและพิธีที่เกี่ยวข้องโดยคำนึงถึงพื้นที่และธรรมเนียมที่เจ้าภาพยึดถือ" },
      { title: "ศาลพระพรหม", description: "ประเมินขอบเขตการจัดตั้งและรายการเตรียมงานสำหรับสถานที่พักอาศัยหรือสถานประกอบการ" },
      { title: "ถอนหรือย้ายศาล", description: "วางขั้นตอนการถอน ย้าย หรือปรับตำแหน่งศาลเดิม โดยตรวจข้อมูลเฉพาะของสถานที่ก่อน" },
      { title: "พิธีบวงสรวง", description: "ประสานรูปแบบพิธี เครื่องประกอบ และลำดับงานให้เหมาะกับวัตถุประสงค์ของเจ้าภาพ" },
      { title: "พิธีลงเสาเอก", description: "เตรียมพิธีสำหรับการเริ่มต้นงานก่อสร้าง โดยประสานกับกำหนดการและผู้รับผิดชอบหน้างาน" },
    ]}
    steps={[
      { title: "รับรายละเอียดสถานที่", description: "สอบถามประเภทพิธี ทำเล วันที่ต้องการ จำนวนผู้ร่วมงาน และเงื่อนไขหน้างาน" },
      { title: "ตรวจและยืนยันขอบเขต", description: "พิจารณาความเหมาะสม รายการจัดเตรียม และเสนอค่าใช้จ่ายให้เจ้าภาพยืนยัน" },
      { title: "เตรียมงานและดำเนินพิธี", description: "จัดลำดับพิธี ประสานผู้เกี่ยวข้อง และดูแลพิธีตามขอบเขตกับกำหนดการที่ยืนยันร่วมกัน" },
    ]}
    heroImage="/services/ceremonies/03.png"
    heroImageAlt="ผลงานจัดตั้งศาลและพื้นที่ประกอบพิธี"
    galleryImages={[
      "/services/ceremonies/01.png",
      "/services/ceremonies/02.png",
      "/services/ceremonies/04.png",
      "/services/ceremonies/05.png",
      "/services/ceremonies/06.png",
      "/services/ceremonies/07.png",
      "/services/ceremonies/08.png",
      "/services/ceremonies/15.png",
      "/services/ceremonies/16.png",
    ]}
    stepImages={[
      "/services/ceremonies/09.png",
      "/services/ceremonies/11.png",
      "/services/ceremonies/13.png",
    ]}
    additionalImages={[
      "/services/ceremonies/10.png",
      "/services/ceremonies/12.png",
      "/services/ceremonies/14.png",
    ]}
    price="เริ่มต้น 20,000 บาท"
    priceNote="ราคาเริ่มต้นเป็นข้อมูลเบื้องต้น รายละเอียดจริงขึ้นอยู่กับประเภทพิธี ทำเล อุปกรณ์ จำนวนผู้ร่วมงาน และขอบเขตการจัดเตรียม"
    disclaimer="ทุกพิธีมีรายละเอียดต่างกัน กรุณายืนยันรายการบริการ วันเวลา ค่าเดินทาง เครื่องประกอบพิธี และค่าใช้จ่ายทั้งหมดกับทีมงานก่อนนัดหมาย"
  />;
}
