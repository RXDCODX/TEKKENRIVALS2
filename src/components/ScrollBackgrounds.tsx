import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import VideoCycler from './VideoCycler';

import bg from '@/assets/video/background.mp4?url';
import bg2 from '@/assets/video/bg2.webm?url';
import bg3 from '@/assets/video/bg3.webm?url';
import bg4 from '@/assets/video/bg4.webm?url';
import bg5 from '@/assets/video/bg5.webm?url';

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

const LAYER_ORDER: ActiveLayer[] = ['video', 'bg2', 'bg3', 'bg4', 'bg5'];

function getMountedLayers(active: ActiveLayer): Set<ActiveLayer> {
  const i = LAYER_ORDER.indexOf(active);
  const set = new Set<ActiveLayer>();
  for (let d = -1; d <= 1; d++) {
    const idx = i + d;
    if (idx >= 0 && idx < LAYER_ORDER.length) {
      set.add(LAYER_ORDER[idx]);
    }
  }
  return set;
}

const videoMap: Record<ActiveLayer, { src: string; type: string }> = {
  video: { src: bg, type: 'video/mp4' },
  bg2: { src: bg2, type: 'video/webm' },
  bg3: { src: bg3, type: 'video/webm' },
  bg4: { src: bg4, type: 'video/webm' },
  bg5: { src: bg5, type: 'video/webm' },
};

const ScrollBackgrounds: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeLayer, setActiveLayer] = useState<ActiveLayer>('video');

  const mountedLayers = getMountedLayers(activeLayer);

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
      {LAYER_ORDER.map(key => (
        <div
          key={key}
          className={`scroll-bg__layer ${activeLayer === key ? 'scroll-bg__layer--active' : ''}`}
        >
          {mountedLayers.has(key) && (
            <VideoCycler
              src={videoMap[key].src}
              type={videoMap[key].type}
              isActive={activeLayer === key}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ScrollBackgrounds;
