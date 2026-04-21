import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';

interface Track {
  id: number;
  title: string;
  artist: string;
  cover: string;
  url: string;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: "Cyber Pulse",
    artist: "AI GENERATED TRACK",
    cover: "https://picsum.photos/seed/neon-1/400",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "Glitch Horizon",
    artist: "AI GENERATED TRACK",
    cover: "https://picsum.photos/seed/cyber-2/400",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "Vapor Drift",
    artist: "AI GENERATED TRACK",
    cover: "https://picsum.photos/seed/circuit-3/400",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

export default function MusicPlayer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = TRACKS[currentIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const p = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(p) ? 0 : p);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', () => handleNext());
    
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', () => handleNext());
    };
  }, [currentIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const p = x / rect.width;
    audio.currentTime = p * audio.duration;
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-full flex items-center justify-between">
      <audio ref={audioRef} src={currentTrack.url} />
      
      {/* Now Playing info (Left) */}
      <div className="w-1/4 flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-neon-cyan to-black rounded-md overflow-hidden flex-shrink-0 group relative">
          <img 
            src={currentTrack.cover} 
            alt="Album Art" 
            className="w-full h-full object-cover transition-transform group-hover:scale-110" 
            referrerPolicy="no-referrer"
          />
          {isPlaying && (
            <div className="absolute inset-0 bg-neon-cyan/20 flex items-center justify-center">
               <div className="w-1 h-1 bg-white rounded-full animate-ping" />
            </div>
          )}
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-bold text-white truncate uppercase tracking-tight">{currentTrack.title}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Controls & Progress (Center) */}
      <div className="flex-1 max-w-2xl flex flex-col items-center gap-2">
        <div className="flex items-center gap-8">
          <button 
            onClick={handlePrev}
            className="text-gray-500 hover:text-neon-cyan transition-colors"
          >
            <SkipBack size={20} fill="currentColor" />
          </button>
          
          <button
            onClick={togglePlay}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:bg-neon-cyan transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>

          <button 
            onClick={handleNext}
            className="text-gray-500 hover:text-neon-cyan transition-colors"
          >
            <SkipForward size={20} fill="currentColor" />
          </button>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full flex items-center gap-3">
          <span className="text-[10px] font-mono text-gray-500 w-8 text-right">
            {formatTime(audioRef.current?.currentTime || 0)}
          </span>
          <div 
            className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer group"
            onClick={seek}
          >
            <motion.div 
              className="h-full bg-gradient-to-r from-neon-cyan to-neon-pink"
              style={{ width: `${progress}%` }}
              transition={{ type: "tween" }}
            />
          </div>
          <span className="text-[10px] font-mono text-gray-500 w-8">
            {formatTime(audioRef.current?.duration || 0)}
          </span>
        </div>
      </div>

      {/* Volume / Misc (Right) */}
      <div className="w-1/4 flex justify-end items-center gap-4">
        <Volume2 className="w-4 h-4 text-gray-500" />
        <div className="w-24 h-1 bg-white/20 rounded-full relative overflow-hidden">
          <div className="absolute inset-0 w-[80%] bg-neon-cyan shadow-[0_0_8px_var(--color-neon-cyan)]"></div>
        </div>
      </div>
    </div>
  );
}
