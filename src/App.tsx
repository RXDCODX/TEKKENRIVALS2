import { useEffect, useRef, useState } from 'react';
import AudioToggleButton from './components/AudioToggleButton';
import FontSwitcher from './components/FontSwitcher';
import Lightbox from './components/Lightbox';
import PrimeDate from './components/PrimeDate';
import PrimeIntro from './components/PrimeIntro';
import PrimeResults from './components/PrimeResults';
import ProgressiveImage from './components/ProgressiveImage';
import ScrollBackgrounds from './components/ScrollBackgrounds';
import SplitText from './components/SplitText';
import { AudioProvider } from './contexts/AudioContext';
import { useAudio } from './hooks/useAudio';

const AppContent: React.FC = () => {
  const { setBackgroundMusic } = useAudio();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const poster3Ref = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(
    null
  );
  const [ready, setReady] = useState(false);
  const [showReportBtn, setShowReportBtn] = useState(false);
  const [introOpen, setIntroOpen] = useState(false);
  const [resultsOpen, setResultsOpen] = useState(false);

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

  useEffect(() => {
    const timer = setTimeout(() => setShowReportBtn(true), 3000);
    return () => clearTimeout(timer);
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
        src='./sr.mp3'
        loop
        preload='metadata'
      />

      {/* Audio toggle button */}
      <AudioToggleButton isVisible={true} />

      {/* Dev-only instant font switcher — never renders in production */}
      {import.meta.env.DEV && <FontSwitcher />}

      {/* Scroll backgrounds — fixed, z-index: 1 */}
      <ScrollBackgrounds ready={ready} />

      {/* Scroll container for creating long scroll */}
      <div className='scroll-container'>
        {/* Fixed logo in center of screen */}
        <div className='logo-container'>
          <a
            href='https://discord.com/invite/Panty-dungeon'
            target='_blank'
            rel='noopener noreferrer'
            className='logo-link'
          >
            <img src='/logo.png' alt='TEKKEN RIVALS 2' className='logo' />
          </a>
        </div>

        {/* Poster 1 — Season Announcement */}
        <div className='poster-section'>
          <ProgressiveImage
            src='/tk_rival_poster4.jpg'
            placeholder='/thumb/tk_rival_poster4.jpg'
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
          <ProgressiveImage
            src='/photo_2026-07-25_20-53-50.jpg'
            placeholder='/thumb/photo_2026-07-25_20-53-50.jpg'
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

        {/* Poster 3 — PRIME (rules + wizard + hollow + date + buttons) */}
        <div className='poster-section poster-section--prime' ref={poster3Ref}>
          <div className='prime-hollow'>
            <svg viewBox='0 0 600 120' xmlns='http://www.w3.org/2000/svg'>
              <text
                x='50%'
                y='50%'
                dominantBaseline='middle'
                textAnchor='middle'
                fill='none'
                stroke='#ffffff'
                strokeWidth='1.5'
                fontFamily='Anton, sans-serif'
                fontSize='120'
              >
                PRIME
              </text>
            </svg>
          </div>

          <ProgressiveImage
            src='/tekken_rivals2_styled_v3.png'
            placeholder='/thumb/tekken_rivals2_styled_v3.png'
            alt='TEKKEN RIVALS 2 Rules'
            className='poster-section__image'
            onClick={() =>
              setLightbox({
                src: '/tekken_rivals2_styled_v3.png',
                alt: 'TEKKEN RIVALS 2 Rules',
              })
            }
          />
          <div className='poster-section__text poster-section__text--prime'>
            <div className='prime-intro-content'>
              <div className='prime-wizard'>
                <div className='prime-wizard__header'>
                  <SplitText
                    text='PRIME'
                    tag='h2'
                    splitType='chars'
                    className='split-title'
                    duration={1.5}
                    delay={80}
                  />
                </div>
                <div className='prime-wizard__steps'>
                  <div className='prime-wizard__step'>
                    <span className='prime-wizard__step-number'>1</span>
                    <span className='prime-wizard__step-text'>
                      Свободный вход
                    </span>
                  </div>
                  <div className='prime-wizard__arrow' />
                  <div className='prime-wizard__step'>
                    <span className='prime-wizard__step-number'>2</span>
                    <span className='prime-wizard__step-text'>
                      Зарабатывайте очки
                    </span>
                  </div>
                  <div className='prime-wizard__arrow' />
                  <div className='prime-wizard__step'>
                    <span className='prime-wizard__step-number'>3</span>
                    <span className='prime-wizard__step-text'>
                      Дойди до финалов
                    </span>
                  </div>
                </div>
              </div>

              <PrimeDate />

              <div className='prime-buttons'>
                <a
                  href='https://www.twitch.tv/avicii75'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='prime-buttons__stream'
                >
                  Стрим
                </a>
                <button
                  type='button'
                  className='prime-buttons__register'
                  onClick={() => setIntroOpen(prev => !prev)}
                >
                  Интро
                </button>
              </div>
            </div>
            <PrimeIntro
              open={introOpen}
              onClose={() => setIntroOpen(false)}
              sectionRef={poster3Ref}
            />
          </div>
        </div>

        {/* Poster 4 — Scoring & Points */}
        <div className='poster-section'>
          <div className='poster-section__text poster-section__text--scoring'>
            <div className='poster-section__title'>
              <SplitText
                text='TEKKEN RIVALS 2™ PRIME FINALS'
                tag='h2'
                splitType='chars'
                className='split-title'
                duration={1.5}
                delay={80}
              />
            </div>
            <div className='poster-section__scoring'>
              <div className='poster-section__scoring-row'>
                <span className='poster-section__scoring-place'>1 место</span>
                <span className='poster-section__scoring-dots' />
                <span className='poster-section__scoring-points'>11</span>
              </div>
              <div className='poster-section__scoring-row'>
                <span className='poster-section__scoring-place'>2 место</span>
                <span className='poster-section__scoring-dots' />
                <span className='poster-section__scoring-points'>10</span>
              </div>
              <div className='poster-section__scoring-row'>
                <span className='poster-section__scoring-place'>3 место</span>
                <span className='poster-section__scoring-dots' />
                <span className='poster-section__scoring-points'>8</span>
              </div>
              <div className='poster-section__scoring-row'>
                <span className='poster-section__scoring-place'>4 место</span>
                <span className='poster-section__scoring-dots' />
                <span className='poster-section__scoring-points'>7</span>
              </div>
              <div className='poster-section__scoring-row'>
                <span className='poster-section__scoring-place'>5-6 место</span>
                <span className='poster-section__scoring-dots' />
                <span className='poster-section__scoring-points'>6</span>
              </div>
              <div className='poster-section__scoring-row'>
                <span className='poster-section__scoring-place'>7-8 место</span>
                <span className='poster-section__scoring-dots' />
                <span className='poster-section__scoring-points'>5</span>
              </div>
              <div className='poster-section__scoring-row'>
                <span className='poster-section__scoring-place'>
                  9-12 место
                </span>
                <span className='poster-section__scoring-dots' />
                <span className='poster-section__scoring-points'>4</span>
              </div>
              <div className='poster-section__scoring-row'>
                <span className='poster-section__scoring-place'>
                  13-16 место
                </span>
                <span className='poster-section__scoring-dots' />
                <span className='poster-section__scoring-points'>3</span>
              </div>
              <div className='poster-section__scoring-row'>
                <span className='poster-section__scoring-place'>
                  17-32 место
                </span>
                <span className='poster-section__scoring-dots' />
                <span className='poster-section__scoring-points'>2</span>
              </div>
              <div className='poster-section__scoring-row'>
                <span className='poster-section__scoring-place'>
                  33 место и ниже
                </span>
                <span className='poster-section__scoring-dots' />
                <span className='poster-section__scoring-points'>1</span>
              </div>
            </div>
            <div className='poster-section__scoring-info'>
              <SplitText
                text='Топ 8 по итогам четырёх турниров попадают в TEKKEN RIVALS 2™ PRIME FINALS и сражаются по системе Round Robin.'
                tag='p'
                splitType='words'
                duration={1}
                delay={20}
                textAlign='left'
              />
            </div>
            <div className='prime-buttons poster-section__results-btn'>
              <button
                type='button'
                className='prime-buttons__results'
                onClick={() => setResultsOpen(true)}
              >
                Результаты первого турнира
              </button>
            </div>
          </div>
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
                  loading='lazy'
                  className='easter-egg__avatar'
                />
              </a>
              <a
                href='https://t.me/anwearable'
                target='_blank'
                rel='noopener noreferrer'
                className='easter-egg__avatar-link'
              >
                <img
                  src='/antonan.jpg'
                  alt='ANWEARABLE'
                  loading='lazy'
                  className='easter-egg__avatar'
                />
              </a>
              <a
                href='https://t.me/matory1911'
                target='_blank'
                rel='noopener noreferrer'
                className='easter-egg__avatar-link'
              >
                <img
                  src='/matory.jpg'
                  alt='MATORY'
                  loading='lazy'
                  className='easter-egg__avatar'
                />
              </a>
              <a
                href='https://t.me/edeneleven'
                target='_blank'
                rel='noopener noreferrer'
                className='easter-egg__avatar-link'
              >
                <video
                  src='/edeneleven.mp4'
                  autoPlay
                  loop
                  muted
                  playsInline
                  aria-label='EDENELEVEN'
                  className='easter-egg__avatar'
                />
              </a>
              <a
                href='https://twitch.tv/iire1gn'
                target='_blank'
                rel='noopener noreferrer'
                className='easter-egg__avatar-link'
              >
                <img
                  src='/iireign.png'
                  alt='IIREIGN'
                  loading='lazy'
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
                  loading='lazy'
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

      <PrimeResults open={resultsOpen} onClose={() => setResultsOpen(false)} />

      {showReportBtn && (
        <a
          href='https://discord.com/invite/Panty-dungeon'
          target='_blank'
          rel='noopener noreferrer'
          className='report-btn'
        >
          пожаловаться на шрифты
        </a>
      )}
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
