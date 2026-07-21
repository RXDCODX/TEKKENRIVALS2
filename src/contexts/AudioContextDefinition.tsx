import { createContext } from 'react';

export interface AudioContextType {
  backgroundMusic: HTMLAudioElement | null;
  muteBackgroundMusic: () => void;
  unmuteBackgroundMusic: () => void;
  isMuted: boolean;
  volume: number;
  setVolume: (volume: number) => void;
  setBackgroundMusic: (audio: HTMLAudioElement) => void;
}

export const AudioContext = createContext<AudioContextType | undefined>(
  undefined
);
