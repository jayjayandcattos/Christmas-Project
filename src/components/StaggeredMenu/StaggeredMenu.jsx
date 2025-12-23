import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import './StaggeredMenu.css';

const menuItems = [
  { label: 'Home', href: '#hero' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Experience', href: '#dome' },
  { label: 'Countdown', href: '#countdown' },
  { label: 'Credits', href: '#footer' },
];

export default function StaggeredMenu({ lenis }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const itemsRef = useRef([]);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
      gsap.fromTo(itemsRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.5,
          ease: 'power2.out',
          delay: 0.1
        }
      );
    } else {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in'
      });
      gsap.to(itemsRef.current, {
        y: -30,
        opacity: 0,
        stagger: 0.05,
        duration: 0.3,
        ease: 'power2.in'
      });
    }
  }, [isOpen]);

  const handleClick = (e, href) => {
    e.preventDefault();
    setIsOpen(false);
    
    const target = document.querySelector(href);
    if (target && lenis) {
      lenis.scrollTo(target, { duration: 1.5, easing: (t) => 1 - Math.pow(1 - t, 3) });
    } else if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <button 
        className={`menu-toggle ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <span className="menu-line"></span>
        <span className="menu-line"></span>
        <span className="menu-line"></span>
      </button>

      <div 
        ref={overlayRef} 
        className={`menu-overlay ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(false)}
      />

      <nav ref={menuRef} className={`staggered-menu ${isOpen ? 'active' : ''}`}>
        <ul className="menu-list">
          {menuItems.map((item, index) => (
            <li 
              key={item.label}
              ref={el => itemsRef.current[index] = el}
              className="menu-item"
            >
              <a 
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                className="menu-link"
              >
                <span className="menu-number">0{index + 1}</span>
                <span className="menu-label">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
