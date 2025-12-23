import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';
import './Lanyard.css';

function SwayingCard() {
  const groupRef = useRef();
  const time = useRef(0);

  useFrame((state, delta) => {
    time.current += delta;
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(time.current * 0.5) * 0.1;
      groupRef.current.rotation.x = Math.sin(time.current * 0.3) * 0.05;
      groupRef.current.position.y = Math.sin(time.current * 0.4) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
        <meshStandardMaterial color="#c41e3a" />
      </mesh>
      
      <Line start={[0, 1.75, 0]} end={[0, 0.5, 0]} />
      
      <group position={[0, -0.5, 0]}>
        <mesh>
          <boxGeometry args={[1.6, 2.2, 0.05]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.3} roughness={0.7} />
        </mesh>
        
        <mesh position={[0, 0.6, 0.03]}>
          <circleGeometry args={[0.35, 32]} />
          <meshStandardMaterial color="#2d5a27" />
        </mesh>
        
        <mesh position={[0, 0.6, 0.04]}>
          <ringGeometry args={[0.28, 0.35, 32]} />
          <meshStandardMaterial color="#c41e3a" />
        </mesh>
        
        <mesh position={[0, -0.2, 0.03]}>
          <planeGeometry args={[1.2, 0.15]} />
          <meshStandardMaterial color="#d4af37" />
        </mesh>
        
        <mesh position={[0, -0.5, 0.03]}>
          <planeGeometry args={[1, 0.1]} />
          <meshStandardMaterial color="#ffffff" opacity={0.8} transparent />
        </mesh>
        
        <mesh position={[0, -0.75, 0.03]}>
          <planeGeometry args={[0.8, 0.08]} />
          <meshStandardMaterial color="#ffffff" opacity={0.5} transparent />
        </mesh>
      </group>
    </group>
  );
}

function Line({ start, end }) {
  const ref = useRef();
  
  const geometry = useMemo(() => {
    const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [start, end]);

  return (
    <line ref={ref} geometry={geometry}>
      <lineBasicMaterial color="#c41e3a" linewidth={2} />
    </line>
  );
}

export default function Lanyard() {
  return (
    <section className="lanyard-section" id="footer">
      <div className="lanyard-wrapper">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }} gl={{ alpha: true }}>
          <ambientLight intensity={0.6} />
          <pointLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-5, 5, 5]} intensity={0.5} color="#c41e3a" />
          <SwayingCard />
          <Environment preset="city" />
        </Canvas>
      </div>
      
      <div className="lanyard-credits">
        <p className="credits-text">Made with ❤️ for Christmas 2024</p>
        <p className="credits-subtext">Wishing you warmth and joy this holiday season</p>
      </div>
    </section>
  );
}
