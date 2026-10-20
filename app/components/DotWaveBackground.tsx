'use client';

import { useEffect, useRef } from 'react';

type Ripple = { x: number; y: number; t0: number; strength: number };

export interface DotWaveBackgroundProps {
  /** Distance between dots in px */
  spacing?: number;
  /** Base dot radius in px */
  dotRadius?: number;
  /** Any CSS color. 'currentColor' follows the CSS `color` of the component (handy for dark mode). */
  color?: string;
  /** Max dot displacement in px */
  waveAmplitude?: number;
  /** Ripple travel speed in px/second */
  waveSpeed?: number;
  /** Milliseconds between ambient ripples */
  rippleInterval?: number;
  /** Spawn ripples from pointer movement and clicks */
  interactive?: boolean;
  className?: string;
}

const RIPPLE_LIFE = 5; // seconds
const MAX_RIPPLES = 16;

export default function DotWaveBackground({
  spacing = 15,
  dotRadius = 1.6,
  color = 'currentColor',
  waveAmplitude = 7,
  waveSpeed = 50,
  rippleInterval = 2600,
  interactive = true,
  className,
}: DotWaveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let dots = new Float32Array(0); // packed [x0, y0, x1, y1, ...]
    let ripples: Ripple[] = [];
    let raf = 0;
    let lastSpawn = 0;
    let lastColorCheck = -Infinity;
    let fill = '#888';

    const ringWidth = spacing * 2.5;
    const waveNumber = (2 * Math.PI) / (spacing * 3.5);

    const resolveColor = () => {
      fill = color === 'currentColor' ? getComputedStyle(canvas).color : color;
    };

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.ceil(width / spacing) + 2;
      const rows = Math.ceil(height / spacing) + 2;
      const ox = (width - (cols - 1) * spacing) / 2;
      const oy = (height - (rows - 1) * spacing) / 2;

      dots = new Float32Array(cols * rows * 2);
      let i = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dots[i++] = ox + c * spacing;
          dots[i++] = oy + r * spacing;
        }
      }
      resolveColor();
    };

    const addRipple = (x: number, y: number, strength: number) => {
      ripples.push({ x, y, t0: performance.now() / 1000, strength });
      if (ripples.length > MAX_RIPPLES) ripples.shift();
    };

    const draw = (now: number) => {
      const t = now / 1000;

      if (now - lastColorCheck > 500) {
        resolveColor();
        lastColorCheck = now;
      }

      if (!reduceMotion && now - lastSpawn > rippleInterval) {
        addRipple(Math.random() * width, Math.random() * height, 0.6 + Math.random() * 0.4);
        lastSpawn = now;
      }
      ripples = ripples.filter((r) => t - r.t0 < RIPPLE_LIFE);

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = fill;

      for (let i = 0; i < dots.length; i += 2) {
        const x = dots[i];
        const y = dots[i + 1];

        // Gentle ambient swell: two crossing sine waves
        let h =
          (Math.sin(x * 0.011 + t * 0.8) + Math.sin((x * 0.6 + y * 0.8) * 0.008 - t * 0.55)) * 0.22;
        let dx = 0;
        let dy = h * waveAmplitude * 0.5;

        // Expanding rings
        for (const r of ripples) {
          const age = t - r.t0;
          const rx = x - r.x;
          const ry = y - r.y;
          const d = Math.hypot(rx, ry) || 1;
          const delta = d - age * waveSpeed;
          if (delta > ringWidth * 3 || delta < -ringWidth * 3) continue;

          const envelope =
            Math.exp(-(delta * delta) / (2 * ringWidth * ringWidth)) *
            (1 - age / RIPPLE_LIFE) *
            r.strength;
          const w = Math.cos(delta * waveNumber) * envelope;

          h += w;
          dx += (rx / d) * w * waveAmplitude;
          dy += (ry / d) * w * waveAmplitude;
        }

        const hc = Math.max(-1, Math.min(1, h));
        const radius = dotRadius * (1 + 0.75 * hc);
        if (radius < 0.15) continue;

        ctx.globalAlpha = Math.max(0.08, Math.min(1, 0.35 + 0.5 * hc));
        ctx.beginPath();
        ctx.arc(x + dx, y + dy, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (!reduceMotion) raf = requestAnimationFrame(draw);
    };

    build();

    const ro = new ResizeObserver(() => {
      build();
      if (reduceMotion) draw(performance.now());
    });
    ro.observe(canvas);

    // Pointer interaction (canvas itself ignores pointer events, so listen on window)
    let lastMove = 0;
    const toLocal = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return [e.clientX - rect.left, e.clientY - rect.top] as const;
    };
    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastMove < 140) return;
      lastMove = now;
      const [x, y] = toLocal(e);
      addRipple(x, y, 0.3);
    };
    const onDown = (e: PointerEvent) => {
      const [x, y] = toLocal(e);
      addRipple(x, y, 1);
    };
    if (interactive && !reduceMotion) {
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerdown', onDown, { passive: true });
    }

    if (reduceMotion) draw(performance.now());
    else raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
    };
  }, [spacing, dotRadius, color, waveAmplitude, waveSpeed, rippleInterval, interactive]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
}

/*
Usage — app/layout.tsx:

  import DotWaveBackground from '@/components/DotWaveBackground';

  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en">
        <body>
          <DotWaveBackground className="text-neutral-400 dark:text-neutral-600" />
          {children}
        </body>
      </html>
    );
  }

Note: the canvas sits at z-index -1, so put your page background color on <html>
(not <body>), or give the canvas zIndex 0 and your content `relative z-10`.
*/
