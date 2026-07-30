import { useEffect, useRef, useState } from 'react';

import './ProgressiveImage.css';

interface ProgressiveImageProps {
  src: string;
  placeholder: string;
  alt: string;
  className?: string;
  onClick?: () => void;
  srcSetWebp?: string;
  srcSetJpeg?: string;
  sizes?: string;
}

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  placeholder,
  alt,
  className,
  onClick,
  srcSetWebp,
  srcSetJpeg,
  sizes,
}) => {
  const [loaded, setLoaded] = useState(false);
  const preloadedRef = useRef(false);

  useEffect(() => {
    preloadedRef.current = false;
    setLoaded(false);

    const startLoading = () => {
      if (preloadedRef.current) return;
      preloadedRef.current = true;

      const img = new Image();
      img.onload = () => {
        if (!preloadedRef.current) return;
        setLoaded(true);
      };
      img.onerror = () => {
        setLoaded(true);
      };
      img.src = src;
    };

    if (document.readyState === 'complete') {
      startLoading();
    } else {
      const handler = () => startLoading();
      window.addEventListener('load', handler, { once: true });
      return () => {
        window.removeEventListener('load', handler);
        preloadedRef.current = false;
      };
    }
  }, [src]);

  if (!loaded) {
    return (
      <img
        src={placeholder}
        alt={alt}
        className={`${className || ''} progressive-image__img progressive-image__img--blur`}
        style={{ cursor: 'default' }}
      />
    );
  }

  return (
    <picture>
      {srcSetWebp && (
        <source srcSet={srcSetWebp} sizes={sizes} type='image/webp' />
      )}
      <img
        src={src}
        srcSet={srcSetJpeg || undefined}
        sizes={srcSetJpeg ? sizes : undefined}
        alt={alt}
        className={`${className || ''} progressive-image__img progressive-image__img--loaded`}
        onClick={onClick}
      />
    </picture>
  );
};

export default ProgressiveImage;
