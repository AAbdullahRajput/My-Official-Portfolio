"use client";

import { useRef, useState, createContext, useContext } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import type { Project } from "@/data/projects";

const FocusCtx = createContext<{
  focusedId: string | null;
  setFocusedId: (id: string | null) => void;
}>({ focusedId: null, setFocusedId: () => {} });

export function ProjectCardGrid({ children }: { children: React.ReactNode }) {
  const [focusedId, setFocusedId] = useState<string | null>(null);
  return (
    <FocusCtx.Provider value={{ focusedId, setFocusedId }}>
      <div className="relative">{children}</div>
    </FocusCtx.Provider>
  );
}

// ─── FULLSCREEN OVERLAY ──────────────────────────────────
function ProjectOverlay({ project, onMouseLeave }: { project: Project; onMouseLeave: () => void }) {
  const [activeImg, setActiveImg] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md"
      onMouseLeave={onMouseLeave}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 30 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-[90vw] max-w-5xl max-h-[85vh] overflow-hidden rounded-[28px] border border-[#8a0303]/20 bg-white shadow-2xl shadow-black/60 dark:bg-[#0a0a0d]"
      >
        {/* red top accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8a0303] to-transparent" />

        <div className="grid grid-cols-1 lg:grid-cols-2 h-full max-h-[85vh]">

          {/* LEFT — images */}
          <div className="flex flex-col gap-4 bg-gray-50 dark:bg-[#0f0f12] p-7 overflow-y-auto">
            {/* main image */}
            <div className="relative aspect-video w-full overflow-hidden rounded-[16px] border border-gray-100 dark:border-white/10 bg-gray-100 dark:bg-white/5 shrink-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImg}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0"
                >
                  {project.images?.[activeImg] ? (
                    <img
                      src={project.images[activeImg]}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <svg className="h-20 w-20 text-[#8a0303]/15" viewBox="0 0 100 100" fill="none">
                        <circle cx="50" cy="50" r="8" stroke="currentColor" strokeWidth="1" />
                        <circle cx="50" cy="50" r="22" stroke="currentColor" strokeWidth="1" />
                        <circle cx="50" cy="50" r="36" stroke="currentColor" strokeWidth="1" />
                        {[0,30,60,90,120,150].map((d) => (
                          <line key={d}
                            x1={50-44*Math.cos(d*Math.PI/180)} y1={50-44*Math.sin(d*Math.PI/180)}
                            x2={50+44*Math.cos(d*Math.PI/180)} y2={50+44*Math.sin(d*Math.PI/180)}
                            stroke="currentColor" strokeWidth="1" />
                        ))}
                      </svg>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* thumbnail strip */}
            {project.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 shrink-0">
                {project.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-[8px] border-2 transition-all ${
                      activeImg === i ? "border-[#8a0303] scale-105" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* badges */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {project.status && (
                <span className={`rounded-full px-3 py-1 font-mono text-[10px] tracking-wide border ${
                  project.status === "Live"
                    ? "border-green-400/40 bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-300"
                    : "border-gray-200 bg-gray-50 text-gray-400 dark:border-white/10 dark:bg-white/5 dark:text-white/30"
                }`}>
                  {project.status === "Live" && "● "}{project.status}
                </span>
              )}
              {project.year && (
                <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 font-mono text-[10px] text-gray-400 dark:border-white/10 dark:bg-white/5 dark:text-white/30">
                  {project.year}
                </span>
              )}
              {project.featured && (
                <span className="rounded-full border border-[#8a0303]/40 bg-[#8a0303]/8 px-3 py-1 font-mono text-[10px] tracking-wide text-[#8a0303] dark:text-red-300">
                  FEATURED
                </span>
              )}
            </div>
          </div>

          {/* RIGHT — details */}
          <div className="flex flex-col gap-6 overflow-y-auto p-7">
            {/* title block */}
            <div>
              <div className="mb-3 h-[2px] w-12 rounded-full bg-[#8a0303]" />
              <h2 className="font-mono text-2xl font-bold leading-tight text-[#0b0e13] dark:text-white">
                {project.title}
              </h2>
              {project.shortDesc && (
                <p className="mt-2 font-mono text-sm text-[#8a0303]/80 dark:text-red-400 leading-snug">
                  {project.shortDesc}
                </p>
              )}
            </div>

            {/* description */}
            <p className="font-mono text-xs leading-relaxed text-gray-500 dark:text-white/50">
              {project.longDescription || project.description}
            </p>

            {/* tech stack */}
            {project.techStack?.length > 0 && (
              <div>
                <p className="mb-3 font-mono text-[10px] tracking-[0.2em] text-[#8a0303] dark:text-red-400 uppercase">
                  Tech Stack
                </p>
                <div className="flex flex-col gap-3">
                  {project.techStack.map((cat) => (
                    <div key={cat.category}>
                      <span className="mb-1.5 block font-mono text-[9px] uppercase tracking-widest text-gray-300 dark:text-white/20">
                        {cat.category}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.tools.map((tool) => (
                          <span key={tool}
                            className="rounded-full border border-[#8a0303]/20 bg-[#8a0303]/5 px-2.5 py-1 font-mono text-[10px] text-[#8a0303] dark:border-red-600/20 dark:bg-red-600/5 dark:text-red-300"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* links */}
            <div className="mt-auto flex flex-wrap gap-2 pt-4 border-t border-gray-100 dark:border-white/5">
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 font-mono text-xs text-gray-600 transition-colors hover:border-[#8a0303]/40 hover:text-[#8a0303] dark:border-white/10 dark:bg-white/5 dark:text-white/50 dark:hover:text-red-300"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
              )}
              {project.live && (
                <a href={project.live} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-[#8a0303]/30 bg-[#8a0303]/5 px-4 py-2 font-mono text-xs text-[#8a0303] transition-colors hover:bg-[#8a0303]/10 dark:text-red-300"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  Live Site
                </a>
              )}
              {project.apk && (
                <a href={project.apk} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-green-400/30 bg-green-50 px-4 py-2 font-mono text-xs text-green-600 transition-colors hover:bg-green-100 dark:bg-green-500/10 dark:text-green-300 dark:border-green-500/20"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                  </svg>
                  Download APK
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── CARD ───────────────────────────────────────────────
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
  const { focusedId, setFocusedId } = useContext(FocusCtx);
  const [hovered, setHovered] = useState(false);

  const isFocused = focusedId === project.title;
  const isBlurred = focusedId !== null && !isFocused;

  const center = (total - 1) / 2;
  const offset = index - center;
  const fanRotate = offset * 5;
  const fanY = Math.abs(offset) * 12;

  const flipY = useMotionValue(0);
  const smoothFlipY = useSpring(flipY, { stiffness: 60, damping: 18, mass: 1.2 });
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 });

  const glow = useTransform(
    [x, y],
    ([xv, yv]: number[]) =>
      `radial-gradient(circle at ${(xv + 0.5) * 100}% ${(yv + 0.5) * 100}%, rgba(220,38,38,0.22), transparent 55%)`
  );

  function handleMouseEnter() {
    setFocusedId(project.title);
    setHovered(true);
    flipY.set(360);
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    setFocusedId(null);
    setHovered(false);
    flipY.set(0);
  }

  return (
    <div
      className="relative shrink-0"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence>
        {hovered && <ProjectOverlay project={project} onMouseLeave={() => setHovered(false)} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 60 + fanY, rotate: fanRotate }}
        whileInView={{ opacity: 1, y: fanY, rotate: fanRotate }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
        animate={{
          y: isFocused ? fanY - 60 : fanY,
          rotate: isFocused ? 0 : fanRotate,
          scale: isFocused ? 1.12 : isBlurred ? 0.94 : 1,
          filter: isBlurred ? "blur(3px) brightness(0.6)" : "blur(0px) brightness(1)",
          zIndex: isFocused ? 50 : 1,
          transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
        }}
        ref={ref}
        onMouseMove={handleMouseMove}
        style={{
          rotateX,
          rotateY: smoothFlipY,
          transformPerspective: 900,
          transformStyle: "preserve-3d",
          transformOrigin: "bottom center",
          cursor: "pointer",
        }}
        data-cursor-hover
        className="group relative w-72"
      >
        <div className="pointer-events-none absolute -inset-px rounded-[22px] bg-gradient-to-b from-red-600/50 via-red-900/10 to-transparent opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative flex h-[400px] flex-col overflow-hidden rounded-[20px] border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 group-hover:border-[#8a0303]/60 group-hover:shadow-2xl group-hover:shadow-[#8a0303]/20 dark:border-white/10 dark:bg-[#0a0a0d] dark:group-hover:border-red-600/60">

          <svg className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 text-[#8a0303]/10 transition-colors duration-300 group-hover:text-[#8a0303]/30" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="8" stroke="currentColor" strokeWidth="0.6" />
            <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="0.6" />
            <circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="0.6" />
            <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="0.6" />
            {[0,30,60,90,120,150].map((deg) => (
              <line key={deg}
                x1={50-48*Math.cos(deg*Math.PI/180)} y1={50-48*Math.sin(deg*Math.PI/180)}
                x2={50+48*Math.cos(deg*Math.PI/180)} y2={50+48*Math.sin(deg*Math.PI/180)}
                stroke="currentColor" strokeWidth="0.6" />
            ))}
          </svg>

          <motion.div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: glow as any }} />

          {project.thumbnail && (
            <div className="mb-4 -mx-6 -mt-6 h-36 overflow-hidden shrink-0">
              <img src={project.thumbnail} alt={project.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
          )}

          <div className={`h-[2px] w-10 rounded-full bg-[#8a0303] transition-all duration-300 group-hover:w-16 ${project.thumbnail ? "mt-2 mb-3" : "mb-4"}`} />

          <div className="relative mb-3 flex items-start justify-between gap-3">
            <h3 className="font-mono text-lg font-semibold leading-tight text-[#0b0e13] dark:text-white">
              {project.title}
            </h3>
            {project.featured && (
              <span className="shrink-0 rounded-full border border-[#8a0303]/40 bg-[#8a0303]/10 px-2 py-0.5 font-mono text-[9px] tracking-wide text-[#8a0303] dark:text-red-300">
                FEATURED
              </span>
            )}
          </div>

          <p className="relative mb-4 flex-1 font-mono text-xs leading-relaxed text-gray-500 line-clamp-3 dark:text-white/50">
            {project.shortDesc || project.description}
          </p>

          <div className="relative mb-4 flex flex-wrap gap-1.5">
            {project.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 font-mono text-[10px] text-gray-500 transition-colors duration-300 group-hover:border-[#8a0303]/30 group-hover:text-[#8a0303] dark:border-white/10 dark:bg-white/[0.03] dark:text-white/60">
                {tag}
              </span>
            ))}
          </div>

          <div className="relative mt-auto flex items-center justify-between font-mono text-xs">
            <div className="flex gap-4">
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 underline-offset-4 transition-colors hover:text-[#8a0303] hover:underline dark:text-white/40 dark:hover:text-red-300"
                >
                  GitHub
                </a>
              )}
              {project.live && (
                <a href={project.live} target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 underline-offset-4 transition-colors hover:text-[#8a0303] hover:underline dark:text-white/40 dark:hover:text-red-300"
                >
                  Live
                </a>
              )}
            </div>
            <span className="text-[10px] text-gray-300 dark:text-white/20 group-hover:text-[#8a0303]/50 transition-colors">
              hover to preview →
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}