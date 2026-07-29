import { useEffect, useRef, useState } from 'react';

import './ProgressiveImage.css';

interface ProgressiveImageProps {
  src: string;
  placeholder: string;
  alt: string;
  /**
   * Intrinsic pixel size of `src`, rendered as width/height attributes so the
   * browser reserves the exact box from the first paint. The sub-kilobyte
   * placeholder has its own intrinsic size and would otherwise let the poster
   * collapse and then shove the page around once the full image lands.
   */
  width: number;
  height: number;
  className?: string;
  /** Skip the viewport gate and start fetching straight away. */
  priority?: boolean;
  onClick?: () => void;
}

/** Start fetching the full-size poster this far before it scrolls into view. */
const PRELOAD_MARGIN = '300px';

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  placeholder,
  alt,
  width,
  height,
  className,
  priority = false,
  onClick,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setLoaded(false);
    setShouldLoad(priority);
  }, [src, priority]);

  // Gate the full-size fetch on the poster nearing the viewport. These are
  // multi-megabyte originals and on a phone every one of them sits below the
  // fold, so fetching them up front would spend the whole data budget before
  // the first screen is even readable.
  useEffect(() => {
    if (shouldLoad) return;

    const el = imgRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: PRELOAD_MARGIN }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldLoad]);

  // Decode the full-size source off to the side and swap it in already
  // decoded, so the un-blur never lands mid-paint.
  useEffect(() => {
    if (!shouldLoad) return;

    let cancelled = false;
    const img = new Image();
    const finish = () => {
      if (!cancelled) setLoaded(true);
    };

    img.onload = finish;
    img.onerror = finish;
    img.src = src;

    return () => {
      cancelled = true;
      img.onload = null;
      img.onerror = null;
    };
  }, [shouldLoad, src]);

  // Only expose the zoom affordance once there is a full-size image to zoom
  // into — before that the control would do nothing.
  const isInteractive = Boolean(onClick) && loaded;

  return (
    <img
      ref={imgRef}
      src={loaded ? src : placeholder}
      alt={alt}
      width={width}
      height={height}
      decoding='async'
      className={`${className || ''} progressive-image__img${loaded ? ' progressive-image__img--loaded' : ' progressive-image__img--blur'}`}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={
        isInteractive ? `${alt} — открыть в полном размере` : undefined
      }
      onClick={isInteractive ? onClick : undefined}
      onKeyDown={
        isInteractive
          ? event => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      style={isInteractive ? undefined : { cursor: 'default' }}
    />
  );
};

export default ProgressiveImage;
