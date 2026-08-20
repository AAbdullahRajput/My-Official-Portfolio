"use client";

import { useRef, useState, useEffect, useCallback, createContext, useContext } from "react";
import { createPortal } from "react-dom";
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

// ─── ZOOMABLE IMAGE ──────────────────────────────────────
function ZoomableImage({ src, alt }: { src: string; alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastPoint = useRef({ x: 0, y: 0 });

  const clampScale = (s: number) => Math.min(5, Math.max(1, s));

  const handleWheel = useCallback((e: React.WheelEvent) => {
    // Trackpad pinch gestures arrive as wheel events with ctrlKey true.
    // Plain two-finger scroll (no ctrlKey) is treated as pan/zoom too so
    // scrolling never escapes to the page behind it.
    e.preventDefault();
    e.stopPropagation();

    if (e.ctrlKey) {
      setScale((s) => clampScale(s - e.deltaY * 0.015));
    } else {
      setScale((s) => clampScale(s - e.deltaY * 0.01));
    }
  }, []);

  function handleMouseDown(e: React.MouseEvent) {
    if (scale <= 1) return;
    dragging.current = true;
    lastPoint.current = { x: e.clientX, y: e.clientY };
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!dragging.current) return;
    const dx = e.clientX - lastPoint.current.x;
    const dy = e.clientY - lastPoint.current.y;
    lastPoint.current = { x: e.clientX, y: e.clientY };
    setPos((p) => ({ x: p.x + dx, y: p.y + dy }));
  }

  function stopDrag() {
    dragging.current = false;
  }

  function resetZoom(e: React.MouseEvent) {
    e.stopPropagation();
    setScale(1);
    setPos({ x: 0, y: 0 });
  }

  function zoomBy(delta: number) {
    setScale((s) => clampScale(s + delta));
  }

  const PAN_STEP = 60;

  function panBy(dx: number, dy: number) {
    setPos((p) => ({ x: p.x + dx, y: p.y + dy }));
  }

  // Reset pan when zoomed all the way back out
  useEffect(() => {
    if (scale === 1) setPos({ x: 0, y: 0 });
  }, [scale]);

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      className="relative h-full w-full overflow-hidden touch-none select-none"
      style={{ cursor: scale > 1 ? (dragging.current ? "grabbing" : "grab") : "default" }}
    >
      <img
        src={src}
        alt={alt}
        loading="eager"
        decoding="async"
        draggable={false}
        className="h-full w-full object-contain bg-gray-100 dark:bg-white/5"
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
          transition: dragging.current ? "none" : "transform 0.15s ease-out",
          transformOrigin: "center center",
        }}
      />

      {/* zoom controls */}
      <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5" data-cursor-hover>
        {scale > 1 && (
          <button
            onClick={resetZoom}
            className="rounded-full border border-gray-200 bg-white/90 px-3 py-1.5 font-mono text-[10px] text-gray-600 shadow-md backdrop-blur-sm transition-colors hover:border-[#8a0303]/40 hover:text-[#8a0303] dark:border-white/10 dark:bg-black/70 dark:text-white/60"
          >
            Reset
          </button>
        )}
        <div className="flex items-center overflow-hidden rounded-full border border-gray-200 bg-white/90 shadow-md backdrop-blur-sm dark:border-white/10 dark:bg-black/70">
          <button
            onClick={(e) => { e.stopPropagation(); zoomBy(-0.4); }}
            aria-label="Zoom out"
            className="flex h-8 w-8 items-center justify-center text-gray-600 transition-colors hover:text-[#8a0303] dark:text-white/60"
          >
            −
          </button>
          <span className="px-1 font-mono text-[10px] text-gray-400 dark:text-white/30">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); zoomBy(0.4); }}
            aria-label="Zoom in"
            className="flex h-8 w-8 items-center justify-center text-gray-600 transition-colors hover:text-[#8a0303] dark:text-white/60"
          >
            +
          </button>
        </div>
      </div>

      {/* directional pad — only useful once zoomed in — full 8-way */}
      {scale > 1 && (
        <div className="absolute bottom-3 left-3 z-10 grid grid-cols-3 grid-rows-3 gap-0.5" data-cursor-hover>
          <button onClick={(e) => { e.stopPropagation(); panBy(PAN_STEP, PAN_STEP); }} aria-label="Pan up-left"
            className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white/90 text-gray-600 shadow-sm backdrop-blur-sm transition-colors hover:text-[#8a0303] dark:border-white/10 dark:bg-black/70 dark:text-white/60">↖</button>
          <button onClick={(e) => { e.stopPropagation(); panBy(0, PAN_STEP); }} aria-label="Pan up"
            className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white/90 text-gray-600 shadow-sm backdrop-blur-sm transition-colors hover:text-[#8a0303] dark:border-white/10 dark:bg-black/70 dark:text-white/60">↑</button>
          <button onClick={(e) => { e.stopPropagation(); panBy(-PAN_STEP, PAN_STEP); }} aria-label="Pan up-right"
            className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white/90 text-gray-600 shadow-sm backdrop-blur-sm transition-colors hover:text-[#8a0303] dark:border-white/10 dark:bg-black/70 dark:text-white/60">↗</button>

          <button onClick={(e) => { e.stopPropagation(); panBy(PAN_STEP, 0); }} aria-label="Pan left"
            className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white/90 text-gray-600 shadow-sm backdrop-blur-sm transition-colors hover:text-[#8a0303] dark:border-white/10 dark:bg-black/70 dark:text-white/60">←</button>
          <button onClick={resetZoom} aria-label="Center"
            className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white/90 text-gray-400 shadow-sm backdrop-blur-sm transition-colors hover:text-[#8a0303] dark:border-white/10 dark:bg-black/70 dark:text-white/30">•</button>
          <button onClick={(e) => { e.stopPropagation(); panBy(-PAN_STEP, 0); }} aria-label="Pan right"
            className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white/90 text-gray-600 shadow-sm backdrop-blur-sm transition-colors hover:text-[#8a0303] dark:border-white/10 dark:bg-black/70 dark:text-white/60">→</button>

          <button onClick={(e) => { e.stopPropagation(); panBy(PAN_STEP, -PAN_STEP); }} aria-label="Pan down-left"
            className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white/90 text-gray-600 shadow-sm backdrop-blur-sm transition-colors hover:text-[#8a0303] dark:border-white/10 dark:bg-black/70 dark:text-white/60">↙</button>
          <button onClick={(e) => { e.stopPropagation(); panBy(0, -PAN_STEP); }} aria-label="Pan down"
            className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white/90 text-gray-600 shadow-sm backdrop-blur-sm transition-colors hover:text-[#8a0303] dark:border-white/10 dark:bg-black/70 dark:text-white/60">↓</button>
          <button onClick={(e) => { e.stopPropagation(); panBy(-PAN_STEP, -PAN_STEP); }} aria-label="Pan down-right"
            className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white/90 text-gray-600 shadow-sm backdrop-blur-sm transition-colors hover:text-[#8a0303] dark:border-white/10 dark:bg-black/70 dark:text-white/60">↘</button>
        </div>
      )}
    </div>
  );
}

// ─── FULLSCREEN OVERLAY ──────────────────────────────────
function ProjectOverlay({ project, onMouseLeave }: { project: Project; onMouseLeave: () => void }) {
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const originalHtmlOverflow = html.style.overflow;
    const originalBodyOverflow = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    document.dispatchEvent(new Event("portal-open"));

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onMouseLeave();
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      html.style.overflow = originalHtmlOverflow;
      body.style.overflow = originalBodyOverflow;
      document.dispatchEvent(new Event("portal-close"));
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onMouseLeave]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-6"
      onClick={onMouseLeave}
      onWheel={(e) => e.preventDefault()}
      onTouchMove={(e) => e.preventDefault()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.2, rotateY: -360 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        exit={{ opacity: 0, scale: 0.2, rotateY: 360 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        className="relative w-[60vw] h-[85vh] max-w-5xl overflow-y-auto overscroll-contain rounded-[24px] border border-gray-200 bg-white px-8 py-12 shadow-2xl dark:border-white/10 dark:bg-[#0a0a0d]"
        style={{ overscrollBehavior: "contain", transformPerspective: 1600, transformStyle: "preserve-3d" }}
      >
        {/* close button */}
        <button
          onClick={onMouseLeave}
          data-cursor-hover
          className="absolute top-6 right-6 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:border-[#8a0303]/40 hover:text-[#8a0303] dark:border-white/10 dark:bg-white/5 dark:text-white/60"
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* red top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-[24px] bg-gradient-to-r from-transparent via-[#8a0303] to-transparent" />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

          {/* LEFT — images */}
          <div className="flex flex-col gap-6 sticky top-16 lg:col-span-3">
            {/* main image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] border border-gray-100 dark:border-white/10 bg-gray-100 dark:bg-white/5 shadow-xl">
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
                    <ZoomableImage src={project.images[activeImg]} alt={project.title} />
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

            {/* image grid */}
            {project.images?.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {project.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    data-cursor-hover
                    className={`relative aspect-video overflow-hidden rounded-[10px] border-2 transition-all ${
                      activeImg === i ? "border-[#8a0303]" : "border-transparent opacity-50 hover:opacity-90"
                    }`}
                  >
                    <img src={img} alt="" loading="lazy" decoding="async" className="h-full w-full object-contain bg-gray-100 dark:bg-white/5" />
                  </button>
                ))}
              </div>
            )}

            {/* badges */}
            <div className="flex flex-wrap items-center gap-2">
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
          <div className="flex flex-col gap-8 lg:col-span-2">
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
            <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-100 dark:border-white/5">
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer"
                  data-cursor-hover
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
                  data-cursor-hover
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
                  data-cursor-hover
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

  function handleOpen() {
    setFocusedId(project.title);
    flipY.set(360);
    setHovered(true);
  }

  function handleClose() {
    flipY.set(0);
    setFocusedId(null);
    setHovered(false);
  }

  return (
    <div
      className="relative shrink-0"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {hovered && <ProjectOverlay project={project} onMouseLeave={handleClose} />}
          </AnimatePresence>,
          document.body
        )}

      <motion.div
        initial={{ opacity: 0, y: 60 + fanY, rotate: fanRotate }}
        whileInView={{ opacity: 1, y: fanY, rotate: fanRotate }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
        animate={{
          y: isFocused ? fanY - 60 : fanY,
          rotate: isFocused ? 0 : fanRotate,
          scale: isFocused ? 1.12 : isBlurred ? 0.94 : 1,
          opacity: isBlurred ? 0.5 : 1,
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
        onClick={handleOpen}
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
            <div className="mb-4 -mx-6 -mt-6 h-44 overflow-hidden shrink-0">
              <img src={project.thumbnail} alt={project.title} loading="lazy" decoding="async" className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105" />
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

          <p className="relative mb-4 flex-1 font-mono text-xs leading-relaxed text-gray-500 line-clamp-4 dark:text-white/50">
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
              click to view →
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}