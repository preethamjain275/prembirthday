import { useRef, useState, useEffect, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  isPlaying: boolean;
  onToggle: () => void;
}

const playlist = [
  '/birthday-soft.mp3',
];

const AudioPlayer = ({ isPlaying, onToggle }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const playNext = useCallback(() => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = playlist[currentTrack];
    
    if (isPlaying) {
      audio.play().catch(() => {
        // Autoplay blocked - user interaction needed
      });
    }
  }, [currentTrack, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      playNext();
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [playNext]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <>
      <audio ref={audioRef} loop={true} preload="auto" />
      
      {isPlaying && (
        <button
          onClick={toggleMute}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-secondary/80 backdrop-blur-sm border border-primary/30 hover:bg-secondary transition-all duration-300 hover:scale-110 soft-glow"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-foreground" />
          ) : (
            <Volume2 className="w-5 h-5 text-foreground" />
          )}
        </button>
      )}
    </>
  );
};

export default AudioPlayer;
