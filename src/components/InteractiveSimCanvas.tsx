import React, { useRef, useEffect, useState } from 'react';
import { RefreshCw, Play, Pause, Orbit, Plane } from 'lucide-react';

type SimMode = 'orbit' | 'drone';

export const InteractiveSimCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mode, setMode] = useState<SimMode>('orbit');
  const [isRunning, setIsRunning] = useState(true);
  const [telemetry, setTelemetry] = useState({
    metric1: '0.04 rad/s',
    metric2: 'PWPF Active',
    metric3: '99.2% Stable',
  });

  // State refs for animation loop
  const stateRef = useRef({
    // Orbital mode state
    time: 0,
    orbitRadius: 130,
    orbitAngle: 0.8,
    satelliteAngle: 0,
    angularVelocity: 0.12,
    targetAngularVelocity: 0,
    pwpfFiring: false,
    debris: [] as { x: number; y: number; vx: number; vy: number; radius: number; color: string }[],
    // Drone mode state
    droneX: 300,
    droneY: 150,
    droneVx: 0,
    droneVy: 0,
    droneTilt: 0,
    targetX: 300,
    targetY: 150,
    streamlines: [] as { x: number; y: number; speed: number; length: number; opacity: number }[],
    mousePos: { x: 300, y: 150 },
    isHovering: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    // Resize handler
    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    // Initialize streamlines
    const streamlines = [];
    for (let i = 0; i < 40; i++) {
      streamlines.push({
        x: Math.random() * 600,
        y: Math.random() * 260,
        speed: 2 + Math.random() * 3,
        length: 15 + Math.random() * 25,
        opacity: 0.1 + Math.random() * 0.3,
      });
    }
    stateRef.current.streamlines = streamlines;

    // Animation Loop
    const render = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      const state = stateRef.current;
      state.time += 0.02;

      const isDark = document.documentElement.classList.contains('dark');
      const primaryColor = isDark ? '#10b981' : '#059669'; // Emerald
      const accentCyan = isDark ? '#06b6d4' : '#0284c7';   // Cyan

      if (mode === 'orbit') {
        // --- ORBITAL DETUMBLE SIMULATION ---
        const cx = width / 2;
        const cy = height / 2;

        // Central Planet
        const planetRadius = Math.min(width, height) * 0.18;
        
        // Atmosphere Glow
        const glow = ctx.createRadialGradient(cx, cy, planetRadius * 0.8, cx, cy, planetRadius * 1.5);
        glow.addColorStop(0, isDark ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.15)');
        glow.addColorStop(1, 'rgba(16, 185, 129, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(cx, cy, planetRadius * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Planet Body
        const planetGrad = ctx.createRadialGradient(cx - 15, cy - 15, 5, cx, cy, planetRadius);
        planetGrad.addColorStop(0, isDark ? '#27272a' : '#e4e4e7');
        planetGrad.addColorStop(1, isDark ? '#18181b' : '#a1a1aa');
        ctx.fillStyle = planetGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, planetRadius, 0, Math.PI * 2);
        ctx.fill();

        // Planet Latitudinal grid lines
        ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
        ctx.lineWidth = 1;
        for (let r = -2; r <= 2; r++) {
          ctx.beginPath();
          ctx.ellipse(cx, cy + r * (planetRadius * 0.3), planetRadius * Math.cos(r * 0.4), planetRadius * 0.2, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Orbit Ellipse Trail
        const rx = width * 0.38;
        const ry = height * 0.38;
        ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)';
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Satellite position along orbit
        if (isRunning) {
          state.orbitAngle += 0.008;
        }
        const satX = cx + Math.cos(state.orbitAngle) * rx;
        const satY = cy + Math.sin(state.orbitAngle) * ry;

        // Satellite Detumble Physics (UntumbleRL simulation)
        // Control law: PWPF modulation active when |angularVelocity| > 0.01
        if (isRunning) {
          const error = state.angularVelocity - state.targetAngularVelocity;
          if (Math.abs(error) > 0.01) {
            // Pulse thruster
            const thrusterTorque = Math.sign(error) * 0.0035;
            state.angularVelocity -= thrusterTorque;
            state.pwpfFiring = Math.sin(state.time * 25) > 0.2;
          } else {
            state.angularVelocity *= 0.98;
            state.pwpfFiring = false;
          }
          state.satelliteAngle += state.angularVelocity;
        }

        // Draw Satellite
        ctx.save();
        ctx.translate(satX, satY);
        ctx.rotate(state.satelliteAngle);

        // PWPF Thruster Plumes
        if (state.pwpfFiring) {
          ctx.fillStyle = '#f59e0b';
          const plumeSize = 6 + Math.sin(state.time * 50) * 4;
          // Left RCS plume
          ctx.beginPath();
          ctx.moveTo(-10, -5);
          ctx.lineTo(-10 - plumeSize, -5);
          ctx.lineTo(-10, -2);
          ctx.fill();
          // Right RCS plume
          ctx.beginPath();
          ctx.moveTo(10, 5);
          ctx.lineTo(10 + plumeSize, 5);
          ctx.lineTo(10, 2);
          ctx.fill();
        }

        // Solar panels
        ctx.fillStyle = accentCyan;
        ctx.fillRect(-22, -4, 9, 8);
        ctx.fillRect(13, -4, 9, 8);
        // Solar panel grid lines
        ctx.strokeStyle = isDark ? '#083344' : '#cffafe';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(-22, -4, 9, 8);
        ctx.strokeRect(13, -4, 9, 8);

        // Satellite Core Body
        ctx.fillStyle = isDark ? '#fafafa' : '#18181b';
        ctx.fillRect(-8, -6, 16, 12);
        // Antenna
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -6);
        ctx.lineTo(0, -12);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, -13, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Velocity vector arrow from satellite
        const tangentX = -Math.sin(state.orbitAngle) * 20;
        const tangentY = Math.cos(state.orbitAngle) * 20;
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(satX, satY);
        ctx.lineTo(satX + tangentX, satY + tangentY);
        ctx.stroke();

        // Telemetry update
        const radSec = Math.abs(state.angularVelocity * 10).toFixed(2);
        const stablePercent = Math.max(0, 100 - parseFloat(radSec) * 20).toFixed(1);
        setTelemetry({
          metric1: `ω: ${radSec} rad/s`,
          metric2: state.pwpfFiring ? 'PWPF RCS: FIRING' : 'PWPF: STANDBY',
          metric3: `Attitude: ${stablePercent}% Stabilized`,
        });

      } else {
        // --- DRONE FLIGHT DYNAMICS SIMULATION ---
        const targetX = state.isHovering ? state.mousePos.x : width / 2 + Math.sin(state.time * 1.5) * 80;
        const targetY = state.isHovering ? state.mousePos.y : height / 2 + Math.cos(state.time * 2) * 35;

        // Streamlines / Wind tunnel particles
        ctx.strokeStyle = isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(5, 150, 105, 0.25)';
        ctx.lineWidth = 1;
        state.streamlines.forEach((line) => {
          if (isRunning) {
            line.x -= line.speed;
            if (line.x < -line.length) {
              line.x = width + line.length;
              line.y = Math.random() * height;
            }
          }
          ctx.beginPath();
          ctx.moveTo(line.x, line.y);
          ctx.lineTo(line.x + line.length, line.y);
          ctx.stroke();
        });

        // PID tracking simulation for Drone
        if (isRunning) {
          const dx = targetX - state.droneX;
          const dy = targetY - state.droneY;
          
          state.droneVx += dx * 0.02;
          state.droneVy += dy * 0.02;
          state.droneVx *= 0.88;
          state.droneVy *= 0.88;

          state.droneX += state.droneVx;
          state.droneY += state.droneVy;

          // Pitch tilt proportional to acceleration
          const targetTilt = (state.droneVx * 0.05);
          state.droneTilt += (targetTilt - state.droneTilt) * 0.2;
        }

        // Draw Drone Target Crosshair
        ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(targetX, targetY, 12, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw Drone
        ctx.save();
        ctx.translate(state.droneX, state.droneY);
        ctx.rotate(state.droneTilt);

        // Quadrotor Arms
        ctx.strokeStyle = isDark ? '#71717a' : '#a1a1aa';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-35, 0);
        ctx.lineTo(35, 0);
        ctx.stroke();

        // Rotor Blades with spin blur
        const rotorSpin = Math.sin(state.time * 60) * 16;
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 1.5;
        // Left Rotor
        ctx.beginPath();
        ctx.ellipse(-35, -4, Math.abs(rotorSpin), 2, 0, 0, Math.PI * 2);
        ctx.stroke();
        // Right Rotor
        ctx.beginPath();
        ctx.ellipse(35, -4, Math.abs(rotorSpin), 2, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Thrust Vectors downwash
        ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
        ctx.beginPath();
        ctx.moveTo(-35, 2);
        ctx.lineTo(-38, 20 + Math.random() * 8);
        ctx.lineTo(-32, 20 + Math.random() * 8);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(35, 2);
        ctx.lineTo(32, 20 + Math.random() * 8);
        ctx.lineTo(38, 20 + Math.random() * 8);
        ctx.fill();

        // Drone Central Avionics Hub
        ctx.fillStyle = isDark ? '#fafafa' : '#18181b';
        ctx.beginPath();
        ctx.roundRect(-10, -6, 20, 12, 3);
        ctx.fill();

        // Flight Controller Status LED
        ctx.fillStyle = primaryColor;
        ctx.beginPath();
        ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Telemetry update
        const speed = Math.hypot(state.droneVx, state.droneVy).toFixed(1);
        const pitchDeg = (state.droneTilt * (180 / Math.PI)).toFixed(1);
        setTelemetry({
          metric1: `Velocity: ${speed} m/s`,
          metric2: `Pitch Angle: ${pitchDeg}°`,
          metric3: 'PID Thrust: 48.6%',
        });
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', updateSize);
    };
  }, [mode, isRunning]);

  // Mouse move handler for interactive tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    stateRef.current.mousePos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    stateRef.current.isHovering = true;
  };

  const handleMouseLeave = () => {
    stateRef.current.isHovering = false;
  };

  const handlePerturb = () => {
    if (mode === 'orbit') {
      // Perturb satellite with a random tumble rate
      stateRef.current.angularVelocity = (Math.random() > 0.5 ? 1 : -1) * (0.15 + Math.random() * 0.2);
    } else {
      // Perturb drone velocity
      stateRef.current.droneVx = (Math.random() - 0.5) * 15;
      stateRef.current.droneVy = -8;
    }
  };

  return (
    <div className="relative w-full rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/40 backdrop-blur-sm overflow-hidden my-4 transition-all">
      {/* Simulation Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-100/40 dark:bg-zinc-900/40 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setMode('orbit')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors cursor-pointer ${
              mode === 'orbit'
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-medium border border-emerald-500/30'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Orbit className="w-3.5 h-3.5" />
            <span>Orbit & UntumbleRL</span>
          </button>

          <button
            onClick={() => setMode('drone')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors cursor-pointer ${
              mode === 'drone'
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-medium border border-emerald-500/30'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>Drone Flight Physics</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePerturb}
            className="inline-flex items-center gap-1 px-2 py-1 rounded border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title={mode === 'orbit' ? 'Induce satellite tumble' : 'Displace drone'}
          >
            <RefreshCw className="w-3 h-3" />
            <span>Perturb</span>
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-zinc-200/50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title={isRunning ? 'Pause physics' : 'Resume physics'}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Physics Canvas */}
      <div className="relative w-full h-52 sm:h-64 cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full h-full block"
        />

        {/* Ambient watermark prompt */}
        <div className="absolute top-3 left-4 text-[10px] font-mono text-zinc-400/60 dark:text-zinc-500/50 pointer-events-none select-none">
          {mode === 'orbit' ? 'Interactive Keplerian Orbit & PWPF Detumble' : 'Move cursor to guide quadrotor attitude'}
        </div>
      </div>

      {/* Live Telemetry Readout Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 border-t border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-100/30 dark:bg-zinc-900/30 text-[11px] font-mono text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-zinc-600 dark:text-zinc-300 font-medium">{telemetry.metric1}</span>
        </div>
        <div className="text-emerald-600 dark:text-emerald-400 font-medium">
          {telemetry.metric2}
        </div>
        <div>
          {telemetry.metric3}
        </div>
      </div>
    </div>
  );
};
