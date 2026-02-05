import { useEffect, useState } from 'react';

interface Heart {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
}

const FloatingHearts = () => {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const createHeart = () => {
      const newHeart: Heart = {
        id: Date.now() + Math.random(),
        x: Math.random() * 100,
        delay: 0,
        duration: 4 + Math.random() * 3,
        size: 12 + Math.random() * 16,
      };
      
      setHearts(prev => [...prev.slice(-8), newHeart]);
    };

    const interval = setInterval(createHeart, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute opacity-60"
          style={{
            left: `${heart.x}%`,
            bottom: '-20px',
            fontSize: `${heart.size}px`,
            animation: `heart-float ${heart.duration}s ease-out forwards`,
            animationDelay: `${heart.delay}s`,
          }}
        >
          💙
        </div>
      ))}
    </div>
  );
};

export default FloatingHearts;
