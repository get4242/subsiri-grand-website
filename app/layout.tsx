import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PromotionPopup } from "@/components/PromotionPopup";
import { ContactDock } from "@/components/ContactDock";

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const siteUrl = "https://subsiri.co.th";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "ทรัพย์สิริ แกรนด์ กรุ๊ป | ที่ดิน ฮวงจุ้ย และพิธีพราหมณ์", template: "%s | ทรัพย์สิริ แกรนด์ กรุ๊ป" },
  description: "บริการซื้อขายและจัดหาที่ดิน ดูฮวงจุ้ย ตั้งศาลพระภูมิ พิธีพราหมณ์ และตรวจดวงชะตาไทย–จีน โดยบริษัท ทรัพย์สิริ แกรนด์ กรุ๊ป จำกัด",
  keywords: [
    "ทรัพย์สิริ แกรนด์ กรุ๊ป", "Subsiri Grand Group", "ซื้อขายที่ดิน", "รับฝากขายที่ดิน", "จัดหาที่ดิน",
    "ที่ดินเขาค้อ", "ที่ดินเพชรบูรณ์", "ที่ดินปทุมธานี", "ที่ดินประจวบคีรีขันธ์", "ดูฮวงจุ้ย",
    "ฮวงจุ้ยบ้าน", "ฮวงจุ้ยที่ดิน", "ตั้งศาลพระภูมิ", "ตั้งศาลตายาย", "ตั้งศาลพระพรหม",
    "พิธีพราหมณ์", "ถอนย้ายศาล", "พิธีบวงสรวง", "พิธีลงเสาเอก", "ดูดวงไทยจีน",
  ],
  openGraph: {
    type: "website",
    locale: "th_TH",
    url: siteUrl,
    siteName: "ทรัพย์สิริ แกรนด์ กรุ๊ป",
    title: "ทรัพย์สิริ แกรนด์ กรุ๊ป | ที่ดิน ฮวงจุ้ย และพิธีพราหมณ์",
    description: "บริการด้านที่ดิน ฮวงจุ้ย พิธีพราหมณ์ ตั้งศาล และโหราศาสตร์ไทย–จีน",
    images: [{ url: "/subsiri-logo.png", width: 800, height: 800, alt: "โลโก้บริษัท ทรัพย์สิริ แกรนด์ กรุ๊ป จำกัด" }],
  },
  twitter: { card: "summary", title: "ทรัพย์สิริ แกรนด์ กรุ๊ป", description: "บริการด้านที่ดิน ฮวงจุ้ย พิธีพราหมณ์ และโหราศาสตร์ไทย–จีน", images: ["/subsiri-logo.png"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "บริษัท ทรัพย์สิริ แกรนด์ กรุ๊ป จำกัด",
  alternateName: "Subsiri Grand Group",
  url: siteUrl,
  logo: `${siteUrl}/subsiri-logo.png`,
  email: "contact@subsiri.co.th",
  telephone: "+66-90-249-1459",
  contactPoint: { "@type": "ContactPoint", telephone: "+66-90-249-1459", contactType: "customer service", availableLanguage: ["Thai"] },
  areaServed: { "@type": "Country", name: "Thailand" },
  knowsAbout: ["ซื้อขายและจัดหาที่ดิน", "ฮวงจุ้ย", "ตั้งศาลพระภูมิ", "พิธีพราหมณ์", "โหราศาสตร์ไทยและจีน"],
  sameAs: ["https://lin.ee/r8WhnWC"],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: "ทรัพย์สิริ แกรนด์ กรุ๊ป",
  inLanguage: "th-TH",
  publisher: { "@id": `${siteUrl}/#organization` },
};

export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="th" className={`${kanit.variable} ${kanit.className}`}><body>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationSchema, websiteSchema]) }} />
    <SiteHeader/><main>{children}</main><SiteFooter/><ContactDock/><PromotionPopup/>
  </body></html>;
}
