"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal, flushSync } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  FiGithub,
  FiMail,
  FiFileText,
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa";

const LINKEDIN_URL = "https://www.linkedin.com/in/ahmad-a-972497411";

const NAV_TOUR_STEPS = [
  {
    id: "hills",
    x: "50%",
    y: "12%",
    title: "Margalla Hills",
    body: "The forested ridge behind me — Margalla Hills, the range that lines Islamabad's northern edge. Shot on one of the hiking trails there.",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 16l5-8 4 5 3-4 4 7H2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "person",
    x: "82%",
    y: "42%",
    title: "Ahmad Abdullah",
    body: "That's me — full-stack developer, currently building production apps at Mehdi Technologies in Islamabad. Taken mid-hike above the city.",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 17c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
];

const links = [
  { label: "Work", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Career", href: "#career" },
  { label: "Contact", href: "#contact" },
];

function smoothScrollTo(href: string) {
  const id = href.replace("#", "");
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth" });
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Logo photo: hold to reveal, 1 click = scroll top, 2 clicks = home
  const [photoOpen, setPhotoOpen] = useState(false);
  const [photoHover, setPhotoHover] = useState(false);
  const [tourActive, setTourActive] = useState<number | null>(null);
  const [logoToured, setLogoToured] = useState(false);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdTriggeredRef = useRef(false);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const photoSoundRef = useRef<HTMLAudioElement | null>(null);

  const HOLD_MS = 350;
  const CLICK_DELAY_MS = 280;

  function clearHoldTimer() {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }

  function handleLogoPointerDown() {
    holdTriggeredRef.current = false;
    clearHoldTimer();
    holdTimerRef.current = setTimeout(() => {
      holdTriggeredRef.current = true;
      setPhotoOpen(true);

      photoSoundRef.current = new Audio("/song/location-pointing.mp3");
      photoSoundRef.current.loop = true;
      photoSoundRef.current.play().catch(() => {});
      setTimeout(() => setTourActive(0), 400);
      setLogoToured(true);
    }, HOLD_MS);
  }

  function handleLogoPointerUp() {
    clearHoldTimer();

    // Photo was opened by the hold — leave it open, only the
    // close button (or backdrop) should dismiss it now.
    if (holdTriggeredRef.current) {
      holdTriggeredRef.current = false;
      return;
    }

    clickCountRef.current += 1;

    if (clickCountRef.current === 1) {
      clickTimerRef.current = setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        clickCountRef.current = 0;
      }, CLICK_DELAY_MS);
    } else {
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      clickCountRef.current = 0;
      window.location.href = "/";
    }
  }

  function handleLogoPointerLeave() {
    // Only cancel a pending (not-yet-triggered) hold — never
    // close a photo that's already open.
    if (!holdTriggeredRef.current) {
      clearHoldTimer();
    }
  }

  function handleClosePhoto() {
    if (photoSoundRef.current) {
      photoSoundRef.current.pause();
      photoSoundRef.current.currentTime = 0;
    }
    setPhotoOpen(false);
    setPhotoHover(false);
    setTourActive(null);
  }

  function playPhotoSound() {
    if (!photoSoundRef.current) return;
    photoSoundRef.current.currentTime = 0;
    photoSoundRef.current.play().catch(() => {});
  }

  function goToTourStep(i: number) {
    setTourActive(i);
  }

  // Detect scroll position
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Load saved theme on mount (localStorage first, falls back to cookie)
  useEffect(() => {
    const getCookie = (name: string) => {
      const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
      return match ? match[2] : null;
    };

    const saved = localStorage.getItem("theme") || getCookie("theme");
    const isDark = saved === "dark";

    setDark(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    }
    setMounted(true);
  }, []);

  // Persist theme whenever it changes (after initial load)
  useEffect(() => {
    if (!mounted) return;

    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("theme", dark ? "dark" : "light");
    document.cookie = `theme=${dark ? "dark" : "light"}; path=/; max-age=31536000`;
  }, [dark, mounted]);

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const nextDark = !dark;

    if (typeof document !== "undefined" && "startViewTransition" in document) {
      const transition = (document as any).startViewTransition(() => {
        flushSync(() => {
          setDark(nextDark);
          if (nextDark) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        });
      });

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 1000,
            easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      });
    } else {
      setDark(nextDark);
    }
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-4 left-1/2 z-50 w-[95%] max-w-5xl -translate-x-1/2"
    >
      <div
        className={`flex items-center justify-between rounded-full border px-5 py-3 transition-colors duration-300 sm:px-8 ${
          scrolled
            ? "border-[#8a0303]/20 bg-white/90 shadow-lg shadow-black/10 backdrop-blur-md dark:border-white/10 dark:bg-ink/90"
            : "border-[#8a0303]/15 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-ink/80"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="group relative shrink-0">
            <button
              type="button"
              data-cursor-hover
              aria-label="Ahmad Abdullah — hold to view photo"
              onPointerDown={handleLogoPointerDown}
              onPointerUp={handleLogoPointerUp}
              onPointerLeave={handleLogoPointerLeave}
              onPointerCancel={handleLogoPointerLeave}
              onContextMenu={(e) => e.preventDefault()}
              className="block rounded-full"
              suppressHydrationWarning
            >
              <Image
                src="/images/profile.jpeg"
                alt="Ahmad Abdullah"
                width={36}
                height={36}
                draggable={false}
                className="h-9 w-9 select-none rounded-full border border-[#8a0303]/20 object-cover"
              />
            </button>

            {/* hold hint badge — mirrors the About photo's "Click to explore" */}
            <AnimatePresence>
              {!logoToured && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ delay: 0.6 }}
                  className="pointer-events-none absolute -bottom-1 -right-1 flex items-center gap-1 rounded-full border border-[#8a0303]/30 bg-white/95 px-1.5 py-0.5 shadow-md backdrop-blur-sm dark:border-accent-green/30 dark:bg-panel/95"
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8a0303] opacity-60 dark:bg-accent-green" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#8a0303] dark:bg-accent-green" />
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* hover tooltip */}
            <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-2.5 w-44 -translate-x-1/2 scale-95 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100">
              <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-xl dark:border-line dark:bg-panel">
                <div className="mb-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#8a0303] dark:text-accent-green">
                  Ahmad Abdullah
                </div>
                <ul className="space-y-1 text-[10px] leading-relaxed text-[#6b7280] dark:text-text-muted">
                  <li>1 click &mdash; scroll to top</li>
                  <li>2 clicks &mdash; go to home</li>
                  <li>Hold &mdash; view photo</li>
                </ul>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-200 dark:border-b-line" />
                <div className="absolute bottom-full left-1/2 mt-[1px] -translate-x-1/2 border-4 border-transparent border-b-white dark:border-b-panel" />
              </div>
            </div>
          </div>

          
          <a  href="#"
            data-cursor-hover
            onClick={(e) => {
              e.preventDefault();
              const atTop = window.scrollY < 10;
              if (atTop) {
                window.location.href = "/";
              } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
          <motion.img
            src="/images/signature.svg"
            alt="Ahmad Abdullah signature"
            className="hidden sm:block h-8 w-36 object-contain dark:invert select-none"
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
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 sm:flex">
          {links.map((link) => (
            
            
          <a  key={link.href}
              href={link.href}
              data-cursor-hover
              onClick={(e) => { e.preventDefault(); smoothScrollTo(link.href); }}
              className="font-mono text-xs text-[#6b7280] transition-colors hover:text-[#8a0303] dark:text-text-muted dark:hover:text-accent-green"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 sm:flex">
          
          <a  href="https://github.com/AAbdullahRajput"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-hover
            className="text-[#6b7280] transition-colors hover:text-[#8a0303] dark:text-text-muted dark:hover:text-accent-green"
          >
            <FiGithub size={15} />
          </a>

          <a  href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-hover
            className="text-[#6b7280] transition-colors hover:text-[#8a0303] dark:text-text-muted dark:hover:text-accent-green"
          >
            <FaLinkedin size={15} />
          </a>

          
          <a  href="mailto:ahmadabdullah4972@gmail.com"
            data-cursor-hover
            className="text-[#6b7280] transition-colors hover:text-[#8a0303] dark:text-text-muted dark:hover:text-accent-green"
          >
            <FiMail size={15} />
          </a>

          
          <a  href="https://drive.google.com/file/d/170hCljehQe0QhSGE07ki7hglMUz1rYT3/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-hover
            className="flex items-center gap-1.5 rounded-full border border-[#8a0303]/20 px-3 py-1.5 font-mono text-xs text-[#0b0e13] transition-colors hover:border-[#8a0303] hover:bg-[#8a0303]/5 hover:text-[#8a0303] dark:border-white/10 dark:text-white dark:hover:border-accent-green/40 dark:hover:bg-accent-green/10 dark:hover:text-accent-green"
          >
            <FiFileText size={12} />
            Resume
          </a>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            data-cursor-hover
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#8a0303]/20 text-[#6b7280] transition-colors hover:text-[#0b0e13] dark:border-white/10 dark:text-text-muted dark:hover:text-white"
            suppressHydrationWarning
          >
            {dark ? <FiSun size={14} /> : <FiMoon size={14} />}
          </button>
        </div>

        {/* Mobile-only quick actions: theme toggle + socials, always visible in the compact bar */}
        <div className="flex items-center gap-3 sm:hidden">
          
          <a href="https://github.com/AAbdullahRajput"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-hover
            aria-label="GitHub"
            className="text-[#6b7280] transition-colors hover:text-[#8a0303] dark:text-text-muted dark:hover:text-accent-green"
          >
            <FiGithub size={15} />
          </a>
          
          <a  href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-hover
            aria-label="LinkedIn"
            className="text-[#6b7280] transition-colors hover:text-[#8a0303] dark:text-text-muted dark:hover:text-accent-green"
          >
            <FaLinkedin size={15} />
          </a>
          
          <a  href="mailto:ahmadabdullah4972@gmail.com"
            data-cursor-hover
            aria-label="Email"
            className="text-[#6b7280] transition-colors hover:text-[#8a0303] dark:text-text-muted dark:hover:text-accent-green"
          >
            <FiMail size={15} />
          </a>
          <button
            type="button"
            onClick={toggleTheme}
            data-cursor-hover
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#8a0303]/20 text-[#6b7280] transition-colors hover:text-[#0b0e13] dark:border-white/10 dark:text-text-muted dark:hover:text-white"
            suppressHydrationWarning
          >
            {dark ? <FiSun size={13} /> : <FiMoon size={13} />}
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            data-cursor-hover
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="text-[#0b0e13] dark:text-white"
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Small falling Spiderman/girl decoration — mobile only, perched above the navbar pill */}
      <div className="pointer-events-none absolute -top-5 right-3 h-9 w-9 sm:hidden">
        <img
          src="/images/falling-boy-girl-spiderman.png"
          alt=""
          className="h-full w-full select-none object-contain object-top dark:invert"
        />
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-2 flex flex-col gap-1 rounded-2xl border border-[#8a0303]/15 bg-white px-6 py-4 shadow-lg dark:border-white/[0.08] dark:bg-ink/95 dark:backdrop-blur-md"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => { e.preventDefault(); setMenuOpen(false); smoothScrollTo(link.href); }}
              className="py-2.5 font-mono text-sm text-[#6b7280] hover:text-[#8a0303] dark:text-text-muted dark:hover:text-accent-green"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://drive.google.com/file/d/170hCljehQe0QhSGE07ki7hglMUz1rYT3/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-[#8a0303]/30 bg-[#8a0303]/5 py-2.5 font-mono text-xs font-semibold text-[#8a0303] dark:border-accent-green/30 dark:bg-accent-green/10 dark:text-accent-green"
          >
            <FiFileText size={13} />
            Resume
          </a>
        </motion.div>
      )}

      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {photoOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[400] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
              onClick={handleClosePhoto}
            >
              <motion.div
                initial={{ scale: 0.85, opacity: 0, y: 12 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.85, opacity: 0, y: 12 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl sm:max-w-lg"
                style={{ aspectRatio: "4/5" }}
              >
                <img
                  src="/images/profile.jpeg"
                  alt="Ahmad Abdullah"
                  draggable={false}
                  className="h-full w-full select-none object-cover"
                />

                <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/60 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent" />

                {/* close button */}
                <button
                  type="button"
                  data-cursor-hover
                  onClick={handleClosePhoto}
                  aria-label="Close"
                  className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                {/* top label */}
                <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[#8a0303] opacity-70 [animation:ping_0.03s_cubic-bezier(0,0,0.2,1)_infinite]" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#8a0303]" />
                  </span>
                  <span className="font-mono text-[9px] font-medium tracking-wide text-white/80">
                    INTERACTIVE TOUR
                  </span>
                </div>

                {/* dim overlay while a step is active */}
                <AnimatePresence>
                  {tourActive !== null && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/15"
                    />
                  )}
                </AnimatePresence>

                {/* numbered markers */}
                <AnimatePresence>
                  {tourActive !== null && NAV_TOUR_STEPS.map((s, i) => (
                    <motion.button
                      key={s.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      data-cursor-hover
                      onClick={(e) => { e.stopPropagation(); goToTourStep(i); playPhotoSound(); }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-10 focus:outline-none"
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
                              className="h-3.5 w-3.5 -ml-1.5"
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
                                stroke={i === tourActive ? "#8a0303" : "rgba(255,255,255,0.85)"}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </motion.svg>
                          ))}
                        </div>

                        <span className="relative flex h-6 w-6 items-center justify-center">
                          <span className={`absolute inline-flex h-full w-full rounded-full opacity-40 [animation:ping_0.7s_linear_infinite] ${i === tourActive ? "bg-[#8a0303]" : "bg-white"}`} />
                          <span className={`absolute inline-flex h-full w-full rounded-full opacity-30 [animation:ping_0.8s_linear_infinite_1.5s] ${i === tourActive ? "bg-[#8a0303]" : "bg-white"}`} />
                          <span className={`relative inline-flex h-5 w-5 items-center justify-center rounded-full border-2 font-mono text-[9px] font-bold shadow-lg transition-all ${
                            i === tourActive
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
                  {tourActive !== null && (
                    <motion.div
                      key={NAV_TOUR_STEPS[tourActive].id}
                      initial={{ opacity: 0, y: 14, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.96 }}
                      transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute bottom-3 left-3 right-3 z-20 rounded-xl border border-white/10 bg-black/75 p-3.5 shadow-2xl backdrop-blur-xl"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        {NAV_TOUR_STEPS[tourActive].id === "person" ? (
                          <img
                            src="/images/profile.jpeg"
                            alt="Ahmad Abdullah"
                            className="h-6 w-6 shrink-0 rounded-full border border-white/30 object-cover"
                          />
                        ) : (
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#8a0303]/90 text-white">
                            {NAV_TOUR_STEPS[tourActive].icon}
                          </span>
                        )}
                        <span className="font-display text-[12px] font-bold text-white">
                          {NAV_TOUR_STEPS[tourActive].title}
                        </span>
                        <span className="ml-auto font-mono text-[9px] text-white/40">
                          {tourActive + 1} / {NAV_TOUR_STEPS.length}
                        </span>
                      </div>

                      <p className="mb-3 text-[11px] leading-relaxed text-white/70">
                        {NAV_TOUR_STEPS[tourActive].body}
                      </p>

                      <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                          {NAV_TOUR_STEPS.map((_, i) => (
                            <button
                              key={i}
                              data-cursor-hover
                              onClick={(e) => { e.stopPropagation(); goToTourStep(i); }}
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                i === tourActive ? "w-4 bg-[#8a0303]" : "w-1.5 bg-white/25 hover:bg-white/50"
                              }`}
                            />
                          ))}
                        </div>

                        <button
                          type="button"
                          data-cursor-hover
                          onClick={(e) => { e.stopPropagation(); goToTourStep((tourActive + 1) % NAV_TOUR_STEPS.length); playPhotoSound(); }}
                          className="ml-auto flex h-7 items-center gap-1.5 rounded-lg bg-[#8a0303] px-3 font-mono text-[10px] font-medium text-white transition-colors hover:bg-[#6e0202]"
                        >
                          {tourActive < NAV_TOUR_STEPS.length - 1 ? "Next" : "Again ↺"}
                          <svg viewBox="0 0 16 16" fill="none" className="h-2.5 w-2.5">
                            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
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
    </motion.header>
  );
}