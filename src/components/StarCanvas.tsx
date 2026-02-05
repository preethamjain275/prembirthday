import { useEffect, useRef, useCallback } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  pulse: number;
  pulseSpeed: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  vx: number;
  vy: number;
  life: number;
}

const StarCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  const initStars = useCallback((width: number, height: number) => {
    const starCount = Math.floor((width * height) / 4000);
    starsRef.current = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.3,
      speed: Math.random() * 0.3 + 0.1,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
    }));
  }, []);

  const addParticle = useCallback((x: number, y: number) => {
    if (particlesRef.current.length > 50) return;
    
    particlesRef.current.push({
      x,
      y,
      size: Math.random() * 3 + 1,
      opacity: 1,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      life: 1,
    });
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;

    // Clear with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'hsl(240, 45%, 6%)');
    gradient.addColorStop(0.5, 'hsl(240, 40%, 12%)');
    gradient.addColorStop(1, 'hsl(280, 40%, 15%)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Update and draw stars
    starsRef.current.forEach((star) => {
      // Slow vertical drift
      star.y += star.speed;
      if (star.y > height) {
        star.y = 0;
        star.x = Math.random() * width;
      }

      // Pulsing effect
      star.pulse += star.pulseSpeed;
      const pulseScale = 1 + Math.sin(star.pulse) * 0.3;
      const currentSize = star.size * pulseScale;
      const currentOpacity = star.opacity * (0.7 + Math.sin(star.pulse) * 0.3);

      // Draw star with glow
      ctx.save();
      ctx.globalAlpha = currentOpacity;
      
      // Outer glow
      const glowGradient = ctx.createRadialGradient(
        star.x, star.y, 0,
        star.x, star.y, currentSize * 4
      );
      glowGradient.addColorStop(0, 'rgba(255, 250, 220, 0.8)');
      glowGradient.addColorStop(0.5, 'rgba(200, 180, 255, 0.3)');
      glowGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(star.x, star.y, currentSize * 4, 0, Math.PI * 2);
      ctx.fill();

      // Core star
      ctx.fillStyle = '#fffef0';
      ctx.beginPath();
      ctx.arc(star.x, star.y, currentSize, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });

    // Update and draw particles (cursor trail)
    particlesRef.current = particlesRef.current.filter((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= 0.02;
      particle.opacity = particle.life;

      if (particle.life <= 0) return false;

      ctx.save();
      ctx.globalAlpha = particle.opacity * 0.8;
      
      // Particle glow
      const particleGradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 3
      );
      particleGradient.addColorStop(0, 'rgba(255, 200, 255, 0.9)');
      particleGradient.addColorStop(0.5, 'rgba(180, 150, 255, 0.4)');
      particleGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = particleGradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      return true;
    });

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars(canvas.width, canvas.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Add particle trail occasionally
      if (Math.random() > 0.7) {
        addParticle(x, y);
      }
      
      mouseRef.current = { x, y };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const y = e.touches[0].clientY - rect.top;
        
        if (Math.random() > 0.5) {
          addParticle(x, y);
        }
        
        mouseRef.current = { x, y };
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove);
    
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initStars, addParticle, animate]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-auto"
      style={{ zIndex: 0 }}
    />
  );
};

export default StarCanvas;
