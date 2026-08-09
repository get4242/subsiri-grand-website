import type { Metadata } from "next";
import { getArticle } from "@/data/articles";
import { CmsArticleDetail } from "@/components/CmsArticleViews";
export async function generateMetadata({ params }: { params: Promise<{slug:string}> }): Promise<Metadata> { const article = getArticle((await params).slug); if (!article) return { title: "บทความ" }; return { title: article.title, description: article.excerpt, keywords: [article.category, article.title, "บทความทรัพย์สิริ"], alternates: { canonical: `/articles/${article.slug}` }, openGraph: { type: "article", url: `/articles/${article.slug}`, title: article.title, description: article.excerpt, images: [{ url: article.coverImage, alt: article.coverImageAlt }] } }; }
export default async function ArticlePage({ params }: { params: Promise<{slug:string}> }) { return <CmsArticleDetail slug={(await params).slug}/>; }
