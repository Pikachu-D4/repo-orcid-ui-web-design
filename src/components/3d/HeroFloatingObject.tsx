"use client";

import { useEffect, useRef, useState } from "react";

export default function HeroFloatingObject() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 780px)").matches;
    setReducedMotion(prefersReduced || isMobile);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    let raf = 0;
    let time = 0;
    let pointerX = 0;
    let pointerY = 0;
    let visible = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
    });
    intersectionObserver.observe(canvas);

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const normalizedX = (event.clientX - rect.left) / rect.width - 0.5;
      const normalizedY = (event.clientY - rect.top) / rect.height - 0.5;
      pointerX = Math.max(-0.6, Math.min(0.6, normalizedX));
      pointerY = Math.max(-0.6, Math.min(0.6, normalizedY));
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const draw = () => {
      if (!visible) {
        raf = window.requestAnimationFrame(draw);
        return;
      }

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      context.clearRect(0, 0, width, height);

      time += 0.012;
      const centerX = width * 0.5 + pointerX * 26;
      const centerY = height * 0.5 + pointerY * 20;
      const radius = Math.min(width, height) * 0.25;

      const wobbleX = Math.sin(time * 1.8) * 10;
      const wobbleY = Math.cos(time * 1.5) * 8;

      const glow = context.createRadialGradient(
        centerX + wobbleX,
        centerY + wobbleY,
        radius * 0.2,
        centerX,
        centerY,
        radius * 1.8,
      );
      glow.addColorStop(0, "rgba(240, 171, 252, 0.45)");
      glow.addColorStop(0.6, "rgba(147, 197, 253, 0.24)");
      glow.addColorStop(1, "rgba(147, 197, 253, 0)");
      context.fillStyle = glow;
      context.beginPath();
      context.arc(centerX, centerY, radius * 1.8, 0, Math.PI * 2);
      context.fill();

      const orb = context.createRadialGradient(
        centerX - radius * 0.2,
        centerY - radius * 0.25,
        radius * 0.25,
        centerX,
        centerY,
        radius,
      );
      orb.addColorStop(0, "rgba(255,255,255,0.95)");
      orb.addColorStop(0.35, "rgba(232,224,255,0.9)");
      orb.addColorStop(1, "rgba(124,108,255,0.86)");

      context.fillStyle = orb;
      context.beginPath();
      context.ellipse(centerX + wobbleX, centerY + wobbleY, radius, radius * 0.84, time, 0, Math.PI * 2);
      context.fill();

      context.strokeStyle = "rgba(255,255,255,0.45)";
      context.lineWidth = 2;
      context.beginPath();
      context.ellipse(centerX + wobbleX, centerY + wobbleY, radius * 0.85, radius * 0.28, time * 1.5, 0, Math.PI * 2);
      context.stroke();

      raf = window.requestAnimationFrame(draw);
    };

    raf = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", handlePointerMove);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [reducedMotion]);

  return (
    <div className="hero-orb-wrap" aria-hidden="true">
      <canvas ref={canvasRef} className="hero-orb-canvas" />
      {reducedMotion ? <div className="hero-orb-fallback" /> : null}
    </div>
  );
}
