import React, { useEffect, useRef, useState } from 'react';

const CORNER_PADDING = 1;
const IDLE_SIZE = 27;
const EASE = 0.5;
const DOT_EASE = 0.35;

const WIGGLE_OFFSET_FACTOR = 7.5;
const WIGGLE_MAX_OFFSET = 100;
const WIGGLE_STIFFNESS = 0.05;
const WIGGLE_DAMPING = 0.72;

// Easter egg: shake the mouse fast enough while NOT hovering anything and
// the corners fly apart, proportional to how hard you're shaking. Calms
// back down into a clean square once you stop.
const SHAKE_DECAY = 0.85; // per-frame decay of accumulated shake energy
const SHAKE_ENERGY_SCALE = 0.02; // raw mouse speed -> energy gained per frame
const SHAKE_ENERGY_CAP = 40; // ceiling so it can't scatter forever
const SHAKE_BREAK_THRESHOLD = 6; // energy needed before corners start separating
const SHAKE_MAX_SCATTER = 45; // px a corner can fly outward at max energy

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Wiggle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

// Outward direction + a slightly unique multiplier per corner, so the
// scatter reads as organic rather than perfectly symmetric.
const CORNER_DIRS = [
  { x: -1, y: -1, mult: 1 }, // top-left
  { x: 1, y: -1, mult: 0.85 }, // top-right
  { x: -1, y: 1, mult: 1.15 }, // bottom-left
  { x: 1, y: 1, mult: 0.95 }, // bottom-right
];

export const TargetCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const cornersRef = useRef<HTMLDivElement | null>(null);
  const rotatorRef = useRef<HTMLDivElement | null>(null);
  const wiggleRef = useRef<HTMLDivElement | null>(null);
  const cornerRefs = useRef<(HTMLSpanElement | null)[]>([null, null, null, null]);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  const mouse = useRef({ x: -100, y: -100 });
  const rawPrevMouse = useRef({ x: -100, y: -100 });
  const dotPos = useRef({ x: -100, y: -100 });
  const prevDotPos = useRef({ x: -100, y: -100 });
  const box = useRef<Box>({ x: 0, y: 0, w: IDLE_SIZE, h: IDLE_SIZE });
  const boxTarget = useRef<Box | null>(null);
  const wiggle = useRef<Wiggle>({ x: 0, y: 0, vx: 0, vy: 0 });
  const hoveringRef = useRef(false);
  const shakeEnergy = useRef(0);

  useEffect(() => {
    hoveringRef.current = hovering;
  }, [hovering]);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    };

    const handleOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest('.cursor-target') as HTMLElement | null;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      boxTarget.current = {
        x: rect.left - CORNER_PADDING,
        y: rect.top - CORNER_PADDING,
        w: rect.width + CORNER_PADDING * 2,
        h: rect.height + CORNER_PADDING * 2,
      };
      setHovering(true);
    };

    const handleOut = (e: MouseEvent) => {
      const fromTarget = (e.target as HTMLElement)?.closest('.cursor-target');
      const toTarget = (e.relatedTarget as HTMLElement | null)?.closest?.('.cursor-target');
      if (fromTarget && !toTarget) {
        boxTarget.current = null;
        setHovering(false);
      }
    };

    const handleLeaveWindow = () => setVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleOver);
    document.addEventListener('mouseout', handleOut);
    document.addEventListener('mouseleave', handleLeaveWindow);

    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;
    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
    let animId: number;

    const update = () => {
      dotPos.current.x = lerp(dotPos.current.x, mouse.current.x, DOT_EASE);
      dotPos.current.y = lerp(dotPos.current.y, mouse.current.y, DOT_EASE);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0)`;
      }

      const vx = dotPos.current.x - prevDotPos.current.x;
      const vy = dotPos.current.y - prevDotPos.current.y;
      prevDotPos.current.x = dotPos.current.x;
      prevDotPos.current.y = dotPos.current.y;

      // Raw (un-eased) mouse speed this frame, feeding the shake detector.
      const rawDx = mouse.current.x - rawPrevMouse.current.x;
      const rawDy = mouse.current.y - rawPrevMouse.current.y;
      rawPrevMouse.current.x = mouse.current.x;
      rawPrevMouse.current.y = mouse.current.y;
      const rawSpeed = Math.hypot(rawDx, rawDy);
      shakeEnergy.current = Math.min(
        shakeEnergy.current * SHAKE_DECAY + rawSpeed * SHAKE_ENERGY_SCALE,
        SHAKE_ENERGY_CAP
      );

      const breakAmount = hoveringRef.current
        ? 0
        : Math.max(0, shakeEnergy.current - SHAKE_BREAK_THRESHOLD);

      const bt =
        boxTarget.current ?? {
          x: dotPos.current.x - IDLE_SIZE / 2,
          y: dotPos.current.y - IDLE_SIZE / 2,
          w: IDLE_SIZE,
          h: IDLE_SIZE,
        };

      box.current.x = lerp(box.current.x, bt.x, EASE);
      box.current.y = lerp(box.current.y, bt.y, EASE);
      box.current.w = lerp(box.current.w, bt.w, EASE);
      box.current.h = lerp(box.current.h, bt.h, EASE);

      if (cornersRef.current) {
        cornersRef.current.style.transform = `translate3d(${box.current.x}px, ${box.current.y}px, 0)`;
        cornersRef.current.style.width = `${box.current.w}px`;
        cornersRef.current.style.height = `${box.current.h}px`;
      }

      // Freeze the idle spin while actively breaking apart, so the scatter
      // reads clearly instead of fighting the rotation.
      if (rotatorRef.current) {
        rotatorRef.current.style.animationPlayState = breakAmount > 0.5 ? 'paused' : 'running';
      }

      const targetX = hoveringRef.current ? clamp(vx * WIGGLE_OFFSET_FACTOR, -WIGGLE_MAX_OFFSET, WIGGLE_MAX_OFFSET) : 0;
      const targetY = hoveringRef.current ? clamp(vy * WIGGLE_OFFSET_FACTOR, -WIGGLE_MAX_OFFSET, WIGGLE_MAX_OFFSET) : 0;

      wiggle.current.vx = (wiggle.current.vx + (targetX - wiggle.current.x) * WIGGLE_STIFFNESS) * WIGGLE_DAMPING;
      wiggle.current.vy = (wiggle.current.vy + (targetY - wiggle.current.y) * WIGGLE_STIFFNESS) * WIGGLE_DAMPING;

      wiggle.current.x += wiggle.current.vx;
      wiggle.current.y += wiggle.current.vy;

      if (wiggleRef.current) {
        wiggleRef.current.style.transform = `translate3d(${wiggle.current.x}px, ${wiggle.current.y}px, 0)`;
      }

      // Per-corner scatter, driven by breakAmount. Zero when hovering or calm.
      const t = performance.now() / 1000;
      cornerRefs.current.forEach((el, i) => {
        if (!el) return;
        const dir = CORNER_DIRS[i];
        const jitterX = Math.sin(t * 15 + i * 2.1) * breakAmount * 0.15;
        const jitterY = Math.cos(t * 17 + i * 1.7) * breakAmount * 0.15;
        const scatterX = clamp(dir.x * breakAmount * dir.mult + jitterX, -SHAKE_MAX_SCATTER, SHAKE_MAX_SCATTER);
        const scatterY = clamp(dir.y * breakAmount * dir.mult + jitterY, -SHAKE_MAX_SCATTER, SHAKE_MAX_SCATTER);
        const rotate = dir.x * dir.y * breakAmount * 0.6 * dir.mult;
        el.style.transform = `translate3d(${scatterX}px, ${scatterY}px, 0) rotate(${rotate}deg)`;
      });

      animId = requestAnimationFrame(update);
    };
    animId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseout', handleOut);
      document.removeEventListener('mouseleave', handleLeaveWindow);
      cancelAnimationFrame(animId);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      {/* Corner brackets — spin idly, lock onto & confine the hovered target */}
      <div
        ref={cornersRef}
        className="fixed top-0 left-0 pointer-events-none z-50 hidden md:block"
        style={{ willChange: 'transform, width, height', mixBlendMode: 'difference' }}
      >
        <div
          ref={rotatorRef}
          className="relative w-full h-full"
          style={{
            animation: hovering ? 'none' : 'cursor-spin 3s linear infinite',
            transform: hovering ? 'rotate(0deg)' : undefined,
            transition: 'transform 300ms ease-out',
          }}
        >
          {/* Wiggle layer — velocity-reactive translate, only active while clamped */}
          <div ref={wiggleRef} className="absolute inset-0" style={{ willChange: 'transform' }}>
            <span
              ref={(el) => (cornerRefs.current[0] = el)}
              className="absolute top-0 left-0 w-2.5 h-2.5 border-t-[3px] border-l-[3px] border-white"
              style={{ willChange: 'transform' }}
            />
            <span
              ref={(el) => (cornerRefs.current[1] = el)}
              className="absolute top-0 right-0 w-2.5 h-2.5 border-t-[3px] border-r-[3px] border-white"
              style={{ willChange: 'transform' }}
            />
            <span
              ref={(el) => (cornerRefs.current[2] = el)}
              className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-[3px] border-l-[3px] border-white"
              style={{ willChange: 'transform' }}
            />
            <span
              ref={(el) => (cornerRefs.current[3] = el)}
              className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-[3px] border-r-[3px] border-white"
              style={{ willChange: 'transform' }}
            />
          </div>
        </div>
      </div>

      {/* Center dot — always free, never clamped, never rotates */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-50 -ml-[2.4px] -mt-[2.4px] w-[4.8px] h-[4.8px] rounded-full bg-white hidden md:block"
        style={{ willChange: 'transform', mixBlendMode: 'difference' }}
      />

      <style>{`
        @keyframes cursor-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};
