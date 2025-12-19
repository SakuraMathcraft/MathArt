
import React, { useRef, useEffect } from 'react';

const KleinBottleVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef({ x: 0.6, y: 0.5 });
  const mouseRef = useRef({ isDown: false, lastX: 0, lastY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles: {u: number, v: number, speed: number, size: number, hue: number}[] = [];
    for(let i=0; i<2500; i++) {
      particles.push({
        u: Math.random() * Math.PI * 2,
        v: Math.random() * Math.PI * 2,
        speed: 0.003 + Math.random() * 0.01,
        size: 0.7 + Math.random() * 1.5,
        hue: 330 + Math.random() * 40
      });
    }

    const getKleinPoint = (u: number, v: number) => {
      // Figure-8 Klein Bottle Parametrization
      const a = 2;
      const x = (a + Math.cos(u/2) * Math.sin(v) - Math.sin(u/2) * Math.sin(2*v)) * Math.cos(u);
      const y = (a + Math.cos(u/2) * Math.sin(v) - Math.sin(u/2) * Math.sin(2*v)) * Math.sin(u);
      const z = Math.sin(u/2) * Math.sin(v) + Math.cos(u/2) * Math.sin(2*v);
      return { x: x * 130, y: y * 130, z: z * 130 };
    };

    const animate = () => {
      ctx.fillStyle = '#010206';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const rotX = rotationRef.current.x;
      const rotY = rotationRef.current.y;
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

      const project = (p: {x: number, y: number, z: number}) => {
        let rx = p.x * cosY - p.z * sinY;
        let rz = p.x * sinY + p.z * cosY;
        let ry = p.y * cosX - rz * sinX;
        rz = p.y * sinX + rz * cosX;
        const scale = 1100 / (1100 + rz);
        return { px: cx + rx * scale, py: cy + ry * scale, pz: rz, scale };
      };

      // 绘制拓扑骨架 (Faint background structure)
      ctx.lineWidth = 0.3;
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.05)';
      const steps = 20;
      for (let i = 0; i <= steps; i++) {
        const u = (i / steps) * Math.PI * 2;
        ctx.beginPath();
        for (let j = 0; j <= steps; j++) {
          const v = (j / steps) * Math.PI * 2;
          const pt = project(getKleinPoint(u, v));
          if (j === 0) ctx.moveTo(pt.px, pt.py); else ctx.lineTo(pt.px, pt.py);
        }
        ctx.stroke();
      }

      // 绘制流动粒子 (The "Water" flow)
      ctx.globalCompositeOperation = 'lighter';
      const time = Date.now() * 0.001;
      
      for (const p of particles) {
        p.u += p.speed;
        const pt = getKleinPoint(p.u, p.v);
        const proj = project(pt);
        
        // 深度与流动位置共同决定透明度和大小
        const depthAlpha = (proj.pz + 500) / 1000;
        const sectionGlow = Math.sin(p.u + time) * 0.5 + 0.5;
        
        // 当粒子通过瓶颈（u在PI附近）时色彩变得更加明亮
        const sectionHue = p.hue + (Math.abs(p.u - Math.PI) < 0.5 ? 40 : 0);
        
        ctx.fillStyle = `hsla(${sectionHue}, 90%, ${60 + sectionGlow * 20}%, ${depthAlpha * 0.5})`;
        ctx.beginPath();
        ctx.arc(proj.px, proj.py, p.size * proj.scale * 1.5, 0, 7);
        ctx.fill();

        if (p.u > Math.PI * 2) p.u -= Math.PI * 2;
      }
      ctx.globalCompositeOperation = 'source-over';

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
    return () => window.cancelAnimationFrame(req);
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing bg-[#010206]" />;
};

export default KleinBottleVisualizer;
