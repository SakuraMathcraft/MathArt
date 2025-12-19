
import React, { useRef, useEffect } from 'react';

const BlackHoleVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef({ x: 0.15, y: 0 });
  const mouseRef = useRef({ isDown: false, lastX: 0, lastY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // 星团群落结构
    const stars: {r: number, angle: number, speed: number, size: number, hue: number, cluster: number}[] = [];
    const numClusters = 12;
    for(let c = 0; c < numClusters; c++) {
      const clusterBaseR = 140 + Math.random() * 400;
      const clusterBaseAngle = Math.random() * Math.PI * 2;
      const starInCluster = 40 + Math.random() * 80;
      
      for(let i=0; i < starInCluster; i++) {
        const r = clusterBaseR + (Math.random() - 0.5) * 60;
        stars.push({
          r,
          angle: clusterBaseAngle + (Math.random() - 0.5) * 0.4,
          // 开普勒旋转速度公式：v 正比于 1/sqrt(r)
          speed: (1.8 / Math.sqrt(r)) * 1.5,
          size: 0.3 + Math.random() * 1.5,
          hue: 10 + Math.random() * 45, // 橙色到金黄色
          cluster: c
        });
      }
    }

    const animate = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const rotX = rotationRef.current.x;
      const rotY = rotationRef.current.y;
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

      ctx.globalCompositeOperation = 'lighter';
      
      for (const s of stars) {
        s.angle += s.speed * 0.7;
        let x = Math.cos(s.angle) * s.r;
        let z = Math.sin(s.angle) * s.r;
        
        let rx = x * cosY - z * sinY;
        let rz = x * sinY + z * cosY;
        let ry = -rz * sinX; 
        rz = rz * cosX;

        // 强引力透镜：越靠近中心，Y轴扭曲越剧烈
        const dist = Math.sqrt(rx*rx + ry*ry);
        const lensing = 16000 / (dist + 20);
        const lensY = (rz < 0) ? -ry * (lensing / 100) : ry;

        const pulse = Math.sin(Date.now() * 0.002 + s.cluster) * 0.1 + 0.9;
        const opacity = Math.min(1, 400 / (s.r + 20)) * 0.4 * pulse;
        
        ctx.fillStyle = `hsla(${s.hue}, 100%, 75%, ${opacity})`;
        ctx.beginPath();
        const drawSize = s.size * (700/(700+rz));
        ctx.arc(cx + rx, cy + lensY, drawSize, 0, 7);
        ctx.fill();
        
        // 核心高亮
        if (s.r < 180 && Math.random() > 0.95) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = `hsla(${s.hue}, 100%, 80%, 0.8)`;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // 事件视界核心及光子环
      const ringGrad = ctx.createRadialGradient(cx, cy, 115, cx, cy, 132);
      ringGrad.addColorStop(0, 'rgba(0,0,0,0)');
      ringGrad.addColorStop(0.5, 'rgba(255, 200, 100, 0.95)');
      ringGrad.addColorStop(1, 'rgba(255, 50, 0, 0)');
      ctx.fillStyle = ringGrad;
      ctx.beginPath(); ctx.arc(cx, cy, 132, 0, 7); ctx.fill();

      // 完美黑体
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#000';
      ctx.beginPath(); ctx.arc(cx, cy, 120, 0, 7); ctx.fill();

      // 内部吸积盘辉光
      const coreGlow = ctx.createRadialGradient(cx, cy, 120, cx, cy, 180);
      coreGlow.addColorStop(0, 'rgba(0,0,0,1)');
      coreGlow.addColorStop(0.2, 'rgba(255, 80, 0, 0.25)');
      coreGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = coreGlow;
      ctx.beginPath(); ctx.arc(cx, cy, 180, 0, 7); ctx.fill();

      requestAnimationFrame(animate);
    };

    const handlePointerDown = (e: PointerEvent) => { mouseRef.current = { isDown: true, lastX: e.clientX, lastY: e.clientY }; };
    const handlePointerMove = (e: PointerEvent) => {
      if (!mouseRef.current.isDown) return;
      rotationRef.current.y += (e.clientX - mouseRef.current.lastX) * 0.003;
      rotationRef.current.x = Math.max(-0.4, Math.min(0.4, rotationRef.current.x + (e.clientY - mouseRef.current.lastY) * 0.003));
      mouseRef.current.lastX = e.clientX; mouseRef.current.lastY = e.clientY;
    };
    const handlePointerUp = () => mouseRef.current.isDown = false;

    canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    const req = requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(req);
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing bg-black" />;
};

export default BlackHoleVisualizer;
