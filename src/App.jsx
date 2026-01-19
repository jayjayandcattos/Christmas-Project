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
  const parallaxBgRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroYearRef = useRef(null);

  useEffect(() => {
    const lenisInstance = new Lenis({
      duration: 2.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    setLenis(lenisInstance);
    lenisInstance.on('scroll', (e) => {
      ScrollTrigger.update();
      const progress = (e.scroll / e.limit) * 100;
      setScrollProgress(progress);
    });
    
    gsap.ticker.add((time) => lenisInstance.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Initialize AOS with premium settings
    AOS.init({
      duration: 1400,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      once: false,
      mirror: true,
      offset: 120,
      anchorPlacement: 'top-bottom',
    });

    return () => {
      lenisInstance.destroy();
      gsap.ticker.remove(lenisInstance.raf);
    };
  }, []);

  // Cinematic parallax effects
  useEffect(() => {
    // Hero parallax layers
    if (heroTitleRef.current && heroYearRef.current) {
      gsap.to(heroTitleRef.current, {
        yPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        }
      });

      gsap.to(heroYearRef.current, {
        yPercent: -80,
        scale: 0.8,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        }
      });
    }

    // Parallax background
    if (parallaxBgRef.current) {
      gsap.to(parallaxBgRef.current, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 2,
        }
      });
    }

    // Gallery reveal with scale
    if (galleryRef.current) {
      gsap.fromTo(galleryRef.current,
        { scale: 0.9, opacity: 0.5 },
        {
          scale: 1,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: galleryRef.current,
            start: 'top 90%',
            end: 'top 40%',
            scrub: 1,
          }
        }
      );
    }

    // Dome gallery cinematic entrance
    if (domeWrapperRef.current) {
      gsap.fromTo(domeWrapperRef.current,
        { scale: 1.1, opacity: 0, filter: 'blur(20px)' },
        {
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          ease: 'power3.out',
          scrollTrigger: {
            trigger: domeWrapperRef.current,
            start: 'top 85%',
            end: 'top 40%',
            scrub: 1.5,
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
        <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }}></div>
      </div>

      {/* Snow Cursor Trail */}
      <SnowCursor />
      
      {/* Candy Cane Aurora */}
      <Aurora 
        colorStops={['#dc2626', '#ffffff', '#dc2626']}
        amplitude={1.0}
        blend={0.6}
        speed={0.4}
      />
      
      <StaggeredMenu lenis={lenis} />
      
      {/* HERO SECTION - Cinematic */}
      <section ref={heroRef} className="hero-section" id="hero">
        {/* Parallax Background Layer */}
        <div ref={parallaxBgRef} className="hero-parallax-bg"></div>
        
        {/* Grid Overlay */}
        <div className="hero-grid-overlay"></div>
        
        {/* Floating Orbs */}
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
        
        <div className="hero-content">
          <div className="hero-eyebrow" data-aos="fade-down" data-aos-delay="0">
            <span>✦</span> Year In Review <span>✦</span>
          </div>
          
          <h1 className="hero-title">
            <span 
              ref={heroTitleRef}
              className="hero-line" 
              data-aos="clip-reveal-up"
              data-aos-delay="200"
            >
              Christmas
            </span>
          </h1>
          
          <div 
            ref={heroYearRef}
            className="hero-year-container"
            data-aos="zoom-in"
            data-aos-delay="600"
          >
            <span className="hero-year">2024</span>
          </div>
          
          <p className="hero-subtitle" data-aos="fade-up" data-aos-delay="800">
            A Year of Unforgettable Moments
          </p>
          
          <div className="scroll-indicator" data-aos="fade-up" data-aos-delay="1200">
            <div className="scroll-mouse">
              <div className="scroll-wheel"></div>
            </div>
            <span>Scroll to explore</span>
          </div>
        </div>
      </section>

      {/* YEAR STATS */}
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
      <section ref={galleryRef} className="section gallery-section" id="gallery">
        <div className="section-header" data-aos="fade-up">
          <span className="section-eyebrow">Gallery</span>
          <h2 className="section-title">Captured Moments</h2>
        </div>
        <CircularGallery 
          bend={2}
          textColor="#ffffff"
          borderRadius={0.08}
          scrollSpeed={1.5}
        />
      </section>

      {/* Divider */}
      <div className="divider-section">
        <CurvedLoop 
          marqueeText="✦ Stories ✦ Adventures ✦ Joy ✦ " 
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
          marqueeText="✦ Reflections ✦ Celebrations ✦ " 
          speed={0.8}
          curveAmount={40}
        />
      </div>

      {/* DOME GALLERY */}
      <section ref={domeWrapperRef} className="section dome-section" id="dome">
        <div className="section-header" data-aos="fade-up">
          <span className="section-eyebrow">Experience</span>
          <h2 className="section-title">Immersive View</h2>
        </div>
        <DomeGallery 
          overlayBlurColor="#000000"
          imageBorderRadius="12px"
          grayscale={false}
          dragSensitivity={15}
          fit={0.6} 
        />
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-content" data-aos="fade-up">
          <p className="footer-text">Made with ❤️ by Justin</p>
          <p className="footer-year">Christmas 2024</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
