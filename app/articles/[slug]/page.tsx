import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { articles, getArticle } from "@/data/articles";
export function generateStaticParams() { return articles.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{slug:string}> }): Promise<Metadata> { const article = getArticle((await params).slug); return { title: article?.title ?? "ไม่พบบทความ", description: article?.excerpt }; }
export default async function ArticlePage({ params }: { params: Promise<{slug:string}> }) { const article = getArticle((await params).slug); if (!article) notFound(); return <article className="article-page"><header><div className="article-hero-cover"><Image src={article.coverImage} alt={article.coverImageAlt} fill priority sizes="100vw" data-temporary-ai-visual={article.temporaryVisual}/><div aria-hidden="true"></div></div><div className="article-hero-copy"><Link href="/articles">← บทความทั้งหมด</Link><p className="kicker">{article.category}</p><h1>{article.title}</h1><p>{article.excerpt}</p><small>{article.publishedAt} · {article.readingTime}</small></div></header><div className="article-content">{article.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}<div className="notice"><strong>ข้อควรทราบ</strong><p>เนื้อหานี้จัดทำเป็นบทความตัวอย่างเพื่อให้ข้อมูลทั่วไป โปรดตรวจสอบข้อเท็จจริงและขอคำแนะนำจากผู้เชี่ยวชาญที่เกี่ยวข้องก่อนตัดสินใจ</p></div></div></article>; }
