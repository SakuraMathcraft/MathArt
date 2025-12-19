
import React, { useRef, useEffect } from 'react';

const CoveringVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef({ x: 0.6, y: 0.8 });
  const mouseRef = useRef({ isDown: false, lastX: 0, lastY: 0 });
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const animate = () => {
      ctx.fillStyle = '#010205';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const time = Date.now() * 0.001;

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
        return { px: cx + rx * scale, py: cy + ry * scale, pz: rz, scale };
      };

      // Base Grid
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'rgba(0, 150, 255, 0.04)';
      const gridSize = 300;
      const gridSteps = 12;
      for (let i = -gridSteps; i <= gridSteps; i++) {
        const offset = (i / gridSteps) * gridSize;
        let p1 = project(-gridSize, 250, offset);
        let p2 = project(gridSize, 250, offset);
        ctx.beginPath(); ctx.moveTo(p1.px, p1.py); ctx.lineTo(p2.px, p2.py); ctx.stroke();
        p1 = project(offset, 250, -gridSize);
        p2 = project(offset, 250, gridSize);
        ctx.beginPath(); ctx.moveTo(p1.px, p1.py); ctx.lineTo(p2.px, p2.py); ctx.stroke();
      }

      // Pulse Effect - Energy waves traveling up
      const pulseSpeed = 2.0;
      const pulseFreq = 0.5;

      // Covering Sheets
      const numSheets = 3;
      const segments = 400;
      
      ctx.globalCompositeOperation = 'lighter';
      for (let s = 0; s < numSheets; s++) {
        const hue = (195 + s * 45) % 360;
        
        for (let i = 0; i < segments - 1; i++) {
          const t1 = (i / segments) * 16 - 8;
          const t2 = ((i + 1) / segments) * 16 - 8;
          
          const angle1 = t1 * Math.PI + time + (s * (Math.PI * 2 / numSheets));
          const angle2 = t2 * Math.PI + time + (s * (Math.PI * 2 / numSheets));
          
          const p1 = project(180 * Math.cos(angle1), t1 * 50, 180 * Math.sin(angle1));
          const p2 = project(180 * Math.cos(angle2), t2 * 50, 180 * Math.sin(angle2));

          // Calculate pulse ripple
          const pulse = Math.pow(Math.sin(t1 * pulseFreq - time * pulseSpeed), 8);
          const opacity = (0.2 + pulse * 0.6) * (1 - Math.abs(t1 / 9)) * p1.scale;
          
          ctx.strokeStyle = `hsla(${hue}, 90%, 65%, ${opacity})`;
          ctx.lineWidth = 1 + pulse * 3;
          
          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);
          ctx.stroke();

          // Sub-fibers for complexity
          if (i % 20 === 0) {
            ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${opacity * 0.2})`;
            ctx.lineWidth = 0.5;
            const pBase = project(180 * Math.cos(angle1), 250, 180 * Math.sin(angle1));
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(pBase.px, pBase.py);
            ctx.stroke();
          }
        }
      }
      ctx.globalCompositeOperation = 'source-over';

      animationIdRef.current = requestAnimationFrame(animate);
    };

    const handlePointerDown = (e: PointerEvent) => { mouseRef.current = { isDown: true, lastX: e.clientX, lastY: e.clientY }; };
    const handlePointerMove = (e: PointerEvent) => {
      if (!mouseRef.current.isDown) return;
      rotationRef.current.y += (e.clientX - mouseRef.current.lastX) * 0.003;
      rotationRef.current.x += (e.clientY - mouseRef.current.lastY) * 0.003;
      mouseRef.current.lastX = e.clientX; mouseRef.current.lastY = e.clientY;
    };
    const handlePointerUp = () => mouseRef.current.isDown = false;
    const handleResize = () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; };

    canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('resize', handleResize);
    animationIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing bg-[#010204]" />;
};

export default CoveringVisualizer;
