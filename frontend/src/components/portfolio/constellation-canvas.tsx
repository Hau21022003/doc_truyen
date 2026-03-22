// components/ConstellationCanvas.tsx
"use client";
import { useEffect, useRef } from "react";

export default function ConstellationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let W = (canvas.width = canvas.offsetWidth);
    let H = (canvas.height = canvas.offsetHeight);
    const mouse = { x: -9999, y: -9999 };

    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.3,
    }));

    let raf: number;
    const MAX_DIST = 130;

    function draw() {
      ctx.fillStyle = "#0a0e1a";
      ctx.fillRect(0, 0, W, H);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        // mouse attraction
        const dx = mouse.x - p.x,
          dy = mouse.y - p.y;
        if (Math.hypot(dx, dy) < 150) {
          p.x += dx * 0.01;
          p.y += dy * 0.01;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(10,240,255,${p.alpha})`;
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++)
        for (let j = i + 1; j < particles.length; j++) {
          const d = Math.hypot(
            particles[i].x - particles[j].x,
            particles[i].y - particles[j].y,
          );
          if (d < MAX_DIST) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(10,240,255,${0.3 * (1 - d / MAX_DIST)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

      raf = requestAnimationFrame(draw);
    }

    draw();

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}
