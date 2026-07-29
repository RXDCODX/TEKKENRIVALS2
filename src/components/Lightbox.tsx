import { useEffect, useCallback, useRef } from 'react';
import styles from './Lightbox.module.scss';

interface LightboxProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ src, alt, isOpen, onClose }) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      // Park focus inside the dialog and hand it back on close, so keyboard
      // and screen-reader users are not left behind on the page underneath.
      restoreFocusRef.current = document.activeElement as HTMLElement | null;
      closeRef.current?.focus();
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      restoreFocusRef.current?.focus?.();
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role='dialog'
      aria-modal='true'
      aria-label={alt}
    >
      {/* Tapping the backdrop closes too, but that is not discoverable on a
          phone — the button is the obvious way out. */}
      <button
        ref={closeRef}
        type='button'
        className={styles.close}
        onClick={onClose}
        aria-label='Закрыть'
      >
        <svg viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
          <path
            d='M6 6l12 12M18 6L6 18'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
          />
        </svg>
      </button>
      <div className={styles.content}>
        <img src={src} alt={alt} className={styles.image} />
      </div>
    </div>
  );
};

export default Lightbox;
