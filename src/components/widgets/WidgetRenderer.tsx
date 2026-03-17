import dynamic from 'next/dynamic';
import { HomeWidget } from '@/lib/settings';

const HeroWidget = dynamic(() => import('./HeroWidget'));
const CategoryWidget = dynamic(() => import('./CategoryWidget'));
const VideoWidget = dynamic(() => import('./VideoWidget'));
const AdWidget = dynamic(() => import('./AdWidget'));

interface WidgetRendererProps {
  widget: HomeWidget;
  posts: any[];
  allWidgetPosts?: Record<string, any[]>;
}

export default function WidgetRenderer({ widget, posts, allWidgetPosts }: WidgetRendererProps) {
  if (!widget.active) return null;

  switch (widget.type) {
    case 'row':
      return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {widget.columns?.map((col) => (
            <div key={col.id} className={`lg:col-span-${col.width || '12'} space-y-8`}>
              {col.widgets.map((childWidget) => (
                <WidgetRenderer 
                  key={childWidget.id} 
                  widget={childWidget} 
                  posts={allWidgetPosts?.[childWidget.id] || []} 
                  allWidgetPosts={allWidgetPosts}
                />
              ))}
            </div>
          ))}
        </div>
      );
    case 'hero':
      return <HeroWidget posts={posts} />;
    case 'category':
      return <CategoryWidget title={widget.title} posts={posts} />;
    case 'video':
      return <VideoWidget title={widget.title} posts={posts} />;
    case 'ad':
      return <AdWidget slot={widget.adSlot || ''} />;
    default:
      return null;
  }
}
