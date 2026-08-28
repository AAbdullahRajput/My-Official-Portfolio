"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll, useAnimationFrame, animate } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";
import Navbar from "@/components/Navbar";

// ─── DATA ───────────────────────────────────────────────
const skills = [
  { label: "Flutter / Dart", angle: 0 },
  { label: "React Native", angle: 51 },
  { label: "Next.js / React", angle: 102 },
  { label: "Node.js / Express", angle: 153 },
  { label: "FastAPI", angle: 204 },
  { label: "Supabase", angle: 255 },
  { label: "Agora RTC", angle: 306 },
];

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

// ─── HERO ───────────────────────────────────────────────
function Hero({ splashDone = false }: { splashDone?: boolean }) {
  const heroImgRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [revealing, setRevealing] = useState(false);
  const [spotPos, setSpotPos] = useState({ x: 50, y: 8 });

  const handleFaceMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = heroImgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotPos({ x: xPct, y: yPct });
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
          transition: "opacity 0.3s ease-out",
          maskImage: "radial-gradient(ellipse 38% 45% at 50% 38%, black 55%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 38% 45% at 50% 38%, black 55%, transparent 100%)",
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        <img
          src="/images/Main-Me.jpg"
          alt="Ahmad"
          className="h-full w-full object-cover object-top"
                    style={{ objectPosition: "50% 8%" }}
        />
      </motion.div>

      {/* Eye hover zone — above everything */}
      <div
        className="absolute inset-y-0 left-1/2 hidden w-[85%] -translate-x-1/2 lg:block pointer-events-none"
        style={{ zIndex: 20 }}
      >
        <div
          className="absolute pointer-events-auto"
          data-cursor-surface="dark"
          onMouseEnter={() => setRevealing(true)}
          onMouseLeave={() => setRevealing(false)}
          style={{
            top: "18%",
            left: "33%",
            width: "34%",
            height: "22%",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row items-center px-6 sm:px-10 lg:pl-4 lg:pr-6">
        <div className="max-w-lg lg:w-[48%] lg:-ml-60">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={splashDone ? "show" : "hidden"}
            custom={0}
            className="mb-5 flex items-center gap-2 font-mono text-xs text-[#8a0303] dark:text-accent-red"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8a0303] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#8a0303]" />
            </span>
            AVAILABLE FOR PROJECTS
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate={splashDone ? "show" : "hidden"}
            custom={1}
            className="font-display text-4xl font-bold tracking-tight leading-[1.05] text-[#0b0e13] dark:text-text sm:text-5xl lg:text-6xl"
          >
            Ahmad Abdullah
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate={splashDone ? "show" : "hidden"}
            custom={2}
            className="font-body mt-4 text-lg font-normal tracking-wide leading-snug text-[#374151] dark:text-text-muted sm:text-xl"
          >
            Full-stack engineer building connected mobile and web systems.
          </motion.p>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate={splashDone ? "show" : "hidden"}
            custom={3}
            className="mt-5 max-w-md text-sm leading-relaxed text-[#6b7280] dark:text-text-dim sm:text-base"
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
              className="rounded-lg bg-[#0b0e13] px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-[#8a0303] hover:shadow-lg hover:shadow-[#8a0303]/30 dark:bg-white dark:text-ink dark:hover:bg-accent-red dark:hover:text-white"
            >
              View work
            </a>

            
            <a  href="#contact"
              data-cursor-hover
              className="rounded-lg border border-[#d1d5db] px-6 py-3 text-sm font-medium text-[#0b0e13] transition-all duration-200 hover:scale-105 hover:border-[#8a0303] hover:text-[#8a0303] hover:bg-gray-50 dark:border-line dark:text-text dark:hover:border-accent-red dark:hover:text-accent-red dark:hover:bg-panel"
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
            {["Flutter", "Next.js", "Supabase", "Agora RTC"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#8a0303]/30 px-3 py-1 font-mono text-xs text-[#8a0303] dark:border-accent-red/40 dark:text-accent-red"
              >
                {tag}
              </span>
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
    x: "60%",
    y: "60%",
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
    x: "72%",
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
    x: "36%",
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

  function handleOpen() {
    setOpen(true);
    setTimeout(() => setActive(0), 400);
  }

  function handleClose() {
    setActive(null);
    setOpen(false);
    setToured(true);
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

                {/* numbered dot markers */}
                <AnimatePresence>
                  {active !== null && TOUR_STEPS.map((s, i) => (
                    <motion.button
                      key={s.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      onClick={(e) => { e.stopPropagation(); goTo(i); }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none z-10"
                      style={{ left: s.x, top: s.y }}
                    >
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
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#8a0303]/90 text-white">
                          {step.icon}
                        </span>
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
                              onClick={(e) => { e.stopPropagation(); goTo(active! - 1); }}
                              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white/70 transition-colors hover:bg-white/20"
                            >
                              <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
                                <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>
                          )}
                          {active! < TOUR_STEPS.length - 1 ? (
                            <button
                              onClick={(e) => { e.stopPropagation(); goTo(active! + 1); }}
                              className="flex h-8 items-center gap-1.5 rounded-xl bg-[#8a0303] px-4 font-mono text-[11px] font-medium text-white transition-colors hover:bg-[#6e0202]"
                            >
                              Next
                              <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3">
                                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>
                          ) : (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleClose(); }}
                              className="flex h-8 items-center gap-1.5 rounded-xl bg-[#8a0303] px-4 font-mono text-[11px] font-medium text-white transition-colors hover:bg-[#6e0202]"
                            >
                              Done ✓
                            </button>
                          )}
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

function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-gray-50 py-28 dark:bg-ink-soft"
    >
      <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="pl-6 sm:pl-10 lg:pl-20 xl:pl-32 lg:pr-10"
        >
          <div className="mb-3 font-mono text-xs text-[#8a0303] dark:text-accent-green">
            ABOUT
          </div>
          <h2 className="font-display mb-6 text-3xl font-bold leading-tight text-[#0b0e13] dark:text-text sm:text-4xl">
            Full-stack, end to end.
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-[#6b7280] dark:text-text-muted sm:text-base">
            I&rsquo;m a full-stack developer based in Islamabad, currently
            building production apps at Mehdi Technologies — Flutter and
            React Native on the client side, Node.js and FastAPI on the
            backend, Supabase and Firebase for auth, storage, and real-time
            data.
          </p>
          <p className="mb-4 text-sm leading-relaxed text-[#6b7280] dark:text-text-muted sm:text-base">
            My focus is on systems that stay in sync — live video calls,
            push notifications, payments, and real-time updates — shipped
            as complete, deployed products rather than prototypes. Golazo,
            my World Cup 2026 prediction app, is live on the Google Play
            Store with real users and a Supabase backend secured with
            row-level security.
          </p>
          <p className="mb-4 text-sm leading-relaxed text-[#6b7280] dark:text-text-muted sm:text-base">
            I care about clean architecture and code I can hand off — SOLID
            principles, JWT auth done properly, and APIs designed so a
            Flutter frontend and a React frontend can both consume them
            without duplicated logic.
          </p>
          <p className="text-sm leading-relaxed text-[#6b7280] dark:text-text-muted sm:text-base">
            Outside of client work I&rsquo;m usually deep in a side project —
            right now that&rsquo;s AI Tools Hub, a Framer-driven CMS site, and
            polishing Get Fit&rsquo;s trainer-booking flow. From idea to
            deployed app is still my favorite part of the job.
          </p>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-[#6b7280] dark:text-text-dim">
            <span>📍 Islamabad, Pakistan</span>
            <span>💼 Available for freelance</span>
            <span>🗣️ English · Urdu</span>
          </div>
        </motion.div>

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

      <div className="mt-16 grid grid-cols-1 gap-px bg-gray-200 dark:bg-line sm:grid-cols-2 lg:grid-cols-4">
        {highlights.map((item) => (
          <div
            key={item.title}
            className="bg-gray-50 p-8 dark:bg-ink-soft"
          >
            <h3 className="mb-2 font-display text-base font-semibold text-[#0b0e13] dark:text-text">
              {item.title}
            </h3>
            <p className="text-sm leading-relaxed text-[#6b7280] dark:text-text-muted">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-16 flex flex-wrap justify-center gap-2 px-6">
        {skills.map((skill) => (
          <span
            key={skill.label}
            className="rounded-full border border-gray-200 bg-white px-3 py-1.5 font-mono text-[11px] text-[#0b0e13] dark:border-line dark:bg-panel dark:text-accent-blue"
          >
            {skill.label}
          </span>
        ))}
      </div>
    </section>
  );
}

// ─── CAREER ─────────────────────────────────────────────
const career = [
  {
    role: "Python & MERN Stack Developer",
    org: "Mehdi Technologies Pvt. Ltd.",
    period: "May 2026 — Present",
    desc: "Building full-stack solutions with Python, React.js, Node.js, Express, MongoDB, and cross-platform mobile features for real client projects.",
  },
  {
    role: "Full Stack Development Intern",
    org: "CodeAlpha",
    period: "May 2026",
    desc: "Built ProjectSync, a Trello-style PM app with React/Vite, Node.js/Express, MongoDB Atlas, and Socket.io — deployed on AWS.",
  },
  {
    role: "Independent Full Stack Developer",
    org: "Self-Directed",
    period: "Feb 2025 — Apr 2026",
    desc: "Designed, built, and deployed full-stack Flutter and web apps end to end — UI, REST APIs, Firebase/Supabase integration, and cloud deployment.",
  },
  {
    role: "B.S. Computer Science",
    org: "University of Arid Agriculture, Rawalpindi",
    period: "May 2026 · CGPA 3.0/4.0",
    desc: "",
  },
];

function Career() {
  return (
    <section
      id="career"
      className="relative bg-gray-50 px-6 py-28 sm:px-10 lg:px-16 dark:bg-ink-soft"
    >
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div className="mb-3 font-mono text-xs text-[#8a0303] dark:text-accent-green">
            CAREER
          </div>
          <h2 className="font-display text-3xl font-bold text-[#0b0e13] dark:text-text sm:text-4xl">
            Where I&rsquo;ve been.
          </h2>
        </motion.div>

        <div className="relative border-l border-gray-200 dark:border-line pl-8">
          {career.map((item, i) => (
            <motion.div
              key={item.role}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative mb-10 last:mb-0"
            >
              <span className="absolute -left-[2.35rem] top-1.5 h-3 w-3 rounded-full bg-[#8a0303] dark:bg-accent-green" />
              <div className="mb-1 font-mono text-xs text-[#6b7280] dark:text-text-dim">
                {item.period}
              </div>
              <h3 className="font-display text-lg font-semibold text-[#0b0e13] dark:text-text">
                {item.role}
              </h3>
              <div className="mb-2 text-sm text-[#8a0303] dark:text-accent-red">
                {item.org}
              </div>
              {item.desc && (
                <p className="text-sm leading-relaxed text-[#6b7280] dark:text-text-muted">
                  {item.desc}
                </p>
              )}
            </motion.div>
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
            className="rounded-lg bg-[#0b0e13] px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-105 disabled:opacity-50 dark:bg-text dark:text-ink"
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

  return (
    <footer className="relative border-t border-gray-200 bg-[#F5F7F6] px-6 py-10 sm:px-10 lg:px-16 dark:border-line dark:bg-ink">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="font-mono text-xs text-[#6b7280] dark:text-text-dim">
          &copy; {year} Ahmad Abdullah. All rights reserved.
        </p>

        <div className="flex items-center gap-5">
          
          <a  href="https://github.com/AAbdullahRajput"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-hover
            className="font-mono text-xs text-[#6b7280] underline-offset-4 hover:text-[#0b0e13] hover:underline dark:text-text-dim dark:hover:text-text"
          >
            GitHub
          </a>
          
          <a  href="mailto:ahmadabdullah4972@gmail.com"
            data-cursor-hover
            className="font-mono text-xs text-[#6b7280] underline-offset-4 hover:text-[#0b0e13] hover:underline dark:text-text-dim dark:hover:text-text"
          >
            Email
          </a>
          
          <a  href="#projects"
            data-cursor-hover
            className="font-mono text-xs text-[#6b7280] underline-offset-4 hover:text-[#0b0e13] hover:underline dark:text-text-dim dark:hover:text-text"
          >
            Work
          </a>
          
          <a  href="#contact"
            data-cursor-hover
            className="font-mono text-xs text-[#6b7280] underline-offset-4 hover:text-[#0b0e13] hover:underline dark:text-text-dim dark:hover:text-text"
          >
            Contact
          </a>
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
      <Career />
      <Contact />
      <Footer />
    </main>
  );
}