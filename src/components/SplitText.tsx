import { lazy, Suspense } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import type { SplitTextProps } from './SplitTextAnimated';

import './SplitText.css';

// GSAP, ScrollTrigger and the SplitText plugin live behind this boundary.
// Phones render the static variant and never fetch the chunk.
const SplitTextAnimated = lazy(() => import('./SplitTextAnimated'));

/**
 * The text exactly as written, in the tag the caller asked for.
 *
 * On mobile this is the whole component: splitting a dozen paragraphs into
 * per-character spans and driving each one from a ScrollTrigger is the most
 * expensive thing on the page, and text that animates in on scroll is text a
 * screen reader has to fight. Alignment is left to the stylesheet so the
 * mobile layout can centre everything.
 */
const StaticText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  tag = 'p',
}) => {
  const Tag = tag as 'p';

  return (
    <Tag className={`split-parent split-parent--static ${className}`.trim()}>
      {text}
    </Tag>
  );
};

const SplitText: React.FC<SplitTextProps> = props => {
  const isMobile = useIsMobile();

  if (isMobile) return <StaticText {...props} />;

  return (
    <Suspense fallback={<StaticText {...props} />}>
      <SplitTextAnimated {...props} />
    </Suspense>
  );
};

export type { SplitTextProps };
export default SplitText;
