
import React, { useRef, useEffect } from 'react';

const PoincareVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef({ x: 0.3, y: 0 });
  const mouseRef = useRef({ isDown: false, lastX: 0, lastY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    const animate = () => {
      ctx.fillStyle = '#02040a';
      ctx.fillRect(0, 0, width, height);
      
      const cx = width / 2;
      const cy = height / 2;
      const diskRadius = Math.min(width, height) * 0.4;
      const time = Date.now() * 0.0004;

      const rotX = rotationRef.current.x;
      const rotY = rotationRef.current.y;
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

      const project = (x: number, y: number, z: number) => {
        let rx = x * cosY - z * sinY;
        let rz = x * sinY + z * cosY;
        let ry = y * cosX - rz * sinX;
        rz = y * sinX + rz * cosX;
        const scale = 1200 / (1200 + rz);
        return { px: cx + rx * scale, py: cy + ry * scale };
      };

      // Draw many geodesics
      ctx.lineWidth = 1;
      for (let i = 0; i < 60; i++) {
        const a1 = (i / 60) * Math.PI * 2 + time;
        const a2 = a1 + (Math.sin(time + i) * 0.5 + 0.8);
        
        // Points on boundary
        const p1x = Math.cos(a1) * diskRadius;
        const p1z = Math.sin(a1) * diskRadius;
        const p2x = Math.cos(a2) * diskRadius;
        const p2z = Math.sin(a2) * diskRadius;

        // Correct Hyperbolic Geodesic Calculation:
        // A geodesic in the Poincare disk is a circular arc orthogonal to the boundary.
        // The center (ox, oz) and radius R of this circle can be found via:
        const x1 = Math.cos(a1), z1 = Math.sin(a1);
        const x2 = Math.cos(a2), z2 = Math.sin(a2);
        
        // Midpoint of the chord
        const mx = (x1 + x2) / 2;
        const mz = (z1 + z2) / 2;
        
        // Distance to origin squared
        const d2 = mx * mx + mz * mz;
        if (d2 < 0.001) continue; // Diameter case (straight line)

        const factor = (1 + 1) / (x1 * x2 + z1 * z2 + 1); // Simplified factor for orthogonal arcs
        // Actual center of the orthogonal arc
        const ox = (x1 + x2) / (x1 * x2 + z1 * z2 + 1);
        const oz = (z1 + z2) / (x1 * x2 + z1 * z2 + 1);
        const R = Math.sqrt(ox * ox + oz * oz - 1);

        // Draw the arc
        ctx.beginPath();
        const hue = (260 + Math.sin(i * 0.1) * 40) % 360;
        ctx.strokeStyle = `hsla(${hue}, 70%, 60%, 0.25)`;
        
        const startAngle = Math.atan2(z1 - oz, x1 - ox);
        const endAngle = Math.atan2(z2 - oz, x2 - ox);
        
        // We need to ensure we draw the arc inside the disk
        let diff = endAngle - startAngle;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;

        const arcSegments = 20;
        for (let j = 0; j <= arcSegments; j++) {
          const t = j / arcSegments;
          const curA = startAngle + diff * t;
          const ax = (ox + Math.cos(curA) * R) * diskRadius;
          const az = (oz + Math.sin(curA) * R) * diskRadius;
          const p = project(ax, 0, az);
          if (j === 0) ctx.moveTo(p.px, p.py);
          else ctx.lineTo(p.px, p.py);
        }
        ctx.stroke();
      }

      // Draw Disk Boundary
      ctx.beginPath();
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 2.5;
      for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.1) {
        const p = project(Math.cos(a) * diskRadius, 0, Math.sin(a) * diskRadius);
        if (a === 0) ctx.moveTo(p.px, p.py);
        else ctx.lineTo(p.px, p.py);
      }
      ctx.stroke();

      requestAnimationFrame(animate);
    };

    const handlePointerDown = (e: PointerEvent) => { mouseRef.current = { isDown: true, lastX: e.clientX, lastY: e.clientY }; };
    const handlePointerMove = (e: PointerEvent) => {
      if (!mouseRef.current.isDown) return;
      rotationRef.current.y += (e.clientX - mouseRef.current.lastX) * 0.005;
      rotationRef.current.x += (e.clientY - mouseRef.current.lastY) * 0.005;
      mouseRef.current.lastX = e.clientX; mouseRef.current.lastY = e.clientY;
    };
    const handlePointerUp = () => mouseRef.current.isDown = false;

    canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    const req = requestAnimationFrame(animate);
    return () => {
      window.cancelAnimationFrame(req);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />;
};

export default PoincareVisualizer;
