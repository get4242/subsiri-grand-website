import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { articles } from "@/data/articles";
export const metadata: Metadata = { title: "บทความ" };
export default function ArticlesPage() { return <><PageHero kicker="KNOWLEDGE & STORIES" title="เรื่องราวและความรู้" description="บทความตัวอย่างเกี่ยวกับที่ดิน ชัยภูมิ และการเตรียมพิธี เพื่อเป็นข้อมูลเบื้องต้นก่อนพูดคุยกับผู้เชี่ยวชาญ"/><section className="section articles-listing"><div className="articles-grid">{articles.map((article) => <Link key={article.slug} href={`/articles/${article.slug}`}><article><div className="article-cover"><Image src={article.coverImage} alt={article.coverImageAlt} fill sizes="(max-width: 620px) 100vw, 33vw" data-temporary-ai-visual={article.temporaryVisual}/></div><div className="article-card-copy"><span>{article.category}</span><h2>{article.title}</h2><p>{article.excerpt}</p><small>{article.publishedAt} · {article.readingTime}</small><b>อ่านบทความ →</b></div></article></Link>)}</div><p className="disclaimer">บทความเป็นข้อมูลทั่วไปและตัวอย่างเนื้อหา ไม่ใช่คำรับรองหรือคำปรึกษาเฉพาะทาง</p></section></>; }
