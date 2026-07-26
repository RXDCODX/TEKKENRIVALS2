import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './ScrollBackgrounds.css';

gsap.registerPlugin(ScrollTrigger);

const LiquidChrome = lazy(() => import('./LiquidChrome'));
const Dither = lazy(() => import('./Dither'));

const ScrollBackgrounds: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const chromeRef = useRef<HTMLDivElement>(null);
  const ditherRef = useRef<HTMLDivElement>(null);
  const [mountEffects, setMountEffects] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.5 && !mountEffects) {
        setMountEffects(true);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [mountEffects]);

  useEffect(() => {
    if (!containerRef.current) return;

    const poster1 = document.querySelectorAll('.poster-section')[0] as HTMLElement | undefined;
    const poster2 = document.querySelectorAll('.poster-section')[1] as HTMLElement | undefined;
    const easterEgg = document.querySelector('.easter-egg') as HTMLElement | null;
    if (!poster1 || !poster2) return;

    const ctx = gsap.context(() => {
      // Video: fade out approaching poster 1
      gsap.fromTo(
        videoRef.current,
        { opacity: 1 },
        {
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: poster1,
            start: 'top+=200vh bottom',
            end: 'top bottom',
            scrub: true,
            once: false,
          },
        },
      );

      // LiquidChrome: fade in as poster 1 enters, fade out approaching poster 2
      if (chromeRef.current) {
        gsap.fromTo(
          chromeRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: poster1,
              start: 'top+=200vh bottom',
              end: 'top bottom',
              scrub: true,
              once: false,
            },
          },
        );

        gsap.fromTo(
          chromeRef.current,
          { opacity: 1 },
          {
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: poster2,
              start: 'top+=150vh bottom',
              end: 'top bottom',
              scrub: true,
              once: false,
            },
          },
        );
      }

      // Dither: fade in as poster 2 enters, fade out approaching easter egg
      if (ditherRef.current) {
        gsap.fromTo(
          ditherRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: poster2,
              start: 'top+=150vh bottom',
              end: 'top bottom',
              scrub: true,
              once: false,
            },
          },
        );

        if (easterEgg) {
          gsap.fromTo(
            ditherRef.current,
            { opacity: 1 },
            {
              opacity: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: easterEgg,
                start: 'top+=100vh bottom',
                end: 'top bottom',
                scrub: true,
                once: false,
              },
            },
          );

          // Video: fade back in at easter egg
          gsap.fromTo(
            videoRef.current,
            { opacity: 0 },
            {
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: easterEgg,
                start: 'top+=100vh bottom',
                end: 'top bottom',
                scrub: true,
                once: false,
              },
            },
          );
        }
      }
    });

    return () => ctx.revert();
  }, [mountEffects]);

  return (
    <div className='scroll-bg' ref={containerRef}>
      <div className='scroll-bg__layer' ref={videoRef}>
        <video
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

      {mountEffects && (
        <div className='scroll-bg__layer' ref={chromeRef}>
          <Suspense fallback={null}>
            <LiquidChrome
              baseColor={[0.15, 0.0, 0.2]}
              speed={0.3}
              amplitude={0.6}
              frequencyX={3}
              frequencyY={2}
            />
          </Suspense>
        </div>
      )}

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
