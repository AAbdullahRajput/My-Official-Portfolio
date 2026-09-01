"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useMotionValue, useMotionValueEvent, useMotionTemplate, useSpring, useTransform, useScroll, useAnimationFrame, useAnimation, animate, type Variants } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";
import Navbar from "@/components/Navbar";
import { FiGithub, FiMail } from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa";

const LINKEDIN_URL = "https://www.linkedin.com/in/ahmad-a-972497411";

// ─── DATA ───────────────────────────────────────────────
const skills = [
  { label: "Flutter / Dart", angle: 0, desc: "Cross-platform mobile & web framework by Google. Powers GetFit and Golazo with a single Dart codebase on Android, iOS, and web." },
  { label: "React Native", angle: 51, desc: "Facebook's cross-platform mobile framework. Used in Station Hub and Golazo — native performance with a JavaScript/TypeScript codebase." },
  { label: "Next.js / React", angle: 102, desc: "React meta-framework for production web apps. Handles SSR, routing, and API routes — used in this portfolio and ConnectHub's frontend." },
  { label: "Node.js / Express", angle: 153, desc: "JavaScript runtime for backend APIs. Handles REST endpoints, JWT auth, and real-time Socket.io connections across multiple projects." },
  { label: "FastAPI", angle: 204, desc: "High-performance Python API framework. Powers Station Hub's backend with async endpoints, Firebase auth, and automatic OpenAPI docs." },
  { label: "Supabase", angle: 255, desc: "Open-source Firebase alternative built on PostgreSQL. Used for auth, real-time subscriptions, and Row Level Security in Golazo and ConnectHub." },
  { label: "Agora RTC", angle: 306, desc: "Real-time video & audio SDK. Powers live trainer-to-user video call sessions inside GetFit with low-latency peer-to-peer streaming." },
];

const TECH_INFO: Record<string, string> = {
  "Flutter": "Cross-platform mobile & web framework by Google using Dart — single codebase for Android, iOS, and web.",
  "React Native": "Facebook's cross-platform mobile framework — native performance with a JavaScript/TypeScript codebase.",
  "Next.js": "React meta-framework for production web apps — SSR, routing, and API routes.",
  "Node.js": "JavaScript runtime for backend APIs — REST endpoints, auth, and real-time connections.",
  "FastAPI": "High-performance Python API framework with async endpoints and automatic OpenAPI docs.",
  "Supabase": "Open-source Firebase alternative built on PostgreSQL — auth, realtime, and Row Level Security.",
  "Agora RTC": "Real-time video & audio SDK powering low-latency peer-to-peer streaming.",
  "Python": "General-purpose language used here for backend services, scripting, and automation.",
  "React.js": "JavaScript library for building component-based user interfaces.",
  "Express": "Minimal Node.js web framework for building REST APIs and middleware.",
  "MongoDB": "NoSQL document database used for flexible, schema-less data storage.",
  "React": "JavaScript library for building component-based user interfaces.",
  "Vite": "Fast frontend build tool with instant dev server startup and HMR.",
  "Socket.io": "Library for real-time, bidirectional communication between client and server.",
  "MongoDB Atlas": "Fully managed cloud version of MongoDB used for hosting production databases.",
  "AWS": "Amazon Web Services — cloud infrastructure used for hosting and deployment.",
  "Java": "Object-oriented language used here for desktop and backend applications.",
  "C#": "Microsoft's object-oriented language used here for Windows desktop applications.",
};

const fadeUp = {
  hidden: { opacity: 0, y: -140, rotate: -6 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: {
      delay: i * 0.12,
      type: "spring" as const,
      stiffness: 140,
      damping: 13,
      mass: 0.8,
    },
  }),
};

// ─── HANGING SPIDER (with real, screen-anchored web thread) ─────
function SpiderWeb({ splashDone }: { splashDone: boolean }) {
  const REST_Y = 140; // resting distance from ceiling anchor to spider top
  const spiderX = useMotionValue(0);
  const spiderY = useMotionValue(-320);
  const [drag, setDrag] = useState({ x: 0, y: -320 });

  useMotionValueEvent(spiderX, "change", (v) => setDrag((d) => ({ ...d, x: v })));
  useMotionValueEvent(spiderY, "change", (v) => setDrag((d) => ({ ...d, y: v })));

  useEffect(() => {
    if (splashDone) {
      animate(spiderY, 0, { type: "spring", stiffness: 65, damping: 6.5, mass: 1, delay: 0.25 });
    }
  }, [splashDone]);

  const anchorX = 64; // matches spider's horizontal center in its box below
  const tipX = anchorX + drag.x;
  const tipY = REST_Y + drag.y;

  return (
    <div
      className="pointer-events-none absolute right-[2%] top-0 z-30 hidden lg:block"
      style={{ width: 260, height: 500 }}
    >
      {/* thread removed — spider hangs freely */}

      <motion.div
        role="img"
        aria-label=""
        className="pointer-events-auto absolute w-150 h-150 cursor-grab select-none active:cursor-grabbing dark:invert"
        style={{
          left: anchorX - 220,
          top: 0,
          x: spiderX,
          y: spiderY,
          transformOrigin: "top center",
          backgroundImage: "url(/images/falling-boy-girl-spiderman.png)",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top center",
          touchAction: "none",
          userSelect: "none",
        }}
        drag
        dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
        dragElastic={0.9}
        dragSnapToOrigin
        dragTransition={{ bounceStiffness: 280, bounceDamping: 9 }}
        whileDrag={{ cursor: "grabbing" }}
        animate={{ rotate: [0, 7, -7, 5, -5, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 1.6 }}
      />
    </div>
  );
}

// ─── HERO ───────────────────────────────────────────────
function Hero({ splashDone = false }: { splashDone?: boolean }) {
  const heroImgRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [revealing, setRevealing] = useState(false);
  const [activeHeroTag, setActiveHeroTag] = useState<{ label: string; desc: string } | null>(null);
  const [hoveredHeroTag, setHoveredHeroTag] = useState<{ tag: { label: string; desc: string }; rect: DOMRect } | null>(null);

  // cursor-tracked reveal spot (percentages), smoothed for a silky follow
  const spotX = useMotionValue(50);
  const spotY = useMotionValue(30);
  const smoothSpotX = useSpring(spotX, { stiffness: 150, damping: 22, mass: 0.3 });
  const smoothSpotY = useSpring(spotY, { stiffness: 150, damping: 22, mass: 0.3 });
  const revealMaskImage = useMotionTemplate`radial-gradient(circle 200px at ${smoothSpotX}% ${smoothSpotY}%, black 45%, transparent 100%)`;

  const handleFaceMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = heroImgRef.current?.getBoundingClientRect();
    if (!rect) return;
    spotX.set(((e.clientX - rect.left) / rect.width) * 100);
    spotY.set(((e.clientY - rect.top) / rect.height) * 100);
    setRevealing(true);
  };

  // 3D tilt for the hero image stack, driven by cursor position
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(useTransform(tiltY, [-0.5, 0.5], [8, -8]), { stiffness: 100, damping: 20 });
  const rotateY = useSpring(useTransform(tiltX, [-0.5, 0.5], [-8, 8]), { stiffness: 100, damping: 20 });

  const handleSectionMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    tiltX.set((e.clientX - rect.left) / rect.width - 0.5);
    tiltY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleSectionMouseLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleSectionMouseMove}
      onMouseLeave={handleSectionMouseLeave}
      className="relative min-h-screen w-full overflow-hidden bg-[#F5F7F6] dark:bg-ink"
      style={{ perspective: 1400 }}
    >
            {/* Spiderman image layer */}
            <motion.div
        ref={heroImgRef}
        initial={{ y: -500, opacity: 0, rotate: -10 }}
        animate={splashDone ? { y: [-500, 30, -15, 5, 0], opacity: 1, rotate: [-10, 4, -2, 1, 0] } : { y: -500, opacity: 0, rotate: -10 }}
        transition={{ duration: 1.4, times: [0, 0.55, 0.75, 0.9, 1], ease: "easeIn", delay: 0.1 }}
        className="absolute inset-y-0 left-1/2 hidden w-[85%] -translate-x-1/2 lg:block"
        data-cursor-surface="dark"
        style={{ zIndex: 5, rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        <img
          src="/images/Spiderman-Main.png"
          alt="Spiderman"
          className="h-full w-full object-cover object-top select-none pointer-events-none dark:hidden"
          style={{
            maskImage: "radial-gradient(ellipse 90% 95% at 50% 40%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 90% 95% at 50% 40%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
          }}
        />
        <img
          src="/images/Spiderman-Main-night.png"
          alt="Spiderman"
          className="hidden h-full w-full object-cover object-top select-none pointer-events-none dark:block"
          style={{
            maskImage: "radial-gradient(ellipse 90% 95% at 50% 40%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 90% 95% at 50% 40%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
                    }}
        />
      </motion.div>

      {/* My photo — revealed over Spiderman face on eye hover */}
           <motion.div
        className="absolute inset-y-0 left-1/2 hidden w-[85%] -translate-x-1/2 lg:block pointer-events-none select-none"
        style={{
          zIndex: 6,
          opacity: revealing ? 1 : 0,
          transition: "opacity 0.25s ease-out",
          maskImage: revealMaskImage,
          WebkitMaskImage: revealMaskImage,
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        <img
          src="/images/Spiderman-Main-me.png"
          alt="Ahmad"
          className="h-full w-full object-cover object-top select-none pointer-events-none"
        />
      </motion.div>
      {/* Full-image hover zone — tracks cursor for the reveal spotlight */}
      <div
        className="absolute inset-y-0 left-1/2 hidden w-[85%] -translate-x-1/2 lg:block pointer-events-auto"
        style={{ zIndex: 20 }}
        data-cursor-surface="dark"
        onMouseEnter={() => setRevealing(true)}
        onMouseLeave={() => setRevealing(false)}
        onMouseMove={handleFaceMouseMove}
      />

      {/* Hanging spider — drops in with gravity/bounce, then idles */}
      <SpiderWeb splashDone={splashDone} />

      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {activeHeroTag && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              onClick={() => setActiveHeroTag(null)}
            >
              <motion.div
                initial={{ y: 60, opacity: 0, scale: 0.96 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 60, opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-white/[0.08] dark:bg-[#0f1117]/90 dark:backdrop-blur-xl"
              >
                <div className="mb-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#8a0303] dark:text-accent-green">
                  {activeHeroTag.label}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[#6b7280] dark:text-text-muted">
                  {activeHeroTag.desc}
                </p>
                <button
                  data-cursor-hover
                  onClick={() => setActiveHeroTag(null)}
                  className="mt-5 w-full rounded-xl bg-[#0b0e13] py-2.5 font-mono text-[11px] font-medium text-white transition-colors hover:bg-[#8a0303] dark:bg-white/[0.06] dark:border dark:border-white/[0.08] dark:text-text dark:hover:border-accent-green/30 dark:hover:bg-white/[0.10]"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {hoveredHeroTag && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="pointer-events-none fixed z-[250] hidden w-56 sm:block"
              style={{
                left: Math.max(12, Math.min(hoveredHeroTag.rect.left + hoveredHeroTag.rect.width / 2 - 112, window.innerWidth - 224 - 12)),
                top: hoveredHeroTag.rect.bottom + 10,
              }}
            >
              <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-xl dark:border-line dark:bg-panel">
                <div className="mb-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#8a0303] dark:text-accent-green">
                  {hoveredHeroTag.tag.label}
                </div>
                <p className="text-[11px] leading-relaxed text-[#6b7280] dark:text-text-muted">
                  {hoveredHeroTag.tag.desc}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <div className="pointer-events-none relative z-30 mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row items-center px-6 sm:px-10 lg:pl-4 lg:pr-6">
        <div className="pointer-events-auto max-w-lg lg:w-[48%] lg:-ml-60 lg:mt-20">

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={splashDone ? "show" : "hidden"}
            custom={1}
          >
            <motion.img
              src="/images/signature.svg"
              alt="Ahmad Abdullah"
              className="h-20 w-auto max-w-sm object-contain dark:invert select-none sm:h-24 lg:h-28"
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{
                clipPath: [
                  "inset(0 100% 0 0)",
                  "inset(0 78% 0 0)",
                  "inset(0 78% 0 0)",
                  "inset(0 52% 0 0)",
                  "inset(0 52% 0 0)",
                  "inset(0 24% 0 0)",
                  "inset(0 24% 0 0)",
                  "inset(0 0% 0 0)",
                ],
                transition: {
                  duration: 2.4,
                  delay: 0.15,
                  times: [0, 0.22, 0.28, 0.5, 0.56, 0.78, 0.84, 1],
                  ease: "easeInOut",
                },
              }}
              whileHover={{
                clipPath: [
                  "inset(0 100% 0 0)",
                  "inset(0 78% 0 0)",
                  "inset(0 78% 0 0)",
                  "inset(0 52% 0 0)",
                  "inset(0 52% 0 0)",
                  "inset(0 24% 0 0)",
                  "inset(0 24% 0 0)",
                  "inset(0 0% 0 0)",
                ],
                transition: {
                  duration: 1.4,
                  times: [0, 0.22, 0.28, 0.5, 0.56, 0.78, 0.84, 1],
                  ease: "easeInOut",
                },
              }}
            />
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate={splashDone ? "show" : "hidden"}
            custom={2}
            className="font-body mt-4 text-lg font-normal tracking-wide leading-snug text-[#374151] dark:text-white/90 sm:text-xl"
          >
            Full-stack engineer building connected mobile and web systems.
          </motion.p>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate={splashDone ? "show" : "hidden"}
            custom={3}
            className="mt-5 max-w-md text-sm leading-relaxed text-[#6b7280] dark:text-white/65 sm:text-base"
          >
            Flutter, React Native, and Next.js apps wired to real-time backends &mdash; live video, payments, and data that stay in sync.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={splashDone ? "show" : "hidden"}
            custom={4}
            className="mt-8 flex flex-wrap gap-3"
          >
            
            <a  href="#projects"
              data-cursor-hover
              className="rounded-lg bg-[#0b0e13] px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-[#8a0303] hover:shadow-lg hover:shadow-[#8a0303]/30 dark:bg-white/15 dark:text-white dark:border dark:border-white/30 dark:hover:border-accent-green/60 dark:hover:bg-accent-green dark:hover:text-[#0b0e13] dark:hover:shadow-lg dark:hover:shadow-accent-green/30"
            >
              View work
            </a>

            
            <a  href="#contact"
              data-cursor-hover
              className="rounded-lg border border-[#d1d5db] px-6 py-3 text-sm font-medium text-[#0b0e13] transition-all duration-200 hover:scale-105 hover:border-[#8a0303] hover:text-[#8a0303] hover:bg-gray-50 dark:border-white/40 dark:text-white dark:hover:border-accent-green dark:hover:text-accent-green dark:hover:bg-accent-green/10"
            >
              Get in touch
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={splashDone ? "show" : "hidden"}
            custom={5}
            className="mt-10 flex flex-wrap gap-2"
          >
            {[
              { label: "Flutter", desc: "Cross-platform mobile & web framework by Google. Powers GetFit and Golazo with a single Dart codebase on Android, iOS, and web." },
              { label: "Next.js", desc: "React meta-framework for production web apps. Handles SSR, routing, and API routes — used in this portfolio and ConnectHub's frontend." },
              { label: "Supabase", desc: "Open-source Firebase alternative built on PostgreSQL. Used for auth, real-time subscriptions, and Row Level Security in Golazo and ConnectHub." },
              { label: "Agora RTC", desc: "Real-time video & audio SDK. Powers live trainer-to-user video call sessions inside GetFit with low-latency peer-to-peer streaming." },
            ].map((tag, i) => (
              <motion.div
                key={tag.label}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: [0.45, 0, 0.55, 1], delay: i * 0.18 }}
              >
                <button
                  data-cursor-hover
                  onClick={() => setActiveHeroTag(tag)}
                  onMouseEnter={(e) => setHoveredHeroTag({ tag, rect: e.currentTarget.getBoundingClientRect() })}
                  onMouseLeave={() => setHoveredHeroTag(null)}
                  className="rounded-full border border-[#8a0303]/30 bg-[#8a0303]/5 px-3 py-1 font-mono text-xs text-[#8a0303] transition-all duration-200 hover:border-[#8a0303] hover:bg-[#8a0303] hover:text-white dark:border-white/30 dark:bg-white/5 dark:text-white/80 dark:hover:border-accent-green dark:hover:bg-accent-green dark:hover:text-[#0b0e13]"
                >
                  {tag.label}
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── PROJECTS ───────────────────────────────────────────
function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const rowOneScrollX = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const rowTwoScrollX = useTransform(scrollYProgress, [0, 1], [0, 200]);

  const [scrollDir, setScrollDir] = useState<1 | -1>(1);
  const scrollDirRef = useRef<1 | -1>(1);
  const lastScrollY = useRef(0);

  const rowOneDragX = useMotionValue(0);
  const rowTwoDragX = useMotionValue(0);

  const rowOneIsDragging = useRef(false);
  const rowTwoIsDragging = useRef(false);
  const rowOneStartX = useRef(0);
  const rowTwoStartX = useRef(0);
  const rowOneStartDrag = useRef(0);
  const rowTwoStartDrag = useRef(0);
  const rowOneAnim = useRef<ReturnType<typeof animate> | null>(null);
  const rowTwoAnim = useRef<ReturnType<typeof animate> | null>(null);

  const half = Math.ceil(projects.length / 2);
  const rowOne = projects.slice(0, half);
  const rowTwo = projects.slice(half);

  const CARD_W = 288 + 40; // card width + gap
  const rowOneWidth = rowOne.length * CARD_W;
  const rowTwoWidth = rowTwo.length * CARD_W;

  // Triple the rows so there's always content on both sides
  const rowOneLoop = [...rowOne, ...rowOne, ...rowOne];
  const rowTwoLoop = [...rowTwo, ...rowTwo, ...rowTwo];

  const rowOneAutoX = useMotionValue(-rowOneWidth); // start at second copy
  const rowTwoAutoX = useMotionValue(-rowTwoWidth);

  useEffect(() => {
    const runRowOne = (dir: 1 | -1) => {
      rowOneAnim.current?.stop();
      const current = rowOneAutoX.get();
      const target = dir === 1 ? -rowOneWidth * 2 : 0;
      const dist = Math.abs(target - current) || rowOneWidth;
      rowOneAnim.current = animate(rowOneAutoX, target, {
        duration: 30 * (dist / rowOneWidth),
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop",
        onRepeat: () => rowOneAutoX.set(-rowOneWidth),
      });
    };

    const runRowTwo = (dir: 1 | -1) => {
      rowTwoAnim.current?.stop();
      const current = rowTwoAutoX.get();
      const target = dir === 1 ? 0 : -rowTwoWidth * 2;
      const dist = Math.abs(target - current) || rowTwoWidth;
      rowTwoAnim.current = animate(rowTwoAutoX, target, {
        duration: 30 * (dist / rowTwoWidth),
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop",
        onRepeat: () => rowTwoAutoX.set(-rowTwoWidth),
      });
    };

    // Initial direction: down (1) → row1 left, row2 right
    runRowOne(1);
    runRowTwo(1);

    const handleScroll = () => {
      const current = window.scrollY;
      const delta = current - lastScrollY.current;
      lastScrollY.current = current;
      if (Math.abs(delta) < 2) return; // ignore noise
      const newDir: 1 | -1 = delta > 0 ? 1 : -1;
      if (newDir === scrollDirRef.current) return; // no direction change
      scrollDirRef.current = newDir;
      setScrollDir(newDir);
      runRowOne(newDir);
      runRowTwo(newDir);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (rowOneIsDragging.current) {
        const delta = e.clientX - rowOneStartX.current;
        rowOneDragX.set(rowOneStartDrag.current + delta);
      }
      if (rowTwoIsDragging.current) {
        const delta = e.clientX - rowTwoStartX.current;
        rowTwoDragX.set(rowTwoStartDrag.current + delta);
      }
    };

    const handleMouseUp = () => {
      if (rowOneIsDragging.current) {
        rowOneIsDragging.current = false;
        rowOneAnim.current?.play();
      }
      if (rowTwoIsDragging.current) {
        rowTwoIsDragging.current = false;
        rowTwoAnim.current?.play();
      }
      document.body.style.userSelect = "";
    };

    const pause = () => { rowOneAnim.current?.pause(); rowTwoAnim.current?.pause(); };
    const resume = () => { rowOneAnim.current?.play(); rowTwoAnim.current?.play(); };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("portal-open", pause);
    document.addEventListener("portal-close", resume);

    return () => {
      rowOneAnim.current?.stop();
      rowTwoAnim.current?.stop();
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("portal-open", pause);
      document.removeEventListener("portal-close", resume);
    };
  }, [rowOneWidth, rowTwoWidth]);

  const rowOneX = useTransform(
    [rowOneScrollX, rowOneAutoX, rowOneDragX],
    ([s, a, d]: number[]) => s + a + d
  );
  const rowTwoX = useTransform(
    [rowTwoScrollX, rowTwoAutoX, rowTwoDragX],
    ([s, a, d]: number[]) => s + a + d
  );

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative bg-[#F5F7F6] py-28 dark:bg-ink overflow-hidden"
    >
      {/* Header — padded normally */}
      <div className="px-6 sm:px-10 lg:px-25 mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-3 font-mono text-xs text-[#8a0303] dark:text-accent-green">
            SELECTED WORK
          </div>
          <h2 className="font-display text-3xl font-bold text-[#0b0e13] dark:text-text sm:text-4xl">
            Things I&rsquo;ve built
          </h2>
        </motion.div>
      </div>

      {/* Row 1 — full bleed, left scroll */}
      <div className="w-full overflow-visible">
        <motion.div
          style={{ x: rowOneX }}
          className="flex items-center gap-10 py-6 cursor-grab active:cursor-grabbing will-change-transform"
          onMouseDown={(e) => {
            rowOneIsDragging.current = true;
            rowOneStartX.current = e.clientX;
            rowOneStartDrag.current = rowOneDragX.get();
            rowOneAnim.current?.pause();
            document.body.style.userSelect = "none";
          }}
        >
          {rowOneLoop.map((project, i) => (
            <ProjectCard
              key={`r1-${i}`}
              project={project}
              index={i % rowOne.length}
              total={rowOne.length}
              scrollDir={scrollDir}
            />
          ))}
        </motion.div>
      </div>

      {/* Row 2 — full bleed, right scroll */}
      <div className="w-full overflow-visible">
        <motion.div
          style={{ x: rowTwoX }}
          className="flex items-center gap-10 py-6 cursor-grab active:cursor-grabbing will-change-transform"
          onMouseDown={(e) => {
            rowTwoIsDragging.current = true;
            rowTwoStartX.current = e.clientX;
            rowTwoStartDrag.current = rowTwoDragX.get();
            rowTwoAnim.current?.pause();
            document.body.style.userSelect = "none";
          }}
        >
          {rowTwoLoop.map((project, i) => (
            <ProjectCard
              key={`r2-${i}`}
              project={project}
              index={i % rowTwo.length}
              total={rowTwo.length}
              scrollDir={scrollDir * -1 as 1 | -1}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}


// ─── ABOUT ──────────────────────────────────────────────
const highlights = [
  {
    title: "Cross-platform by default",
    desc: "One product, shipped to Flutter, React Native, and web — sharing logic instead of rebuilding it three times.",
  },
  {
    title: "Real-time systems",
    desc: "Agora video calls, Socket.io feeds, Supabase realtime — apps where data has to stay in sync live, not on refresh.",
  },
  {
    title: "End-to-end ownership",
    desc: "UI, REST APIs, database schema, auth, deployment — I take a project from a blank repo to a live URL.",
  },
  {
    title: "Production-ready, not prototypes",
    desc: "Golazo is live on Google Play with real users. ConnectHub is deployed and running. I ship things people actually use.",
  },
];

const BADGE_ICONS = {
  experience: (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="6" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 6V5a3 3 0 0 1 6 0v1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M10 11v2M9 12h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  projects: (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  playstore: (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 3.5 15.5 10 4 16.5V3.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  realtime: (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 3v2M10 15v2M3 10h2M15 10h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5.5 5.5l1.4 1.4M13.1 13.1l1.4 1.4M14.5 5.5l-1.4 1.4M6.9 13.1l-1.4 1.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  stack: (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 10l8-5 8 5-8 5-8-5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M2 13l8 5 8-5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
} as const;

function OrbitBadge({
  orbitAngle,
  baseAngle,
  radius,
  iconKey,
  label,
  sub,
}: {
  orbitAngle: ReturnType<typeof useMotionValue<number>>;
  baseAngle: number;
  radius: number;
  iconKey: keyof typeof BADGE_ICONS;
  label: string;
  sub: string;
}) {
  const left = useTransform(orbitAngle, (v) => {
    const rad = ((v + baseAngle) * Math.PI) / 180;
    return `${50 + radius * Math.cos(rad)}%`;
  });
  const top = useTransform(orbitAngle, (v) => {
    const rad = ((v + baseAngle) * Math.PI) / 180;
    return `${50 + radius * Math.sin(rad)}%`;
  });

  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
      style={{ left, top }}
    >
      <div
        className={[
          "flex items-center gap-2.5 rounded-2xl border px-3.5 py-2.5 shadow-lg backdrop-blur-sm",
          "border-[#8a0303]/25 bg-white shadow-[#8a0303]/10",
          "dark:border-accent-green/20 dark:bg-panel/90 dark:shadow-accent-green/10",
        ].join(" ")}
      >
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#8a0303]/10 text-[#8a0303] dark:bg-accent-green/10 dark:text-accent-green"
        >
          {BADGE_ICONS[iconKey]}
        </span>
        <div>
          <div className="font-display text-[13px] font-bold leading-tight text-[#8a0303] dark:text-accent-green">
            {label}
          </div>
          <div className="text-[10px] font-medium tracking-wide text-[#6b7280] dark:text-text-dim">
            {sub}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const TOUR_STEPS = [
  {
    id: "hills",
    x: "75%",
    y: "55%",
    title: "Margalla Hills",
    body: "The green ridgeline stretching across the horizon — Margalla Hills, the foothills of the Himalayas that frame Islamabad's northern edge. A 15-minute drive from my desk.",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 16l5-8 4 5 3-4 4 7H2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "skyline",
    x: "67%",
    y: "32%",
    title: "Centaurus, Islamabad",
    body: "The trio of towers cutting through the haze — Centaurus, Islamabad's landmark mixed-use skyscraper complex in F-8. One of the few high-rises that breaks the city's low-rise grid.",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 17V9l4-4 4 4V7l3-3 3 3v10H3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "person",
    x: "33%",
    y: "48%",
    title: "Ahmad Abdullah",
    body: "That's me — full-stack developer, currently building production apps at Mehdi Technologies in Islamabad. Shot from a hiking trail above the city.",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 17c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
];

function PhotoTour() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [toured, setToured] = useState(false);
  const soundRef = useRef<HTMLAudioElement | null>(null);

  function playSound() {
    if (!soundRef.current) return;
    soundRef.current.currentTime = 0;
    soundRef.current.play().catch(() => {});
  }

  function handleOpen() {
    soundRef.current = new Audio("/song/location-pointing.mp3");
    soundRef.current.loop = true;
    soundRef.current.play().catch(() => {});
    setOpen(true);
    setTimeout(() => setActive(0), 400);
  }

  function handleClose() {
    if (soundRef.current) { soundRef.current.pause(); soundRef.current.currentTime = 0; }
    setActive(null);
    setOpen(false);
    setToured(false);
  }

  function goTo(i: number) {
    setActive(i);
  }

  const step = active !== null ? TOUR_STEPS[active] : null;

  return (
    <>
      {/* ── thumbnail card ── */}
      <motion.div
        className="relative aspect-[4/5] w-[90%] overflow-hidden rounded-2xl border border-gray-200 shadow-xl dark:border-line cursor-pointer"
        style={{ transformPerspective: 900, transformStyle: "preserve-3d" }}
        whileHover={{
          rotateY: 360,
          scale: 1.03,
          boxShadow: "0 25px 50px rgba(138,3,3,0.25)",
        }}
        transition={{
          rotateY: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
          scale: { duration: 0.4, ease: "easeOut" },
          boxShadow: { duration: 0.4 },
        }}
        data-cursor-hover
        onClick={handleOpen}
      >
        <img
          src="/images/About-Photo.jpeg"
          alt="Ahmad Abdullah"
          className="h-full w-full object-cover"
          style={{ objectPosition: "50% 30%" }}
        />

        {/* hint badge */}
        <AnimatePresence>
          {!toured && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ delay: 0.6 }}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full border border-[#8a0303]/30 bg-white/90 px-3 py-1.5 shadow-md backdrop-blur-sm dark:bg-panel/90"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8a0303] opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#8a0303]" />
              </span>
              <span className="font-mono text-[10px] text-[#8a0303] dark:text-accent-green">
                Click to explore
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── fullscreen overlay portal ── */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
              onClick={handleClose}
            >
              <motion.div
                initial={{ scale: 0.08, opacity: 0, borderRadius: "24px" }}
                animate={{ scale: 1, opacity: 1, borderRadius: "20px" }}
                exit={{ scale: 0.08, opacity: 0, borderRadius: "24px" }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-2xl overflow-hidden shadow-2xl"
                style={{ maxHeight: "90vh", aspectRatio: "4/5" }}
              >
                {/* photo */}
                <img
                  src="/images/About-Photo.jpeg"
                  alt="Ahmad Abdullah"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: "50% 30%" }}
                />

                {/* top gradient */}
                <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/60 to-transparent" />
                {/* bottom gradient */}
                <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 to-transparent" />

                {/* close button */}
                <button
                  data-cursor-hover
                  onClick={handleClose}
                  className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                {/* top label */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8a0303] opacity-70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#8a0303]" />
                  </span>
                  <span className="font-mono text-[11px] font-medium text-white/80 tracking-wide">
                    INTERACTIVE TOUR
                  </span>
                </div>

                {/* dim overlay when step active */}
                <AnimatePresence>
                  {active !== null && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/20"
                    />
                  )}
                </AnimatePresence>

                {/* numbered dot markers with animated arrows */}
                <AnimatePresence>
                  {active !== null && TOUR_STEPS.map((s, i) => (
                    <motion.button
                      key={s.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      data-cursor-hover
onClick={(e) => { e.stopPropagation(); goTo(i); playSound(); }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none z-10"
                      style={{ left: s.x, top: s.y }}
                    >
                      <div className="flex items-center gap-0">
                        {/* animated arrow chain pointing left */}
                        <div className="flex items-center mr-1">
                          {[0, 1, 2].map((j) => (
                            <motion.svg
                              key={j}
                              viewBox="0 0 16 16"
                              fill="none"
                              className="h-4 w-4 -ml-1.5"
                              xmlns="http://www.w3.org/2000/svg"
                              animate={{ opacity: [0, 1, 0], x: [-4, 0, -4] }}
                              transition={{
                                duration: 1.1,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: j * 0.18,
                              }}
                            >
                              <path
                                d="M10 3L5 8l5 5"
                                stroke={i === active ? "#8a0303" : "rgba(255,255,255,0.85)"}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </motion.svg>
                          ))}
                        </div>

                        {/* dot */}
                        <span className="relative flex h-7 w-7 items-center justify-center">
                          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-40 ${i === active ? "bg-[#8a0303]" : "bg-white"}`} />
                          <span className={`relative inline-flex h-6 w-6 items-center justify-center rounded-full border-2 font-mono text-[10px] font-bold shadow-lg transition-all ${
                            i === active
                              ? "border-[#8a0303] bg-[#8a0303] text-white scale-125"
                              : "border-white/80 bg-white/20 text-white backdrop-blur-sm"
                          }`}>
                            {i + 1}
                          </span>
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </AnimatePresence>

                {/* tooltip card */}
                <AnimatePresence mode="wait">
                  {step && (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: 16, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute bottom-5 left-4 right-4 z-20 rounded-2xl border border-white/10 bg-black/70 p-4 shadow-2xl backdrop-blur-xl"
                    >
                      {/* header */}
                      <div className="mb-2.5 flex items-center gap-2.5">
                        {step.id === "person" ? (
                          <img
                            src="/images/profile.jpeg"
                            alt="Ahmad Abdullah"
                            className="h-7 w-7 shrink-0 rounded-full border border-white/30 object-cover"
                          />
                        ) : (
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#8a0303]/90 text-white">
                            {step.icon}
                          </span>
                        )}
                        <span className="font-display text-[14px] font-bold text-white">
                          {step.title}
                        </span>
                        <span className="ml-auto font-mono text-[10px] text-white/40">
                          {active! + 1} / {TOUR_STEPS.length}
                        </span>
                      </div>

                      {/* body */}
                      <p className="mb-3.5 text-[12px] leading-relaxed text-white/70">
                        {step.body}
                      </p>

                      {/* nav row */}
                      <div className="flex items-center gap-2">
                        {/* progress dots */}
                        <div className="flex gap-1.5">
                          {TOUR_STEPS.map((_, i) => (
                            <button
                              data-cursor-hover
                              key={i}
                              onClick={(e) => { e.stopPropagation(); goTo(i); }}
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                i === active
                                  ? "w-5 bg-[#8a0303]"
                                  : "w-1.5 bg-white/25 hover:bg-white/50"
                              }`}
                            />
                          ))}
                        </div>

                        <div className="ml-auto flex gap-2">
                          {active! > 0 && (
                            <button
                              data-cursor-hover
                              onClick={(e) => { e.stopPropagation(); goTo(active! - 1); playSound(); }}
                              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white/70 transition-colors hover:bg-white/20"
                            >
                              <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
                                <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>
                          )}
                            <button
                              data-cursor-hover
                              onClick={(e) => { e.stopPropagation(); goTo((active! + 1) % TOUR_STEPS.length); playSound(); }}
                              className="flex h-8 items-center gap-1.5 rounded-xl bg-[#8a0303] px-4 font-mono text-[11px] font-medium text-white transition-colors hover:bg-[#6e0202]"
                            >
                              {active! < TOUR_STEPS.length - 1 ? "Next" : "Again ↺"}
                              <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3">
                                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

function OrbitPhoto() {
  const orbitAngle = useMotionValue(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useAnimationFrame((t) => {
    orbitAngle.set((t / 1000) * (360 / 22));
  });

  return (
    <div className="relative mx-auto flex aspect-square w-full max-w-2xl items-center justify-center">
      <div className="absolute inset-[8%] rounded-full bg-[#8a0303]/10 blur-3xl dark:bg-accent-green/10" />

      <motion.div
        className="absolute rounded-full border border-[#8a0303]/25 dark:border-accent-green/25"
        style={{ inset: "-30%" }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0.15, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full border border-[#8a0303]/25 dark:border-accent-green/25"
        style={{ inset: "-20%" }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0.15, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute rounded-full border border-[#8a0303]/25 dark:border-accent-green/25"
        style={{ inset: "-10%" }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0.15, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {mounted && (
        <>
          <OrbitBadge orbitAngle={orbitAngle} baseAngle={0}   radius={75} iconKey="experience" label="1+ Years"    sub="Production Experience" />
          <OrbitBadge orbitAngle={orbitAngle} baseAngle={72}  radius={75} iconKey="projects"   label="20+ Apps"    sub="Shipped to Production" />
          <OrbitBadge orbitAngle={orbitAngle} baseAngle={144} radius={75} iconKey="playstore"  label="Google Play" sub="Live with Real Users"  />
          <OrbitBadge orbitAngle={orbitAngle} baseAngle={216} radius={75} iconKey="realtime"   label="Real-Time"   sub="Video · Sockets · RTC" />
          <OrbitBadge orbitAngle={orbitAngle} baseAngle={288} radius={75} iconKey="stack"      label="Full-Stack"  sub="Mobile · Web · API"    />
        </>
      )}

      <PhotoTour />
    </div>
  );
}

const bioCards: never[] = [];

const highlightIcons = [
  <svg key="cross" viewBox="0 0 20 20" fill="none" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg"><path d="M3 10h14M10 3v14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  <svg key="rt" viewBox="0 0 20 20" fill="none" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.6"/><path d="M10 3v2M10 15v2M3 10h2M15 10h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  <svg key="e2e" viewBox="0 0 20 20" fill="none" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg"><path d="M4 3.5 15.5 10 4 16.5V3.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>,
  <svg key="prod" viewBox="0 0 20 20" fill="none" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg"><path d="M3 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Z" stroke="currentColor" strokeWidth="1.6"/><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
];

function SkillChips() {
  const [activeSkill, setActiveSkill] = useState<typeof skills[0] | null>(null);

  return (
    <>
      <div className="mt-10 flex flex-wrap justify-center gap-2 px-6">
        {skills.map((skill, i) => (
          <motion.div
            key={skill.label}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: [0.45, 0, 0.55, 1], delay: i * 0.14 }}
            className="group relative"
          >
            {/* chip */}
            <button
              data-cursor-hover
              onClick={() => setActiveSkill(skill)}
              className="rounded-full border border-gray-200 bg-white px-3 py-1.5 font-mono text-[11px] text-[#0b0e13] transition-all duration-200 hover:border-[#8a0303] hover:bg-[#8a0303] hover:text-white hover:shadow-sm dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white dark:hover:border-accent-green dark:hover:bg-accent-green dark:hover:text-[#0b0e13]"
            >
              {skill.label}
            </button>

            {/* desktop tooltip */}
            <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2.5 w-56 -translate-x-1/2 scale-95 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 hidden sm:block">
              <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-xl dark:border-line dark:bg-panel">
                <div className="mb-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#8a0303] dark:text-accent-green">
                  {skill.label}
                </div>
                <p className="text-[11px] leading-relaxed text-[#6b7280] dark:text-text-muted">
                  {skill.desc}
                </p>
                {/* arrow */}
                <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-200 dark:border-t-line" />
                <div className="absolute left-1/2 top-full mt-[-1px] -translate-x-1/2 border-4 border-transparent border-t-white dark:border-t-panel" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* mobile modal */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {activeSkill && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              onClick={() => setActiveSkill(null)}
            >
              <motion.div
                initial={{ y: 60, opacity: 0, scale: 0.96 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 60, opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-white/[0.08] dark:bg-[#0f1117]/90 dark:backdrop-blur-xl"
              >
                <div className="mb-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#8a0303] dark:text-accent-green">
                  {activeSkill.label}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[#6b7280] dark:text-text-muted">
                  {activeSkill.desc}
                </p>
                <button
                  data-cursor-hover
                  onClick={() => setActiveSkill(null)}
                  className="mt-5 w-full rounded-xl bg-[#0b0e13] py-2.5 font-mono text-[11px] font-medium text-white transition-colors hover:bg-[#8a0303] dark:bg-white/[0.06] dark:border dark:border-white/[0.08] dark:text-text dark:hover:border-accent-green/30 dark:hover:bg-white/[0.10]"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-gray-50 py-28 dark:bg-ink"
    >
      <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        {/* ── Left: bio cards ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="pl-6 sm:pl-10 lg:pl-20 xl:pl-32 lg:pr-10"
        >
          <div className="mb-3 font-mono text-xs text-[#8a0303] dark:text-accent-green">ABOUT</div>
          <h2 className="font-display mb-8 text-3xl font-bold leading-tight text-[#0b0e13] dark:text-text sm:text-4xl">
            Full-Stack Website & Mobile App Developer
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="text-sm leading-relaxed text-[#6b7280] dark:text-text-muted"
          >
            I&rsquo;m Ahmad Abdullah, a full-stack developer at Mehdi Technologies in Islamabad. I build cross-platform mobile apps with Flutter and React Native, web frontends with Next.js, and backend APIs with Node.js and FastAPI — wiring them together with real-time features like live video calls, push notifications, and payments. I take projects from a blank repo to a live, deployed product and care about clean architecture, proper auth, and code that doesn&rsquo;t need rewriting six months later.
          </motion.p>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {highlights.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:border-[#8a0303]/60 hover:shadow-md dark:border-white/[0.08] dark:bg-white/[0.04] dark:backdrop-blur-sm dark:hover:border-accent-green/40 dark:hover:bg-white/[0.07]"
              >
                {/* fill layer — expands from top-left corner to full card */}
                <div className="absolute inset-0 origin-top-left scale-0 rounded-2xl bg-gradient-to-br from-[#8a0303]/12 via-[#8a0303]/6 to-transparent transition-transform duration-700 ease-out group-hover:scale-100 dark:from-accent-green/10 dark:via-accent-green/5" />
                {/* top accent line — draws across first */}
                <div className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 rounded-t-2xl bg-gradient-to-r from-[#8a0303] via-[#8a0303]/70 to-[#8a0303]/20 transition-transform duration-400 ease-out group-hover:scale-x-100 dark:from-accent-green dark:via-accent-green/70 dark:to-accent-green/20" />
                {/* left accent line — draws down with slight delay */}
                <div className="absolute inset-y-0 left-0 w-[2px] origin-top scale-y-0 rounded-l-2xl bg-gradient-to-b from-[#8a0303] via-[#8a0303]/50 to-[#8a0303]/10 transition-transform duration-500 delay-100 ease-out group-hover:scale-y-100 dark:from-accent-green dark:via-accent-green/50 dark:to-accent-green/10" />
                {/* right accent line — draws down with more delay */}
                <div className="absolute inset-y-0 right-0 w-[2px] origin-top scale-y-0 rounded-r-2xl bg-gradient-to-b from-[#8a0303]/60 via-[#8a0303]/30 to-transparent transition-transform duration-500 delay-200 ease-out group-hover:scale-y-100 dark:from-accent-green/60 dark:via-accent-green/30" />
                {/* bottom accent line — draws last, completing the frame */}
                <div className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 rounded-b-2xl bg-gradient-to-r from-[#8a0303]/40 via-[#8a0303]/20 to-transparent transition-transform duration-500 delay-300 ease-out group-hover:scale-x-100 dark:from-accent-green/40 dark:via-accent-green/20" />
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-2xl"
                  style={{ background: "radial-gradient(circle at 0% 0%, rgba(138,3,3,0.06) 0%, transparent 70%)" }} />
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-xl bg-[#8a0303]/10 text-[#8a0303] dark:bg-accent-green/10 dark:text-accent-green">
                  {highlightIcons[i]}
                </div>
                <h3 className="mb-1 font-display text-[13px] font-bold text-[#0b0e13] dark:text-text">
                  {item.title}
                </h3>
                <p className="text-[11px] leading-relaxed text-[#6b7280] dark:text-text-muted">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {[
              {
                icon: <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5 shrink-0" xmlns="http://www.w3.org/2000/svg"><path d="M10 2a6 6 0 0 1 6 6c0 4-6 10-6 10S4 12 4 8a6 6 0 0 1 6-6Z" stroke="currentColor" strokeWidth="1.5"/><circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/></svg>,
                label: "Islamabad, Pakistan",
              },
              {
                icon: <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5 shrink-0" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="6" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M7 6V5a3 3 0 0 1 6 0v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
                label: "Available for freelance",
              },
              {
                icon: <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5 shrink-0" xmlns="http://www.w3.org/2000/svg"><path d="M2 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5Z" stroke="currentColor" strokeWidth="1.5"/><path d="M2 8h16" stroke="currentColor" strokeWidth="1.5"/><path d="M8 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
                label: "English · Urdu",
              },
            ].map(({ icon, label }) => (
              <span key={label} className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 font-mono text-[11px] text-[#6b7280] transition-all duration-200 hover:border-[#8a0303]/40 hover:text-[#8a0303] hover:shadow-sm dark:border-white/[0.15] dark:bg-white/[0.06] dark:text-white dark:hover:border-accent-green/30 dark:hover:text-accent-green [&>svg]:stroke-current">
                {icon}
                {label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ── Right: orbit photo ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-md pr-6 sm:pr-10 lg:pr-16 xl:pr-20"
        >
          <OrbitPhoto />
        </motion.div>
      </div>

      {/* ── Highlights grid ──
      <div className="mt-20 px-6 sm:px-10 lg:px-24 xl:px-32">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#8a0303]/40 hover:shadow-lg dark:border-white/[0.08] dark:bg-white/[0.04] dark:backdrop-blur-sm dark:hover:border-accent-green/30 dark:hover:bg-white/[0.07]"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-2xl"
                style={{ background: "radial-gradient(circle at 50% 0%, rgba(138,3,3,0.07) 0%, transparent 70%)" }} />
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#8a0303]/10 text-[#8a0303] dark:bg-accent-green/10 dark:text-accent-green">
                {highlightIcons[i]}
              </div>
              <h3 className="mb-2 font-display text-[15px] font-bold text-[#0b0e13] dark:text-text">
                {item.title}
              </h3>
              <p className="text-[12px] leading-relaxed text-[#6b7280] dark:text-text-muted">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div> */}

      {/* ── Skills chips ── */}
      <SkillChips />
    </section>
  );
}


// ─── SKILLS ─────────────────────────────────────────────
const SKILL_ICON_URL: Record<string, string> = {
  "Flutter": "https://www.vectorlogo.zone/logos/flutterio/flutterio-icon.svg",
  "Dart": "https://www.vectorlogo.zone/logos/dartlang/dartlang-icon.svg",
  "React Native": "https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg",
  "Expo": "https://www.vectorlogo.zone/logos/expoio/expoio-icon.svg",
  "React.js": "https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg",
  "Next.js": "https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg",
  "TypeScript": "https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg",
  "JavaScript (ES6+)": "https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg",
  "Tailwind CSS": "https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original.svg",
  "HTML5": "https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg",
  "CSS3": "https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg",
  "Node.js": "https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg",
  "Express.js": "https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original.svg",
  "Python": "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg",
  "FastAPI": "https://raw.githubusercontent.com/devicons/devicon/master/icons/fastapi/fastapi-original.svg",
  "REST APIs": "https://img.icons8.com/color/48/api-settings.png",
  "Socket.io": "https://cdn.simpleicons.org/socketdotio/010101",
  "JWT Auth": "https://cdn.simpleicons.org/jsonwebtokens/000000",
  "Supabase (PostgreSQL)": "https://cdn.simpleicons.org/supabase/3ECF8E",
  "MongoDB": "https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg",
  "MySQL": "https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original.svg",
  "Firebase Realtime DB": "https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg",
  "Firestore": "https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg",
  "SQLite": "https://www.vectorlogo.zone/logos/sqlite/sqlite-icon.svg",
  "Firebase Auth": "https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg",
  "Supabase RLS": "https://cdn.simpleicons.org/supabase/3ECF8E",
  "Cloud Functions": "https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg",
  "FCM": "https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg",
  "Vercel": "https://raw.githubusercontent.com/devicons/devicon/master/icons/vercel/vercel-original.svg",
  "Railway": "https://cdn.simpleicons.org/railway/0B0D0E",
  "AWS": "https://img.icons8.com/color/96/amazon-web-services.png",
  "Aiven": "https://avatars.githubusercontent.com/u/29717922?s=200&v=4",
  "Git": "https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original.svg",
  "GitHub": "https://www.vectorlogo.zone/logos/github/github-icon.svg",
  "VS Code": "https://www.vectorlogo.zone/logos/visualstudio_code/visualstudio_code-icon.svg",
  "Postman": "https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg",
  "Figma": "https://www.vectorlogo.zone/logos/figma/figma-icon.svg",
  "Framer": "https://cdn.simpleicons.org/framer/0055FF",
  "Android Studio": "https://raw.githubusercontent.com/devicons/devicon/master/icons/androidstudio/androidstudio-original.svg",
};

const SKILL_LEVEL: Record<string, "Advanced" | "Proficient" | "Familiar"> = {
  "Flutter": "Advanced",
  "Dart": "Advanced",
  "React Native": "Advanced",
  "Expo": "Proficient",
  "React.js": "Advanced",
  "Next.js": "Advanced",
  "TypeScript": "Proficient",
  "JavaScript (ES6+)": "Advanced",
  "Tailwind CSS": "Advanced",
  "HTML5": "Advanced",
  "CSS3": "Advanced",
  "Node.js": "Advanced",
  "Express.js": "Advanced",
  "Python": "Proficient",
  "FastAPI": "Proficient",
  "REST APIs": "Advanced",
  "Socket.io": "Proficient",
  "JWT Auth": "Proficient",
  "Supabase (PostgreSQL)": "Advanced",
  "MongoDB": "Proficient",
  "MySQL": "Proficient",
  "Firebase Realtime DB": "Proficient",
  "Firestore": "Proficient",
  "SQLite": "Familiar",
  "Firebase Auth": "Proficient",
  "Supabase RLS": "Proficient",
  "Cloud Functions": "Familiar",
  "FCM": "Proficient",
  "Vercel": "Proficient",
  "Railway": "Proficient",
  "AWS": "Familiar",
  "Aiven": "Familiar",
  "Git": "Advanced",
  "GitHub": "Advanced",
  "VS Code": "Advanced",
  "Postman": "Proficient",
  "Figma": "Proficient",
  "Framer": "Proficient",
  "Android Studio": "Proficient",
};

const SKILL_INFO: Record<string, string> = {
  "Flutter": "Google's UI toolkit for building natively compiled apps for mobile, web, and desktop from a single Dart codebase.",
  "Dart": "The language behind Flutter — statically typed, compiled, and optimized for building fast UI.",
  "React Native": "Framework for building native mobile apps using React and JavaScript/TypeScript.",
  "Expo": "Toolchain built around React Native that simplifies builds, OTA updates, and native APIs.",
  "React.js": "JavaScript library for building component-based, declarative user interfaces.",
  "Next.js": "React framework with server-side rendering, routing, and API routes built in.",
  "TypeScript": "Typed superset of JavaScript that catches errors at compile time.",
  "JavaScript (ES6+)": "Core scripting language of the web, using modern ES6+ syntax and features.",
  "Tailwind CSS": "Utility-first CSS framework for building custom designs without leaving your markup.",
  "HTML5": "Markup language that structures content on the web.",
  "CSS3": "Stylesheet language used to style and lay out HTML content.",
  "Node.js": "JavaScript runtime for building fast, scalable backend services and APIs.",
  "Express.js": "Minimal, unopinionated web framework for Node.js used to build REST APIs.",
  "Python": "General-purpose language used here for backend services, scripting, and automation.",
  "FastAPI": "High-performance Python framework for building APIs with automatic docs and async support.",
  "REST APIs": "Architectural style for designing networked applications using standard HTTP methods.",
  "Socket.io": "Library enabling real-time, bidirectional communication between client and server.",
  "JWT Auth": "Token-based authentication standard used to securely verify user identity across requests.",
  "Supabase (PostgreSQL)": "Open-source Firebase alternative built on PostgreSQL with auth and realtime features.",
  "MongoDB": "NoSQL document database used for flexible, schema-less data storage.",
  "MySQL": "Popular relational database used for structured, transactional data.",
  "Firebase Realtime DB": "Cloud-hosted NoSQL database that syncs data in real time across clients.",
  "Firestore": "Firebase's flexible, scalable NoSQL document database.",
  "SQLite": "Lightweight, file-based relational database often used for local storage.",
  "Firebase Auth": "Managed authentication service supporting email, social, and phone sign-in.",
  "Supabase RLS": "Row Level Security — database-level rules that control who can read or write specific rows.",
  "Cloud Functions": "Serverless functions that run backend code in response to events.",
  "FCM": "Firebase Cloud Messaging — service for sending push notifications across platforms.",
  "Vercel": "Cloud platform for deploying frontend apps and serverless functions.",
  "Railway": "Cloud platform for deploying and hosting backend services and databases.",
  "AWS": "Amazon Web Services — cloud infrastructure used for hosting and deployment.",
  "Aiven": "Managed cloud service for databases and data infrastructure.",
  "Git": "Distributed version control system for tracking code changes.",
  "GitHub": "Platform for hosting Git repositories and collaborating on code.",
  "VS Code": "Lightweight, extensible code editor used for day-to-day development.",
  "Postman": "Tool for building, testing, and documenting APIs.",
  "Figma": "Collaborative design tool used for UI/UX mockups and prototypes.",
  "Framer": "Design and prototyping tool used to build interactive, animated interfaces.",
  "Android Studio": "Official IDE for building native Android applications.",
};

const CORE_SKILLS = [
  { label: "Flutter & Mobile", percent: 95 },
  { label: "React / Next.js", percent: 90 },
  { label: "Node.js & APIs", percent: 88 },
  { label: "Databases & Cloud", percent: 85 },
];

const SKILL_CATEGORIES = [
  {
    title: "Mobile",
    skills: ["Flutter", "Dart", "React Native", "Expo"],
  },
  {
    title: "Frontend / Web",
    skills: ["React.js", "Next.js", "TypeScript", "JavaScript (ES6+)", "Tailwind CSS", "HTML5", "CSS3"],
  },
  {
    title: "Backend & APIs",
    skills: ["Node.js", "Express.js", "Python", "FastAPI", "REST APIs", "Socket.io", "JWT Auth"],
  },
  {
    title: "Databases",
    skills: ["Supabase (PostgreSQL)", "MongoDB", "MySQL", "Firebase Realtime DB", "Firestore", "SQLite"],
  },
  {
    title: "Cloud & DevOps",
    skills: ["Firebase Auth", "Supabase RLS", "Cloud Functions", "FCM", "Vercel", "Railway", "AWS", "Aiven"],
  },
  {
    title: "Tools",
    skills: ["Git", "GitHub", "VS Code", "Postman", "Figma", "Framer", "Android Studio"],
  },
];

function SkillIcon({ name }: { name: string }) {
  const url = SKILL_ICON_URL[name];
  if (!url) return null;
  return (
    <img
      src={url}
      alt={name}
      className="h-6 w-6 shrink-0 object-contain"
      loading="lazy"
      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
    />
  );
}

function CircleStat({ label, percent, index }: { label: string; percent: number; index: number }) {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#8a0303]/60 hover:shadow-md dark:border-white/[0.08] dark:bg-white/[0.04] dark:hover:border-accent-green/40 dark:hover:bg-white/[0.07]"
    >
      {/* fill layer — expands from top-left corner to full card, same as About cards */}
      <div className="absolute inset-0 origin-top-left scale-0 rounded-2xl bg-gradient-to-br from-[#8a0303]/12 via-[#8a0303]/6 to-transparent transition-transform duration-700 ease-out group-hover:scale-100 dark:from-accent-green/10 dark:via-accent-green/5" />
      {/* top accent line — draws across first */}
      <div className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 rounded-t-2xl bg-gradient-to-r from-[#8a0303] via-[#8a0303]/70 to-[#8a0303]/20 transition-transform duration-400 ease-out group-hover:scale-x-100 dark:from-accent-green dark:via-accent-green/70 dark:to-accent-green/20" />
      {/* left accent line — draws down with slight delay */}
      <div className="absolute inset-y-0 left-0 w-[2px] origin-top scale-y-0 rounded-l-2xl bg-gradient-to-b from-[#8a0303] via-[#8a0303]/50 to-[#8a0303]/10 transition-transform duration-500 delay-100 ease-out group-hover:scale-y-100 dark:from-accent-green dark:via-accent-green/50 dark:to-accent-green/10" />
      {/* right accent line — draws down with more delay */}
      <div className="absolute inset-y-0 right-0 w-[2px] origin-top scale-y-0 rounded-r-2xl bg-gradient-to-b from-[#8a0303]/60 via-[#8a0303]/30 to-transparent transition-transform duration-500 delay-200 ease-out group-hover:scale-y-100 dark:from-accent-green/60 dark:via-accent-green/30" />
      {/* bottom accent line — draws last, completing the frame */}
      <div className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 rounded-b-2xl bg-gradient-to-r from-[#8a0303]/40 via-[#8a0303]/20 to-transparent transition-transform duration-500 delay-300 ease-out group-hover:scale-x-100 dark:from-accent-green/40 dark:via-accent-green/20" />
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-2xl"
        style={{ background: "radial-gradient(circle at 0% 0%, rgba(138,3,3,0.06) 0%, transparent 70%)" }} />

      <div className="relative z-10 h-28 w-28">
        <svg viewBox="0 0 110 110" className="h-full w-full -rotate-90">
          <circle
            cx="55" cy="55" r={radius} fill="none" strokeWidth="8"
            className="stroke-gray-100 dark:stroke-white/[0.07]"
          />
          <motion.circle
            cx="55" cy="55" r={radius} fill="none" strokeWidth="8" strokeLinecap="round"
            className="stroke-[#8a0303] dark:stroke-accent-green"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: circumference - (percent / 100) * circumference }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.3, delay: index * 0.1 + 0.15, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-display text-xl font-bold text-[#0b0e13] dark:text-text">
          {percent}%
        </div>
      </div>
      <span className="relative z-10 text-center font-mono text-[11px] font-bold uppercase tracking-widest text-[#8a0303] dark:text-accent-green">
        {label}
      </span>
    </motion.div>
  );
}

function SkillRow({ name, index, onSelect }: { name: string; index: number; onSelect: (name: string) => void }) {
  const level = SKILL_LEVEL[name] ?? "Proficient";
  return (
    <motion.button
      type="button"
      data-cursor-hover
      onClick={() => onSelect(name)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className="group/row relative flex w-full items-center justify-between overflow-hidden rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-left hover:bg-[#8a0303] dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:bg-accent-green"
    >
      {/* fill sweeps in from left on hover, and eases back out slowly too */}
      <div className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-[#8a0303] transition-transform duration-700 ease-in-out group-hover/row:scale-x-100 dark:bg-accent-green" />

      <div className="relative z-10 flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 transition-colors duration-300 group-hover/row:bg-white/15 dark:bg-white/[0.05]">
          <SkillIcon name={name} />
        </span>
        <span className="font-mono text-[13px] font-semibold text-[#0b0e13] transition-colors duration-300 group-hover/row:text-white dark:text-white dark:group-hover/row:text-[#0b0e13]">
          {name}
        </span>
      </div>

      <span className="relative z-10 shrink-0 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-[#374151] transition-colors duration-300 group-hover/row:border-white/40 group-hover/row:bg-white/15 group-hover/row:text-white dark:border-white/10 dark:bg-white/5 dark:text-white/60 dark:group-hover/row:border-[#0b0e13]/20 dark:group-hover/row:bg-[#0b0e13]/10 dark:group-hover/row:text-[#0b0e13]">
        {level}
      </span>
    </motion.button>
  );
}

function SkillTabBar({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="relative mb-8 flex flex-wrap items-center justify-center gap-2">
      {SKILL_CATEGORIES.map((cat, i) => {
        const isActive = i === activeIndex;
        return (
          <button
            key={cat.title}
            data-cursor-hover
            onClick={() => onSelect(i)}
            className={`relative flex items-center justify-center rounded-full px-5 py-2.5 font-mono text-[12px] font-semibold uppercase tracking-wide transition-colors duration-300 ${
              isActive
                ? "text-white dark:text-[#0b0e13]"
                : "text-[#6b7280] hover:text-[#8a0303] dark:text-white/60 dark:hover:text-accent-green"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="skillTabPill"
                className="absolute inset-0 rounded-full bg-[#8a0303] dark:bg-accent-green"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10">{cat.title}</span>
          </button>
        );
      })}
    </div>
  );
}

function Skills() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeSkillName, setActiveSkillName] = useState<string | null>(null);
  const activeCat = SKILL_CATEGORIES[activeIndex];

  return (
    <section
      id="skills"
      className="relative bg-[#F5F7F6] px-6 py-28 sm:px-10 lg:px-20 xl:px-32 dark:bg-ink"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mb-14"
      >
        <div className="mb-3 font-mono text-xs text-[#8a0303] dark:text-accent-green">
          SKILLS
        </div>
        <h2 className="font-display text-3xl font-bold text-[#0b0e13] dark:text-text sm:text-4xl">
          What I work with.
        </h2>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#6b7280] dark:text-text-muted">
          The languages, frameworks, and tools I reach for when taking a product from idea to production. Pick a category to see the stack.
        </p>
      </motion.div>

      <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {CORE_SKILLS.map((s, i) => (
          <CircleStat key={s.label} label={s.label} percent={s.percent} index={i} />
        ))}
      </div>

      <div className="mx-auto flex w-full flex-col items-center">
        <SkillTabBar activeIndex={activeIndex} onSelect={setActiveIndex} />

        <div className="relative w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 dark:border-white/[0.08] dark:bg-white/[0.02]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCat.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {activeCat.skills.map((skill, i) => (
                <SkillRow key={skill} name={skill} index={i} onSelect={setActiveSkillName} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {activeSkillName && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              onClick={() => setActiveSkillName(null)}
            >
              <motion.div
                initial={{ y: 60, opacity: 0, scale: 0.96 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 60, opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-white/[0.08] dark:bg-[#0f1117]/90 dark:backdrop-blur-xl"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white p-1.5 shadow-sm">
                    <SkillIcon name={activeSkillName} />
                  </span>
                  <div className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#8a0303] dark:text-accent-green">
                    {activeSkillName}
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-[#6b7280] dark:text-text-muted">
                  {SKILL_INFO[activeSkillName] ?? "No description available yet."}
                </p>
                <button
                  data-cursor-hover
                  onClick={() => setActiveSkillName(null)}
                  className="mt-5 w-full rounded-xl bg-[#0b0e13] py-2.5 font-mono text-[11px] font-medium text-white transition-colors hover:bg-[#8a0303] dark:bg-white/[0.06] dark:border dark:border-white/[0.08] dark:text-text dark:hover:border-accent-green/30 dark:hover:bg-white/[0.10]"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}

// ─── CAREER ─────────────────────────────────────────────
interface CareerProject {
  name: string;
  url?: string;
}

interface CareerItem {
  type: "work";
  role: string;
  org: string;
  period: string;
  desc: string;
  tags: string[];
  projects: CareerProject[];
}

const career: CareerItem[] = [
  {
    type: "work" as const,
    role: "Python & MERN Stack Developer",
    org: "Mehdi Technologies Pvt. Ltd.",
    period: "May 2026 — Present",
    desc: "Building full-stack solutions with Python, React.js, Node.js, Express, and MongoDB for real client projects, alongside cross-platform mobile features.",
    tags: ["Python", "React.js", "Node.js", "Express", "MongoDB"],
    projects: [
      { name: "GetFit AI — user app", url: "https://getfitai-ashen.vercel.app/" },
      { name: "GetFit AI — trainer app", url: "https://getfitai-ashen.vercel.app/" },
      { name: "Golazo — live on Google Play", url: "https://play.google.com/store/apps/details?id=com.golazo" },
      { name: "Station Hub — travel & booking platform", url: "https://github.com/AAbdullahRajput/Station-Hub-Project" },
      { name: "Scan-Chat AI — SaaS chatbot platform", url: "https://scan-chat.ai" },
      { name: "AI Tools Hub — Framer AI tools directory" },
    ],
  },
  {
    type: "work" as const,
    role: "Full Stack Development Intern",
    org: "CodeAlpha",
    period: "May 2026",
    desc: "Full-stack development internship building real-time, production-style web applications.",
    tags: ["React", "Vite", "Node.js", "Socket.io", "MongoDB Atlas", "AWS"],
    projects: [
      { name: "ConnectHub — real-time social platform", url: "https://github.com/AAbdullahRajput/Connect-Hub" },
      { name: "ProjectSync — real-time Trello-style PM app", url: "https://project-sync-alpha.vercel.app" },
      { name: "E-Commerce Fullstack — store with admin panel", url: "https://github.com/AAbdullahRajput/E-Commerce-Fullstack-Design" },
    ],
  },
  {
    type: "work" as const,
    role: "Independent Full Stack Developer",
    org: "Self-Directed",
    period: "Feb 2025 — Apr 2026",
    desc: "Designed, built, and deployed full-stack Flutter, web, mobile, and desktop apps end to end — UI, REST APIs, auth, and cloud deployment.",
    tags: ["Flutter", "React Native", "Java", "Python", "C#"],
    projects: [
      { name: "The Royal Restaurant — React restaurant website", url: "https://github.com/AAbdullahRajput/-The-Royal-Restaurant-Website-Using-React-" },
      { name: "FitLife — AI fitness app with Gemini Vision", url: "https://github.com/AAbdullahRajput/FitLife" },
      { name: "Campus Entry Guide — face recognition attendance app", url: "https://github.com/AAbdullahRajput/Campus_Entry_Guide" },
      { name: "SabziDukan — role-based shop management system", url: "https://github.com/AAbdullahRajput/SabziDukan" },
      { name: "Mighty Meals — Java restaurant management system", url: "https://github.com/AAbdullahRajput/Mighty-Meals" },
      { name: "LexiParse Tools — Python lexical analyzer", url: "https://github.com/AAbdullahRajput/LexiParse-Tools" },
      { name: "Musicfy — Android music player", url: "https://github.com/AAbdullahRajput/Musicfy" },
      { name: "Maze Game — OpenGL maze game", url: "https://github.com/AAbdullahRajput/Maze-Game" },
      { name: "Mini Market Management System — C# WinForms POS", url: "https://github.com/AAbdullahRajput/Mini-Market-Management-System" },
    ],
  },
];

const CAREER_OFFSET_CLASS: Record<number, string> = {
  0: "",
  1: "lg:ml-[220px]",
  2: "lg:-ml-[70px]",
  3: "lg:ml-[150px]",
};

function FootIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <ellipse cx="12" cy="9" rx="3.3" ry="4.2" />
      <ellipse cx="12" cy="14" rx="4.4" ry="5" />
    </svg>
  );
}

function FootMark({
  x,
  y,
  angle,
  side,
  ratio,
  progress,
  scrollDir,
}: {
  x: number;
  y: number;
  angle: number;
  side: 1 | -1;
  ratio: number;
  progress: ReturnType<typeof useMotionValue<number>>;
  scrollDir: 1 | -1;
}) {
  const opacity = useTransform(progress, [Math.max(ratio - 0.025, 0), ratio], [0, 1]);
  const scale = useTransform(progress, [Math.max(ratio - 0.025, 0), ratio], [0.4, 1]);
  const rotation = angle + 90 + (scrollDir === 1 ? 180 : 0);

  return (
    <motion.div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity,
        scale,
        rotate: rotation,
        translateX: "-50%",
        translateY: "-50%",
      }}
      className="text-[#8a0303] dark:text-accent-green"
    >
      <FootIcon className={`h-6 w-6 ${side === 1 ? "" : "-scale-x-100"}`} />
    </motion.div>
  );
}

const waveContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
} satisfies Variants;
const waveItem = {
  hidden: { y: 0 },
  visible: {
    y: [0, -6, 0],
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
} satisfies Variants;

function CareerNode({
  item,
  index,
  total,
  progress,
  markerRef,
  cardRef,
}: {
  item: typeof career[number];
  index: number;
  total: number;
  progress: ReturnType<typeof useMotionValue<number>>;
  markerRef: (el: HTMLDivElement | null) => void;
  cardRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const isRight = index % 2 === 1;
  const threshold = index / (total - 1);
  const rangeStart = Math.min(Math.max(threshold - 0.12, 0), threshold - 0.02);
  const [detailOpen, setDetailOpen] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const fill = useTransform(progress, [rangeStart, threshold], [0, 1]);
  const [activated, setActivated] = useState(() => fill.get() >= 0.98);
  const [jumpCycle, setJumpCycle] = useState(() => (fill.get() >= 0.98 ? 1 : 0));
  const dotScale = useTransform(fill, [0, 1], [0.8, 1.15]);
  const dotBg = useTransform(fill, [0, 1], ["#e5e7eb", "#8a0303"]);
  const dotText = useTransform(fill, [0, 1], ["#6b7280", "#ffffff"]);
  const ringOpacity = useTransform(fill, [0, 1], [0, 0.5]);

  const waveControls = useAnimation();

  useMotionValueEvent(fill, "change", (v) => {
    if (v >= 0.98 && !activated) {
      setActivated(true);
      setJumpCycle((c) => c + 1);
      waveControls.set("hidden");
      waveControls.start("visible");
    } else if (v < 0.98 && activated) {
      setActivated(false);
    }
  });

  const cardBgClass = activated
    ? "bg-[#8a0303] border-[#8a0303] dark:bg-accent-green dark:border-accent-green"
    : "bg-white border-gray-200 dark:bg-white/[0.04] dark:border-white/[0.08]";
  const headingClass = activated
    ? "text-white dark:text-[#0b0e13]"
    : "text-[#0b0e13] dark:text-text";
  const orgClass = activated
    ? "text-white/90 dark:text-[#0b0e13]/80"
    : "text-[#8a0303] dark:hover:text-amber-300";
  const descClass = activated
    ? "text-white/80 dark:text-[#0b0e13]/75"
    : "text-[#6b7280] dark:text-text-muted";
  const tagClass = activated
    ? "border-white/30 bg-white/10 text-white dark:border-[#0b0e13]/25 dark:bg-[#0b0e13]/10 dark:text-[#0b0e13]"
    : "border-gray-200 bg-gray-50 text-[#374151] dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white/70";
  const builtBorderClass = activated
    ? "border-white/20 dark:border-[#0b0e13]/20"
    : "border-gray-100 dark:border-white/[0.06]";
  const builtLabelTextClass = activated
    ? "text-white/70 dark:text-[#0b0e13]/70"
    : "text-[#6b7280] dark:text-text-dim";
  const listTextClass = activated
    ? "text-white/85 dark:text-[#0b0e13]/85"
    : "text-[#374151] dark:text-white/75";
  const listDotClass = activated
    ? "bg-white dark:bg-[#0b0e13]"
    : "bg-[#8a0303] dark:bg-accent-green";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`relative z-10 mb-16 flex last:mb-0 ${
        isRight ? "lg:justify-end" : "lg:justify-start"
      }`}
    >
      <div className="flex flex-row items-start gap-5">
      {/* marker */}
      <div ref={markerRef} className="relative flex shrink-0 items-center justify-center">
        <motion.span
          style={{ opacity: ringOpacity }}
          className="absolute h-10 w-10 rounded-full bg-[#8a0303] dark:bg-accent-green animate-ping"
        />
        <motion.span
          style={{ scale: dotScale, backgroundColor: dotBg }}
          animate={{ rotate: activated ? 360 : 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-white shadow-md dark:border-ink"
        >
          <motion.span style={{ color: dotText }} className="font-mono text-[11px] font-bold">
            {index + 1}
          </motion.span>
        </motion.span>
      </div>

      {/* card */}
      <motion.div
        ref={cardRef}
        key={jumpCycle}
        style={{
          transformPerspective: 800,
          transformStyle: "preserve-3d",
        }}
        initial={{ rotateY: 0 }}
        animate={{ rotateY: activated ? 360 : 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className={`group relative w-full max-w-md overflow-hidden rounded-2xl border p-5 shadow-sm hover:-translate-y-1 hover:shadow-lg sm:p-6 ${cardBgClass} ${
          activated ? "" : "hover:border-[#8a0303]/40 dark:hover:border-accent-green/30 dark:hover:bg-white/[0.07]"
        }`}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: "radial-gradient(circle at 0% 0%, rgba(138,3,3,0.06) 0%, transparent 70%)" }}
        />

        <motion.div
          variants={waveContainer}
          initial="hidden"
          animate={waveControls}
        >
        <motion.div
          variants={waveItem}
          className={`relative mb-2 inline-flex items-center gap-2 rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium ${
            activated
              ? "border-white/40 bg-white/10 text-white dark:border-[#0b0e13]/30 dark:bg-[#0b0e13]/10 dark:text-[#0b0e13]"
              : "border-[#8a0303]/25 bg-[#8a0303]/5 text-[#8a0303] dark:border-accent-green/25 dark:bg-accent-green/5 dark:text-accent-green"
          }`}
        >
          {item.period}
        </motion.div>
        <motion.h3 variants={waveItem} className={`relative font-display text-lg font-bold sm:text-xl ${headingClass}`}>
          {item.role}
        </motion.h3>
        <motion.div variants={waveItem} className={`relative mt-0.5 mb-3 text-sm font-medium ${orgClass}`}>
          {item.org}
        </motion.div>

        {item.desc && (
          <motion.p variants={waveItem} className={`relative mb-4 text-[13px] leading-relaxed ${descClass}`}>
            {item.desc}
          </motion.p>
        )}

        {item.tags.length > 0 && (
          <motion.div variants={waveItem} className="relative mb-4 flex flex-wrap gap-1.5">
            {item.tags.map((tag, ti) => (
              <motion.div
                key={tag}
                className="relative"
                animate={{ y: [0, -9, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: [0.45, 0, 0.55, 1], delay: ti * 0.12 }}
                onMouseEnter={() => setHoveredTag(tag)}
                onMouseLeave={() => setHoveredTag((t) => (t === tag ? null : t))}
              >
                <button
                  type="button"
                  data-cursor-hover
                  onClick={(e) => { e.stopPropagation(); setActiveTag(tag); }}
                  className={`rounded-full border px-2.5 py-1 font-mono text-[10px] transition-transform duration-150 hover:scale-105 ${tagClass}`}
                >
                  {tag}
                </button>
                {TECH_INFO[tag] && hoveredTag === tag && (
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-52 -translate-x-1/2 hidden sm:block">
                    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-xl dark:border-line dark:bg-panel">
                      <div className="mb-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#8a0303] dark:text-accent-green">
                        {tag}
                      </div>
                      <p className="text-[11px] leading-relaxed text-[#6b7280] dark:text-text-muted">
                        {TECH_INFO[tag]}
                      </p>
                      <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-200 dark:border-t-line" />
                      <div className="absolute left-1/2 top-full mt-[-1px] -translate-x-1/2 border-4 border-transparent border-t-white dark:border-t-panel" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {typeof document !== "undefined" && createPortal(
          <AnimatePresence>
            {activeTag && TECH_INFO[activeTag] && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                onClick={() => setActiveTag(null)}
              >
                <motion.div
                  initial={{ y: 60, opacity: 0, scale: 0.96 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 60, opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-white/[0.08] dark:bg-[#0f1117]/90 dark:backdrop-blur-xl"
                >
                  <div className="mb-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#8a0303] dark:text-accent-green">
                    {activeTag}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[#6b7280] dark:text-text-muted">
                    {TECH_INFO[activeTag]}
                  </p>
                  <button
                    data-cursor-hover
                    onClick={() => setActiveTag(null)}
                    className="mt-5 w-full rounded-xl bg-[#0b0e13] py-2.5 font-mono text-[11px] font-medium text-white transition-colors hover:bg-[#8a0303] dark:bg-white/[0.06] dark:border dark:border-white/[0.08] dark:text-text dark:hover:border-accent-green/30 dark:hover:bg-white/[0.10]"
                  >
                    Close
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

        {item.projects.length > 0 && (
          <motion.div variants={waveItem} className={`relative border-t pt-3 ${builtBorderClass}`}>
            <div className={`mb-2 font-mono text-[10px] font-bold uppercase tracking-widest ${builtLabelTextClass}`}>
              What I built
            </div>
            <ul className="space-y-1.5">
              {item.projects.map((p) => (
                <li key={p.name} className={`flex items-start gap-2 text-[12px] leading-relaxed ${listTextClass}`}>
                  <span className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${listDotClass}`} />
                  {p.url ? (
                    
                    <a  href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor-hover
                      className={activated ? "hover:underline hover:text-white" : "hover:text-[#8a0303] hover:underline dark:hover:text-accent-green"}
                    >
                      {p.name}
                    </a>
                  ) : (
                    <span>{p.name}</span>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        <motion.button
          variants={waveItem}
          data-cursor-hover
          onClick={() => setDetailOpen(true)}
          className={`relative mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border py-2 font-mono text-[11px] font-medium transition-all duration-200 ${
            activated
              ? "border-white/90 text-white dark:text-black hover:bg-black hover:border-white hover:text-white"
              : "border-[#0b0e13]/25 text-[#0b0e13] hover:bg-[#0b0e13] hover:text-white hover:border-[#0b0e13] dark:border-white/20 dark:text-white dark:hover:bg-black dark:hover:border-black"
          }`}
        >
          View more
        </motion.button>
        </motion.div>
      </motion.div>
      </div>

      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {detailOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
              onClick={() => setDetailOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-white/[0.08] dark:bg-[#0f1117]/95 dark:backdrop-blur-xl sm:p-8"
              >
                <button
                  data-cursor-hover
                  onClick={() => setDetailOpen(false)}
                  className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-[#6b7280] transition-colors hover:bg-gray-100 dark:border-white/10 dark:text-text-dim dark:hover:bg-white/10"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#8a0303]/25 bg-[#8a0303]/5 px-2.5 py-1 font-mono text-[10px] font-medium text-[#8a0303] dark:border-accent-green/25 dark:bg-accent-green/5 dark:text-accent-green">
                  {item.period}
                </div>
                <h3 className="font-display text-2xl font-bold text-[#0b0e13] dark:text-text">
                  {item.role}
                </h3>
                <div className="mt-1 mb-4 text-sm font-medium text-[#8a0303] dark:text-accent-red">
                  {item.org}
                </div>

                {item.desc && (
                  <p className="mb-5 text-sm leading-relaxed text-[#6b7280] dark:text-text-muted">
                    {item.desc}
                  </p>
                )}

                {item.tags.length > 0 && (
                  <div className="mb-5 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 font-mono text-[10px] text-[#374151] dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {item.projects.length > 0 && (
                  <div className="border-t border-gray-100 pt-4 dark:border-white/[0.06]">
                    <div className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-[#6b7280] dark:text-text-dim">
                      Projects under {item.org}
                    </div>
                    <ul className="space-y-2.5">
                      {item.projects.map((p) =>
                        p.url ? (
                          <li key={p.name}>
                            
                            <a  href={p.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-cursor-hover
                              className="flex items-center gap-2 text-sm text-[#374151] transition-colors hover:text-[#8a0303] hover:underline dark:text-white/80 dark:hover:text-accent-green"
                            >
                              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#8a0303] dark:bg-accent-green" />
                              {p.name}
                            </a>
                          </li>
                        ) : (
                          <li key={p.name} className="flex items-center gap-2 text-sm text-[#374151] dark:text-white/80">
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#8a0303] dark:bg-accent-green" />
                            {p.name}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
}

function FallingSpiderman({ x, y }: { x: number; y: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          setTriggered(false);
          setTimeout(() => setTriggered(true), 50);
        } else if (!entry.isIntersecting) {
          setTriggered(false);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [triggered]);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute z-20 hidden -translate-x-1/2 lg:block"
      style={{ left: x, top: 0, width: 420, height: y }}
    >
      <AnimatePresence>
        {triggered && (
          <motion.img
            key="falling-spiderman"
            src="/images/falling-down-main.png"
            alt=""
            className="absolute bottom-0 left-1/2 w-full -translate-x-1/2 object-contain select-none dark:invert"
            style={{ transformOrigin: "top center" }}
            initial={{ y: -(y + 300), opacity: 0, scaleY: 1, rotate: 0 }}
            animate={{
              y: [-(y + 300), 0, 28, 0, -30, 0],
              opacity: [0, 1, 1, 1, 1, 1],
              scaleY: [1, 0.88, 1.06, 0.96, 1.02, 1],
              rotate: [-30, 30],
            }}
            transition={{
              y: {
                duration: 1.1,
                times: [0, 0.52, 0.66, 0.78, 0.9, 1],
                ease: ["easeIn", "easeOut", "easeOut", "easeOut", "easeOut"],
              },
              opacity: {
                duration: 1.1,
                times: [0, 0.52, 0.66, 0.78, 0.9, 1],
                ease: ["easeIn", "easeOut", "easeOut", "easeOut", "easeOut"],
              },
              scaleY: {
                duration: 1.1,
                times: [0, 0.52, 0.66, 0.78, 0.9, 1],
                ease: ["easeIn", "easeOut", "easeOut", "easeOut", "easeOut"],
              },
              rotate: {
                duration: 1.8,
                delay: 1.1,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              },
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Career() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pathRef = useRef<SVGPathElement>(null);
  const [pathD, setPathD] = useState("");
  const [pathLen, setPathLen] = useState(0);
    const [footprints, setFootprints] = useState<
    { x: number; y: number; angle: number; side: 1 | -1; ratio: number }[]
  >([]);
  const [scrollDir, setScrollDir] = useState<1 | -1>(1);
  const lastScrollY = useRef(0);
  const firstCardRef = useRef<HTMLDivElement>(null);
  const [spiderTarget, setSpiderTarget] = useState({ x: 100, y: 460 });

  useEffect(() => {
    const measure = () => {
      if (!firstCardRef.current || !trackRef.current) return;
      const cardRect = firstCardRef.current.getBoundingClientRect();
      const trackRect = trackRef.current.getBoundingClientRect();
      setSpiderTarget({
        x: cardRect.right - trackRect.left - 220,
        y: cardRect.bottom - trackRect.top + 710,
      });
    };

    const ro = new ResizeObserver(measure);

    // Watch for the card to appear anywhere in the DOM
    const mo = new MutationObserver(() => {
      if (firstCardRef.current) {
        mo.disconnect();
        ro.observe(firstCardRef.current);
        measure();
      }
    });

    // Try to observe immediately if card exists
    if (firstCardRef.current) {
      ro.observe(firstCardRef.current);
      measure();
    } else {
      // If card doesn't exist, observe the document body for any changes
      mo.observe(document.body, { childList: true, subtree: true });
    }

    // Also try measuring after a small delay to catch any layout shifts
    const timeoutId = setTimeout(measure, 500);
    const timeoutId2 = setTimeout(measure, 1000);

    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("resize", measure);
      clearTimeout(timeoutId);
      clearTimeout(timeoutId2);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.75", "end 0.75"],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 160, damping: 26, mass: 0.3 });

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      const delta = current - lastScrollY.current;
      lastScrollY.current = current;
      if (Math.abs(delta) < 2) return;
      setScrollDir(delta > 0 ? 1 : -1);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const lastPathD = useRef("");

  const computePath = () => {
    if (!trackRef.current) return;
    const trackRect = trackRef.current.getBoundingClientRect();
    const points = markerRefs.current
      .map((el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2 - trackRect.left, y: r.top + r.height / 2 - trackRect.top };
      })
      .filter(Boolean) as { x: number; y: number }[];
    if (points.length < 2) return;
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const midY = (prev.y + curr.y) / 2;
      d += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`;
    }
    if (d !== lastPathD.current) {
      lastPathD.current = d;
      setPathD(d);
    }
  };

  useAnimationFrame(computePath);

  useEffect(() => {
    if (!pathRef.current) return;
    const len = pathRef.current.getTotalLength();
    setPathLen(len);
    if (len === 0) return;

    const spacing = 30; // px between each footstep
    const sideOffset = 11; // px perpendicular offset for left/right foot
    const count = Math.max(2, Math.floor(len / spacing));
    const marks: typeof footprints = [];

    for (let i = 0; i <= count; i++) {
      const dist = (i / count) * len;
      const p = pathRef.current.getPointAtLength(dist);
      const p2 = pathRef.current.getPointAtLength(Math.min(dist + 1, len));
      const angle = (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI;
      const side: 1 | -1 = i % 2 === 0 ? 1 : -1;
      const nx = -Math.sin((angle * Math.PI) / 180);
      const ny = Math.cos((angle * Math.PI) / 180);
      marks.push({
        x: p.x + nx * sideOffset * side,
        y: p.y + ny * sideOffset * side,
        angle,
        side,
        ratio: dist / len,
      });
    }
    setFootprints(marks);
  }, [pathD]);

  return (
    <section
      id="career"
      ref={sectionRef}
      className="relative overflow-hidden bg-gray-50 pb-28 pt-8 dark:bg-ink"
    >
      <div className="relative pl-6 sm:pl-10 lg:pl-20 xl:pl-32 pr-6 sm:pr-10 lg:pr-20 xl:pr-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 flex max-w-3xl flex-wrap items-end justify-between gap-4"
        >
          <div>
            <div className="mb-3 font-mono text-xs text-[#8a0303] dark:text-accent-green">
              CAREER
            </div>
            <h2 className="font-display text-3xl font-bold text-[#0b0e13] dark:text-text sm:text-4xl">
              Where I&rsquo;ve been.
            </h2>
          </div>
        </motion.div>

        <div ref={trackRef} className="relative z-10 w-full max-w-9xl">
          <FallingSpiderman x={spiderTarget.x} y={spiderTarget.y} />
          {/* hidden path — geometry source only, never stroked */}
          {pathD && (
            <svg className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full lg:block" style={{ overflow: "visible" }}>
              <path ref={pathRef} d={pathD} fill="none" stroke="none" />
            </svg>
          )}

          {/* footstep trail (desktop) */}
          <div className="pointer-events-none absolute inset-0 z-0 hidden lg:block">
            {footprints.map((f, i) => (
              <FootMark key={i} x={f.x} y={f.y} angle={f.angle} side={f.side} ratio={f.ratio} progress={smoothProgress} scrollDir={scrollDir} />
            ))}
          </div>

          {/* dotted fallback (mobile) */}
          <div
            className="absolute left-5 top-1 bottom-1 w-0.5 text-gray-300 dark:text-line lg:hidden"
            style={{ backgroundImage: "repeating-linear-gradient(to bottom, currentColor 0 4px, transparent 4px 11px)" }}
          />
          <motion.div
            style={{ scaleY: smoothProgress, backgroundImage: "repeating-linear-gradient(to bottom, currentColor 0 4px, transparent 4px 11px)" }}
            className="absolute left-5 top-1 bottom-1 w-0.5 origin-top text-[#8a0303] dark:text-accent-green lg:hidden"
          />

          {career.map((item, i) => (
            <CareerNode
              key={item.role}
              item={item}
              index={i}
              total={career.length}
              progress={smoothProgress}
              markerRef={(el) => { markerRefs.current[i] = el; }}
              cardRef={i === 0 ? firstCardRef : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ────────────────────────────────────────────
function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
        <section
      id="contact"
      className="relative bg-[#F5F7F6] px-6 py-28 sm:px-10 lg:px-16 dark:bg-ink"
    >
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="mb-3 font-mono text-xs text-[#8a0303] dark:text-accent-green">
            GET IN TOUCH
          </div>
          <h2 className="font-display text-3xl font-bold text-[#0b0e13] dark:text-text sm:text-4xl">
            Let&rsquo;s build something.
          </h2>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onSubmit={handleSubmit}
          suppressHydrationWarning
          className="flex flex-col gap-4"
        >
          <input
            required
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-[#0b0e13] outline-none focus:border-[#8a0303] dark:border-line dark:bg-ink-soft dark:text-text dark:focus:border-accent-blue"
          />
          <input
            required
            type="email"
            placeholder="Your email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-[#0b0e13] outline-none focus:border-[#8a0303] dark:border-line dark:bg-ink-soft dark:text-text dark:focus:border-accent-blue"
          />
          <textarea
            required
            rows={5}
            placeholder="What are you building?"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-[#0b0e13] outline-none focus:border-[#8a0303] dark:border-line dark:bg-ink-soft dark:text-text dark:focus:border-accent-blue"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            data-cursor-hover
            className="rounded-lg bg-[#0b0e13] px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-[#8a0303] disabled:opacity-50 dark:bg-text dark:text-ink dark:hover:bg-accent-green"
          >
            {status === "sending" ? "Sending..." : status === "sent" ? "Sent ✓" : "Send message"}
          </button>
          {status === "error" && (
            <p className="text-sm text-red-500 dark:text-red-400">
              Something went wrong — try again.
            </p>
          )}
        </motion.form>
      </div>
    </section>
  );
}

// ─── FOOTER ─────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear();

  const exploreLinks = [
    { label: "Work", href: "#projects" },
    { label: "About", href: "#about" },
    { label: "Career", href: "#career" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <footer className="relative border-t border-gray-200 bg-[#F5F7F6] dark:border-line dark:bg-ink">
      <div className="grid grid-cols-1 gap-12 px-6 py-16 sm:grid-cols-2 sm:px-10 lg:grid-cols-4 lg:pl-20 xl:pl-32 lg:pr-20 xl:pr-32">
        {/* Brand */}
        <div className="sm:col-span-2 lg:pl-0">
          <motion.div
            className="relative inline-block"
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            whileInView={{
              clipPath: [
                "inset(0 100% 0 0)",
                "inset(0 78% 0 0)",
                "inset(0 78% 0 0)",
                "inset(0 52% 0 0)",
                "inset(0 52% 0 0)",
                "inset(0 24% 0 0)",
                "inset(0 24% 0 0)",
                "inset(0 0% 0 0)",
              ],
              transition: {
                duration: 2.4,
                times: [0, 0.22, 0.28, 0.5, 0.56, 0.78, 0.84, 1],
                ease: "easeInOut",
              },
            }}
            whileHover={{
              clipPath: [
                "inset(0 100% 0 0)",
                "inset(0 78% 0 0)",
                "inset(0 78% 0 0)",
                "inset(0 52% 0 0)",
                "inset(0 52% 0 0)",
                "inset(0 24% 0 0)",
                "inset(0 24% 0 0)",
                "inset(0 0% 0 0)",
              ],
              transition: {
                duration: 1.4,
                times: [0, 0.22, 0.28, 0.5, 0.56, 0.78, 0.84, 1],
                ease: "easeInOut",
              },
            }}
            viewport={{ once: false, amount: 0, margin: "0px 0px -100px 0px" }}
          >
            <button
              type="button"
              data-cursor-hover
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="block"
            >
              <div className="h-16 w-72 overflow-hidden">
                <img
                  src="/images/signature.svg"
                  alt="Ahmad Abdullah signature"
                  className="h-full w-full object-contain dark:invert select-none"
                />
              </div>
            </button>
          </motion.div>
          <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#8a0303] dark:text-accent-green">
            Full-Stack Developer
          </p>
          <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-[#6b7280] dark:text-text-muted">
            Building cross-platform mobile &amp; web systems &mdash; Flutter, React Native, and Next.js wired to real-time backends.
          </p>

          <div className="mt-5 flex items-center gap-3">
            
            <a  href="https://github.com/AAbdullahRajput"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-hover
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-[#6b7280] transition-colors hover:border-[#8a0303]/40 hover:text-[#8a0303] dark:border-white/10 dark:text-text-dim dark:hover:border-accent-green/30 dark:hover:text-accent-green"
            >
              <FiGithub size={15} />
            </a>
            
            <a  href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-hover
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-[#6b7280] transition-colors hover:border-[#8a0303]/40 hover:text-[#8a0303] dark:border-white/10 dark:text-text-dim dark:hover:border-accent-green/30 dark:hover:text-accent-green"
            >
              <FaLinkedin size={15} />
            </a>
            
            <a  href="mailto:ahmadabdullah4972@gmail.com"
              data-cursor-hover
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-[#6b7280] transition-colors hover:border-[#8a0303]/40 hover:text-[#8a0303] dark:border-white/10 dark:text-text-dim dark:hover:border-accent-green/30 dark:hover:text-accent-green"
            >
              <FiMail size={15} />
            </a>
          </div>
        </div>

        {/* Explore */}
        <div>
          <div className="mb-4 font-mono text-[10px] font-bold uppercase tracking-widest text-[#0b0e13] dark:text-text">
            Explore
          </div>
          <ul className="space-y-2.5">
            {exploreLinks.map((link) => (
              <li key={link.label}>
                
                <a  href={link.href}
                  data-cursor-hover
                  className="text-[13px] text-[#6b7280] transition-colors hover:text-[#8a0303] dark:text-text-muted dark:hover:text-accent-green"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Get in touch */}
        <div>
          <div className="mb-4 font-mono text-[10px] font-bold uppercase tracking-widest text-[#0b0e13] dark:text-text">
            Get in touch
          </div>
          
          <a  href="mailto:ahmadabdullah4972@gmail.com"
            data-cursor-hover
            className="block text-[13px] text-[#6b7280] transition-colors hover:text-[#8a0303] dark:text-text-muted dark:hover:text-accent-green"
          >
            ahmadabdullah4972@gmail.com
          </a>
          <p className="mt-2 text-[13px] text-[#6b7280] dark:text-text-muted">
            Islamabad, Pakistan
          </p>
          
          <a  href="#contact"
            data-cursor-hover
            className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#0b0e13] px-4 py-2 font-mono text-[11px] font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-[#8a0303] dark:bg-white/10 dark:text-white dark:hover:bg-accent-green dark:hover:text-[#0b0e13]"
          >
            Start a project
            <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3">
              <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-line">
        <div className="flex flex-col items-center justify-between gap-3 px-6 py-6 sm:flex-row sm:px-10 lg:pl-20 xl:pl-32 lg:pr-20 xl:pr-32">
          <p className="font-mono text-xs text-[#6b7280] dark:text-text-dim">
            &copy; {year} Ahmad Abdullah. All rights reserved.
          </p>
          <p className="font-mono text-xs text-[#6b7280] dark:text-text-dim">
            Islamabad, PK &middot; Available for freelance
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── MAIN EXPORT ────────────────────────────────────────
export default function PersonalPortfolio({ splashDone = false }: { splashDone?: boolean }) {
  return (
    <main>
      <Navbar />
      <Hero splashDone={splashDone} />
      <Projects />
      <About />
      <Skills />
      <Career />
      <Contact />
      <Footer />
    </main>
  );
}