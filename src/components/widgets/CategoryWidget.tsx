import ArticleCard from "@/components/ArticleCard";

interface CategoryWidgetProps {
  title?: string;
  posts: any[];
}

export default function CategoryWidget({ title, posts }: CategoryWidgetProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="mt-16">
      {title && (
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-black tracking-tighter uppercase italic border-l-4 border-brand-red pl-4">
            {title}
          </h2>
          <div className="h-[2px] bg-brand-red/10 flex-grow" />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {posts.map((post: any) => (
          <ArticleCard 
            key={post.id}
            slug={post.slug}
            title={post.title}
            excerpt={post.excerpt}
            category={post.categories?.nodes[0]?.name || title || "НОВИНИ"}
            imageUrl={post.featuredImage?.node?.sourceUrl || "https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=2070&auto=format&fit=crop"}
            date={new Date(post.date).toLocaleDateString('bg-BG', { day: 'numeric', month: 'long' })}
          />
        ))}
      </div>
    </section>
  );
}
