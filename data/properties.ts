export type Property = {
  slug: string;
  name: string;
  eyebrow: string;
  area: string;
  price: string;
  location: string;
  province: string;
  titleDeed: string;
  highlights: string[];
  status: "พร้อมขาย" | "พร้อมโอน" | "sold";
  image: string;
  images: string[];
  mapUrl: string | null;
  youtubeUrl: string | null;
  description: string;
};

export const properties: Property[] = [
  {
    slug: "blue-diamond",
    name: "Blue Diamond",
    eyebrow: "ผืนดินท่ามกลางอากาศบริสุทธิ์",
    area: "2–4 ไร่",
    price: "25,000 บาท / ตร.ว.",
    location: "ต.แคมป์สน อ.เขาค้อ จ.เพชรบูรณ์",
    province: "เพชรบูรณ์",
    titleDeed: "โฉนดครุฑแดง",
    highlights: ["ถนนเข้าถึง", "ระบบไฟฟ้าพร้อม", "ทำเลแคมป์สน เขาค้อ"],
    status: "พร้อมขาย",
    image: "/land/blue-diamond/01.jpg",
    images: ["/land/blue-diamond/01.jpg", "/land/blue-diamond/02.jpg", "/land/blue-diamond/03.jpg", "/land/blue-diamond/04.jpg", "/land/blue-diamond/05.png"],
    mapUrl: null,
    youtubeUrl: "https://www.youtube.com/watch?v=naKp5kfTIkI",
    description: "ที่ดิน Blue Diamond ขนาด 2–4 ไร่ ในพื้นที่ตำบลแคมป์สน อำเภอเขาค้อ จังหวัดเพชรบูรณ์ มีถนนเข้าถึงและระบบไฟฟ้าพร้อม โปรดติดต่อทีมงานเพื่อยืนยันรายละเอียดแปลงและข้อมูลล่าสุด",
  },
  {
    slug: "prestige-life",
    name: "Prestige Life",
    eyebrow: "ทำเลเด่นบนเส้นทางสำคัญ",
    area: "25 ไร่",
    price: "50,000 บาท / ตร.ว.",
    location: "ต.แคมป์สน อ.เขาค้อ จ.เพชรบูรณ์",
    province: "เพชรบูรณ์",
    titleDeed: "กรุณาสอบถามทีมงาน",
    highlights: ["ติดถนน AH16", "มองเห็นวิววัดผาซ่อนแก้ว", "เหมาะกับโครงการขนาดใหญ่"],
    status: "พร้อมขาย",
    image: "/land/prestige-life/01.jpg",
    images: ["/land/prestige-life/01.jpg", "/land/prestige-life/02.jpg", "/land/prestige-life/03.jpg", "/land/prestige-life/04.jpg", "/land/prestige-life/05.jpg", "/land/prestige-life/06.jpg"],
    mapUrl: null,
    youtubeUrl: "https://www.youtube.com/watch?v=gx32pVlKqV8&t=10s",
    description: "ที่ดิน Prestige Life ขนาด 25 ไร่ ในพื้นที่ตำบลแคมป์สน อำเภอเขาค้อ จังหวัดเพชรบูรณ์ ติดถนน AH16 และมองเห็นวิววัดผาซ่อนแก้ว โปรดติดต่อทีมงานเพื่อยืนยันรายละเอียดแปลงและเอกสารสิทธิ์ล่าสุด",
  },
  {
    slug: "paradise",
    name: "Paradise",
    eyebrow: "วิวกังหันลมบนทำเลแคมป์สน",
    area: "23 ไร่ ไม่แบ่งขาย",
    price: "15,000 บาท / ตร.ว.",
    location: "ต.แคมป์สน อ.เขาค้อ จ.เพชรบูรณ์",
    province: "เพชรบูรณ์",
    titleDeed: "โฉนดครุฑแดง",
    highlights: ["วิวกังหันลม", "ห่างถนน AH16 ประมาณ 9 กม.", "ขายยกแปลง ไม่แบ่งขาย"],
    status: "พร้อมขาย",
    image: "/land/paradise/01.jpg",
    images: ["/land/paradise/01.jpg", "/land/paradise/02.jpg", "/land/paradise/03.jpg", "/land/paradise/04.jpg", "/land/paradise/05.jpg", "/land/paradise/06.png"],
    mapUrl: null,
    youtubeUrl: "https://www.youtube.com/watch?v=koIPD1fREEU&t=4s",
    description: "ที่ดิน Paradise ขนาด 23 ไร่ ขายยกแปลงและไม่แบ่งขาย ตั้งอยู่ในตำบลแคมป์สน อำเภอเขาค้อ จังหวัดเพชรบูรณ์ โดดเด่นด้วยวิวกังหันลม และอยู่ห่างถนน AH16 ประมาณ 9 กิโลเมตร",
  },
  {
    slug: "sam-roi-yod-valley",
    name: "ที่ดินสามร้อยยอด วิวเขา 250°",
    eyebrow: "ผืนใหญ่สไตล์วัลเลย์ ใกล้ชายหาด",
    area: "19 ไร่ 1 งาน 58.7 ตร.ว.",
    price: "กรุณาสอบถามราคา",
    location: "อ.สามร้อยยอด จ.ประจวบคีรีขันธ์",
    province: "ประจวบคีรีขันธ์",
    titleDeed: "โฉนดที่ดิน",
    highlights: [
      "วิวเทือกเขาสามร้อยยอดล้อมรอบประมาณ 250 องศา",
      "ห่างชายหาดประมาณ 2.9 กม. หรือขับรถประมาณ 8 นาที",
      "มีทางสาธารณะกว้าง 4 เมตร",
      "เหมาะพัฒนารีสอร์ตหรือพูลวิลล่า",
    ],
    status: "พร้อมโอน",
    image: "/properties/sam-roi-yod-valley/01.jpg",
    images: [
      "/properties/sam-roi-yod-valley/01.jpg",
      "/properties/sam-roi-yod-valley/02.jpg",
      "/properties/sam-roi-yod-valley/03.jpg",
      "/properties/sam-roi-yod-valley/04.jpg",
      "/properties/sam-roi-yod-valley/05.jpg",
      "/properties/sam-roi-yod-valley/06.jpg",
    ],
    mapUrl: "https://goo.gl/maps/kKJ9F8tAFmxeAdY89",
    youtubeUrl: "https://youtu.be/0ZYsrIycmdA?si=JzR8mAk-ihwW_I45",
    description: "ที่ดินโฉนดผืนใหญ่ในอำเภอสามร้อยยอด บรรยากาศแบบวัลเลย์ มองเห็นแนวเทือกเขารอบพื้นที่ และอยู่ใกล้ชายหาด เหมาะสำหรับผู้ที่กำลังพิจารณาพัฒนาโครงการที่พักหรือบ้านพักตากอากาศ โปรดตรวจสอบแนวเขตและรายละเอียดล่าสุดกับทีมงานก่อนตัดสินใจ",
  },
  {
    slug: "khlong-5-pathum-thani",
    name: "ที่ดินคลอง 5 ฝั่งตะวันตก",
    eyebrow: "ติดถนนใหญ่ รองรับการพัฒนาโครงการ",
    area: "22 ไร่ 2 งาน 2.18 ตร.ว.",
    price: "4,000,000 บาท / ไร่",
    location: "ถนนเลียบคลอง 5 ฝั่งตะวันตก จ.ปทุมธานี",
    province: "ปทุมธานี",
    titleDeed: "กรุณาสอบถามทีมงาน",
    highlights: [
      "หน้ากว้างติดถนนประมาณ 36 เมตร ลึกประมาณ 1,025 เมตร",
      "ติดถนนเลียบคลอง 5 ฝั่งตะวันตก",
      "วางผังถนนเมนเข้าสู่ด้านในได้",
      "เหมาะสำหรับพัฒนาโครงการหรือถือครองเพื่อการลงทุน",
    ],
    status: "พร้อมโอน",
    image: "/properties/khlong-5-pathum-thani/01.png",
    images: [
      "/properties/khlong-5-pathum-thani/01.png",
      "/properties/khlong-5-pathum-thani/02.png",
      "/properties/khlong-5-pathum-thani/03.png",
      "/properties/khlong-5-pathum-thani/04.png",
      "/properties/khlong-5-pathum-thani/05.png",
      "/properties/khlong-5-pathum-thani/06.png",
      "/properties/khlong-5-pathum-thani/07.png",
    ],
    mapUrl: null,
    youtubeUrl: null,
    description: "ที่ดินผืนยาวติดถนนเลียบคลอง 5 ฝั่งตะวันตก จังหวัดปทุมธานี มีหน้ากว้างประมาณ 36 เมตรและลึกประมาณ 1,025 เมตร ข้อมูลจากเอกสารลูกค้าระบุว่าสามารถวางแนวถนนเมนเข้าสู่พื้นที่ด้านในได้ โปรดยืนยันเอกสารสิทธิ์ แนวเขต และข้อกำหนดการพัฒนากับทีมงาน",
  },
  {
    slug: "ramintra-58",
    name: "ที่ดินรามอินทรา 58",
    eyebrow: "แปลงสี่เหลี่ยม ใกล้รถไฟฟ้าสายสีชมพู",
    area: "396 ตร.ว.",
    price: "44,000,000 บาท",
    location: "ซอยรามอินทรา 58 กรุงเทพมหานคร",
    province: "กรุงเทพมหานคร",
    titleDeed: "โฉนด 4 แปลง แปลงละ 99 ตร.ว.",
    highlights: [
      "หน้ากว้างประมาณ 64 เมตร ลึกประมาณ 25 เมตร",
      "ใกล้รถไฟฟ้าสายสีชมพู สถานีวัชรพล",
      "เชื่อมต่อถนนรามอินทรา เกษตร–นวมินทร์ และทางด่วน",
      "เหมาะสำหรับบ้าน โฮมออฟฟิศ สำนักงาน หรือโครงการขนาดเล็ก",
    ],
    status: "พร้อมโอน",
    image: "/properties/ramintra-58/01.png",
    images: [
      "/properties/ramintra-58/01.png",
      "/properties/ramintra-58/02.png",
      "/properties/ramintra-58/03.png",
      "/properties/ramintra-58/04.png",
      "/properties/ramintra-58/05.png",
      "/properties/ramintra-58/06.png",
      "/properties/ramintra-58/07.png",
    ],
    mapUrl: "https://maps.app.goo.gl/YoobzqZZYP8DMqgWA?g_st=ic",
    youtubeUrl: null,
    description: "ที่ดินในซอยรามอินทรา 58 ขนาดรวม 396 ตารางวา แบ่งเป็นโฉนด 4 แปลง แปลงละ 99 ตารางวา รูปแปลงสี่เหลี่ยมและอยู่ใกล้เส้นทางหลัก สิ่งอำนวยความสะดวก และรถไฟฟ้าสายสีชมพู โปรดตรวจสอบระยะทาง แนวเขต และเงื่อนไขการขายล่าสุดกับทีมงาน",
  },
];

export const getProperty = (slug: string) => properties.find((item) => item.slug === slug);
