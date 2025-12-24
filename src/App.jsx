import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Aurora from './components/Aurora/Aurora';
import CircularGallery from './components/CircularGallery/CircularGallery';
import DomeGallery from './components/DomeGallery/DomeGallery';
import CurvedLoop from './components/CurvedLoop/CurvedLoop';
import YearStats from './components/YearStats/YearStats';
import PolaroidGallery from './components/PolaroidGallery/PolaroidGallery';
import SnowCursor from './components/SnowCursor/SnowCursor';
import StaggeredMenu from './components/StaggeredMenu/StaggeredMenu';

import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [lenis, setLenis] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const domeWrapperRef = useRef(null);
  const galleryRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const lenisInstance = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    setLenis(lenisInstance);
    lenisInstance.on('scroll', (e) => {
      ScrollTrigger.update();
      const progress = (e.scroll / (e.limit)) * 100;
      setScrollProgress(progress);
    });
    
    gsap.ticker.add((time) => lenisInstance.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Initialize AOS
    AOS.init({
      duration: 1200,
      easing: 'ease-out-expo',
      once: true,
      offset: 100,
    });

    return () => {
      lenisInstance.destroy();
      gsap.ticker.remove(lenisInstance.raf);
    };
  }, []);

  useEffect(() => {
    // Hero entrance
    if (heroRef.current) {
      gsap.fromTo(heroRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: 'power3.out'
        }
      );
    }

    // CircularGallery scroll-triggered
    if (galleryRef.current) {
      gsap.fromTo(galleryRef.current,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: galleryRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          }
        }
      );
    }

    // DomeGallery entrance
    if (domeWrapperRef.current) {
      gsap.fromTo(domeWrapperRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.3,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: domeWrapperRef.current,
            start: 'top 85%',
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
      {/* Scroll Progress Bar */}
      <div className="scroll-progress">
        <div 
          className="scroll-progress-bar" 
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* Snow Cursor Trail */}
      <SnowCursor />
      
      {/* Candy Cane Aurora Background */}
      <Aurora 
        colorStops={['#dc2626', '#ffffff', '#dc2626']}
        amplitude={1.2}
        blend={0.8}
        speed={0.6}
      />
      
      <StaggeredMenu lenis={lenis} />
      
      {/* HERO SECTION */}
      <section ref={heroRef} className="hero-section" id="hero">
        <div className="hero-content" data-aos="zoom-in" data-aos-duration="1500">
          <h1 className="hero-title">
            <span className="hero-line" data-aos="fade-right" data-aos-delay="200">Christmas</span>
            <span className="hero-line hero-year" data-aos="fade-left" data-aos-delay="400">2024</span>
          </h1>
          <p className="hero-subtitle" data-aos="fade-up" data-aos-delay="600">A Year Worth Remembering</p>
        </div>
      </section>

      {/* YEAR STATS - Spotify Wrapped Style */}
      <YearStats />

      {/* Divider */}
      <div className="divider-section">
        <CurvedLoop 
          marqueeText="✦ Memories ✦ Moments ✦ Magic ✦ " 
          speed={1.2}
          curveAmount={50}
        />
      </div>

      {/* CIRCULAR GALLERY */}
      <section ref={galleryRef} className="section" id="gallery" data-aos="fade-up">
        <CircularGallery 
          bend={2}
          textColor="#ff1744"
          borderRadius={0.06}
          scrollSpeed={1.5}
        />
      </section>

      {/* Divider */}
      <div className="divider-section">
        <CurvedLoop 
          marqueeText="✦ Your Story ✦ Your Moments ✦ " 
          speed={0.9}
          curveAmount={60}
          direction="right"
        />
      </div>

      {/* POLAROID GALLERY */}
      <PolaroidGallery />

      {/* Divider */}
      <div className="divider-section">
        <CurvedLoop 
          marqueeText="✦ Reflections ✦ Adventures ✦ Celebrations ✦ " 
          speed={0.8}
          curveAmount={40}
        />
      </div>

      {/* DOME GALLERY */}
      <section ref={domeWrapperRef} className="section" id="dome" data-aos="zoom-in">
        <DomeGallery 
          overlayBlurColor="#000000"
          imageBorderRadius="8px"
          grayscale={false}
          dragSensitivity={15}
          fit={0.6} 
        />
      </section>
    </div>
  );
}

export default App;
