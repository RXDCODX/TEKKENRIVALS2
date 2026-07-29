import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import VideoCycler from './VideoCycler';

import './ScrollBackgrounds.css';

gsap.registerPlugin(ScrollTrigger);

/*
 * Five fixed video layers with scroll-driven switching:
 *   [0] background.mp4 — intro (0-100vh) and easter egg
 *   [1] bg2.webm       — poster 1 zone (100-200vh)
 *   [2] bg3.webm       — poster 2 zone (200-300vh)
 *   [3] bg4.webm       — poster 3 zone (300-400vh)
 *   [4] bg5.webm       — poster 4 / FINALS zone (400-500vh)
 */

type ActiveLayer = 'video' | 'bg2' | 'bg3' | 'bg4' | 'bg5';

const ScrollBackgrounds: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeLayer, setActiveLayer] = useState<ActiveLayer>('video');

  // ScrollTrigger
  useEffect(() => {
    if (!containerRef.current) return;

    const vh = window.innerHeight;
    const maxScroll = document.documentElement.scrollHeight - vh;
    const clamp = (v: number) => Math.max(0, Math.min(v, maxScroll));

    const posters = document.querySelectorAll<HTMLElement>('.poster-section');
    const easterEgg = document.querySelector<HTMLElement>('.easter-egg');

    const ctx = gsap.context(() => {
      if (posters.length > 0) {
        const p1Top = posters[0].offsetTop;
        const p1H = posters[0].offsetHeight;

        ScrollTrigger.create({
          trigger: containerRef.current,
          start: clamp(p1Top - vh * 0.5),
          end: clamp(p1Top + p1H + vh * 0.2),
          onEnter: () => setActiveLayer('bg2'),
          onLeaveBack: () => setActiveLayer('video'),
          onLeave: () => setActiveLayer('bg3'),
          onEnterBack: () => setActiveLayer('bg2'),
        });
      }

      if (posters.length > 1) {
        const p2Top = posters[1].offsetTop;
        const p2H = posters[1].offsetHeight;

        ScrollTrigger.create({
          trigger: containerRef.current,
          start: clamp(p2Top - vh * 0.5),
          end: clamp(p2Top + p2H + vh * 0.2),
          onEnter: () => setActiveLayer('bg3'),
          onLeaveBack: () => setActiveLayer('bg2'),
          onLeave: () => setActiveLayer('bg4'),
          onEnterBack: () => setActiveLayer('bg3'),
        });
      }

      if (posters.length > 2) {
        const p3Top = posters[2].offsetTop;
        const p3H = posters[2].offsetHeight;

        ScrollTrigger.create({
          trigger: containerRef.current,
          start: clamp(p3Top - vh * 0.5),
          end: clamp(p3Top + p3H),
          onEnter: () => setActiveLayer('bg4'),
          onLeaveBack: () => setActiveLayer('bg3'),
        });
      }

      if (posters.length > 3) {
        const p4Top = posters[3].offsetTop;
        const p4H = posters[3].offsetHeight;

        // bg5 (threads.webm) for poster 4 — PRIME FINALS
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: clamp(p4Top - vh * 0.5),
          end: clamp(p4Top + p4H + vh * 0.2),
          onEnter: () => setActiveLayer('bg5'),
          onLeaveBack: () => setActiveLayer('bg4'),
          onLeave: () => setActiveLayer('video'),
          onEnterBack: () => setActiveLayer('bg5'),
        });
      }

      if (easterEgg) {
        const eggTop = easterEgg.offsetTop;
        const fadeStart = clamp(eggTop - vh);
        const fadeEnd = clamp(eggTop + vh * 0.3);

        if (fadeEnd > fadeStart) {
          ScrollTrigger.create({
            trigger: containerRef.current,
            start: fadeStart,
            end: fadeEnd,
            onEnter: () => setActiveLayer('video'),
            onLeaveBack: () => setActiveLayer('video'),
          });
        }
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className='scroll-bg' ref={containerRef}>
      {/* background.mp4 — intro + easter egg */}
      <div
        className={`scroll-bg__layer ${activeLayer === 'video' ? 'scroll-bg__layer--active' : ''}`}
      >
        <VideoCycler
          src='./background.mp4'
          type='video/mp4'
          isActive={activeLayer === 'video'}
        />
      </div>

      {/* bg2.webm — poster 1 (ferrofluid) */}
      <div
        className={`scroll-bg__layer ${activeLayer === 'bg2' ? 'scroll-bg__layer--active' : ''}`}
      >
        <VideoCycler
          src='./bg2.webm'
          type='video/webm'
          isActive={activeLayer === 'bg2'}
        />
      </div>

      {/* bg3.webm — poster 2 (dither) */}
      <div
        className={`scroll-bg__layer ${activeLayer === 'bg3' ? 'scroll-bg__layer--active' : ''}`}
      >
        <VideoCycler
          src='./bg3.webm'
          type='video/webm'
          isActive={activeLayer === 'bg3'}
        />
      </div>

      {/* bg4.webm — poster 3 (pixel snow) */}
      <div
        className={`scroll-bg__layer ${activeLayer === 'bg4' ? 'scroll-bg__layer--active' : ''}`}
      >
        <VideoCycler
          src='./bg4.webm'
          type='video/webm'
          isActive={activeLayer === 'bg4'}
        />
      </div>

      {/* bg5.webm — poster 4 / FINALS (threads) */}
      <div
        className={`scroll-bg__layer ${activeLayer === 'bg5' ? 'scroll-bg__layer--active' : ''}`}
      >
        <VideoCycler
          src='./bg5.webm'
          type='video/webm'
          isActive={activeLayer === 'bg5'}
        />
      </div>
    </div>
  );
};

export default ScrollBackgrounds;
