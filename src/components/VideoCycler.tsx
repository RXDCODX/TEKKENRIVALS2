import { useEffect, useRef, useState } from 'react';

interface VideoCyclerProps {
  src: string;
  type: string;
  isActive: boolean;
  deferLoad?: boolean;
}

const CROSSFADE_THRESHOLD = 0.85;
const MIN_SWAP_INTERVAL = 2000;
const MAX_FADE = 2;
const IDLE_FALLBACK_TIMEOUT = 3000;

const VideoCycler: React.FC<VideoCyclerProps> = ({
  src,
  type,
  isActive,
  deferLoad = false,
}) => {
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const isPrimaryRef = useRef(true);
  const lastSwapRef = useRef(0);
  const [isPrimary, setIsPrimary] = useState(true);
  const [fadeDuration, setFadeDuration] = useState(1.5);
  const [hasSource, setHasSource] = useState(!deferLoad);

  useEffect(() => {
    const target = isPrimary ? videoARef.current : videoBRef.current;
    if (!target) return;
    if (isActive && hasSource && !document.hidden) {
      void target.play().catch(() => {});
    } else {
      target.pause();
    }
  }, [isActive, isPrimary, hasSource]);

  useEffect(() => {
    if (!deferLoad) return;

    const assignSrc = () => {
      const setSrc = (video: HTMLVideoElement | null) => {
        if (!video || video.src) return;
        video.src = src;
        video.load();
      };
      setSrc(videoARef.current);
      setSrc(videoBRef.current);
      setHasSource(true);
    };

    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(assignSrc, {
        timeout: IDLE_FALLBACK_TIMEOUT,
      });
      return () => window.cancelIdleCallback(id);
    }

    const t = setTimeout(assignSrc, IDLE_FALLBACK_TIMEOUT);
    return () => clearTimeout(t);
  }, [deferLoad, src]);

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const vid = e.currentTarget;
    const isPrimaryCheck = isPrimaryRef.current;
    const isThisPrimary = (vid === videoARef.current) === isPrimaryCheck;
    if (!isThisPrimary) return;

    if (!vid.duration) return;
    const ratio = vid.currentTime / vid.duration;
    const now = Date.now();

    if (
      ratio >= CROSSFADE_THRESHOLD &&
      now - lastSwapRef.current > MIN_SWAP_INTERVAL
    ) {
      lastSwapRef.current = now;
      const next =
        vid === videoARef.current ? videoBRef.current : videoARef.current;
      if (next) {
        next.currentTime = 0;
        void next.play().catch(() => {});
      }
      isPrimaryRef.current = !isPrimaryCheck;
      setIsPrimary(!isPrimaryCheck);
    }
  };

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const d = e.currentTarget.duration;
    if (d) {
      setFadeDuration(prev => {
        const calculated = Math.min(d * 0.15, MAX_FADE);
        return calculated > prev ? calculated : prev;
      });
    }
  };

  return (
    <div
      className='video-cycler'
      style={
        { '--crossfade-duration': `${fadeDuration}s` } as React.CSSProperties
      }
    >
      <video
        ref={videoARef}
        className={`video-cycler__video ${isPrimary ? 'video-cycler__video--active' : 'video-cycler__video--inactive'}`}
        muted
        playsInline
        preload={deferLoad ? 'none' : isActive ? 'metadata' : 'none'}
        loop
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      >
        {!deferLoad && <source src={src} type={type} />}
      </video>
      <video
        ref={videoBRef}
        className={`video-cycler__video ${!isPrimary ? 'video-cycler__video--active' : 'video-cycler__video--inactive'}`}
        muted
        playsInline
        preload={deferLoad ? 'none' : isActive ? 'metadata' : 'none'}
        loop
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      >
        {!deferLoad && <source src={src} type={type} />}
      </video>
    </div>
  );
};

export default VideoCycler;
