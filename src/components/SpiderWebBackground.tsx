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
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      ctx.clearRect(0, 0, width, height);

      const cols = 5;
      const rows = 4;
      const cellW = width / cols;
      const cellH = height / rows;

      ctx.strokeStyle = "rgba(76, 139, 245, 0.25)";
      ctx.lineWidth = 0.8;

      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          const cx = c * cellW;
          const cy = r * cellH;
          const spokeLen = Math.min(cellW, cellH) * 0.5;
          const spokeCount = 8;

          for (let s = 0; s < spokeCount; s++) {
            const angle = (s / spokeCount) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(
              cx + spokeLen * Math.cos(angle),
              cy + spokeLen * Math.sin(angle)
            );
            ctx.stroke();
          }

          for (let ring = 1; ring <= 4; ring++) {
            const r2 = (spokeLen * ring) / 4;
            ctx.beginPath();
            ctx.arc(cx, cy, r2, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }
    };

    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}