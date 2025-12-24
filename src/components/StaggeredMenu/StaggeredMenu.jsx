import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import './StaggeredMenu.css';

const menuItems = [
  { label: 'Home', href: '#hero' },
  { label: 'Stats', href: '#stats' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Memories', href: '#polaroids' },
  { label: 'Dome', href: '#dome' },
];

const socials = [
  { label: 'GitHub', href: 'https://github.com/jayjayandcattos' },
];

export default function StaggeredMenu({ lenis }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const panelRef = useRef(null);
  const itemsRef = useRef([]);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Open: show overlay, slide panel, stagger items
      gsap.set(overlayRef.current, { display: 'block' });
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      gsap.to(panelRef.current, { x: '0%', duration: 0.5, ease: 'power3.out' });
      panelRef.current.classList.add('open');
      gsap.fromTo(itemsRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power2.out', delay: 0.2 }
      );
    } else {
      // Close: hide overlay, slide panel back
      gsap.to(overlayRef.current, { 
        opacity: 0, 
        duration: 0.3, 
        ease: 'power2.in',
        onComplete: () => gsap.set(overlayRef.current, { display: 'none' }) // FIX: Hide after fade
      });
      gsap.to(panelRef.current, { x: '100%', duration: 0.4, ease: 'power3.in' });
      panelRef.current.classList.remove('open');
      gsap.to(itemsRef.current, { y: -20, opacity: 0, stagger: 0.03, duration: 0.2, ease: 'power2.in' });
    }
  }, [isOpen]);

  const handleClick = (e, href) => {
    e.preventDefault();
    setIsOpen(false); // FIX: Close menu on link click
    
    const target = document.querySelector(href);
    if (target && lenis) {
      setTimeout(() => {
        lenis.scrollTo(target, { duration: 1.5, easing: (t) => 1 - Math.pow(1 - t, 3) });
      }, 400);
    } else if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth' });
      }, 400);
    }
  };

  const handleOverlayClick = () => {
    setIsOpen(false); // FIX: Close menu when overlay clicked
  };

  return (
    <div ref={wrapperRef} className={`staggered-menu-wrapper fixed-wrapper ${isOpen ? 'open' : ''}`}>
      <header className="staggered-menu-header">
        <div></div>
        <button className="sm-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          <span>{isOpen ? 'Close' : 'Menu'}</span>
          <span className="sm-icon">
            <span className="sm-icon-line" style={{ transform: isOpen ? 'translate(-50%, -50%) rotate(45deg)' : 'translate(-50%, calc(-50% - 3px))' }}></span>
            <span className="sm-icon-line" style={{ transform: isOpen ? 'translate(-50%, -50%) rotate(-45deg)' : 'translate(-50%, calc(-50% + 3px))' }}></span>
          </span>
        </button>
      </header>

      {/* FIX: Overlay with proper click handler and active class */}
      <div 
        ref={overlayRef} 
        className={`menu-overlay ${isOpen ? 'active' : ''}`} 
        onClick={handleOverlayClick}
        style={{ display: 'none' }} // FIX: Hidden by default
      />

      <nav ref={panelRef} className="staggered-menu-panel" style={{ transform: 'translateX(100%)' }}>
        <div className="sm-panel-inner">
          <ul className="sm-panel-list">
            {menuItems.map((item, index) => (
              <li key={item.label} className="sm-panel-itemWrap">
                <a
                  ref={el => itemsRef.current[index] = el}
                  href={item.href}
                  onClick={(e) => handleClick(e, item.href)}
                  className="sm-panel-item"
                >
                  <span className="sm-panel-itemLabel">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
          
          <div className="sm-socials">
            <h4 className="sm-socials-title">Connect</h4>
            <ul className="sm-socials-list">
              {socials.map((social) => (
                <li key={social.label}>
                  <a href={social.href} className="sm-socials-link" target="_blank" rel="noopener noreferrer">
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

/*
MENU INTERACTION FIXES:
1. handleClick closes menu (setIsOpen(false)) when link clicked
2. handleOverlayClick closes menu when overlay clicked
3. Overlay starts with display: none, shown only when isOpen
4. Overlay uses .active class for proper pointer-events control
5. Panel properly animated in/out with GSAP
6. No permanent black background - overlay hidden on close
*/
