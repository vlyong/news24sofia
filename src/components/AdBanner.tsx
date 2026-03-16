"use client";

import { useEffect, useRef } from "react";

interface AdBannerProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
  responsive?: boolean;
}

export default function AdBanner({ slot, format = "auto", className = "", responsive = true }: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    // Only push once. In dev mode (strict mode), Next.js mounts components twice.
    if (pushed.current) return;

    const attemptPush = () => {
      try {
        if (typeof window !== "undefined" && (window as any).adsbygoogle) {
          const ads = (window as any).adsbygoogle || [];
          ads.push({});
          pushed.current = true;
        }
      } catch (err) {
        console.error("AdSense push error:", err);
      }
    };

    // Small delay to ensure DOM is ready and avoid race conditions
    const timer = setTimeout(attemptPush, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`ad-container relative w-full overflow-hidden ${className}`}>
      {/* Skeleton / Placeholder to avoid Layout Shift */}
      <div className="absolute inset-0 bg-black/5 dark:bg-white/5 border border-dashed border-black/10 dark:border-white/10 rounded-xl flex items-center justify-center -z-10 group">
        <div className="text-center px-4">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/20 group-hover:text-brand-red transition-colors">
            Рекламен блок
          </p>
          <div className="mt-1 flex gap-1 justify-center opacity-30">
             <div className="w-1 h-1 rounded-full bg-foreground/20"></div>
             <div className="w-1 h-1 rounded-full bg-foreground/20"></div>
             <div className="w-1 h-1 rounded-full bg-foreground/20"></div>
          </div>
        </div>
      </div>

      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      ></ins>
    </div>
  );
}
