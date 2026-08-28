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
      rings: number,
      color: string
    ) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.7;

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

      const isDark = document.documentElement.classList.contains("dark");

      if (isDark) {
        ctx.fillStyle = "#0b0e13";
        ctx.fillRect(0, 0, width, height);
      }

      const color = isDark
        ? "rgba(200, 200, 210, 0.14)"
        : "rgba(120, 120, 120, 0.22)";

      drawWeb(0, 0, 220, 10, 6, color);
      drawWeb(width, Math.min(900, height), 240, 10, 6, color);
    };

    draw();
    window.addEventListener("resize", draw);

    // Redraw when theme toggles (watches the <html> class attribute)
    const observer = new MutationObserver(draw);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.removeEventListener("resize", draw);
      observer.disconnect();
    };
  }, []);

  return (
        <canvas
      ref={canvasRef}
      className="pointer-events-none absolute top-0 left-0 z-0"
      style={{ position: "absolute", top: 0, left: 0 }}
    />
  );
}