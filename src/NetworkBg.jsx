// Animiertes Punktnetz mit Scroll-Parallaxe (portiert von network-bg.js)
import { useEffect, useRef } from 'react';

const RAW = [
  [340, 240, 13], [650, 40, 12], [630, 175, 11], [825, 315, 12], [935, 255, 11],
  [985, 35, 12], [1110, 355, 12], [525, 455, 12], [1240, 160, 9], [120, 500, 9],
  [900, 620, 10], [560, 700, 10], [1060, 660, 9]
];
const NODES = RAW.map(([x, y, r]) => [700 + (x - 700) * 1.35, 400 + (y - 400) * 1.35, r * 0.55]);
const LINKS = [
  [0, 1], [0, 2], [0, 7], [0, 9], [1, 2], [2, 3], [3, 7], [3, 4], [3, 6], [4, 5],
  [4, 6], [6, 8], [5, 8], [7, 11], [3, 10], [6, 12], [10, 12], [11, 10]
];

export function NetworkBg({ flip = false, speed = 0.12 }) {
  const hostRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        if (!hostRef.current || !svgRef.current) return;
        const rect = hostRef.current.getBoundingClientRect();
        const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
        svgRef.current.style.transform = (flip ? 'scale(-1,-1) ' : '') + 'translateY(' + -offset + 'px)';
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [flip, speed]);

  return (
    <div ref={hostRef} style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }} aria-hidden="true">
      <svg ref={svgRef} viewBox="0 0 1400 800" preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: '-8% 0', width: '100%', height: '116%', willChange: 'transform', transform: flip ? 'scale(-1,-1)' : undefined }}>
        {LINKS.map(([a, b], i) => (
          <line key={i} x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]} stroke="#D71920" strokeOpacity="0.16" />
        ))}
        {NODES.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="#D71920" fillOpacity="0.32"
            style={{ transformOrigin: x + 'px ' + y + 'px', animation: 'nbg-pulse ' + (3.2 + (i % 5) * 0.7) + 's ease-in-out ' + i * 0.35 + 's infinite' }} />
        ))}
      </svg>
    </div>
  );
}
