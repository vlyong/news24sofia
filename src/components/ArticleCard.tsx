import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";

interface ArticleCardProps {
  slug: string;
  title: string;
  excerpt?: string;
  category: string;
  imageUrl: string;
  date: string;
  isLarge?: boolean;
  priority?: boolean;
}

export default function ArticleCard({ slug, title, excerpt, category, imageUrl, date, isLarge = false, priority = false }: ArticleCardProps) {
  // Helper to strip HTML tags for excerpts if needed, 
  // though dangerouslySetInnerHTML is better if we want to keep formatting.
  // For excerpts, usually a clean string is better.
  const cleanExcerpt = excerpt ? excerpt.replace(/<\/?[^>]+(>|$)/g, "") : "";

  return (
    <Link 
      href={`/article/${slug}`} 
      className={`group flex flex-col relative overflow-hidden rounded-2xl bg-background border border-black/5 dark:border-white/5 hover:shadow-2xl transition-all duration-500 ${isLarge ? 'md:col-span-2' : ''}`}
    >
      {/* Image Container */}
      <div className={`relative w-full ${isLarge ? 'h-[450px]' : 'h-[280px]'} overflow-hidden`}>
        <Image 
          src={imageUrl} 
          alt={title.replace(/<\/?[^>]+(>|$)/g, "")}
          fill
          priority={priority}
          className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
        />
        {/* Category Badge - Top Right */}
        <div className="absolute top-4 left-4 z-30">
          <span className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-brand-red text-white rounded-lg shadow-lg shadow-brand-red/30">
            {category}
          </span>
        </div>
      </div>

      {/* Content Overlay - Glossy Style */}
      <div className={`
        absolute bottom-0 left-0 w-full p-6 z-20
        bg-white/80 dark:bg-black/60 backdrop-blur-xl
        border-t border-white/20 dark:border-white/10
        flex flex-col gap-2 transition-all duration-500
        group-hover:bg-white/90 dark:group-hover:bg-black/80
        ${isLarge ? 'min-h-[180px]' : 'min-h-[140px]'}
      `}>
        {/* We use a div here instead of h3 because WordPress titles often come wrapped in <p> or <span> tags 
            which causes hydration mismatch when nested inside an h3 or p tag. */}
        <div 
          className={`font-black leading-tight text-foreground group-hover:text-brand-red transition-colors line-clamp-2 ${isLarge ? 'text-2xl md:text-3xl' : 'text-lg'}`}
          dangerouslySetInnerHTML={{ __html: title }}
        />
        
        {cleanExcerpt && (
          <div className={`text-foreground/70 dark:text-white/60 line-clamp-2 text-sm leading-relaxed ${!isLarge && 'hidden md:line-clamp-2'}`}>
            {cleanExcerpt}
          </div>
        )}

        <div className="flex items-center gap-2 mt-auto pt-2 text-[10px] text-foreground/40 dark:text-white/40 font-bold uppercase tracking-wider">
          <Clock className="w-3 h-3 text-brand-red" />
          <span>{date}</span>
        </div>
      </div>

      {/* Hover Highlight Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-red/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </Link>
  );
}
