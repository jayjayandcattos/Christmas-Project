import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
  const domeRef = useRef(null);
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

    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenisInstance.destroy();
      gsap.ticker.remove(lenisInstance.raf);
    };
  }, []);

  useEffect(() => {
    if (!domeRef.current) return;

    gsap.fromTo(domeRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: domeRef.current,
          start: 'top 80%',
          end: 'top 20%',
          toggleActions: 'play none none reverse',
        }
      }
    );

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
      <StaggeredMenu lenis={lenis} />
      
      <ScrollExpansionHero />

      <div className="divider-section">
        <CurvedLoop 
          marqueeText="✦ Merry Christmas ✦ Happy Holidays ✦ Season's Greetings ✦ Joy & Peace " 
          speed={1}
          curveAmount={50}
        />
      </div>

      <section ref={galleryRef} className="section section--gallery" id="gallery">
        <CircularGallery 
          bend={2}
          textColor="#d4af37"
          borderRadius={0.08}
          scrollSpeed={1.5}
        />
      </section>

      <div className="divider-section">
        <CurvedLoop 
          marqueeText="✦ Winter Wonderland ✦ Magical Moments ✦ Cherished Memories " 
          speed={0.8}
          curveAmount={60}
          direction="right"
        />
      </div>

      <section ref={domeRef} className="section section--dome" id="dome">
        <DomeGallery 
          overlayBlurColor="#060010"
          imageBorderRadius="12px"
          grayscale={false}
          dragSensitivity={15}
        />
      </section>

      <div className="divider-section" style={{ background: 'linear-gradient(180deg, #060010 0%, #0a1628 50%, #060010 100%)' }}>
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
