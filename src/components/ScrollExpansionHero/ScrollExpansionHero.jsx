import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollExpansionHero.css';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollExpansionHero() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const subtitleRef = useRef(null);
  const iceCrack1Ref = useRef(null);
  const iceCrack2Ref = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    const subtitle = subtitleRef.current;
    const iceCrack1 = iceCrack1Ref.current;
    const iceCrack2 = iceCrack2Ref.current;

    // Initial states
    gsap.set(text, { scale: 0.6, opacity: 0 });
    gsap.set(subtitle, { y: 40, opacity: 0 });
    gsap.set(iceCrack1, { opacity: 0, scale: 0.9 });
    gsap.set(iceCrack2, { opacity: 0, scale: 0.85 });

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

    // Text expansion animation
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
    }, '-=0.5')
    // Ice cracks appear with slower parallax
    .to(iceCrack1, {
      opacity: 0.7,
      scale: 1.05,
      y: -15,
      duration: 1,
      ease: 'power1.out'
    }, '-=0.3')
    .to(iceCrack2, {
      opacity: 0.5,
      scale: 1.1,
      y: -25,
      duration: 1,
      ease: 'power1.out'
    }, '-=0.8')
    // Final fade
    .to([text, subtitle], {
      opacity: 0.2,
      scale: 1.15,
      duration: 0.6,
      ease: 'power1.in'
    })
    .to([iceCrack1, iceCrack2], {
      opacity: 0.9,
      scale: 1.2,
      duration: 0.6,
      ease: 'power1.in'
    }, '-=0.6');

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
      
      {/* PNG ice crack overlays - FOREGROUND layer above content */}
      <div ref={iceCrack1Ref} className="ice-crack ice-crack-1">
        <img src="/ice-crack-1.png" alt="" aria-hidden="true" />
      </div>
      <div ref={iceCrack2Ref} className="ice-crack ice-crack-2">
        <img src="/ice-crack-2.png" alt="" aria-hidden="true" />
      </div>
    </section>
  );
}
