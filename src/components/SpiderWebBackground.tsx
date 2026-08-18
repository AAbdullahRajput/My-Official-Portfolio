"use client";

import { useEffect, useRef } from "react";

export default function SpiderWebBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawWeb = (
      cx: number,
      cy: number,
      radius: number,
      spokes: number,
      rings: number
    ) => {
      ctx.strokeStyle = "rgba(120, 120, 120, 0.22)";
      ctx.lineWidth = 0.7;

      // radiating spokes
      const spokePoints: { x: number; y: number }[][] = [];
      for (let s = 0; s < spokes; s++) {
        const angle = (s / spokes) * Math.PI * 2;
        const points: { x: number; y: number }[] = [];
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        ctx.lineTo(x, y);
        ctx.stroke();
        for (let r = 1; r <= rings; r++) {
          const rr = (radius / rings) * r;
          points.push({ x: cx + Math.cos(angle) * rr, y: cy + Math.sin(angle) * rr });
        }
        spokePoints.push(points);
      }

      // connecting rings between spokes (slightly irregular, like a real web)
      for (let r = 0; r < rings; r++) {
        ctx.beginPath();
        for (let s = 0; s <= spokes; s++) {
          const p = spokePoints[s % spokes][r];
          if (s === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }
    };

    const draw = () => {
      const width = window.innerWidth;
      const height = document.body.scrollHeight || window.innerHeight * 4;
      canvas.width = width;
      canvas.height = height;
      canvas.style.height = height + "px";

      ctx.clearRect(0, 0, width, height);

      // top-left corner web
      drawWeb(0, 0, 220, 10, 6);

      // bottom-right corner web (near end of hero section)
      drawWeb(width, Math.min(900, height), 240, 10, 6);
    };

    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute top-0 left-0 z-0"
      style={{ position: "absolute", top: 0, left: 0 }}
    />
  );
}