"use client";

import { useEffect, useRef } from "react";

export default function SpiderWebBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = document.body.scrollHeight;

    canvas.width = width;
    canvas.height = height;

    const resize = () => {
      width = window.innerWidth;
      height = document.body.scrollHeight;
      canvas.width = width;
      canvas.height = height;
      draw();
    };

    window.addEventListener("resize", resize);

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      const cols = 6;
      const rows = Math.ceil(height / 300);
      const cellW = width / cols;
      const cellH = height / rows;

      ctx.strokeStyle = "rgba(76, 139, 245, 0.06)";
      ctx.lineWidth = 0.6;

      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          const cx = c * cellW;
          const cy = r * cellH;
          const spokeLen = Math.min(cellW, cellH) * 0.48;
          const spokeCount = 6;

          for (let s = 0; s < spokeCount; s++) {
            const angle = (s / spokeCount) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + spokeLen * Math.cos(angle), cy + spokeLen * Math.sin(angle));
            ctx.stroke();
          }

          for (let ring = 1; ring <= 3; ring++) {
            const r2 = (spokeLen * ring) / 3;
            ctx.beginPath();
            ctx.arc(cx, cy, r2, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }
    }

    draw();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 1 }}
    />
  );
}