"use client";

import { useRef, useState, createContext, useContext } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import type { Project } from "@/data/projects";

// ─── INLINE CONTEXT ─────────────────────────────────────
const FocusCtx = createContext<{
  focusedId: string | null;
  setFocusedId: (id: string | null) => void;
}>({ focusedId: null, setFocusedId: () => {} });

export function ProjectCardGrid({ children }: { children: React.ReactNode }) {
  const [focusedId, setFocusedId] = useState<string | null>(null);
  return (
    <FocusCtx.Provider value={{ focusedId, setFocusedId }}>
      <div className="relative">
        {focusedId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-none fixed inset-0 z-30 backdrop-blur-sm bg-black/20"
          />
        )}
        {children}
      </div>
    </FocusCtx.Provider>
  );
}

// ─── FULLSCREEN OVERLAY ──────────────────────────────────
function ProjectOverlay({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [activeImg, setActiveImg] = useState(0);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 40 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl rounded-[24px] border border-[#8a0303]/30 bg-white dark:bg-[#0a0a0d] shadow-2xl shadow-black/50 overflow-hidden"
        >
          {/* close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white/80 text-gray-500 backdrop-blur-sm hover:border-[#8a0303]/40 hover:text-[#8a0303] dark:border-white/10 dark:bg-black/40 dark:text-white/50 dark:hover:text-red-300 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* LEFT — images */}
            <div className="flex flex-col gap-3 bg-gray-50 dark:bg-[#0f0f12] p-6">
              {/* main image */}
              <div className="relative aspect-video w-full overflow-hidden rounded-[14px] border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5">
                {project.images?.[activeImg] ? (
                  <img
                    src={project.images[activeImg]}
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  /* placeholder when no image supplied */
                  <div className="flex h-full w-full items-center justify-center">
                    <svg className="h-16 w-16 text-[#8a0303]/20" viewBox="0 0 100 100" fill="none">
                      <circle cx="50" cy="50" r="8" stroke="currentColor" strokeWidth="1" />
                      <circle cx="50" cy="50" r="22" stroke="currentColor" strokeWidth="1" />
                      <circle cx="50" cy="50" r="36" stroke="currentColor" strokeWidth="1" />
                      {[0,30,60,90,120,150].map((d) => (
                        <line key={d}
                          x1={50 - 44*Math.cos(d*Math.PI/180)} y1={50 - 44*Math.sin(d*Math.PI/180)}
                          x2={50 + 44*Math.cos(d*Math.PI/180)} y2={50 + 44*Math.sin(d*Math.PI/180)}
                          stroke="currentColor" strokeWidth="1" />
                      ))}
                    </svg>
                  </div>
                )}
              </div>

              {/* thumbnail strip */}
              {project.images && project.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {project.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-[8px] border-2 transition-colors ${
                        activeImg === i
                          ? "border-[#8a0303]"
                          : "border-transparent hover:border-[#8a0303]/40"
                      }`}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* status + year badges */}
              <div className="flex items-center gap-2 mt-1">
                {project.status && (
                  <span className={`rounded-full px-3 py-1 font-mono text-[10px] tracking-wide border ${
                    project.status === "Live"
                      ? "border-green-500/40 bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-300"
                      : project.status === "In Development"
                      ? "border-yellow-500/40 bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-300"
                      : "border-gray-300 bg-gray-50 text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-white/50"
                  }`}>
                    {project.status === "Live" && <span className="mr-1">●</span>}
                    {project.status}
                  </span>
                )}
                {project.year && (
                  <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 font-mono text-[10px] text-gray-400 dark:border-white/10 dark:bg-white/5 dark:text-white/30">
                    {project.year}
                  </span>
                )}
                {project.featured && (
                  <span className="rounded-full border border-[#8a0303]/40 bg-[#8a0303]/10 px-3 py-1 font-mono text-[10px] tracking-wide text-[#8a0303] dark:text-red-300">
                    FEATURED
                  </span>
                )}
              </div>
            </div>

            {/* RIGHT — details */}
            <div className="flex flex-col gap-5 overflow-y-auto p-6 max-h-[80vh]">
              {/* title */}
              <div>
                <div className="mb-2 h-[2px] w-10 rounded-full bg-[#8a0303]" />
                <h2 className="font-mono text-2xl font-bold text-[#0b0e13] dark:text-white">
                  {project.title}
                </h2>
                {project.shortDesc && (
                  <p className="mt-1 font-mono text-sm text-[#8a0303] dark:text-red-400">
                    {project.shortDesc}
                  </p>
                )}
              </div>

              {/* long description */}
              <div>
                <p className="font-mono text-xs leading-relaxed text-gray-500 dark:text-white/50">
                  {project.longDescription || project.description}
                </p>
              </div>

              {/* tech stack */}
              {project.techStack && project.techStack.length > 0 && (
                <div>
                  <h4 className="mb-3 font-mono text-[10px] tracking-widest text-[#8a0303] dark:text-red-400 uppercase">
                    Tech Stack
                  </h4>
                  <div className="flex flex-col gap-3">
                    {project.techStack.map((cat) => (
                      <div key={cat.category}>
                        <span className="mb-1.5 block font-mono text-[10px] text-gray-400 dark:text-white/30 uppercase tracking-wide">
                          {cat.category}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {cat.tools.map((tool) => (
                            <span
                              key={tool}
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

              {/* tags fallback */}
              {!project.techStack && (
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 font-mono text-[10px] text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-white/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* links */}
              <div className="mt-auto flex flex-wrap gap-3 pt-2 border-t border-gray-100 dark:border-white/5">
                {project.github && (
                  
                  <a href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 font-mono text-xs text-gray-600 transition-colors hover:border-[#8a0303]/40 hover:text-[#8a0303] dark:border-white/10 dark:bg-white/5 dark:text-white/50 dark:hover:text-red-300"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    GitHub
                  </a>
                )}
                {project.live && (
                  
                  <a  href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-[#8a0303]/30 bg-[#8a0303]/5 px-4 py-2 font-mono text-xs text-[#8a0303] transition-colors hover:bg-[#8a0303]/10 dark:text-red-300"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    Live Site
                  </a>
                )}
                {project.apk && (
                  
                  <a  href={project.apk}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-50 px-4 py-2 font-mono text-xs text-green-700 transition-colors hover:bg-green-100 dark:bg-green-500/10 dark:text-green-300 dark:border-green-500/20"
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
    </AnimatePresence>
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
  const [expanded, setExpanded] = useState(false);

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
    flipY.set(0);
  }

  return (
    <>
      {/* fullscreen overlay */}
      {expanded && (
        <ProjectOverlay project={project} onClose={() => setExpanded(false)} />
      )}

      <motion.div
        initial={{ opacity: 0, y: 60 + fanY, rotate: fanRotate }}
        whileInView={{ opacity: 1, y: fanY, rotate: fanRotate }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
        animate={{
          y: isFocused ? fanY - 60 : fanY,
          rotate: isFocused ? 0 : fanRotate,
          scale: isFocused ? 1.55 : isBlurred ? 0.96 : 1,
          filter: isBlurred ? "blur(3px) brightness(0.7)" : "blur(0px) brightness(1)",
          zIndex: isFocused ? 50 : 1,
          transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
        }}
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setExpanded(true)}
        style={{
          rotateX,
          rotateY: smoothFlipY,
          transformPerspective: 900,
          transformStyle: "preserve-3d",
          transformOrigin: "bottom center",
          cursor: "pointer",
        }}
        data-cursor-hover
        className="group relative w-72 shrink-0"
      >
        {/* outer glow ring */}
        <div className="pointer-events-none absolute -inset-px rounded-[22px] bg-gradient-to-b from-red-600/50 via-red-900/10 to-transparent opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative flex h-[400px] flex-col overflow-hidden rounded-[20px] border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 group-hover:border-[#8a0303]/60 group-hover:shadow-2xl group-hover:shadow-[#8a0303]/20 dark:border-white/10 dark:bg-[#0a0a0d] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] dark:group-hover:border-red-600/60">

          {/* web-line texture */}
          <svg
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 text-[#8a0303]/10 transition-colors duration-300 group-hover:text-[#8a0303]/30 dark:text-red-600/10 dark:group-hover:text-red-600/25"
            viewBox="0 0 100 100" fill="none"
          >
            <circle cx="50" cy="50" r="8" stroke="currentColor" strokeWidth="0.6" />
            <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="0.6" />
            <circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="0.6" />
            <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="0.6" />
            {[0, 30, 60, 90, 120, 150].map((deg) => (
              <line key={deg}
                x1={50 - 48 * Math.cos((deg * Math.PI) / 180)} y1={50 - 48 * Math.sin((deg * Math.PI) / 180)}
                x2={50 + 48 * Math.cos((deg * Math.PI) / 180)} y2={50 + 48 * Math.sin((deg * Math.PI) / 180)}
                stroke="currentColor" strokeWidth="0.6"
              />
            ))}
          </svg>

          {/* cursor glare */}
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: glow as any }}
          />

          {/* thumbnail if available */}
          {project.thumbnail && (
            <div className="mb-4 -mx-6 -mt-6 h-36 overflow-hidden">
              <img
                src={project.thumbnail}
                alt={project.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          )}

          {/* top accent line */}
          <div className={`h-[2px] w-10 rounded-full bg-[#8a0303] transition-all duration-300 group-hover:w-16 dark:bg-red-600/70 ${project.thumbnail ? "mt-2 mb-3" : "mb-4"}`} />

          <div className="relative mb-3 flex items-start justify-between gap-3">
            <h3 className="font-mono text-lg font-semibold leading-tight text-[#0b0e13] dark:text-white">
              {project.title}
            </h3>
            {project.featured && (
              <span className="shrink-0 rounded-full border border-[#8a0303]/40 bg-[#8a0303]/10 px-2 py-0.5 font-mono text-[9px] tracking-wide text-[#8a0303] dark:border-red-600/40 dark:bg-red-600/10 dark:text-red-300">
                FEATURED
              </span>
            )}
          </div>

          <p className="relative mb-4 flex-1 font-mono text-xs leading-relaxed text-gray-500 line-clamp-3 dark:text-white/50">
            {project.shortDesc || project.description}
          </p>

          <div className="relative mb-4 flex flex-wrap gap-1.5">
            {project.tags.slice(0, 4).map((tag) => (
              <span key={tag}
                className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 font-mono text-[10px] text-gray-500 transition-colors duration-300 group-hover:border-[#8a0303]/30 group-hover:text-[#8a0303] dark:border-white/10 dark:bg-white/[0.03] dark:text-white/60 dark:group-hover:border-red-600/30 dark:group-hover:text-red-200"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="relative mt-auto flex items-center justify-between font-mono text-xs">
            <div className="flex gap-4">
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-gray-400 underline-offset-4 transition-colors hover:text-[#8a0303] hover:underline dark:text-white/40 dark:hover:text-red-300"
                >
                  GitHub
                </a>
              )}
              {project.live && (
                <a href={project.live} target="_blank" rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-gray-400 underline-offset-4 transition-colors hover:text-[#8a0303] hover:underline dark:text-white/40 dark:hover:text-red-300"
                >
                  Live
                </a>
              )}
            </div>
            <span className="text-[10px] text-gray-300 dark:text-white/20 group-hover:text-[#8a0303]/50 transition-colors">
              click to expand →
            </span>
          </div>
        </div>
      </motion.div>
    </>
  );
}