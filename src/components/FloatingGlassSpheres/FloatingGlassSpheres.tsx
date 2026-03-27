'use client';

import React, { useEffect, useState, Suspense } from 'react';
import './FloatingGlassSpheres.css';

// Non-destructive entry component.
// - Lazy-loads the heavy 3D implementation at runtime.
// - Detects WebGL support and low-end devices and falls back to CSS blobs.
// - pointer-events: none so it never blocks UI interactivity.

const LazyR3F = React.lazy(async () => {
  try {
    // Dynamically import the R3F implementation file inside this folder.
    const mod = await import('./FloatingGlassSpheresR3F');
    // We export a named export FloatingGlassSpheresR3F there.
    return { default: mod.FloatingGlassSpheresR3F };
  } catch {
    // If dynamic import fails (missing libs or other), fall back to a no-op component.
    return { default: () => null };
  }
});

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

function isLowEndDevice(): boolean {
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
    deviceMemory?: number;
  };

  const ua = navigator.userAgent || '';
  const isMobileUa = /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(ua);
  const smallViewport = window.innerWidth <= 768;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const memory = typeof nav.deviceMemory === 'number' ? nav.deviceMemory : undefined;
  const lowMemory = typeof memory === 'number' && memory <= 4;
  const cores = navigator.hardwareConcurrency || 0;
  const lowCpu = cores > 0 && cores <= 4;

  const saveData = Boolean(nav.connection?.saveData);
  const slowNetwork = /2g/.test(nav.connection?.effectiveType || '');

  return isMobileUa || smallViewport || reducedMotion || lowMemory || lowCpu || saveData || slowNetwork;
}

const FloatingGlassSpheres: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Run lightweight checks on mount.
    const webgl = detectWebGL();
    const lowEnd = isLowEndDevice();

    // Enable only when WebGL available and not low-end device. Adjust as needed.
    setEnabled(webgl && !lowEnd);
    setChecked(true);
  }, []);

  // Keep this component aria-hidden and pointer-events: none so it never interferes with UI.
  return (
    <div className="floating-glass-spheres-root" aria-hidden="true">
      {checked && enabled ? (
        <Suspense fallback={<div className="floating-glass-spheres-fallback" />}>
          <LazyR3F />
        </Suspense>
      ) : (
        // Fallback static/animated CSS blobs for devices without WebGL or prior to lazy load.
        <div className="floating-glass-spheres-fallback" />
      )}
    </div>
  );
};

export default FloatingGlassSpheres;
