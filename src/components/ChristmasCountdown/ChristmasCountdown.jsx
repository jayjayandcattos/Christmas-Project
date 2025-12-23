import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';
import './ChristmasCountdown.css';

function Snowfall({ count = 200 }) {
  const mesh = useRef();
  const particles = useRef();

  useEffect(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    particles.current = positions;
    mesh.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  }, [count]);

  useFrame((state, delta) => {
    if (!mesh.current || !particles.current) return;
    const positions = mesh.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] -= delta * (0.5 + Math.random() * 0.5);
      if (positions[i * 3 + 1] < -5) {
        positions[i * 3 + 1] = 10;
        positions[i * 3] = (Math.random() - 0.5) * 20;
      }
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry />
      <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

function AnimatedTree() {
  const treeRef = useRef();
  const starRef = useRef();
  const lightsRef = useRef([]);

  useEffect(() => {
    if (lightsRef.current.length > 0) {
      gsap.to(lightsRef.current, {
        opacity: 0.3,
        stagger: { each: 0.2, repeat: -1, yoyo: true },
        duration: 0.8,
        ease: 'sine.inOut'
      });
    }
    if (starRef.current) {
      gsap.to(starRef.current, {
        scale: 1.2,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }
  }, []);

  return (
    <div className="tree-container" ref={treeRef}>
      <div className="tree">
        <div className="star" ref={starRef}>★</div>
        <div className="tree-layer tree-layer-1">
          <div className="light" ref={el => lightsRef.current[0] = el} style={{ left: '30%' }}></div>
          <div className="light" ref={el => lightsRef.current[1] = el} style={{ left: '70%' }}></div>
        </div>
        <div className="tree-layer tree-layer-2">
          <div className="light" ref={el => lightsRef.current[2] = el} style={{ left: '20%' }}></div>
          <div className="light" ref={el => lightsRef.current[3] = el} style={{ left: '50%' }}></div>
          <div className="light" ref={el => lightsRef.current[4] = el} style={{ left: '80%' }}></div>
        </div>
        <div className="tree-layer tree-layer-3">
          <div className="light" ref={el => lightsRef.current[5] = el} style={{ left: '15%' }}></div>
          <div className="light" ref={el => lightsRef.current[6] = el} style={{ left: '40%' }}></div>
          <div className="light" ref={el => lightsRef.current[7] = el} style={{ left: '65%' }}></div>
          <div className="light" ref={el => lightsRef.current[8] = el} style={{ left: '85%' }}></div>
        </div>
        <div className="trunk"></div>
      </div>
    </div>
  );
}

export default function ChristmasCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isChristmas, setIsChristmas] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      let christmas = new Date(currentYear, 11, 25, 0, 0, 0);
      
      if (now > christmas) {
        christmas = new Date(currentYear + 1, 11, 25, 0, 0, 0);
      }

      const diff = christmas.getTime() - now.getTime();

      if (diff <= 0) {
        setIsChristmas(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="countdown-section" id="countdown">
      <div className="countdown-canvas">
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }} style={{ background: 'transparent' }}>
          <ambientLight intensity={0.5} />
          <Snowfall count={150} />
        </Canvas>
      </div>
      
      <div className="countdown-content">
        <h2 className="countdown-title">
          {isChristmas ? 'Merry Christmas!' : 'Christmas Countdown'}
        </h2>
        
        {!isChristmas && (
          <div className="countdown-timer">
            <div className="time-block">
              <span className="time-value">{String(timeLeft.days).padStart(2, '0')}</span>
              <span className="time-label">Days</span>
            </div>
            <span className="time-separator">:</span>
            <div className="time-block">
              <span className="time-value">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="time-label">Hours</span>
            </div>
            <span className="time-separator">:</span>
            <div className="time-block">
              <span className="time-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="time-label">Minutes</span>
            </div>
            <span className="time-separator">:</span>
            <div className="time-block">
              <span className="time-value">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="time-label">Seconds</span>
            </div>
          </div>
        )}

        <AnimatedTree />
      </div>
    </section>
  );
}
