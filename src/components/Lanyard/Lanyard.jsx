import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';
import './Lanyard.css';

// Test cube to verify Three.js is working
function TestCube() {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#ff1744" />
    </mesh>
  );
}

// Simplified ID Card
function IDCard() {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.rotation.z = Math.sin(time * 0.5) * 0.1;
      groupRef.current.position.x = Math.sin(time * 0.8) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Black rope */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 3, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Metal ring */}
      <mesh position={[0, 1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.1, 0.03, 16, 32]} />
        <meshStandardMaterial color="#666666" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* White card */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.8, 2.5, 0.08]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>

      {/* Photo circle */}
      <mesh position={[0, 0.5, 0.05]}>
        <circleGeometry args={[0.6, 32]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>

      {/* HELLO text */}
      <Text
        position={[0, -0.2, 0.05]}
        fontSize={0.35}
        color="#1a1a1a"
        anchorX="center"
        anchorY="middle"
      >
        HELLO!
      </Text>

      {/* Black badge */}
      <mesh position={[0, -0.75, 0.05]}>
        <planeGeometry args={[1.4, 0.28]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Badge text */}
      <Text
        position={[0, -0.75, 0.06]}
        fontSize={0.13}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        I'M REACT BITS
      </Text>
    </group>
  );
}

export default function Lanyard() {
  return (
    <section className="lanyard-section">
      <div className="developer-section">
        <div className="developer-title">Meet the Developer</div>
        <h2 className="developer-name">Justin</h2>
        <p className="developer-role">Full Stack Developer</p>
        <p className="developer-tagline">"Building beautiful experiences, one line of code at a time"</p>
      </div>

      <div className="lanyard-wrapper">
        <Canvas
          shadows
          camera={{ position: [0, 0, 7], fov: 45 }}
          style={{ background: 'transparent' }}
        >
          {/* Lighting */}
          <ambientLight intensity={1.2} />
          <directionalLight position={[5, 10, 5]} intensity={1.8} castShadow />
          <pointLight position={[-5, 5, 5]} intensity={0.8} />
          
          {/* The 3D ID Card */}
          <IDCard />
        </Canvas>
      </div>
    </section>
  );
}
