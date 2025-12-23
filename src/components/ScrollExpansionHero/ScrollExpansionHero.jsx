import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollExpansionHero.css';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollExpansionHero() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    const subtitle = subtitleRef.current;

    gsap.set(text, { scale: 0.5, opacity: 0 });
    gsap.set(subtitle, { y: 30, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
        pin: true,
        anticipatePin: 1,
      }
    });

    tl.to(text, {
      scale: 1,
      opacity: 1,
      duration: 1,
      ease: 'power1.out'
    })
    .to(subtitle, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'power1.out'
    }, '-=0.3')
    .to([text, subtitle], {
      opacity: 0.3,
      scale: 1.1,
      duration: 0.5,
      ease: 'power1.in'
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section ref={containerRef} className="scroll-expansion-hero" id="hero">
      <div className="hero-content">
        <h1 ref={textRef} className="hero-title">
          <span className="hero-title-line">Christmas</span>
          <span className="hero-title-line accent">Memories</span>
        </h1>
        <p ref={subtitleRef} className="hero-subtitle">
          A journey through warmth and wonder
        </p>
      </div>
      <div className="hero-overlay"></div>
      <div className="snowflakes" aria-hidden="true">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="snowflake" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`
          }}>❄</div>
        ))}
      </div>
    </section>
  );
}
