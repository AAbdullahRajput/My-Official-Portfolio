"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
      className="fixed top-4 left-1/2 z-50 w-[92%] max-w-3xl -translate-x-1/2"
    >
      <div
        className={`flex items-center justify-between rounded-full border px-4 py-2 transition-colors duration-300 sm:px-6 ${
          scrolled
            ? "border-[#8a0303]/20 bg-white/90 shadow-lg shadow-black/10 backdrop-blur-md dark:border-white/10 dark:bg-ink/90"
            : "border-[#8a0303]/15 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-ink/80"
        }`}
      >
        {/* Logo */}
        <a href="#" data-cursor-hover onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="flex items-center gap-2">
          <Image
            src="/images/profile.jpeg"
            alt="Ahmad Abdullah"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full border border-[#8a0303]/20 object-cover"
          />
        </a>

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
    </motion.header>
  );
}