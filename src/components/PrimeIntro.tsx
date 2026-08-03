import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const YOUTUBE_EMBED_URL = 'https://www.youtube.com/embed/WCBlSTe7Dmw?rel=0';

interface PrimeIntroProps {
  open: boolean;
  onClose: () => void;
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

const PrimeIntro: React.FC<PrimeIntroProps> = ({
  open,
  onClose,
  sectionRef,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const section = sectionRef.current;
    if (!overlay || !section) return;

    const content = section.querySelector<HTMLElement>('.prime-intro-content');

    if (open) {
      gsap.to(overlay, {
        autoAlpha: 1,
        duration: 0.45,
        ease: 'power2.out',
      });
      if (content)
        gsap.to(content, { autoAlpha: 0, duration: 0.45, ease: 'power2.out' });
    } else {
      gsap.to(overlay, {
        autoAlpha: 0,
        duration: 0.45,
        ease: 'power2.in',
      });
      if (content)
        gsap.to(content, { autoAlpha: 1, duration: 0.45, ease: 'power2.out' });
    }
  }, [open, sectionRef]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  return (
    <div ref={overlayRef} className='prime-intro-overlay'>
      <button
        type='button'
        className='prime-intro-overlay__close'
        aria-label='Закрыть интро'
        onClick={onClose}
      >
        ×
      </button>
      {open && (
        <div className='prime-intro-overlay__frame'>
          <iframe
            src={`${YOUTUBE_EMBED_URL}&autoplay=1`}
            title='TEKKEN RIVALS 2 — интро'
            allow='autoplay; fullscreen; picture-in-picture; encrypted-media'
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
};

export default PrimeIntro;
