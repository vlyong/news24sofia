import Image from "next/image";
import Link from "next/link";
import AdBanner from "@/components/AdBanner";
import { Clock, Share2, MessageCircle, ChevronLeft } from "lucide-react";
import { fetchAPI, GET_POST_BY_SLUG } from "@/lib/api";
import { getSettings } from "@/lib/settings";
import { notFound } from "next/navigation";
import VideoPlayer from "@/components/VideoPlayer";
import { extractVideoUrl } from "@/lib/utils";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await fetchAPI(GET_POST_BY_SLUG, {
    variables: {
      id: resolvedParams.slug,
      idType: "SLUG"
    }
  });

  const post = data?.post;
  if (!post) return { title: "Статия не е намерена - News24Sofia" };

  const settings = await getSettings();
  const override = settings.seoOverrides[resolvedParams.slug];

  const title = override?.title || post.title;
  const description = override?.description || post.content.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 160) + "...";

  return {
    title: `${title} | News24Sofia`,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: `https://news24sofia.eu/${post.slug}`,
      siteName: 'News24Sofia',
      images: [
        {
          url: post.featuredImage?.node?.sourceUrl || "https://news24sofia.eu/og-image.jpg",
          width: 1200,
          height: 630,
        },
      ],
      locale: 'bg_BG',
      type: 'article',
      publishedTime: post.date,
      authors: [post.author?.node?.name || 'Редакция NEWS24'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: description,
      images: [post.featuredImage?.node?.sourceUrl || "https://news24sofia.eu/og-image.jpg"],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  const data = await fetchAPI(GET_POST_BY_SLUG, {
    variables: {
      id: resolvedParams.slug,
      idType: "SLUG"
    }
  });

  const post = data?.post;

  if (!post) {
    notFound();
  }

  const article = {
    title: post.title,
    category: post.categories?.nodes[0]?.name || "БЪЛГАРИЯ",
    categorySlug: post.categories?.nodes[0]?.slug || "krimi",
    author: post.author?.node?.name || "Редакция NEWS24",
    date: new Date(post.date).toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    imageUrl: post.featuredImage?.node?.sourceUrl || "https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=2070&auto=format&fit=crop",
    content: post.content,
    video: extractVideoUrl(post.content) || { url: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8", isIframe: false }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "image": [article.imageUrl],
    "datePublished": post.date,
    "dateModified": post.modified || post.date,
    "author": [{
      "@type": "Person",
      "name": article.author,
      "url": "https://news24sofia.eu"
    }],
    "publisher": {
      "@type": "Organization",
      "name": "News24Sofia",
      "logo": {
        "@type": "ImageObject",
        "url": "https://news24sofia.eu/logo.png"
      }
    },
    "description": post.excerpt?.replace(/<[^>]*>/g, '').slice(0, 160)
  };
  const settings = await getSettings();

  return (
    <main className="min-h-screen pb-24 bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Article Header (Hero) */}
      <article className="max-w-4xl mx-auto px-4 mt-8">
        
        {/* Breadcrumb & Back */}
        <div className="flex items-center gap-2 text-sm text-foreground/50 mb-6 font-medium">
          <Link href="/" className="hover:text-foreground flex items-center gap-1 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Начало
          </Link>
          <span>/</span>
          <Link href={`/category/${article.categorySlug}`} className="hover:text-brand-red font-medium transition-colors uppercase">
            {article.category}
          </Link>
        </div>

        <div className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6 text-foreground" dangerouslySetInnerHTML={{ __html: article.title }} />

        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-black/10 dark:border-white/10 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-red/20 flex items-center justify-center font-bold text-brand-red uppercase">
              {article.author.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-sm text-foreground">{article.author}</p>
              <div className="flex items-center gap-2 text-xs text-foreground/50">
                <Clock className="w-3 h-3" />
                <span>{article.date} ч.</span>
              </div>
            </div>
          </div>
          
          {/* Social Actions */}
          <div className="flex items-center gap-3">
            <button className="p-2.5 rounded-full bg-black/5 dark:bg-white/5 hover:bg-brand-red hover:text-white transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-sm font-medium">
              <MessageCircle className="w-4 h-4" />
              Коментари
            </button>
          </div>
        </div>

        {/* Main Image or Video */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-12 shadow-2xl shadow-black/10 bg-black">
          {article.categorySlug === "news24" ? (
            <VideoPlayer 
              src={article.video.url} 
              isIframe={article.video.isIframe}
              poster={article.imageUrl}
              className="w-full h-full"
            />
          ) : (
            <Image 
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          )}
        </div>

        {/* Content & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Article Content */}
          <div className="lg:col-span-8 prose prose-lg dark:prose-invert max-w-none 
                          prose-headings:font-bold prose-headings:text-brand-red
                          prose-p:text-foreground/80 prose-p:leading-relaxed
                          prose-a:text-brand-red hover:prose-a:text-brand-red/80">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />

            {/* In-article Ad */}
            {settings.ads.showInArticle && (
              <div className="my-12">
                <AdBanner slot="8877665544" format="auto" className="min-h-[250px]" />
              </div>
            )}
          </div>

          {/* Sticky Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-24">
              {/* Sidebar Ad */}
              {settings.ads.showArticleSidebar && (
                <div className="min-h-[600px]">
                  <AdBanner slot="9988776655" format="vertical" className="h-full" />
                </div>
              )}
            </div>
          </aside>
          
        </div>
      </article>
    </main>
  );
}
