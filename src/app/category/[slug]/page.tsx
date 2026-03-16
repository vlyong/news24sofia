import ArticleCard from "@/components/ArticleCard";
import AdBanner from "@/components/AdBanner";
import { fetchAPI, GET_POSTS_BY_CATEGORY } from "@/lib/api";
import { getSettings } from "@/lib/settings";
import type { Metadata } from "next";

export const revalidate = 60;

const categoryNames: Record<string, string> = {
  'krimi': 'Крими',
  'politics': 'Политика',
  'community': 'Общество',
  'world': 'Свят',
  'sport': 'Спорт',
  'exclusive': 'Ексклузивно',
  'regioni': 'Региони',
  'sofiya': 'София',
  'plovdiv': 'Пловдив',
  'varna': 'Варна',
  'burgas': 'Бургас',
  'blagoevgrad': 'Благоевград',
  'iconomic': 'Икономика',
  'biznes': 'Бизнес',
  'health': 'Здраве',
  'health-news': 'Здравни новини',
  'healthy': 'Здравословно',
  'news24': 'NEWS24 TV'
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const categoryName = categoryNames[resolvedParams.slug] || resolvedParams.slug.toUpperCase();

  return {
    title: `${categoryName} - Новини от News24Sofia`,
    description: `Всички най-нови новини от категория ${categoryName}. Бъдете информирани с News24Sofia.`,
    openGraph: {
      title: `${categoryName} - News24Sofia`,
      description: `Следете последните новини от ${categoryName}.`,
      url: `https://news24sofia.eu/category/${resolvedParams.slug}`,
      siteName: 'News24Sofia',
      locale: 'bg_BG',
      type: 'website',
    }
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const categoryName = categoryNames[resolvedParams.slug] || resolvedParams.slug.toUpperCase();

  const data = await fetchAPI(GET_POSTS_BY_CATEGORY, {
    variables: {
      categoryName: resolvedParams.slug
    }
  });

  const { posts: rawPosts } = data;
  const posts = rawPosts?.nodes || [];
  const settings = await getSettings();

  return (
    <main className="min-h-screen pb-24 bg-background">
      {/* Category Header */}
      <div className="w-full bg-black/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10 py-12 mb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-black text-foreground capitalize tracking-tight">
            {categoryName}
          </h1>
          <p className="text-foreground/60 mt-4 max-w-2xl text-lg">
            Всички най-нови и важни публикации от категория "{categoryName}". Следете тук за ексклузивна информация.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Ad Banner */}
      {settings.ads.showTopBanner && (
        <div className="mb-12">
          <AdBanner slot="1234567890" format="horizontal" className="h-[90px] md:h-[250px]" />
        </div>
      )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: any, i: number) => (
            <ArticleCard 
              key={post.id}
              slug={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              category={categoryName}
              imageUrl={post.featuredImage?.node?.sourceUrl || "https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=2070&auto=format&fit=crop"}
              date={new Date(post.date).toLocaleDateString('bg-BG', { day: 'numeric', month: 'long' })}
              isLarge={i === 0 && posts.length > 2} 
              priority={i === 0}
            />
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-16 text-center">
          <button className="px-8 py-3 bg-brand-red text-white font-bold rounded-lg hover:bg-brand-red/90 transition-colors shadow-lg shadow-brand-red/20">
            Зареди още новини
          </button>
        </div>

        {/* Ad Space - Bottom */}
        <div className="mt-16">
          <AdBanner slot="5544332211" format="auto" className="min-h-[250px]" />
        </div>
      </div>
    </main>
  );
}
