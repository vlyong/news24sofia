import Link from "next/link";
import Image from "next/image";
import VideoPlayer from "@/components/VideoPlayer";
import { extractVideoUrl } from "@/lib/utils";

interface VideoWidgetProps {
  title?: string;
  posts: any[];
}

export default function VideoWidget({ title = "NEWS24 TV", posts }: VideoWidgetProps) {
  if (!posts || posts.length === 0) return null;

  const dynamicVideo = posts[0] ? extractVideoUrl(posts[0].content) : null;
  const fallbackUrl = "https://bitdash-a.akamaihd.net/content/MI201112210086_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8";
  
  const videoSrc = dynamicVideo?.url || fallbackUrl;
  const isVideoIframe = dynamicVideo?.isIframe || false;

  return (
    <section className="mt-8 py-12 px-6 bg-black rounded-[32px] overflow-hidden relative shadow-2xl shadow-brand-red/10 border border-white/5">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-red/10 to-transparent pointer-events-none" />
      
      <div className="flex items-center justify-between mb-10 relative z-10">
          <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-red rounded-2xl flex items-center justify-center animate-pulse shadow-lg shadow-brand-red/40">
                  <div className="w-4 h-4 bg-white rounded-full" />
              </div>
              <div>
                  <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                    {title.split(' ')[0]} <span className="text-brand-red">{title.split(' ')[1] || ''}</span>
                  </h2>
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
                  poster={posts[0].featuredImage?.node?.sourceUrl}
                  className="aspect-video"
              />
              <div className="mt-6">
                  <div className="text-2xl font-bold text-white mb-2" dangerouslySetInnerHTML={{ __html: posts[0].title }} />
                  <div className="text-white/60 line-clamp-2" dangerouslySetInnerHTML={{ __html: posts[0].excerpt }} />
              </div>
          </div>

          {/* Video Playlist */}
          <div className="lg:col-span-4 flex flex-col gap-6">
              {posts.slice(1).map((v: any) => (
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
  );
}
