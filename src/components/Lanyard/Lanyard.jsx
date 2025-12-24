import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Image } from '@react-three/drei';
import { useRef, useState } from 'react';
import { Vector3 } from 'three';
import './Lanyard.css';

// ID Card Component
function IDCard({ photoUrl = null }) {
  const cardRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [velocity, setVelocity] = useState(new Vector3(0, 0, 0));

  useFrame((state) => {
    if (!cardRef.current) return;

    // Apply gravity and damping for realistic swing
    const damping = 0.95;
    const gravity = -0.002;

    velocity.y += gravity;
    velocity.multiplyScalar(damping);

    // Update position based on velocity
    cardRef.current.position.add(velocity);

    // Constrain to rope length (simple pendulum)
    const ropeLength = 3;
    const anchorPoint = new Vector3(0, 2, 0);
    const currentPos = cardRef.current.position;
    const distance = currentPos.distanceTo(anchorPoint);

    if (distance > ropeLength) {
      const direction = currentPos.clone().sub(anchorPoint).normalize();
      cardRef.current.position.copy(anchorPoint.clone().add(direction.multiplyScalar(ropeLength)));
      velocity.multiplyScalar(0.8);
    }

    // Mouse interaction influence
    if (!isDragging) {
      const mouseX = state.pointer.x * 2;
      const mouseY = state.pointer.y * 2;
      const influence = 0.002;
      
      velocity.x += (mouseX - currentPos.x) * influence;
      velocity.y += (mouseY - currentPos.y) * influence * 0.5;
    }

    // Gentle rotation based on swing
    cardRef.current.rotation.z = velocity.x * 0.5;
    cardRef.current.rotation.x = velocity.y * 0.3;
  });

  const handlePointerDown = (e) => {
    e.stopPropagation();
    setIsDragging(true);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <group
      ref={cardRef}
      position={[0, -1, 0]}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {/* Rope segments */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 3, 8]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Metal clasp */}
      <mesh position={[0, 1.4, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.08, 0.02, 8, 16]} />
        <meshStandardMaterial color="#444444" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Card body - white background */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.5, 2.1, 0.05]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Photo circle placeholder */}
      <mesh position={[0, 0.45, 0.03]}>
        <circleGeometry args={[0.5, 32]} />
        <meshStandardMaterial color={photoUrl ? "#666666" : "#e0e0e0"} />
      </mesh>

      {/* Optional: Load custom photo */}
      {photoUrl && (
        <Image
          url={photoUrl}
          position={[0, 0.45, 0.04]}
          scale={[1, 1]}
          transparent
          opacity={1}
        />
      )}

      {/* "HELLO!" text */}
      <Text
        position={[0, -0.15, 0.03]}
        fontSize={0.28}
        color="#1a1a1a"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff"
        fontWeight="900"
      >
        HELLO!
      </Text>

      {/* Black badge with text */}
      <mesh position={[0, -0.65, 0.03]}>
        <planeGeometry args={[1.2, 0.22]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      <Text
        position={[0, -0.65, 0.04]}
        fontSize={0.11}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff"
        fontWeight="700"
        letterSpacing={0.02}
      >
        I'M REACT BITS
      </Text>

      {/* Card border/edge */}
      <mesh position={[0, 0, -0.001]}>
        <boxGeometry args={[1.5, 2.1, 0.001]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
    </group>
  );
}

// Main Lanyard Component
export default function Lanyard({ photoUrl = null }) {
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
          camera={{ position: [0, 0, 6], fov: 40 }}
          style={{ background: 'transparent' }}
        >
          {/* Lighting setup */}
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={1.2}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <pointLight position={[-5, 5, -5]} intensity={0.3} color="#ffffff" />
          <pointLight position={[5, -5, 5]} intensity={0.2} color="#ff1744" />

          {/* Floor shadow catcher (invisible) */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <shadowMaterial transparent opacity={0.15} />
          </mesh>

          {/* ID Card with physics */}
          <IDCard photoUrl={photoUrl} />
        </Canvas>
      </div>
    </section>
  );
}
