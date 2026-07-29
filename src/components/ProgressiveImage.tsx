import { useEffect, useRef, useState } from 'react';

import './ProgressiveImage.css';

interface ProgressiveImageProps {
  src: string;
  placeholder: string;
  alt: string;
  className?: string;
  onClick?: () => void;
}

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  placeholder,
  alt,
  className,
  onClick,
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

  const displaySrc = loaded ? src : placeholder;

  return (
    <img
      src={displaySrc}
      alt={alt}
      className={`${className || ''} progressive-image__img${loaded ? ' progressive-image__img--loaded' : ' progressive-image__img--blur'}`}
      onClick={loaded ? onClick : undefined}
      style={loaded ? {} : { cursor: 'default' }}
    />
  );
};

export default ProgressiveImage;
