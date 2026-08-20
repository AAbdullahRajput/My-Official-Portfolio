"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Project } from "@/data/projects";

export default function ProjectCard({
  project,
  index,
  total = 1,
}: {
  project: Project;
  index: number;
  total?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const center = (total - 1) / 2;
  const offset = index - center;
  const fanRotate = offset * 5; // base fan angle
  const fanY = Math.abs(offset) * 12; // arc lift toward the edges

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 });

  const glow = useTransform(
    [x, y],
    ([xv, yv]: number[]) =>
      `radial-gradient(circle at ${(xv + 0.5) * 100}% ${(yv + 0.5) * 100}%, rgba(220,38,38,0.22), transparent 55%)`
  );

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 + fanY, rotate: fanRotate }}
      whileInView={{ opacity: 1, y: fanY, rotate: fanRotate }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{
        y: fanY - 44,
        rotate: 0,
        scale: 1.07,
        zIndex: 50,
        transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
      }}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,
        transformStyle: "preserve-3d",
        transformOrigin: "bottom center",
      }}
      data-cursor-hover
      className="group relative w-[260px] shrink-0 -ml-6 first:ml-0 sm:w-72 sm:-ml-8"
    >
      {/* outer glow ring, only visible on hover */}
      <div className="pointer-events-none absolute -inset-px rounded-[22px] bg-gradient-to-b from-red-600/40 via-red-900/10 to-transparent opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative overflow-hidden rounded-[20px] border border-white/10 bg-[#0a0a0d] p-6 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] transition-colors duration-300 group-hover:border-red-600/50">
        {/* web-line texture, corner-anchored */}
        <svg
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 text-red-600/10 transition-colors duration-300 group-hover:text-red-600/25"
          viewBox="0 0 100 100"
          fill="none"
        >
          <circle cx="50" cy="50" r="8" stroke="currentColor" strokeWidth="0.6" />
          <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="0.6" />
          <circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="0.6" />
          <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="0.6" />
          {[0, 30, 60, 90, 120, 150].map((deg) => (
            <line
              key={deg}
              x1={50 - 48 * Math.cos((deg * Math.PI) / 180)}
              y1={50 - 48 * Math.sin((deg * Math.PI) / 180)}
              x2={50 + 48 * Math.cos((deg * Math.PI) / 180)}
              y2={50 + 48 * Math.sin((deg * Math.PI) / 180)}
              stroke="currentColor"
              strokeWidth="0.6"
            />
          ))}
        </svg>

        {/* cursor-tracking red glare */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glow as any }}
        />

        {/* thin red accent line, top */}
        <div className="mb-4 h-[2px] w-10 rounded-full bg-red-600/70 transition-all duration-300 group-hover:w-16" />

        <div className="relative mb-3 flex items-start justify-between gap-3" style={{ transform: "translateZ(24px)" }}>
          <h3 className="font-display text-lg font-semibold leading-tight text-white">
            {project.title}
          </h3>
          {project.featured && (
            <span className="shrink-0 rounded-full border border-red-600/40 bg-red-600/10 px-2 py-0.5 font-mono text-[9px] tracking-wide text-red-300">
              FEATURED
            </span>
          )}
        </div>

        <p className="relative mb-5 text-xs leading-relaxed text-white/50" style={{ transform: "translateZ(14px)" }}>
          {project.description}
        </p>

        <div className="relative mb-5 flex flex-wrap gap-1.5" style={{ transform: "translateZ(10px)" }}>
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] text-white/60 transition-colors duration-300 group-hover:border-red-600/30 group-hover:text-red-200"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="relative flex gap-4 text-xs" style={{ transform: "translateZ(10px)" }}>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 underline-offset-4 transition-colors hover:text-red-300 hover:underline"
            >
              GitHub
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 underline-offset-4 transition-colors hover:text-red-300 hover:underline"
            >
              Live site
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}