import { createContext } from 'react';
import { useAudio } from '@/hooks/use-audio';

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const audio = useAudio();
  return <AudioContext.Provider value={audio}>{children}</AudioContext.Provider>;
}

export default AudioContext;
