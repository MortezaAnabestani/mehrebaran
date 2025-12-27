import { useEffect, useRef, useState } from "react";

const useBackgroundAudio = (src: string) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;
    return () => audio.pause();
  }, [src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => console.warn("Audio playback failed:", err));
    }
    setIsPlaying(!isPlaying);
  };

  return { isPlaying, togglePlay };
};

export { useBackgroundAudio };
