
import React, { useRef, useEffect } from 'react';

const KochVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let animationId: number;

    const drawKochLine = (x1: number, y1: number, x2: number, y2: number, depth: number, morph: number) => {
      if (depth <= 0) {
        // Morph the line: when morph > 0, the middle segment rises
        const dx = (x2 - x1) / 3;
        const dy = (y2 - y1) / 3;
        const p1 = { x: x1 + dx, y: y1 + dy };
        const p3 = { x: x1 + 2 * dx, y: y1 + 2 * dy };
        
        const angle = Math.atan2(y2 - y1, x2 - x1) - Math.PI / 3;
        const dist = Math.sqrt(dx * dx + dy * dy) * morph;
        const p2 = {
          x: p1.x + Math.cos(angle) * dist,
          y: p1.y + Math.sin(angle) * dist
        };

        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(x2, y2);
        return;
      }
      
      const dx = (x2 - x1) / 3;
      const dy = (y2 - y1) / 3;
      const p1 = { x: x1 + dx, y: y1 + dy };
      const p3 = { x: x1 + 2 * dx, y: y1 + 2 * dy };
      const angle = Math.atan2(y2 - y1, x2 - x1) - Math.PI / 3;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const p2 = {
        x: p1.x + Math.cos(angle) * dist,
        y: p1.y + Math.sin(angle) * dist
      };

      drawKochLine(x1, y1, p1.x, p1.y, depth - 1, morph);
      drawKochLine(p1.x, p1.y, p2.x, p2.y, depth - 1, morph);
      drawKochLine(p2.x, p2.y, p3.x, p3.y, depth - 1, morph);
      drawKochLine(p3.x, p3.y, x2, y2, depth - 1, morph);
    };

    const animate = (time: number) => {
      ctx.fillStyle = '#05070a';
      ctx.fillRect(0, 0, width, height);

      // Smooth depth calculation
      const cycle = (time / 2500) % 5;
      const depth = Math.floor(cycle);
      const morph = cycle - depth;

      const size = Math.min(width, height) * 0.7;
      const cx = width / 2;
      const cy = height / 2 + size * 0.15;
      
      const p1 = { x: cx - size / 2, y: cy + size * 0.28 };
      const p2 = { x: cx + size / 2, y: cy + size * 0.28 };
      const p3 = { x: cx, y: cy - size * 0.58 };

      ctx.beginPath();
      ctx.strokeStyle = '#60a5fa';
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(96, 165, 250, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.moveTo(p1.x, p1.y);
      
      drawKochLine(p1.x, p1.y, p2.x, p2.y, depth, morph);
      drawKochLine(p2.x, p2.y, p3.x, p3.y, depth, morph);
      drawKochLine(p3.x, p3.y, p1.x, p1.y, depth, morph);
      
      ctx.stroke();
      ctx.shadowBlur = 0;

      animationId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; });
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
};

export default KochVisualizer;
