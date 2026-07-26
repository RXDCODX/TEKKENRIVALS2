import { useEffect, useRef, useState } from 'react';
import { AudioProvider } from './contexts/AudioContext';
import { useAudio } from './hooks/useAudio';
import AudioToggleButton from './components/AudioToggleButton';
import SplitText from './components/SplitText';
import Lightbox from './components/Lightbox';
import ScrollBackgrounds from './components/ScrollBackgrounds';

const AppContent: React.FC = () => {
  const { setBackgroundMusic } = useAudio();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(
    null
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    Promise.all([
      document.fonts.ready,
      new Promise<void>(resolve => {
        if (document.readyState === 'complete') return resolve();
        window.addEventListener('load', () => resolve(), { once: true });
      }),
    ]).then(() => {
      setReady(true);
      document.body.style.overflow = '';
    });
  }, []);

  return (
    <>
      {/* Loading overlay — blocks scroll until page is ready */}
      {!ready && <div className='loading-overlay' />}

      {/* Background music */}
      <audio
        ref={audio => {
          if (audio) {
            audioRef.current = audio;
            setBackgroundMusic(audio);
          }
        }}
        src='./sr.wav'
        loop
        preload='auto'
      />

      {/* Audio toggle button */}
      <AudioToggleButton isVisible={true} />

      {/* Scroll backgrounds — fixed, z-index: 1 */}
      <ScrollBackgrounds />

      {/* Scroll container for creating long scroll */}
      <div className='scroll-container'>
        {/* Fixed logo in center of screen */}
        <div className='logo-container'>
          <img src='/logo.png' alt='TEKKEN RIVALS 2' className='logo' />
        </div>

        {/* Poster 1 — Season Announcement */}
        <div className='poster-section'>
          <img
            src='/tk_rival_poster4.jpg'
            alt='TEKKEN RIVALS 2 Season'
            className='poster-section__image'
            onClick={() =>
              setLightbox({
                src: '/tk_rival_poster4.jpg',
                alt: 'TEKKEN RIVALS 2 Season',
              })
            }
          />
          <div className='poster-section__text poster-section__text--distributed'>
            <div className='poster-section__title'>
              <SplitText
                text='TEKKEN RIVALS 2™'
                tag='h2'
                splitType='chars'
                className='split-title'
                duration={1.5}
                delay={80}
              />
            </div>
            <div className='poster-section__center'>
              <SplitText
                text='В прошлом сезоне мы разыграли более 100 000 тысяч рублей призовых. А В ЭТОМ СЕЗОНЕ ВАС ЖДЕТ БОЛЬШЕ ИВЕНТОВ. Анонс первого турнира будет 26 июля 2026 года.'
                tag='p'
                splitType='words'
                duration={1.2}
                delay={30}
                textAlign='left'
              />
            </div>
            <div className='poster-section__bottom'>
              <p className='poster-section__line'>
                Без вашей поддержки этого бы не произошло -{' '}
                <a
                  href='https://www.donationalerts.com/r/avicii75'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='poster-section__link'
                >
                  donationalerts.com/r/avicii75
                </a>
              </p>
              <p className='poster-section__line'>
                Конечно же -{' '}
                <a
                  href='https://www.twitch.tv/avicii75'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='poster-section__link'
                >
                  twitch.tv/avicii75
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Poster 2 — Tournament Formats */}
        <div className='poster-section'>
          <div className='poster-section__text poster-section__text--formats'>
            <div className='poster-section__format'>
              <SplitText
                text='TEKKEN RIVALS 2™ [P] — PRIME'
                tag='h3'
                splitType='chars'
                className='split-heading'
                duration={1.3}
                delay={60}
                textAlign='left'
              />
              <SplitText
                text='Prime турнир. Свободный вход. Зарабатывай очки. Дойди до финалов.'
                tag='p'
                splitType='words'
                duration={1}
                delay={25}
                textAlign='left'
              />
            </div>

            <div className='poster-section__format poster-section__format--right'>
              <SplitText
                text='TEKKEN RIVALS 2™ [T] — TAG'
                tag='h3'
                splitType='chars'
                className='split-heading'
                duration={1.3}
                delay={60}
                textAlign='right'
              />
              <SplitText
                text='2x2 в стиле TAG TOURNAMENT. Свободный вход. Возьми с собой TEKKEN друга.'
                tag='p'
                splitType='words'
                duration={1}
                delay={25}
                textAlign='right'
              />
            </div>

            <div className='poster-section__format'>
              <SplitText
                text='TEKKEN RIVALS 2™ [S] — STREAMER BATTLE'
                tag='h3'
                splitType='chars'
                className='split-heading'
                duration={1.3}
                delay={60}
                textAlign='left'
              />
              <SplitText
                text='Streamer Battle 3x3. Собирай команду. Покажи кто лучший стример.'
                tag='p'
                splitType='words'
                duration={1}
                delay={25}
                textAlign='left'
              />
            </div>

            <div className='poster-section__format poster-section__format--right'>
              <SplitText
                text='TEKKEN RIVALS 2™ [R] — REGIONS'
                tag='h3'
                splitType='chars'
                className='split-heading'
                duration={1.3}
                delay={60}
                textAlign='right'
              />
              <SplitText
                text='5х5. Москва или Питер? Или...? Твой город тоже может выставить пятёрку.'
                tag='p'
                splitType='words'
                duration={1}
                delay={25}
                textAlign='right'
              />
            </div>

            <div className='poster-section__format'>
              <SplitText
                text='TEKKEN RIVALS 2™ [W] — WORLDWIDE CHAMPS'
                tag='h3'
                splitType='chars'
                className='split-heading'
                duration={1.3}
                delay={60}
                textAlign='left'
              />
              <SplitText
                text='5X5 RUSSIA VS GERMANY/UNITED KINGDOM/ETC. На кону флаг.'
                tag='p'
                splitType='words'
                duration={1}
                delay={25}
                textAlign='left'
              />
            </div>
          </div>
          <img
            src='/photo_2026-07-25_20-53-50.jpg'
            alt='TEKKEN RIVALS 2 Formats'
            className='poster-section__image'
            onClick={() =>
              setLightbox({
                src: '/photo_2026-07-25_20-53-50.jpg',
                alt: 'TEKKEN RIVALS 2 Formats',
              })
            }
          />
        </div>

        {/* Easter egg at the very bottom */}
        <div className='easter-egg'>
          <div className='easter-egg__content'>
            <div className='easter-egg__avatars'>
              <a
                href='https://twitch.tv/avicii75'
                target='_blank'
                rel='noopener noreferrer'
                className='easter-egg__avatar-link'
              >
                <img
                  src='/avicii75.webp'
                  alt='AVICII75'
                  className='easter-egg__avatar'
                />
              </a>
              <a
                href='https://github.com/rxdcodx'
                target='_blank'
                rel='noopener noreferrer'
                className='easter-egg__avatar-link'
              >
                <img
                  src='https://avatars.githubusercontent.com/u/88150316'
                  alt='RXDCODX'
                  className='easter-egg__avatar'
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      <Lightbox
        src={lightbox?.src ?? ''}
        alt={lightbox?.alt ?? ''}
        isOpen={lightbox !== null}
        onClose={() => setLightbox(null)}
      />
    </>
  );
};

const App: React.FC = () => {
  return (
    <AudioProvider>
      <AppContent />
    </AudioProvider>
  );
};

export default App;
