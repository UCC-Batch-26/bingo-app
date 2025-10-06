import { useRef, useCallback, useEffect, useState } from 'react';

export function useAudio() {
  const audioContextRef = useRef(null);
  const bgmAudioRef = useRef(null);
  const ballDrawAudioRef = useRef(null);
  const victoryAudioRef = useRef(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isBgmPlaying, setIsBgmPlaying] = useState(false);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const loadAudio = useCallback(async (src) => {
    try {
      const response = await fetch(src);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      return audioBuffer;
    } catch (error) {
      console.error('Error loading audio:', error);
      return null;
    }
  }, []);

  const playSound = useCallback(
    async (src, volume = 0.5, loop = false) => {
      if (!isAudioEnabled) return;

      try {
        const audioContext = initAudioContext();
        const audioBuffer = await loadAudio(src);

        if (!audioBuffer) return;

        const source = audioContext.createBufferSource();
        const gainNode = audioContext.createGain();

        source.buffer = audioBuffer;
        source.loop = loop;
        gainNode.gain.value = volume;

        source.connect(gainNode);
        gainNode.connect(audioContext.destination);

        source.start();

        return source;
      } catch (error) {
        console.error('Error playing sound:', error);
      }
    },
    [isAudioEnabled, initAudioContext, loadAudio],
  );

  const playBgm = useCallback(async () => {
    if (!isAudioEnabled || isBgmPlaying) return;

    try {
      const bgmSource = await playSound('/sounds/bgm.mp3', 0.3, true);
      if (bgmSource) {
        bgmAudioRef.current = bgmSource;
        setIsBgmPlaying(true);
      }
    } catch (error) {
      console.error('Error playing BGM:', error);
    }
  }, [isAudioEnabled, isBgmPlaying, playSound]);

  const stopBgm = useCallback(() => {
    if (bgmAudioRef.current) {
      bgmAudioRef.current.stop();
      bgmAudioRef.current = null;
      setIsBgmPlaying(false);
    }
  }, []);

  const playBallDraw = useCallback(async () => {
    if (!isAudioEnabled) return;

    try {
      const ballDrawSource = await playSound('/sounds/ballDraw.mp3', 0.6);
      if (ballDrawSource) {
        ballDrawAudioRef.current = ballDrawSource;
      }
    } catch (error) {
      console.error('Error playing ball draw sound:', error);
    }
  }, [isAudioEnabled, playSound]);

  const playVictory = useCallback(async () => {
    if (!isAudioEnabled) return;

    try {
      const victorySource = await playSound('/sounds/victory.mp3', 0.8);
      if (victorySource) {
        victoryAudioRef.current = victorySource;
      }
    } catch (error) {
      console.error('Error playing victory sound:', error);
    }
  }, [isAudioEnabled, playSound]);

  const toggleAudio = useCallback(() => {
    setIsAudioEnabled((prev) => {
      if (prev) {
        stopBgm();
      }
      return !prev;
    });
  }, [stopBgm]);

  const resumeAudioContext = useCallback(async () => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
  }, []);

  useEffect(() => {
    return () => {
      stopBgm();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopBgm]);

  return {
    isAudioEnabled,
    isBgmPlaying,

    playBgm,
    stopBgm,
    playBallDraw,
    playVictory,
    toggleAudio,
    resumeAudioContext,
  };
}
