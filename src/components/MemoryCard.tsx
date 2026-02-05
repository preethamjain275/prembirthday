import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface MemoryCardProps {
  imageUrl: string;
  text: string;
  index: number;
}

const MemoryCard = ({ imageUrl, text, index }: MemoryCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        'memory-card w-full aspect-[3/4] cursor-pointer',
        isFlipped && 'flipped',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
      style={{
        transition: `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`,
      }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      role="button"
      tabIndex={0}
      aria-label={`Memory card ${index + 1}. Click to flip.`}
    >
      <div className="memory-card-inner">
        {/* Front - Photo */}
        <div className="memory-card-front bg-card border-2 border-primary/30 soft-glow">
          <div className="w-full h-full relative overflow-hidden">
            <img
              src={imageUrl}
              alt={`Memory ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <span className="text-sm font-body text-foreground/80">Memory {index + 1}</span>
            </div>
          </div>
        </div>

        {/* Back - Text */}
        <div className="memory-card-back bg-gradient-to-br from-secondary to-muted border-2 border-accent/40 flex items-center justify-center p-6">
          <div className="text-center">
            <p className="font-body text-sm md:text-base leading-relaxed text-foreground/90">
              "{text}"
            </p>
            <div className="mt-4 flex justify-center gap-1">
              <span className="text-accent">✨</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryCard;
