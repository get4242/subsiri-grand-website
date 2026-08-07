import type { Metadata } from "next";
import { getArticle } from "@/data/articles";
import { CmsArticleDetail } from "@/components/CmsArticleViews";
export async function generateMetadata({ params }: { params: Promise<{slug:string}> }): Promise<Metadata> { const article = getArticle((await params).slug); return { title: article?.title ?? "บทความ", description: article?.excerpt }; }
export default async function ArticlePage({ params }: { params: Promise<{slug:string}> }) { return <CmsArticleDetail slug={(await params).slug}/>; }
