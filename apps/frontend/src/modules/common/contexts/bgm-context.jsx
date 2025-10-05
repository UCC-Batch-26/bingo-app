import { createContext, useEffect, useState } from 'react';

const BGMContext = createContext();

export function BGMProvider({ children }) {
  const [bgmAudio, setBgmAudio] = useState(null);
  const [isBgmPlaying, setIsBgmPlaying] = useState(false);

  // Initialize background music
  useEffect(() => {
    const audio = new Audio('/sounds/bgm.mp3');
    audio.loop = true;
    audio.volume = 0.3; // Lower volume for background music
    setBgmAudio(audio);

    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  // Play background music when component mounts
  useEffect(() => {
    if (bgmAudio && !isBgmPlaying) {
      bgmAudio
        .play()
        .then(() => {
          setIsBgmPlaying(true);
        })
        .catch((error) => {
          console.log('BGM autoplay prevented:', error);
        });
    }
  }, [bgmAudio, isBgmPlaying]);

  // Toggle background music
  const toggleBGM = () => {
    if (bgmAudio) {
      if (isBgmPlaying) {
        bgmAudio.pause();
        setIsBgmPlaying(false);
      } else {
        bgmAudio
          .play()
          .then(() => {
            setIsBgmPlaying(true);
          })
          .catch((error) => {
            console.log('BGM play error:', error);
          });
      }
    }
  };

  // Stop BGM (for special events like number reveal)
  const stopBGM = () => {
    if (bgmAudio && isBgmPlaying) {
      bgmAudio.pause();
      setIsBgmPlaying(false);
    }
  };

  // Start BGM
  const startBGM = () => {
    if (bgmAudio && !isBgmPlaying) {
      bgmAudio
        .play()
        .then(() => {
          setIsBgmPlaying(true);
        })
        .catch((error) => {
          console.log('BGM start error:', error);
        });
    }
  };

  return (
    <BGMContext.Provider
      value={{
        bgmAudio,
        isBgmPlaying,
        toggleBGM,
        stopBGM,
        startBGM,
      }}
    >
      {children}
    </BGMContext.Provider>
  );
}

export default BGMContext;
