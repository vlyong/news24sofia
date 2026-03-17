import ArticleCard from "@/components/ArticleCard";

interface HeroWidgetProps {
  posts: any[];
}

export default function HeroWidget({ posts }: HeroWidgetProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {posts.map((post: any, index: number) => (
        <ArticleCard 
          key={post.id}
          slug={post.slug}
          title={post.title}
          excerpt={post.excerpt}
          category={post.categories?.nodes[0]?.name || "БЪЛГАРИЯ"}
          imageUrl={post.featuredImage?.node?.sourceUrl || "https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=2070&auto=format&fit=crop"}
          date={new Date(post.date).toLocaleDateString('bg-BG', { day: 'numeric', month: 'long' })}
          isLarge={index === 0}
          priority={index === 0}
        />
      ))}
    </div>
  );
}
