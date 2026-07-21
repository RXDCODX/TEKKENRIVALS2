import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AudioContext, AudioContextType } from './AudioContextDefinition';

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolumeState] = useState(0.3);
  const userInteractedRef = useRef(false);

  // Ref to track latest isMuted for callbacks
  const isMutedRef = useRef(isMuted);
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Load saved state from localStorage
  useEffect(() => {
    const savedVolume = localStorage.getItem('audioVolume');

    if (savedVolume !== null) {
      const volumeValue = parseFloat(savedVolume);
      if (!isNaN(volumeValue) && volumeValue >= 0 && volumeValue <= 1) {
        setVolumeState(volumeValue);
      }
    }
  }, []);

  // Wait for first user interaction before playing
  useEffect(() => {
    const handleInteraction = () => {
      userInteractedRef.current = true;
      const savedState = localStorage.getItem('audioEnabled');
      const shouldPlay = savedState !== null && JSON.parse(savedState);
      if (shouldPlay && backgroundMusicRef.current) {
        setIsMuted(false);
        isMutedRef.current = false;
        backgroundMusicRef.current.muted = false;
        backgroundMusicRef.current.play().catch(console.error);
      }
      document.removeEventListener('click', handleInteraction);
    };
    document.addEventListener('click', handleInteraction);
    return () => document.removeEventListener('click', handleInteraction);
  }, []);

  // Sync audio element when isMuted/volume changes
  useEffect(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.muted = isMuted;
      backgroundMusicRef.current.volume = volume;
    }
  }, [isMuted, volume]);

  // Play when unmuted (only after user interaction)
  useEffect(() => {
    if (backgroundMusicRef.current && !isMuted && userInteractedRef.current) {
      backgroundMusicRef.current.play().catch(console.error);
    }
  }, [isMuted]);

  const muteBackgroundMusic = useCallback(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.muted = true;
      backgroundMusicRef.current.pause();
    }
    setIsMuted(true);
    localStorage.setItem('audioEnabled', 'false');
  }, []);

  const unmuteBackgroundMusic = useCallback(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.muted = false;
      backgroundMusicRef.current.play().catch(console.error);
    }
    setIsMuted(false);
    localStorage.setItem('audioEnabled', 'true');
  }, []);

  const setBackgroundMusic = useCallback(
    (audio: HTMLAudioElement) => {
      backgroundMusicRef.current = audio;
      if (audio) {
        // Use ref to get latest value instead of stale closure
        audio.muted = isMutedRef.current;
        audio.volume = volume;
      }
    },
    [volume]
  );

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    localStorage.setItem('audioVolume', clampedVolume.toString());

    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = clampedVolume;
    }
  }, []);

  const value: AudioContextType = {
    backgroundMusic: backgroundMusicRef.current,
    muteBackgroundMusic,
    unmuteBackgroundMusic,
    isMuted,
    volume,
    setVolume,
    setBackgroundMusic,
  };

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
};
