import ArticleCard from "@/components/ArticleCard";
import { fetchAPI, GET_SEARCH_RESULTS } from "@/lib/api";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q: searchTerm } = await searchParams;

  if (!searchTerm) {
    return (
      <main className="min-h-screen pb-24 bg-background text-foreground">
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-2xl font-bold mb-4">Търсене</h1>
            <p>Моля, въведете ключова дума за търсене.</p>
        </div>
      </main>
    );
  }

  const data = await fetchAPI(GET_SEARCH_RESULTS, {
    variables: { searchTerm },
  });

  const posts = data?.posts?.nodes || [];

  return (
    <main className="min-h-screen pb-24 bg-background text-foreground">
      <div className="container mx-auto px-4 py-12 border-b border-black/10 dark:border-white/10 mb-12 bg-black/5 dark:bg-white/5">
        <h1 className="text-4xl font-black tracking-tight leading-tight">
          Резултати за: <span className="text-brand-red">"{searchTerm}"</span>
        </h1>
        <p className="text-foreground/60 mt-2 font-medium">
          Намерихме {posts.length} {posts.length === 1 ? 'резултат' : 'резултата'} за вашето търсене.
        </p>
      </div>

      <div className="container mx-auto px-4">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <ArticleCard
                key={post.id}
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                category={post.categories?.nodes[0]?.name || "Новини"}
                imageUrl={post.featuredImage?.node?.sourceUrl || "https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=2070&auto=format&fit=crop"}
                date={new Date(post.date).toLocaleDateString('bg-BG', { day: 'numeric', month: 'long' })}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-black/5 dark:bg-white/5 rounded-2xl border border-dashed border-black/10 dark:border-white/10">
            <p className="text-xl text-foreground/40 font-bold uppercase tracking-widest">Няма намерени резултати</p>
            <p className="text-foreground/60 mt-2">Опитайте с други ключови думи.</p>
          </div>
        )}
      </div>
    </main>
  );
}
