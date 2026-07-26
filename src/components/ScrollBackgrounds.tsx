import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './ScrollBackgrounds.css';

gsap.registerPlugin(ScrollTrigger);

const LiquidChrome = lazy(() => import('./LiquidChrome'));
const Dither = lazy(() => import('./Dither'));

/*
 * Only one background layer is mounted at a time.
 * ScrollTrigger switches the active layer as posters enter/leave.
 */

type BackgroundLayer = 'video' | 'chrome' | 'dither';

const ScrollBackgrounds: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoElRef = useRef<HTMLVideoElement>(null);
  const [activeLayer, setActiveLayer] = useState<BackgroundLayer>('video');
  const [mountEffects, setMountEffects] = useState(false);

  useEffect(() => {
    videoElRef.current?.play().catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.5 && !mountEffects) {
        setMountEffects(true);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [mountEffects]);

  // Pause video when not active
  useEffect(() => {
    const video = videoElRef.current;
    if (!video) return;

    if (activeLayer === 'video' && !document.hidden) {
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [activeLayer]);

  // Pause video when tab is hidden
  useEffect(() => {
    const onVisibility = () => {
      const video = videoElRef.current;
      if (!video) return;
      if (document.hidden) {
        video.pause();
      } else if (activeLayer === 'video') {
        void video.play().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [activeLayer]);

  // GSAP ScrollTrigger for layer switching
  useEffect(() => {
    if (!containerRef.current) return;

    const vh = window.innerHeight;
    const maxScroll = document.documentElement.scrollHeight - vh;
    const clamp = (v: number) => Math.max(0, Math.min(v, maxScroll));

    const posters = document.querySelectorAll<HTMLElement>('.poster-section');

    const ctx = gsap.context(() => {
      if (posters.length > 0) {
        const poster1 = posters[0];
        const p1Top = poster1.offsetTop;
        const p1Height = poster1.offsetHeight;

        ScrollTrigger.create({
          trigger: containerRef.current,
          start: clamp(p1Top - vh * 0.2),
          end: clamp(p1Top + p1Height + vh * 0.2),
          onEnter: () => {
            if (mountEffects) setActiveLayer('chrome');
          },
          onEnterBack: () => {
            if (mountEffects) setActiveLayer('chrome');
          },
          onLeave: () => setActiveLayer('video'),
          onLeaveBack: () => setActiveLayer('video'),
        });
      }

      if (posters.length > 1) {
        const poster2 = posters[1];
        const p2Top = poster2.offsetTop;
        const p2Height = poster2.offsetHeight;

        ScrollTrigger.create({
          trigger: containerRef.current,
          start: clamp(p2Top - vh * 0.2),
          end: clamp(p2Top + p2Height + vh * 0.2),
          onEnter: () => {
            if (mountEffects) setActiveLayer('dither');
          },
          onEnterBack: () => {
            if (mountEffects) setActiveLayer('dither');
          },
          onLeave: () => {
            if (mountEffects) setActiveLayer('chrome');
          },
          onLeaveBack: () => {
            if (mountEffects) setActiveLayer('chrome');
          },
        });
      }

      // Video fades back in at easter egg
      const easterEgg = document.querySelector<HTMLElement>('.easter-egg');
      if (easterEgg) {
        const eggTop = easterEgg.offsetTop;
        const fadeStart = clamp(eggTop - vh - vh * 0.3);
        const fadeEnd = clamp(eggTop + vh * 0.3);
        if (fadeEnd > fadeStart) {
          ScrollTrigger.create({
            trigger: containerRef.current,
            start: fadeStart,
            end: fadeEnd,
            onEnter: () => setActiveLayer('video'),
            onLeaveBack: () => {
              if (mountEffects) setActiveLayer('dither');
            },
          });
        }
      }
    });

    return () => ctx.revert();
  }, [mountEffects]);

  return (
    <div className='scroll-bg' ref={containerRef}>
      <div
        className={`scroll-bg__layer scroll-bg__layer--video ${activeLayer === 'video' ? 'scroll-bg__layer--active' : ''}`}
      >
        <video
          ref={videoElRef}
          className='scroll-bg__video'
          autoPlay
          muted
          loop
          playsInline
          preload='metadata'
        >
          <source src='./background.mp4' type='video/mp4' />
        </video>
      </div>

      {mountEffects && activeLayer === 'chrome' && (
        <div className='scroll-bg__layer scroll-bg__layer--active'>
          <Suspense fallback={null}>
            <LiquidChrome
              baseColor={[
                0.09803921568627451, 0.09803921568627451, 0.09803921568627451,
              ]}
              speed={0.3}
              amplitude={0.6}
              frequencyX={3}
              frequencyY={2}
              mouseStrength={0.2}
              interactive
            />
          </Suspense>
        </div>
      )}

      {mountEffects && activeLayer === 'dither' && (
        <div className='scroll-bg__layer scroll-bg__layer--active'>
          <Suspense fallback={null}>
            <Dither
              waveSpeed={0.05}
              waveFrequency={3}
              waveAmplitude={0.3}
              waveColor={[0.8, 0.1, 0.1]}
              colorNum={4}
              pixelSize={2}
              enableMouseInteraction={true}
              mouseRadius={1}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
};

export default ScrollBackgrounds;
