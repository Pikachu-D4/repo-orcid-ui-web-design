'use client';

import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Note: this implementation expects @react-three/fiber v9+ for React 19 compatibility.

type SphereConfig = {
  radius: number;
  base: THREE.Vector3;
  speed: number;
  phase: number;
  rotationSpeed: THREE.Vector3;
  colorShift: number;
};

function getCssVar(name: string, fallback: string): THREE.Color {
  if (typeof window === 'undefined') return new THREE.Color(fallback);
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return new THREE.Color(value || fallback);
}

function GlassSphere({ cfg, logoTexture }: { cfg: SphereConfig; logoTexture: THREE.Texture | null }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock, pointer }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();

    ref.current.position.x = cfg.base.x + Math.cos(t * cfg.speed + cfg.phase) * 0.28 + pointer.x * 0.2;
    ref.current.position.y = cfg.base.y + Math.sin(t * cfg.speed + cfg.phase) * 0.22 + pointer.y * 0.14;
    ref.current.position.z = cfg.base.z + Math.sin(t * (cfg.speed * 0.6) + cfg.phase) * 0.12;

    ref.current.rotation.x += cfg.rotationSpeed.x;
    ref.current.rotation.y += cfg.rotationSpeed.y;
    ref.current.rotation.z += cfg.rotationSpeed.z;
  });

  const tint = useMemo(() => {
    const primary = getCssVar('--primary', '#7fb8ff');
    return primary.offsetHSL(cfg.colorShift, 0.05, 0.08);
  }, [cfg.colorShift]);

  return (
    <mesh ref={ref} position={cfg.base.toArray()}>
      <icosahedronGeometry args={[cfg.radius, 2]} />
      <meshPhysicalMaterial
        color={tint}
        roughness={0.12}
        metalness={0.03}
        transmission={0.9}
        thickness={0.85}
        envMapIntensity={0.45}
        clearcoat={0.5}
        clearcoatRoughness={0.1}
        map={logoTexture}
        transparent
        opacity={0.88}
      />
    </mesh>
  );
}

function Scene() {
  const loader = useMemo(() => new THREE.TextureLoader(), []);

  const logoTexture = useMemo(() => {
    try {
      const tex = loader.load('/next.svg');
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    } catch {
      return null;
    }
  }, [loader]);

  const spheres = useMemo<SphereConfig[]>(
    () => [
      {
        radius: 0.72,
        base: new THREE.Vector3(-1.2, 0.7, -1.5),
        speed: 0.55,
        phase: 0.4,
        rotationSpeed: new THREE.Vector3(0.0012, 0.0016, 0.0008),
        colorShift: -0.08,
      },
      {
        radius: 0.64,
        base: new THREE.Vector3(1.25, 0.35, -1.2),
        speed: 0.48,
        phase: 1.3,
        rotationSpeed: new THREE.Vector3(0.0014, 0.0012, 0.0009),
        colorShift: -0.02,
      },
      {
        radius: 0.58,
        base: new THREE.Vector3(-0.35, -0.7, -1.35),
        speed: 0.62,
        phase: 2.1,
        rotationSpeed: new THREE.Vector3(0.0011, 0.001, 0.0007),
        colorShift: 0.03,
      },
      {
        radius: 0.46,
        base: new THREE.Vector3(1.6, -0.85, -1.8),
        speed: 0.41,
        phase: 0.8,
        rotationSpeed: new THREE.Vector3(0.0013, 0.0009, 0.0007),
        colorShift: 0.07,
      },
      {
        radius: 0.42,
        base: new THREE.Vector3(-1.65, -0.25, -2.05),
        speed: 0.57,
        phase: 2.8,
        rotationSpeed: new THREE.Vector3(0.001, 0.0014, 0.0008),
        colorShift: 0.11,
      },
    ],
    []
  );

  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight intensity={0.6} position={[2.2, 1.8, 1.4]} />
      <pointLight intensity={0.35} position={[-2.5, -1.1, 1.2]} />

      {spheres.map((cfg, idx) => (
        <GlassSphere key={idx} cfg={cfg} logoTexture={logoTexture} />
      ))}
    </>
  );
}

export const FloatingGlassSpheresR3F: React.FC = () => {
  const dpr = typeof window === 'undefined' ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);

  return (
    <Canvas
      className="floating-glass-spheres-canvas"
      dpr={dpr}
      camera={{ position: [0, 0, 3.8], fov: 48, near: 0.1, far: 100 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
    >
      <Scene />
    </Canvas>
  );
};

export default FloatingGlassSpheresR3F;
