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

export const metadata: Metadata = { title: { default: "ทรัพย์สิริ แกรนด์ กรุ๊ป", template: "%s | ทรัพย์สิริ แกรนด์ กรุ๊ป" }, description: "บริการซื้อขายและจัดหาที่ดิน ฮวงจุ้ย พิธีพราหมณ์ และโหราศาสตร์ไทยจีน", icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" } };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="th" className={`${kanit.variable} ${kanit.className}`}><body><SiteHeader/><main>{children}</main><SiteFooter/><ContactDock/><PromotionPopup/></body></html>; }
