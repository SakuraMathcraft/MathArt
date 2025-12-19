
import React, { useRef, useEffect } from 'react';

const HilbertVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const order = 6;
    const n = Math.pow(2, order);
    const totalPoints = n * n;
    
    const hilbert = (i: number): {x: number, y: number} => {
      const points = [{x: 0, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 0}];
      let index = i & 3;
      let v = { ...points[index] };
      for (let j = 1; j < order; j++) {
        i = i >>> 2;
        index = i & 3;
        let len = Math.pow(2, j);
        if (index === 0) {
          let temp = v.x; v.x = v.y; v.y = temp;
        } else if (index === 1) {
          v.y += len;
        } else if (index === 2) {
          v.x += len; v.y += len;
        } else if (index === 3) {
          let temp = len - 1 - v.x; v.x = len - 1 - v.y; v.y = temp; v.x += len;
        }
      }
      return v;
    };

    let progress = 0;
    const speed = 0.5; // 极低速度

    const animate = () => {
      ctx.fillStyle = '#020308';
      ctx.fillRect(0, 0, width, height);

      const size = Math.min(width, height) - 160;
      const stepSize = size / (n - 1);
      const ox = (width - size) / 2;
      const oy = (height - size) / 2;

      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      const limit = Math.floor(progress);
      for (let i = 0; i < limit; i++) {
        const p1 = hilbert(i);
        const p2 = hilbert(i + 1);
        
        const opacity = Math.min(1, (limit - i) / 50); // 尾迹渐隐
        ctx.strokeStyle = `hsla(270, 70%, 65%, ${opacity * 0.8})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(168, 85, 247, 0.4)';
        
        ctx.beginPath();
        ctx.moveTo(ox + p1.x * stepSize, oy + p1.y * stepSize);
        ctx.lineTo(ox + p2.x * stepSize, oy + p2.y * stepSize);
        ctx.stroke();
      }

      // 当前焦点
      if (limit < totalPoints) {
        const p = hilbert(limit);
        ctx.fillStyle = '#fff';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(ox + p.x * stepSize, oy + p.y * stepSize, 5, 0, 7);
        ctx.fill();
      }

      progress += speed;
      if (progress > totalPoints + 200) progress = 0;

      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; });
    animate();
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block bg-[#020308]" />;
};

export default HilbertVisualizer;
