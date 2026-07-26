import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './ScrollBackgrounds.css';

gsap.registerPlugin(ScrollTrigger);

const LiquidChrome = lazy(() => import('./LiquidChrome'));
const Dither = lazy(() => import('./Dither'));

/*
 * Each background layer maps to a poster section.
 * When a poster enters the viewport, its background fades in.
 * When it exits, the background fades out.
 * Transition zones overlap so two backgrounds are visible simultaneously.
 *
 * Layout:
 *   [0] Video       — intro, visible before poster 1, fades out as poster 1 enters
 *   [1] LiquidChrome — poster 1 background, fades in/out with poster 1
 *   [2] Dither       — poster 2 background, fades in/out with poster 2
 */

const TRANSITION_ZONE = 0.3; // vh: overlap zone where two backgrounds crossfade

const ScrollBackgrounds: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const videoElRef = useRef<HTMLVideoElement>(null);
  const chromeRef = useRef<HTMLDivElement>(null);
  const ditherRef = useRef<HTMLDivElement>(null);
  const [mountEffects, setMountEffects] = useState(false);

  // Ensure video plays immediately
  useEffect(() => {
    videoElRef.current?.play().catch(() => {});
  }, []);

  // Lazy-mount WebGL effects on first scroll
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.5 && !mountEffects) {
        setMountEffects(true);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [mountEffects]);

  // GSAP scroll-driven opacity for each background layer
  useEffect(() => {
    if (!containerRef.current) return;

    const vh = window.innerHeight;
    const maxScroll = document.documentElement.scrollHeight - vh;

    const clamp = (v: number) => Math.max(0, Math.min(v, maxScroll));

    const posters = document.querySelectorAll<HTMLElement>('.poster-section');

    const ctx = gsap.context(() => {
      // Helper: bell-curve opacity (0 → 1 → 0) over a scroll range
      const fadeOnScroll = (el: HTMLElement, rangeStart: number, rangeEnd: number) => {
        if (rangeEnd <= rangeStart) return;
        gsap.to(el, {
          opacity: 0,
          immediateRender: true,
          scrollTrigger: {
            trigger: containerRef.current,
            start: rangeStart,
            end: rangeEnd,
            scrub: true,
            onUpdate(self) {
              const p = self.progress;
              const opacity = p <= 0.5 ? p * 2 : (1 - p) * 2;
              gsap.set(el, { opacity: Math.max(0, Math.min(1, opacity)) });
            },
          },
        });
      };

      // [0] Video — intro: fades OUT when poster 1 enters (no fade-in, only fade-out)
      if (videoRef.current && posters.length > 0) {
        const poster = posters[0];
        const posterTop = poster.offsetTop;
        // Fade-out starts TRANSITION_ZONE before poster enters viewport
        const fadeStart = 0;
        const fadeEnd = clamp(posterTop - vh + TRANSITION_ZONE * vh);
        gsap.to(videoRef.current, {
          opacity: 0,
          immediateRender: true,
          scrollTrigger: {
            trigger: containerRef.current,
            start: fadeStart,
            end: fadeEnd,
            scrub: true,
          },
        });
      }

      // [1] LiquidChrome — poster 1 background (bell curve)
      if (chromeRef.current && posters.length > 0) {
        const poster = posters[0];
        const posterTop = poster.offsetTop;
        const posterHeight = poster.offsetHeight;
        const rangeStart = clamp(posterTop - vh - TRANSITION_ZONE * vh);
        const rangeEnd = clamp(posterTop + posterHeight + TRANSITION_ZONE * vh);
        fadeOnScroll(chromeRef.current, rangeStart, rangeEnd);
      }

      // [2] Dither — poster 2 background (bell curve)
      if (ditherRef.current && posters.length > 1) {
        const poster = posters[1];
        const posterTop = poster.offsetTop;
        const posterHeight = poster.offsetHeight;
        const rangeStart = clamp(posterTop - vh - TRANSITION_ZONE * vh);
        const rangeEnd = clamp(posterTop + posterHeight + TRANSITION_ZONE * vh);
        fadeOnScroll(ditherRef.current, rangeStart, rangeEnd);
      }

      // Video — outro: fades back in at the easter egg (bottom of page)
      if (videoRef.current) {
        const easterEgg = document.querySelector<HTMLElement>('.easter-egg');
        if (easterEgg) {
          const eggTop = easterEgg.offsetTop;
          const fadeStart = clamp(eggTop - vh - TRANSITION_ZONE * vh);
          const fadeEnd = clamp(eggTop + TRANSITION_ZONE * vh);
          if (fadeEnd > fadeStart) {
            gsap.to(videoRef.current, {
              opacity: 1,
              immediateRender: false,
              scrollTrigger: {
                trigger: containerRef.current,
                start: fadeStart,
                end: fadeEnd,
                scrub: true,
              },
            });
          }
        }
      }
    });

    return () => ctx.revert();
  }, [mountEffects]);

  return (
    <div className='scroll-bg' ref={containerRef}>
      {/* Video layer — visible at page load */}
      <div className='scroll-bg__layer scroll-bg__layer--video' ref={videoRef}>
        <video
          ref={videoElRef}
          className='scroll-bg__video'
          autoPlay
          muted
          loop
          playsInline
          preload='auto'
        >
          <source src='./background.mp4' type='video/mp4' />
        </video>
      </div>

      {/* LiquidChrome — poster 1 background */}
      {mountEffects && (
        <div className='scroll-bg__layer' ref={chromeRef}>
          <Suspense fallback={null}>
            <LiquidChrome
              baseColor={[
                0.09803921568627451, 0.09803921568627451, 0.09803921568627451,
              ]}
              speed={0.3}
              amplitude={0.6}
              frequencyX={3}
              frequencyY={2}
              interactive
            />
          </Suspense>
        </div>
      )}

      {/* Dither — poster 2 background */}
      {mountEffects && (
        <div className='scroll-bg__layer' ref={ditherRef}>
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
