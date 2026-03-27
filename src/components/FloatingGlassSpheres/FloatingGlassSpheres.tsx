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
    return { default: mod.FloatingGlassSpheresR3F } as any;
  } catch (e) {
    // If dynamic import fails (missing libs or other), fall back to a no-op component.
    return { default: () => null } as any;
  }
});

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

function isLowEndDevice(): boolean {
  // Conservative low-end check: small viewport or mobile user agent.
  // We intentionally keep this simple to avoid third-party libs.
  const ua = navigator.userAgent || '';
  const isMobile = /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(ua) || window.innerWidth <= 768;
  return isMobile;
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
        <Suspense fallback={null}>
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