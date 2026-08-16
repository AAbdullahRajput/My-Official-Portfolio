"use client";

import { useEffect, useRef } from "react";

export default function SpiderWebBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const width = window.innerWidth;
      const height = document.body.scrollHeight || window.innerHeight * 4;
      canvas.width = width;
      canvas.height = height;
      canvas.style.height = height + "px";

      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = "rgba(138, 3, 3, 0.13)";
      ctx.lineWidth = 0.5;

      // use a seeded-like approach so lines are stable
      const seed = [
        [0.12, 0.08, 0.88, 0.45],
        [0.76, 0.03, 0.22, 0.67],
        [0.45, 0.91, 0.60, 0.12],
        [0.88, 0.55, 0.10, 0.80],
        [0.33, 0.44, 0.95, 0.30],
        [0.05, 0.60, 0.70, 0.95],
        [0.60, 0.20, 0.40, 0.75],
        [0.22, 0.85, 0.78, 0.15],
        [0.90, 0.40, 0.15, 0.55],
        [0.50, 0.70, 0.85, 0.05],
        [0.15, 0.30, 0.65, 0.90],
        [0.70, 0.65, 0.30, 0.40],
        [0.38, 0.10, 0.55, 0.88],
        [0.82, 0.78, 0.08, 0.25],
        [0.25, 0.50, 0.92, 0.60],
        [0.55, 0.35, 0.18, 0.95],
        [0.08, 0.75, 0.48, 0.20],
        [0.65, 0.88, 0.35, 0.50],
        [0.42, 0.15, 0.80, 0.70],
        [0.95, 0.25, 0.05, 0.45],
        [0.18, 0.55, 0.72, 0.35],
        [0.78, 0.42, 0.28, 0.80],
        [0.35, 0.68, 0.58, 0.08],
        [0.62, 0.05, 0.45, 0.65],
        [0.02, 0.90, 0.88, 0.38],
        [0.48, 0.28, 0.12, 0.72],
        [0.85, 0.62, 0.52, 0.18],
        [0.28, 0.38, 0.98, 0.82],
        [0.72, 0.82, 0.22, 0.62],
        [0.58, 0.48, 0.68, 0.28],
        [0.10, 0.18, 0.42, 0.92],
        [0.92, 0.08, 0.75, 0.58],
        [0.40, 0.95, 0.02, 0.35],
        [0.68, 0.32, 0.88, 0.72],
        [0.22, 0.72, 0.32, 0.48],
        [0.80, 0.58, 0.62, 0.02],
        [0.15, 0.42, 0.50, 0.78],
        [0.52, 0.80, 0.20, 0.55],
        [0.88, 0.15, 0.38, 0.88],
        [0.32, 0.62, 0.78, 0.22],
      ];

      seed.forEach(([x1r, y1r, x2r, y2r]) => {
        ctx.beginPath();
        ctx.moveTo(x1r * width, y1r * height);
        ctx.lineTo(x2r * width, y2r * height);
        ctx.stroke();
      });
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