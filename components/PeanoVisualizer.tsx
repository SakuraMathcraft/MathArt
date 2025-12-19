
import React, { useRef, useEffect } from 'react';

const PeanoVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let animationId: number;

    const order = 3;
    const n = Math.pow(3, order);
    const totalPoints = n * n;

    // Peano curve coordinate mapping logic (Base-3)
    const peano = (i: number): {x: number, y: number} => {
      let x = 0, y = 0, p = i;
      for (let j = 0; j < order; j++) {
        let quadX = p % 3;
        let quadY = Math.floor((p / 3) % 3);
        if (quadY === 1) quadX = 2 - quadX;
        if (x % 2 === 1) quadY = 2 - quadY;
        x = x * 3 + quadX;
        y = y * 3 + quadY;
        p = Math.floor(p / 9);
      }
      return {x, y};
    };

    let progress = 0;
    const speed = 0.4; // Controlled slow iteration speed

    const animate = () => {
      ctx.fillStyle = '#05070a';
      ctx.fillRect(0, 0, width, height);

      const margin = 100;
      const size = Math.min(width, height) - margin * 2;
      const step = size / (n - 1);
      const offsetX = (width - size) / 2;
      const offsetY = (height - size) / 2;

      ctx.beginPath();
      ctx.strokeStyle = '#0ea5e9';
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(14, 165, 233, 0.5)';

      const limit = Math.floor(progress);
      for (let i = 0; i < limit; i++) {
        const p = peano(i);
        const px = offsetX + p.x * step;
        const py = offsetY + p.y * step;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw the "growth" tip
      if (progress < totalPoints) {
        const p = peano(limit);
        ctx.beginPath();
        ctx.fillStyle = '#fff';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#fff';
        ctx.arc(offsetX + p.x * step, offsetY + p.y * step, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      progress += speed;
      if (progress > totalPoints + 300) progress = 0;

      animationId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block bg-[#05070a]" />;
};

export default PeanoVisualizer;
