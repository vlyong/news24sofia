import WidgetRenderer from "@/components/widgets/WidgetRenderer";
import { fetchAPI, GET_ALL_POSTS, GET_POSTS_BY_CATEGORY } from "@/lib/api";
import { getSettings } from "@/lib/settings";

export const revalidate = 60;

export default async function Home() {
  const settings = await getSettings();
  
  // 1. Prepare data for all widgets
  const widgetDataPromises = settings.homepageLayout.map(async (widget) => {
    if (!widget.active) return { widget, posts: [] };

    let posts = [];
    try {
      if (widget.type === 'hero') {
        const data = await fetchAPI(GET_ALL_POSTS);
        posts = (data?.posts?.nodes || []).slice(0, 4);
      } else if (widget.type === 'video') {
        const data = await fetchAPI(GET_POSTS_BY_CATEGORY, { variables: { categoryName: widget.categoryName || "news24" } });
        posts = (data?.posts?.nodes || []).slice(0, widget.limit || 3);
      } else if (widget.type === 'category') {
        const data = await fetchAPI(GET_POSTS_BY_CATEGORY, { variables: { categoryName: widget.categoryName } });
        posts = (data?.posts?.nodes || []).slice(0, widget.limit || 4);
      }
    } catch (error) {
      console.error(`Error fetching data for widget ${widget.id}:`, error);
    }

    return { widget, posts };
  });

  const resolvedWidgets = await Promise.all(widgetDataPromises);

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

      <div className="container mx-auto px-4">
        {resolvedWidgets.map(({ widget, posts }) => (
          <WidgetRenderer key={widget.id} widget={widget} posts={posts} />
        ))}
      </div>
    </main>
  );
}
