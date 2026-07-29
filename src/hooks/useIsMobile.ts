import { useEffect, useState } from 'react';

/**
 * Viewport width below which the site switches to its mobile layout.
 * Keep in sync with the `@media (max-width: 768px)` block in
 * src/styles/main.scss — the two have to agree or the JS and CSS
 * layouts disagree about which mode the page is in.
 */
export const MOBILE_BREAKPOINT = 768;

const QUERY = `(max-width: ${MOBILE_BREAKPOINT}px)`;

const matchesMobile = () =>
  typeof window !== 'undefined' && window.matchMedia(QUERY).matches;

/**
 * True while the viewport is phone-sized.
 *
 * Resolved synchronously on the very first render, so the desktop-only
 * trees it guards (the video backgrounds, the GSAP text animations) never
 * mount on mobile — not even for a single frame, which is what keeps their
 * chunks and the ~86 MB of background video off the wire entirely.
 */
export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(matchesMobile);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const onChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);

    // Re-read once on mount in case the viewport changed before hydration.
    setIsMobile(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return isMobile;
};
