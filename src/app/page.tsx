import Link from "next/link";
import Image from "next/image";
import ArticleCard from "@/components/ArticleCard";
import AdBanner from "@/components/AdBanner";
import VideoPlayer from "@/components/VideoPlayer";
import { fetchAPI, GET_ALL_POSTS, GET_POSTS_BY_CATEGORY } from "@/lib/api";
import { extractVideoUrl } from "@/lib/utils";
import { getSettings } from "@/lib/settings";

export const revalidate = 60; // revalidate at most every 60 seconds

export default async function Home() {
  const [allPostsData, videoPostsData] = await Promise.all([
    fetchAPI(GET_ALL_POSTS),
    fetchAPI(GET_POSTS_BY_CATEGORY, { variables: { categoryName: "news24" } })
  ]);

  const settings = await getSettings();

  const posts = allPostsData?.posts?.nodes || [];
  const videoPosts = (videoPostsData?.posts?.nodes || []).slice(0, 3);
  
  // Extract dynamic video source from the first video post's content
  const dynamicVideo = videoPosts[0] ? extractVideoUrl(videoPosts[0].content) : null;
  const fallbackUrl = "https://bitdash-a.akamaihd.net/content/MI201112210086_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8";
  
  const videoSrc = dynamicVideo?.url || fallbackUrl;
  const isVideoIframe = dynamicVideo?.isIframe || false;

  return (
    <main className="min-h-screen pb-24">
      {/* Breaking News Bar */}
      {settings.isBreakingNewsActive && settings.breakingNewsItems.length > 0 && (
        <div className="bg-brand-red text-white py-2 px-4 shadow-lg shadow-brand-red/20 mb-8 overflow-hidden">
          <div className="container mx-auto flex items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-2 bg-white text-brand-red px-2 py-0.5 rounded text-xs font-bold uppercase shrink-0 z-10">
              {settings.tickerConfig.showIcon && (
                <span className={`
                    inline-block bg-brand-red
                    ${settings.tickerConfig.iconType === 'pulse' ? 'w-2 h-2 rounded-full animate-pulse' : ''}
                    ${settings.tickerConfig.iconType === 'flash' ? 'w-2 h-2 rounded-full animate-ping' : ''}
                    ${settings.tickerConfig.iconType === 'spin' ? 'w-3 h-3 rounded-sm animate-spin' : ''}
                    ${settings.tickerConfig.iconType === 'wave' ? 'w-2 h-2 rounded-full animate-custom-wave' : ''}
                `} />
              )}
              ИЗВЪНРЕДНО
            </div>
            <div className="whitespace-nowrap overflow-hidden z-0">
                <div className="inline-block animate-marquee pl-[100%]">
                    {settings.breakingNewsItems.map((item: any, idx: number) => (
                        <span key={idx} className="inline-flex items-center">
                            {item.link ? (
                                <a href={item.link} className="hover:underline decoration-white/50 underline-offset-4">
                                    {item.text}
                                </a>
                            ) : (
                                <span>{item.text}</span>
                            )}
                            {idx < settings.breakingNewsItems.length - 1 && (
                                <span className="mx-8 opacity-50">•</span>
                            )}
                        </span>
                    ))}
                </div>
            </div>
          </div>
        </div>
      )}

      {settings.ads.showTopBanner && (
        <div className="container mx-auto px-4 mt-8">
          <AdBanner slot="1234567890" format="horizontal" className="h-[90px] md:h-[120px]" />
        </div>
      )}

      <div className="container mx-auto px-4">
        {/* Main Grid Layout */}
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

        {/* NEWS24 TV - Video Section */}
        {videoPosts.length > 0 && (
          <section className="mt-20 py-12 px-6 bg-black rounded-[32px] overflow-hidden relative shadow-2xl shadow-brand-red/10 border border-white/5">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-red/10 to-transparent pointer-events-none" />
            
            <div className="flex items-center justify-between mb-10 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-red rounded-2xl flex items-center justify-center animate-pulse shadow-lg shadow-brand-red/40">
                        <div className="w-4 h-4 bg-white rounded-full" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">NEWS24 <span className="text-brand-red">TV</span></h2>
                        <p className="text-white/40 text-sm font-bold tracking-widest uppercase mt-1">Видео новини в реално време</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                {/* Large Featured Video */}
                <div className="lg:col-span-8">
                    <VideoPlayer 
                        src={videoSrc} 
                        isIframe={isVideoIframe}
                        poster={videoPosts[0].featuredImage?.node?.sourceUrl}
                        className="aspect-video"
                    />
                    <div className="mt-6">
                        {/* Use div instead of h3/p here because content might contain nested tags like <p> */}
                        <div className="text-2xl font-bold text-white mb-2" dangerouslySetInnerHTML={{ __html: videoPosts[0].title }} />
                        <div className="text-white/60 line-clamp-2" dangerouslySetInnerHTML={{ __html: videoPosts[0].excerpt }} />
                    </div>
                </div>

                {/* Video Playlist */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    {videoPosts.slice(1).map((v: any) => (
                        <Link key={v.id} href={`/${v.slug}`} className="flex gap-4 group cursor-pointer bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                            <div className="relative w-32 aspect-video rounded-lg overflow-hidden shrink-0">
                                <Image 
                                    src={v.featuredImage?.node?.sourceUrl || ""} 
                                    alt={v.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                    <div className="w-8 h-8 bg-brand-red rounded-full flex items-center justify-center scale-90 group-hover:scale-100 transition-transform">
                                        <div className="border-l-8 border-l-white border-y-4 border-y-transparent ml-1" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white line-clamp-2 leading-tight" dangerouslySetInnerHTML={{ __html: v.title }} />
                                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-2 inline-block">Още по темата</span>
                            </div>
                        </Link>
                    ))}
                    <Link href="/category/news24" className="mt-auto">
                        <button className="w-full py-4 border border-white/10 text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-white hover:text-black transition-all">
                            Всички Видеа
                        </button>
                    </Link>
                </div>
            </div>
          </section>
        )}
        
        {/* Ad Space */}
        <div className="my-12">
          <AdBanner slot="0987654321" format="horizontal" className="h-[90px] md:h-[120px]" />
        </div>
      </div>
    </main>
  );
}
