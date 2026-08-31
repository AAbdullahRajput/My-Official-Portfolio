"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
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
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdTriggeredRef = useRef(false);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    }, HOLD_MS);
  }

  function handleLogoPointerUp() {
    clearHoldTimer();

    if (holdTriggeredRef.current) {
      setPhotoOpen(false);
      setPhotoHover(false);
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
    clearHoldTimer();
    if (holdTriggeredRef.current) {
      setPhotoOpen(false);
      setPhotoHover(false);
      holdTriggeredRef.current = false;
    }
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
              className="font-mono text-xs text-[#6b7280] transition-colors hover:text-[#0b0e13] dark:text-text-muted dark:hover:text-white"
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
            className="text-[#6b7280] transition-colors hover:text-[#0b0e13] dark:text-text-muted dark:hover:text-white"
          >
            <FiGithub size={15} />
          </a>

          <a  href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-hover
            className="text-[#6b7280] transition-colors hover:text-[#0b0e13] dark:text-text-muted dark:hover:text-white"
          >
            <FaLinkedin size={15} />
          </a>

          
          <a  href="mailto:ahmadabdullah4972@gmail.com"
            data-cursor-hover
            className="text-[#6b7280] transition-colors hover:text-[#0b0e13] dark:text-text-muted dark:hover:text-white"
          >
            <FiMail size={15} />
          </a>

          
          <a  href="https://drive.google.com/file/d/170hCljehQe0QhSGE07ki7hglMUz1rYT3/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-hover
            className="flex items-center gap-1.5 rounded-full border border-[#8a0303]/20 px-3 py-1.5 font-mono text-xs text-[#0b0e13] transition-colors hover:bg-gray-50 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
          >
            <FiFileText size={12} />
            Resume
          </a>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={() => setDark((prev) => !prev)}
            data-cursor-hover
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#8a0303]/20 text-[#6b7280] transition-colors hover:text-[#0b0e13] dark:border-white/10 dark:text-text-muted dark:hover:text-white"
          >
            {dark ? <FiSun size={14} /> : <FiMoon size={14} />}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          data-cursor-hover
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="text-[#0b0e13] dark:text-white sm:hidden"
        >
          {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
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
            
            
            <a  key={link.href}
              href={link.href}
              onClick={(e) => { e.preventDefault(); setMenuOpen(false); smoothScrollTo(link.href); }}
              className="py-3 font-mono text-sm text-[#6b7280] hover:text-[#0b0e13] dark:text-text-muted dark:hover:text-white"
            >
              {link.label}
            </a>
          ))}

          
          <a  href="https://github.com/AAbdullahRajput"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 font-mono text-sm text-[#6b7280] hover:text-[#0b0e13] dark:text-text-muted dark:hover:text-white"
          >
            GitHub
          </a>

          <a  href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 font-mono text-sm text-[#6b7280] hover:text-[#0b0e13] dark:text-text-muted dark:hover:text-white"
          >
            LinkedIn
          </a>

          
          <a  href="mailto:ahmadabdullah4972@gmail.com"
            className="py-3 font-mono text-sm text-[#6b7280] hover:text-[#0b0e13] dark:text-text-muted dark:hover:text-white"
          >
            Email
          </a>

          <button
            type="button"
            onClick={() => setDark((prev) => !prev)}
            className="flex items-center gap-2 py-3 font-mono text-sm text-[#6b7280] hover:text-[#0b0e13] dark:text-text-muted dark:hover:text-white"
          >
            {dark ? <FiSun size={14} /> : <FiMoon size={14} />}
            {dark ? "Light mode" : "Dark mode"}
          </button>
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
              className="fixed inset-0 z-[400] flex items-center justify-center bg-black/90"
              onMouseEnter={() => setPhotoHover(true)}
              onMouseLeave={() => setPhotoHover(false)}
            >
              <motion.img
                initial={{ scale: 1.08, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.08, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                src="/images/profile.jpeg"
                alt="Ahmad Abdullah"
                draggable={false}
                className="h-full w-full select-none object-cover"
              />

              <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/70 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent" />

              <AnimatePresence>
                {photoHover && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-2xl border border-white/10 bg-black/70 px-5 py-3 text-center backdrop-blur-xl"
                  >
                    <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#8a0303] dark:text-accent-green">
                      Ahmad Abdullah
                    </div>
                    <div className="mt-1 font-mono text-[11px] text-white/70">
                      Full-Stack Developer &middot; Islamabad, PK
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.header>
  );
}