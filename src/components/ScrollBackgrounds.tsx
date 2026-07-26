import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './ScrollBackgrounds.css';

gsap.registerPlugin(ScrollTrigger);

const Dither = lazy(() => import('./Dither'));

/*
 * Two layers: video (intro/outro) and dither (both posters).
 * Dither shifts colors via shader uniforms — no React re-render.
 */

const ScrollBackgrounds: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoElRef = useRef<HTMLVideoElement>(null);
  const [showVideo, setShowVideo] = useState(true);
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

  // Pause video when not visible
  useEffect(() => {
    const video = videoElRef.current;
    if (!video) return;
    if (showVideo && !document.hidden) {
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [showVideo]);

  useEffect(() => {
    const onVisibility = () => {
      const video = videoElRef.current;
      if (!video) return;
      if (document.hidden) {
        video.pause();
      } else if (showVideo) {
        void video.play().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [showVideo]);

  // ScrollTrigger: show video → hide video when poster 1 enters → show video at easter egg
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

        // Hide video when poster 1 enters, show when scrolling back to top
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: clamp(p1Top - vh * 0.5),
          onEnter: () => setShowVideo(false),
          onLeaveBack: () => setShowVideo(true),
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
            onEnter: () => setShowVideo(true),
            onLeaveBack: () => setShowVideo(false),
          });
        }
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className='scroll-bg' ref={containerRef}>
      <div
        className={`scroll-bg__layer scroll-bg__layer--video ${showVideo ? 'scroll-bg__layer--active' : ''}`}
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

      {mountEffects && (
        <div
          className={`scroll-bg__layer ${!showVideo ? 'scroll-bg__layer--active' : ''}`}
        >
          <Suspense fallback={null}>
            <Dither
              waveSpeed={0.05}
              waveFrequency={3}
              waveAmplitude={0.3}
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
