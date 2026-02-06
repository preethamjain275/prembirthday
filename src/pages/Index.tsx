import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import StarCanvas from '@/components/StarCanvas';
import FloatingHearts from '@/components/FloatingHearts';
import MemoryCard from '@/components/MemoryCard';
import AudioPlayer from '@/components/AudioPlayer';

gsap.registerPlugin(ScrollTrigger);

const memories = [
  {
    image: '/photo1.jpeg',
    text: 'Back then, everything was new. Somehow, you became my constant.',
  },
  {
    image: '/photo2.jpeg',
    text: "We didn't plan this friendship. It just happened… and stayed.",
  },
  {
    image: '/photo3.jpeg',
    text: 'Some of my best laughs exist because of you.',
  },
  {
    image: '/photo4.jpeg',
    text: 'On days when everything felt heavy, your presence made it lighter.',
  },
  {
    image: '/photo5.jpeg',
    text: "Our inside jokes don't need explanations.",
  },
  {
    image: '/photo6.jpeg',
    text: 'From first semester to now, we both grew — but we stayed us.',
  },
  {
    image: '/photo7.jpeg',
    text: 'You never needed many words. You were just there, and that mattered.',
  },
  {
    image: '/photo8.jpeg',
    text: "I don't say this often, but I'm really grateful for you.",
  },
  {
    image: '/photo9.jpeg',
    text: "Today, you're not just my best friend. You're part of my everyday life.",
  },
  {
    image: '/photo10.jpeg',
    text: "From first semester to third semester, we walked together. And I think… we'll keep walking for a long time.",
  },
];

const Index = () => {
  const [entered, setEntered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const entryRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const celebrateRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef<HTMLDivElement>(null);

  // Entry animations
  useEffect(() => {
    if (headingRef.current && buttonRef.current) {
      const tl = gsap.timeline();
      
      tl.fromTo(
        headingRef.current,
        { opacity: 0, y: 50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out' }
      ).fromTo(
        buttonRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.4'
      );
    }
  }, []);

  // Scroll animations for sections
  useEffect(() => {
    if (!entered) return;

    // Celebrate section animation
    if (celebrateRef.current) {
      gsap.fromTo(
        celebrateRef.current.querySelector('h2'),
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: celebrateRef.current,
            start: 'top 80%',
          },
        }
      );
    }

    // Closing section animation
    if (closingRef.current) {
      const lines = closingRef.current.querySelectorAll('.closing-line');
      gsap.fromTo(
        lines,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.3,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: closingRef.current,
            start: 'top 70%',
          },
        }
      );

      // Star burst animation for the star emoji
      const starEmoji = closingRef.current.querySelector('.star-burst');
      if (starEmoji) {
        gsap.fromTo(
          starEmoji,
          { scale: 0, rotation: -180 },
          {
            scale: 1,
            rotation: 0,
            duration: 0.8,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: closingRef.current,
              start: 'top 60%',
            },
          }
        );
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [entered]);

  const handleEnter = () => {
    // Start music
    setIsPlaying(true);

    // Animate entry screen out
    if (entryRef.current) {
      gsap.to(entryRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
          setEntered(true);
          // Scroll to top of content
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
      });
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background canvas */}
      <StarCanvas />
      
      {/* Floating hearts (only after entering) */}
      {entered && <FloatingHearts />}
      
      {/* Audio player */}
      <AudioPlayer isPlaying={isPlaying} onToggle={() => setIsPlaying(!isPlaying)} />

      {/* Entry Screen */}
      {!entered && (
        <div
          ref={entryRef}
          className="fixed inset-0 z-20 flex flex-col items-center justify-center"
        >
          <div className="text-center px-6">
            <h1
              ref={headingRef}
              className="font-heading text-5xl md:text-7xl lg:text-8xl text-foreground text-glow mb-12"
            >
              Happy Birthday prem 💙
            </h1>
            
            <button
              ref={buttonRef}
              onClick={handleEnter}
              className="btn-glow text-foreground font-body text-lg md:text-xl px-10 py-4 rounded-full pulse-glow"
            >
              Enter
            </button>
          </div>

          {/* Decorative stars around button */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute text-2xl animate-float"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 3) * 20}%`,
                  animationDelay: `${i * 0.5}s`,
                  opacity: 0.6,
                }}
              >
                ✨
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content (after entry) */}
      {entered && (
        <div ref={mainContentRef} className="relative z-10">
          {/* Back Button */}
          <button
            onClick={() => setEntered(false)}
            className="fixed top-6 left-6 z-50 px-6 py-2 rounded-full bg-secondary/80 backdrop-blur-sm border border-primary/30 hover:bg-secondary transition-all duration-300 hover:scale-110 font-body text-foreground"
            aria-label="Back"
          >
            ← Back
          </button>

          {/* Celebrate & Memories Section */}
          <section
            ref={celebrateRef}
            className="min-h-screen px-4 md:px-8 py-20"
          >
            <div className="max-w-6xl mx-auto">
              <h2 className="font-heading text-4xl md:text-6xl text-center text-foreground text-glow mb-16">
                Celebrate Your Birthday ✨
              </h2>

              {/* Memory Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {memories.map((memory, index) => (
                  <MemoryCard
                    key={index}
                    imageUrl={memory.image}
                    text={memory.text}
                    index={index}
                  />
                ))}
              </div>

              <p className="text-center text-muted-foreground text-sm mt-8 font-body">
                Tap or hover on cards to reveal memories
              </p>
            </div>
          </section>

          {/* Emotional Closing Section */}
          <section
            ref={closingRef}
            className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
          >
            <div className="max-w-2xl text-center">
              <p className="closing-line font-heading text-2xl md:text-4xl text-foreground/90 mb-6">
                Some people become memories.
              </p>
              <p className="closing-line font-heading text-2xl md:text-4xl text-foreground/90 mb-6">
                Some become constants.
              </p>
              <p className="closing-line font-heading text-3xl md:text-5xl text-foreground text-glow mb-8">
                You're the second{' '}
                <span className="star-burst inline-block">⭐</span>
              </p>

              {/* Star burst effect */}
              <div className="relative mt-12">
                <div className="flex justify-center gap-2">
                  {[...Array(7)].map((_, i) => (
                    <span
                      key={i}
                      className="text-lg animate-shimmer"
                      style={{
                        animationDelay: `${i * 0.2}s`,
                      }}
                    >
                      ✨
                    </span>
                  ))}
                </div>
              </div>

              {/* Final thank you */}
              <div className="mt-20 opacity-80">
                <p className="font-body text-sm text-muted-foreground">
                  Made with 💙 for you
                </p>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Index;
