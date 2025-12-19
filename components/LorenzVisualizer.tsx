
import React, { useRef, useEffect } from 'react';

const LorenzVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ isDown: false, lastX: 0, lastY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    let lx = 0.1, ly = 0, lz = 0;
    const sigma = 10, rho = 28, beta = 8/3, dt = 0.008;
    const points: {x: number, y: number, z: number}[] = [];
    const maxPoints = 2500; // Slightly reduced for smoother performance

    const animate = () => {
      // Clear with persistence effect
      ctx.fillStyle = '#020306';
      ctx.fillRect(0, 0, width, height);

      // Solve ODE and update points
      for(let i=0; i<5; i++) {
        const dx = (sigma * (ly - lx)) * dt;
        const dy = (lx * (rho - lz) - ly) * dt;
        const dz = (lx * ly - beta * lz) * dt;
        lx += dx; ly += dy; lz += dz;
        points.push({x: lx, y: ly, z: lz});
        if(points.length > maxPoints) points.shift();
      }

      const scale = 16;
      const offsetX = width / 2;
      const offsetY = height / 2 + 100;
      
      const rotX = rotationRef.current.x;
      const rotY = rotationRef.current.y;
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

      ctx.lineWidth = 1.2;
      ctx.lineCap = 'round';
      
      // Batch drawing for performance
      for(let i=1; i<points.length; i++) {
        const p1 = points[i-1];
        const p2 = points[i];

        const project = (p: {x: number, y: number, z: number}) => {
          let rx = p.x * cosY - p.z * sinY;
          let rz = p.x * sinY + p.z * cosY;
          let ry = p.y * cosX - rz * sinX;
          rz = p.y * sinX + rz * cosX;
          return { x: offsetX + rx * scale, y: offsetY - rz * scale };
        };

        const proj1 = project(p1);
        const proj2 = project(p2);

        const progress = i / points.length;
        const hue = (p1.z * 4 + 180) % 360;
        ctx.strokeStyle = `hsla(${hue}, 70%, 50%, ${progress * 0.8})`;
        
        ctx.beginPath();
        ctx.moveTo(proj1.x, proj1.y);
        ctx.lineTo(proj2.x, proj2.y);
        ctx.stroke();
      }

      requestAnimationFrame(animate);
    };

    const handlePointerDown = (e: PointerEvent) => {
      mouseRef.current = { isDown: true, lastX: e.clientX, lastY: e.clientY };
    };
    const handlePointerMove = (e: PointerEvent) => {
      if (!mouseRef.current.isDown) return;
      const dx = e.clientX - mouseRef.current.lastX;
      const dy = e.clientY - mouseRef.current.lastY;
      rotationRef.current.y += dx * 0.005;
      rotationRef.current.x += dy * 0.005;
      mouseRef.current.lastX = e.clientX;
      mouseRef.current.lastY = e.clientY;
    };
    const handlePointerUp = () => mouseRef.current.isDown = false;

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    const req = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.cancelAnimationFrame(req);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />;
};

export default LorenzVisualizer;
