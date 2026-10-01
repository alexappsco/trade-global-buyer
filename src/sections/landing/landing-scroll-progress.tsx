'use client';

import { useEffect, useRef } from 'react';

export default function LandingScrollProgress() {
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    let current = 0;
    let target = 0;
    let frameId = 0;

    const readProgress = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      target = scrollable > 0 ? Math.min(Math.max(window.scrollY / scrollable, 0), 1) : 0;

      if (frameId) return;

      const tick = () => {
        current += (target - current) * 0.2;

        if (Math.abs(target - current) < 0.001) {
          current = target;
          bar.style.transform = `scaleX(${current})`;
          frameId = 0;
          return;
        }

        bar.style.transform = `scaleX(${current})`;
        frameId = window.requestAnimationFrame(tick);
      };

      frameId = window.requestAnimationFrame(tick);
    };

    readProgress();
    window.addEventListener('scroll', readProgress, { passive: true });
    window.addEventListener('resize', readProgress);

    return () => {
      window.removeEventListener('scroll', readProgress);
      window.removeEventListener('resize', readProgress);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div
      ref={barRef}
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        insetInlineStart: 0,
        width: '100%',
        height: 3,
        zIndex: 1999,
        transform: 'scaleX(0)',
        transformOrigin: '0% 50%',
        pointerEvents: 'none',
        background: 'linear-gradient(90deg, #1B8354 0%, #92F7C0 100%)',
      }}
    />
  );
}