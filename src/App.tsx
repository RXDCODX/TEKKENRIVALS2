import { useRef } from 'react';
import { AudioProvider } from './contexts/AudioContext';
import { useAudio } from './hooks/useAudio';
import AudioToggleButton from './components/AudioToggleButton';

const AppContent: React.FC = () => {
  const { setBackgroundMusic } = useAudio();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  return (
    <>
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

      {/* Scroll container for creating long scroll */}
      <div className='scroll-container'>
        {/* Background video — scrolls with page */}
        <video
          className='background-video'
          autoPlay
          muted
          loop
          playsInline
          preload='auto'
        >
          <source src='./background.mp4' type='video/mp4' />
        </video>

        {/* Fixed logo in center of screen */}
        <div className='logo-container'>
          <img src='/logo.png' alt='TEKKEN RIVALS 2' className='logo' />
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
