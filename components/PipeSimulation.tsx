import React, { useRef, useEffect } from 'react';
import { FlowRegime } from '../types';

interface PipeSimulationProps {
  reynolds: number;
  velocity: number;
  regime: FlowRegime;
}

const PipeSimulation: React.FC<PipeSimulationProps> = ({ reynolds, velocity, regime }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; alpha: number; life: number }[]>([]);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      timeRef.current += 1;
      
      // Basic Setup
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;
      
      // Clear Canvas (Water Background)
      ctx.fillStyle = '#e0f2fe'; // Light blue water
      ctx.fillRect(0, 0, width, height);
      
      // Draw Pipe Walls
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(0, 0, width, 10); // Top wall
      ctx.fillRect(0, height - 10, width, 10); // Bottom wall
      
      // Draw Injector Needle
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(0, centerY - 2);
      ctx.lineTo(40, centerY - 2);
      ctx.lineTo(40, centerY + 2);
      ctx.lineTo(0, centerY + 2);
      ctx.fill();

      // Simulation Logic based on Reynolds Number
      ctx.strokeStyle = '#dc2626'; // Red ink
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Speed multiplier for visuals (clamped to avoid being too fast/slow)
      const speedFactor = Math.max(2, Math.min(velocity * 20, 15));

      if (reynolds < 2000) {
        // LAMINAR: Straight line
        ctx.beginPath();
        ctx.moveTo(40, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();
      } else if (reynolds >= 2000 && reynolds < 4000) {
        // TRANSITION: Wavy line
        ctx.beginPath();
        ctx.moveTo(40, centerY);
        
        const frequency = 0.02 + (reynolds - 2000) * 0.00005;
        const amplitude = 5 + (reynolds - 2000) * 0.015;
        
        for (let x = 40; x < width; x += 5) {
          // Wave moves with time
          const y = centerY + Math.sin((x * frequency) - (timeRef.current * speedFactor * 0.05)) * amplitude;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else {
        // TURBULENT: Particle System
        
        // Spawn particles
        const particlesPerFrame = Math.min(5, Math.ceil(reynolds / 2000));
        for (let i = 0; i < particlesPerFrame; i++) {
          particlesRef.current.push({
            x: 40,
            y: centerY + (Math.random() - 0.5) * 4, // Slight variance at nozzle
            vx: speedFactor + Math.random(),
            vy: (Math.random() - 0.5) * (reynolds / 800), // Chaos increases with Re
            alpha: 1,
            life: 100 + Math.random() * 50
          });
        }

        // Update and Draw Particles
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life--;
          p.alpha = p.life / 150;

          // Bounce off walls (simplified)
          if (p.y <= 12 || p.y >= height - 12) {
             p.vy *= -0.5;
          }

          if (p.life <= 0 || p.x > width) {
            particlesRef.current.splice(i, 1);
          } else {
            ctx.fillStyle = `rgba(220, 38, 38, ${p.alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2 + (1-p.alpha)*4, 0, Math.PI * 2); // Ink spreads
            ctx.fill();
          }
        }
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [reynolds, velocity]);

  return (
    <div className="w-full relative rounded-xl overflow-hidden shadow-inner border border-slate-300 bg-slate-50 h-64">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={256} 
        className="w-full h-full object-cover"
      />
      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-3 py-1 rounded text-xs font-mono text-slate-600 border border-slate-200">
        Re: {reynolds.toFixed(0)} | {regime}
      </div>
    </div>
  );
};

export default PipeSimulation;