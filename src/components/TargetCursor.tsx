import React, { useEffect, useRef, useState } from 'react';

const CORNER_PADDING = 8;   // gap between element edge and bracket when locked on a target
const IDLE_SIZE = 32;       // size of the idle rotating square
const EASE = 0.25;          // corner box position/size easing
const DOT_EASE = 0.35;      // dot easing (snappier, feels "free")

// Wiggle (velocity-reactive translate spring on the clamped corners)
const WIGGLE_OFFSET_FACTOR = 7.5;  // px of translate per px/frame of cursor velocity
const WIGGLE_MAX_OFFSET = 100;       // px clamp
const WIGGLE_STIFFNESS = 0.05;     // spring pull toward target
const WIGGLE_DAMPING = 0.72;       // velocity decay (lower = more overshoot/bounce)

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

export const TargetCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const cornersRef = useRef<HTMLDivElement | null>(null);
  const wiggleRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  const mouse = useRef({ x: -100, y: -100 });
  const dotPos = useRef({ x: -100, y: -100 });
  const prevDotPos = useRef({ x: -100, y: -100 });
  const box = useRef<Box>({ x: 0, y: 0, w: IDLE_SIZE, h: IDLE_SIZE });
  const boxTarget = useRef<Box | null>(null);
  const wiggle = useRef<Wiggle>({ x: 0, y: 0, vx: 0, vy: 0 });
  const hoveringRef = useRef(false);

  useEffect(() => {
    hoveringRef.current = hovering;
  }, [hovering]);

  useEffect(() => {
    // Only enable on non-touch devices
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
      // Dot: always free, always following raw mouse position
      dotPos.current.x = lerp(dotPos.current.x, mouse.current.x, DOT_EASE);
      dotPos.current.y = lerp(dotPos.current.y, mouse.current.y, DOT_EASE);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0)`;
      }

      // Raw per-frame cursor velocity, used to drive the wiggle spring
      const vx = dotPos.current.x - prevDotPos.current.x;
      const vy = dotPos.current.y - prevDotPos.current.y;
      prevDotPos.current.x = dotPos.current.x;
      prevDotPos.current.y = dotPos.current.y;

      // Corner box: idles as a fixed-size square centered on the dot,
      // eases into the hovered target's bounding box when one is active
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

      // Wiggle: lateral/vertical shove based on cursor velocity, only while clamped
      const targetX = hoveringRef.current ? clamp(vx * WIGGLE_OFFSET_FACTOR, -WIGGLE_MAX_OFFSET, WIGGLE_MAX_OFFSET) : 0;
      const targetY = hoveringRef.current ? clamp(vy * WIGGLE_OFFSET_FACTOR, -WIGGLE_MAX_OFFSET, WIGGLE_MAX_OFFSET) : 0;

      wiggle.current.vx = (wiggle.current.vx + (targetX - wiggle.current.x) * WIGGLE_STIFFNESS) * WIGGLE_DAMPING;
      wiggle.current.vy = (wiggle.current.vy + (targetY - wiggle.current.y) * WIGGLE_STIFFNESS) * WIGGLE_DAMPING;

      wiggle.current.x += wiggle.current.vx;
      wiggle.current.y += wiggle.current.vy;

      if (wiggleRef.current) {
        wiggleRef.current.style.transform = `translate3d(${wiggle.current.x}px, ${wiggle.current.y}px, 0)`;
      }

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
          className="relative w-full h-full"
          style={{
            animation: hovering ? 'none' : 'cursor-spin 3s linear infinite',
            transform: hovering ? 'rotate(0deg)' : undefined,
            transition: 'transform 300ms ease-out',
          }}
        >
          {/* Wiggle layer — velocity-reactive translate, only active while clamped */}
          <div ref={wiggleRef} className="absolute inset-0" style={{ willChange: 'transform' }}>
            <span className="absolute top-0 left-0 w-3.5 h-3.5 border-t-[3px] border-l-[3px] border-white" />
            <span className="absolute top-0 right-0 w-3.5 h-3.5 border-t-[3px] border-r-[3px] border-white" />
            <span className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-[3px] border-l-[3px] border-white" />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-[3px] border-r-[3px] border-white" />
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
