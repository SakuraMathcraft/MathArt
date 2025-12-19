
import React, { useRef, useEffect } from 'react';

const MandelbrotVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewRef = useRef({ x: -0.5, y: 0, scale: 200 });
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const renderScale = 0.5; // Render at lower res then upscale for performance
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let bufferWidth = Math.floor(width * renderScale);
    let bufferHeight = Math.floor(height * renderScale);
    
    const bufferCanvas = document.createElement('canvas');
    bufferCanvas.width = bufferWidth;
    bufferCanvas.height = bufferHeight;
    const bctx = bufferCanvas.getContext('2d', { alpha: false })!;

    const draw = () => {
      const { x: centerX, y: centerY, scale } = viewRef.current;
      const imgData = bctx.createImageData(bufferWidth, bufferHeight);
      const data = imgData.data;
      const maxIter = 120;

      for (let py = 0; py < bufferHeight; py++) {
        const y0 = (py - bufferHeight / 2) / (scale * renderScale) + centerY;
        for (let px = 0; px < bufferWidth; px++) {
          const x0 = (px - bufferWidth / 2) / (scale * renderScale) + centerX;
          
          let x = 0, y = 0, iteration = 0;
          let x2 = 0, y2 = 0;

          // Optimized Mandelbrot loop
          while (x2 + y2 <= 4 && iteration < maxIter) {
            y = 2 * x * y + y0;
            x = x2 - y2 + x0;
            x2 = x * x;
            y2 = y * y;
            iteration++;
          }

          const pixelIdx = (py * bufferWidth + px) * 4;
          if (iteration === maxIter) {
            // Inside the set: Deep void
            data[pixelIdx] = 2;
            data[pixelIdx + 1] = 4;
            data[pixelIdx + 2] = 8;
          } else {
            // Smoother coloring using escape time and log mapping
            const mu = iteration + 1 - Math.log(Math.log(Math.sqrt(x2 + y2))) / Math.log(2);
            
            // Deep cosmic palette: Dark Blues -> Purples -> Deep Oranges
            const r = Math.sin(0.05 * mu + 0.5) * 60 + 80;
            const g = Math.sin(0.03 * mu + 1.2) * 50 + 60;
            const b = Math.sin(0.02 * mu + 2.5) * 100 + 130;
            
            // Brighten near the edge but avoid pure white
            const brightness = Math.min(1, iteration / 30);
            data[pixelIdx] = r * brightness * 0.4;
            data[pixelIdx + 1] = g * brightness * 0.5;
            data[pixelIdx + 2] = b * brightness * 0.8;
          }
          data[pixelIdx + 3] = 255;
        }
      }
      bctx.putImageData(imgData, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(bufferCanvas, 0, 0, width, height);
    };

    let animationId: number;
    const renderLoop = () => {
      draw();
      animationId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Current complex plane position under mouse
      const complexX = (mouseX - width / 2) / viewRef.current.scale + viewRef.current.x;
      const complexY = (mouseY - height / 2) / viewRef.current.scale + viewRef.current.y;

      const zoomFactor = Math.pow(1.1, -e.deltaY * 0.002);
      viewRef.current.scale *= zoomFactor;

      // Adjust center so the point under the mouse stays stationary
      viewRef.current.x = complexX - (mouseX - width / 2) / viewRef.current.scale;
      viewRef.current.y = complexY - (mouseY - height / 2) / viewRef.current.scale;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      bufferWidth = Math.floor(width * renderScale);
      bufferHeight = Math.floor(height * renderScale);
      bufferCanvas.width = bufferWidth;
      bufferCanvas.height = bufferHeight;
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('resize', handleResize);
    
    return () => {
      canvas.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
};

export default MandelbrotVisualizer;
