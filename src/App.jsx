import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Aurora from './components/Aurora/Aurora';
import ScrollExpansionHero from './components/ScrollExpansionHero/ScrollExpansionHero';
import CircularGallery from './components/CircularGallery/CircularGallery';
import DomeGallery from './components/DomeGallery/DomeGallery';
import CurvedLoop from './components/CurvedLoop/CurvedLoop';
import ChristmasCountdown from './components/ChristmasCountdown/ChristmasCountdown';
import Lanyard from './components/Lanyard/Lanyard';
import StaggeredMenu from './components/StaggeredMenu/StaggeredMenu';

import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [lenis, setLenis] = useState(null);
  const domeWrapperRef = useRef(null);
  const galleryRef = useRef(null);

  useEffect(() => {
    const lenisInstance = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    setLenis(lenisInstance);
    lenisInstance.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenisInstance.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenisInstance.destroy();
      gsap.ticker.remove(lenisInstance.raf);
    };
  }, []);

  useEffect(() => {
    // CAUSE: GSAP was setting opacity: 0 initially, making gallery invisible until scroll
    // FIX: Remove opacity animation, keep only y-transform for subtle scroll effect
    if (domeWrapperRef.current) {
      gsap.fromTo(domeWrapperRef.current,
        { y: 40 },
        {
          y: 0,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: domeWrapperRef.current,
            start: 'top 90%',
            end: 'top 40%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }

    // CircularGallery scroll-triggered opacity
    if (galleryRef.current) {
      gsap.fromTo(galleryRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: galleryRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          }
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="app-container">
      {/* Aurora background: red tones, low opacity, behind all content, above black base */}
      <Aurora 
        colorStops={['#ff0844', '#ff1744', '#d50000']} // Red aurora tones only
        amplitude={0.8}
        blend={0.7}
        speed={0.5}
      />
      
      <StaggeredMenu lenis={lenis} />
      
      <ScrollExpansionHero />

      {/* Festive Divider - transparent, text-only */}
      <div className="divider-section">
        <CurvedLoop 
          marqueeText="✦ Merry Christmas ✦ Happy Holidays ✦ Season's Greetings ✦ Joy & Peace " 
          speed={1}
          curveAmount={50}
        />
      </div>

      <section ref={galleryRef} className="section" id="gallery">
        <CircularGallery 
          bend={2}
          textColor="#ff1744"
          borderRadius={0.06}
          scrollSpeed={1.5}
        />
      </section>

      {/* Festive Divider - transparent */}
      <div className="divider-section">
        <CurvedLoop 
          marqueeText="✦ Winter Wonderland ✦ Magical Moments ✦ Cherished Memories " 
          speed={0.8}
          curveAmount={60}
          direction="right"
        />
      </div>

      {/* DomeGallery with GSAP wrapper for opacity/transform, scaled larger */}
      <section ref={domeWrapperRef} className="section" id="dome">
        <DomeGallery 
          overlayBlurColor="#000000"
          imageBorderRadius="8px"
          grayscale={false}
          dragSensitivity={15}
          fit={0.6} 
        />
      </section>

      {/* Festive Divider - transparent */}
      <div className="divider-section">
        <CurvedLoop 
          marqueeText="✦ Countdown to Christmas ✦ The Most Wonderful Time ✦ " 
          speed={0.6}
          curveAmount={40}
        />
      </div>

      <ChristmasCountdown />

      <Lanyard />
    </div>
  );
}

export default App;
