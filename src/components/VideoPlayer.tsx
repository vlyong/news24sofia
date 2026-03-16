"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, AlertCircle } from "lucide-react";

interface VideoPlayerProps {
  src: string;
  isIframe?: boolean;
  poster?: string;
  className?: string;
}

export default function VideoPlayer({ src, isIframe = false, poster, className = "" }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout|null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src || isIframe) return;

    let hls: any = null;

    const initPlayer = async () => {
        try {
            if (src.endsWith(".m3u8")) {
                const HlsModule = await import("hls.js");
                const Hls = HlsModule.default;
                if (Hls.isSupported()) {
                    hls = new Hls();
                    hls.loadSource(src);
                    hls.attachMedia(video);
                } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = src;
                }
            } else {
                video.src = src;
            }
        } catch (e) {
            console.error("HLS init error:", e);
            video.src = src; // Fallback to direct src
        }
    };

    initPlayer();

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onError = () => {
        if (video.error) {
            console.error("Video error code:", video.error.code, "message:", video.error.message);
            setError("Видеото не може да бъде заредено. Проверете източника.");
        }
    };

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('error', onError);

    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('error', onError);
      if (hls) {
        hls.destroy();
      }
    };
  }, [src, isIframe]);

  const togglePlay = () => {
    if (isIframe) return;
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(err => {
            console.error("Playback error:", err);
            // Ignore AbortError as it's common when toggling quickly
            if (err.name !== 'AbortError') {
                setError("Грешка при пускане на видеото.");
            }
        });
      } else {
        videoRef.current.pause();
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgress = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      if (!isNaN(duration) && duration > 0) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      if (!isNaN(duration) && duration > 0) {
        const value = Number(e.target.value);
        const seekTime = (value / 100) * duration;
        videoRef.current.currentTime = seekTime;
        setProgress(value);
      }
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  return (
    <div 
      className={`relative group bg-black rounded-3xl overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {isIframe ? (
        <iframe 
            src={src}
            className="w-full h-full border-0 aspect-video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
        />
      ) : (
        <>
          <video
            ref={videoRef}
            poster={poster}
            className="w-full h-full cursor-pointer"
            onClick={togglePlay}
            onTimeUpdate={handleProgress}
            playsInline
          />

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-40 p-6 text-center">
                <AlertCircle className="w-12 h-12 text-brand-red mb-4" />
                <p className="text-white font-bold">{error}</p>
                <button 
                    onClick={() => { setError(null); togglePlay(); }}
                    className="mt-4 px-6 py-2 bg-brand-red text-white rounded-full text-sm font-bold hover:bg-brand-red/80 transition-colors"
                >
                    Опитай отново
                </button>
            </div>
          )}

          {/* Glossy Overlay Controls */}
          <div className={`
            absolute inset-x-0 bottom-0 p-4 transition-opacity duration-500 z-30
            ${showControls ? 'opacity-100' : 'opacity-0'}
          `}>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl">
              {/* Progress Bar */}
              <input
                type="range"
                min="0"
                max="100"
                value={progress || 0}
                onChange={handleSeek}
                className="absolute -top-1 left-4 right-4 h-1 bg-white/20 appearance-none cursor-pointer rounded-full overflow-hidden [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-0 [&::-webkit-slider-thumb]:h-0 [&::-webkit-slider-thumb]:shadow-[-100vw_0_0_100vw_rgba(255,59,48,1)]"
              />

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={togglePlay}
                    className="text-white hover:text-brand-red transition-colors"
                  >
                    {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                  </button>

                  <button 
                    onClick={toggleMute}
                    className="text-white hover:text-brand-red transition-colors"
                  >
                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <button className="text-white hover:text-brand-red transition-colors">
                    <Settings size={20} />
                  </button>
                  <button 
                    onClick={toggleFullscreen}
                    className="text-white hover:text-brand-red transition-colors"
                  >
                    <Maximize size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Center Play Button (only when not playing and no error) */}
          {!isPlaying && !error && (
            <button 
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all z-20"
            >
              <div className="w-20 h-20 bg-brand-red rounded-full flex items-center justify-center shadow-2xl shadow-brand-red/40 transform group-hover:scale-110 transition-transform">
                <Play size={40} fill="white" className="text-white ml-2" />
              </div>
            </button>
          )}
        </>
      )}
    </div>
  );
}
