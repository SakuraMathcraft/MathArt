
import React, { useRef, useEffect } from 'react';

const RiemannVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef({ x: 0.6, y: 0.7 });
  const mouseRef = useRef({ isDown: false, lastX: 0, lastY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const animate = () => {
      ctx.fillStyle = '#010206';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const time = Date.now() * 0.0006;

      const rotX = rotationRef.current.x;
      const rotY = rotationRef.current.y;
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

      const project = (x: number, y: number, z: number) => {
        let rx = x * cosY - z * sinY;
        let rz = x * sinY + z * cosY;
        let ry = y * cosX - rz * sinX;
        rz = y * sinX + rz * cosX;
        const scale = 900 / (900 + rz);
        return { px: cx + rx * scale, py: cy + ry * scale, pz: rz, scale };
      };

      const drawSolidSheet = (sheetOffset: number, hue: number) => {
        const rSteps = 12;
        const aSteps = 45;
        const maxR = 300;

        for (let rIdx = 0; rIdx < rSteps; rIdx++) {
          const r1 = (rIdx / rSteps) * maxR;
          const r2 = ((rIdx + 1) / rSteps) * maxR;

          for (let aIdx = 0; aIdx < aSteps; aIdx++) {
            const a1 = (aIdx / aSteps) * Math.PI * 2;
            const a2 = ((aIdx + 1) / aSteps) * Math.PI * 2;

            // 黎曼曲面 sqrt(z) 的两个分支
            const zVal1 = a1 / 2 + sheetOffset + time * 0.5;
            const zVal2 = a2 / 2 + sheetOffset + time * 0.5;

            const x1 = r1 * Math.cos(a1), z1 = r1 * Math.sin(a1);
            const x2 = r2 * Math.cos(a1), z2 = r2 * Math.sin(a1);
            const x3 = r2 * Math.cos(a2), z3 = r2 * Math.sin(a2);
            const x4 = r1 * Math.cos(a2), z4 = r1 * Math.sin(a2);

            const y1 = Math.sin(zVal1) * 100;
            const y2 = Math.sin(zVal1) * 100;
            const y3 = Math.sin(zVal2) * 100;
            const y4 = Math.sin(zVal2) * 100;

            const p1 = project(x1, y1, z1);
            const p2 = project(x2, y2, z2);
            const p3 = project(x3, y3, z3);
            const p4 = project(x4, y4, z4);

            // 深度排序：只绘制在视线前方的多边形（简化版）
            const avgPz = (p1.pz + p2.pz + p3.pz + p4.pz) / 4;
            
            // 基于高度差的简单着色
            const hDiff = Math.abs(y3 - y1);
            const brightness = 35 + (1 - hDiff/30) * 35;
            const op = 0.3 + (rIdx/rSteps) * 0.5;

            ctx.fillStyle = `hsla(${hue}, 80%, ${brightness}%, ${op})`;
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.lineTo(p3.px, p3.py);
            ctx.lineTo(p4.px, p4.py);
            ctx.closePath();
            ctx.fill();

            // 极细的接缝增强体积感
            ctx.strokeStyle = `hsla(${hue}, 100%, 80%, 0.05)`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      };

      // 绘制两个相互编织的页片
      drawSolidSheet(0, 165); // 蓝绿色页片
      drawSolidSheet(Math.PI, 280); // 紫色页片

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

export default RiemannVisualizer;
