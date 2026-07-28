import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './ScrollBackgrounds.css';

gsap.registerPlugin(ScrollTrigger);

/*
 * Four fixed video layers with scroll-driven switching:
 *   [0] background.mp4 — intro (0-100vh) and easter egg (400-500vh)
 *   [1] bg2.webm       — poster 1 zone (100-200vh)
 *   [2] bg3.webm       — poster 2 zone (200-300vh)
 *   [3] bg4.webm       — poster 3 zone (300-400vh)
 */

type ActiveLayer = 'video' | 'bg2' | 'bg3' | 'bg4';

const ScrollBackgrounds: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const bg2Ref = useRef<HTMLVideoElement>(null);
  const bg3Ref = useRef<HTMLVideoElement>(null);
  const bg4Ref = useRef<HTMLVideoElement>(null);
  const [activeLayer, setActiveLayer] = useState<ActiveLayer>('video');

  const videoMap = { video: videoRef, bg2: bg2Ref, bg3: bg3Ref, bg4: bg4Ref };

  // Play/pause based on active layer
  useEffect(() => {
    for (const [key, ref] of Object.entries(videoMap)) {
      const el = ref.current;
      if (!el) continue;
      if (key === activeLayer && !document.hidden) {
        void el.play().catch(() => {});
      } else {
        el.pause();
      }
    }
  }, [activeLayer]);

  // Visibility change
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        Object.values(videoMap).forEach(ref => ref.current?.pause());
      } else {
        const el = videoMap[activeLayer]?.current;
        if (el) void el.play().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [activeLayer]);

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

        // bg2: activate when poster 1 enters, deactivate when it leaves
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

        // bg3: activate when poster 2 enters, deactivate when it leaves
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

        // bg4: activate when poster 3 enters
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

        // video (background.mp4) for poster 4 — same as intro & easter egg
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: clamp(p4Top - vh * 0.5),
          end: clamp(p4Top + p4H + vh * 0.2),
          onEnter: () => setActiveLayer('video'),
          onLeaveBack: () => setActiveLayer('bg4'),
          onLeave: () => setActiveLayer('video'),
          onEnterBack: () => setActiveLayer('video'),
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

  const forceRestart = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const el = e.currentTarget;
    el.currentTime = 0;
    void el.play().catch(() => {});
  };

  return (
    <div className='scroll-bg' ref={containerRef}>
      {/* background.mp4 — intro + outro */}
      <div
        className={`scroll-bg__layer scroll-bg__layer--video ${activeLayer === 'video' ? 'scroll-bg__layer--active' : ''}`}
      >
        <video
          ref={videoRef}
          className='scroll-bg__video'
          autoPlay
          muted
          loop
          playsInline
          preload='metadata'
          onEnded={forceRestart}
        >
          <source src='./background.mp4' type='video/mp4' />
        </video>
      </div>

      {/* bg2.webm — poster 1 */}
      <div
        className={`scroll-bg__layer ${activeLayer === 'bg2' ? 'scroll-bg__layer--active' : ''}`}
      >
        <video
          ref={bg2Ref}
          className='scroll-bg__video'
          muted
          loop
          playsInline
          preload='metadata'
          onEnded={forceRestart}
        >
          <source src='./bg2.webm' type='video/webm' />
        </video>
      </div>

      {/* bg3.webm — poster 2 */}
      <div
        className={`scroll-bg__layer ${activeLayer === 'bg3' ? 'scroll-bg__layer--active' : ''}`}
      >
        <video
          ref={bg3Ref}
          className='scroll-bg__video'
          muted
          loop
          playsInline
          preload='metadata'
          onEnded={forceRestart}
        >
          <source src='./bg3.webm' type='video/webm' />
        </video>
      </div>

      {/* bg4.webm — poster 3 */}
      <div
        className={`scroll-bg__layer ${activeLayer === 'bg4' ? 'scroll-bg__layer--active' : ''}`}
      >
        <video
          ref={bg4Ref}
          className='scroll-bg__video'
          muted
          loop
          playsInline
          preload='metadata'
          onEnded={forceRestart}
        >
          <source src='./bg4.webm' type='video/webm' />
        </video>
      </div>
    </div>
  );
};

export default ScrollBackgrounds;
