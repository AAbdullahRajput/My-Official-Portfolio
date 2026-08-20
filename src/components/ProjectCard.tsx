"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Project } from "@/data/projects";

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
            style={{
        rotateX,
        rotateY,
        transformPerspective: 800,
        transformStyle: "preserve-3d",
        boxShadow: useTransform(
          [rotateX, rotateY],
          ([rx, ry]: number[]) => `${ry * -1.5}px ${rx * 1.5}px 30px rgba(0,0,0,0.25)`
        ) as any,
      }}
      data-cursor-hover
      className="group relative rounded-2xl border border-line bg-panel p-6 transition-shadow"
    >
            <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
        style={{
          background: useTransform(
            [x, y],
            ([xv, yv]: number[]) =>
              `radial-gradient(circle at ${(xv + 0.5) * 100}% ${(yv + 0.5) * 100}%, rgba(255,255,255,0.12), transparent 60%)`
          ) as any,
          transition: "opacity 0.3s",
        }}
      />

      <div className="mb-4 flex items-start justify-between" style={{ transform: "translateZ(20px)" }}>
               <h3 className="font-display text-xl font-semibold text-text" style={{ transform: "translateZ(30px)" }}>{project.title}</h3>
        {project.featured && (
          <span className="rounded-full bg-accent-blue/10 px-2 py-0.5 font-mono text-[10px] text-accent-blue">
            FEATURED
          </span>
        )}
      </div>

      <p className="mb-5 text-sm leading-relaxed text-text-muted">{project.description}</p>

      <div className="mb-5 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-line bg-ink-soft px-2.5 py-1 font-mono text-[11px] text-accent-green">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex gap-4 text-sm">
        {project.github && (
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-text-dim underline-offset-4 hover:text-text hover:underline">
            GitHub
          </a>
        )}
        {project.live && (
          <a href={project.live} target="_blank" rel="noopener noreferrer" className="text-text-dim underline-offset-4 hover:text-text hover:underline">
            Live site
          </a>
        )}
      </div>
    </motion.div>
  );
}