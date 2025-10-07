import { useContext } from 'react';
import AudioContext from '@/modules/common/contexts/audio-context';

export function useAudioContext() {
  const ctx = useContext(AudioContext);
  if (!ctx) {
    throw new Error('useAudioContext must be used within an AudioProvider');
  }
  return ctx;
}
