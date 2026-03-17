import dynamic from 'next/dynamic';
import { HomeWidget } from '@/lib/settings';

const HeroWidget = dynamic(() => import('./HeroWidget'));
const CategoryWidget = dynamic(() => import('./CategoryWidget'));
const VideoWidget = dynamic(() => import('./VideoWidget'));
const AdWidget = dynamic(() => import('./AdWidget'));

interface WidgetRendererProps {
  widget: HomeWidget;
  posts: any[];
}

export default function WidgetRenderer({ widget, posts }: WidgetRendererProps) {
  if (!widget.active) return null;

  switch (widget.type) {
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
