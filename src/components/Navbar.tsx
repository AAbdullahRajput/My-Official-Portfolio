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

const links = [
  { label: "Work", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);

  // Detect scroll position
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    onScroll();

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Toggle dark mode
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

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
            ? "border-[#8a0303]/20 bg-white/90 shadow-lg shadow-black/10 backdrop-blur-md dark:border-white/10 dark:bg-[#0b0e13]/90"
            : "border-[#8a0303]/15 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-[#0b0e13]/80"
        }`}
      >
        {/* Logo */}
        <a href="#" data-cursor-hover className="flex items-center gap-2">
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
            <a
              key={link.href}
              href={link.href}
              data-cursor-hover
              className="font-mono text-xs text-[#6b7280] transition-colors hover:text-[#0b0e13] dark:text-gray-400 dark:hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 sm:flex">
          <a
            href="https://github.com/AAbdullahRajput"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-hover
            className="text-[#6b7280] transition-colors hover:text-[#0b0e13] dark:text-gray-400 dark:hover:text-white"
          >
            <FiGithub size={15} />
          </a>

          <a
            href="mailto:ahmadabdullah4972@gmail.com"
            data-cursor-hover
            className="text-[#6b7280] transition-colors hover:text-[#0b0e13] dark:text-gray-400 dark:hover:text-white"
          >
            <FiMail size={15} />
          </a>

          <a
            href="https://drive.google.com/file/d/170hCljehQe0QhSGE07ki7hglMUz1rYT3/view?usp=sharing"
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
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#8a0303]/20 text-[#6b7280] transition-colors hover:text-[#0b0e13] dark:border-white/10 dark:text-gray-400 dark:hover:text-white"
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
          className="mt-2 flex flex-col gap-1 rounded-2xl border border-[#8a0303]/15 bg-white px-6 py-4 shadow-lg dark:border-white/10 dark:bg-[#0b0e13]"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="py-3 font-mono text-sm text-[#6b7280] hover:text-[#0b0e13] dark:text-gray-400 dark:hover:text-white"
            >
              {link.label}
            </a>
          ))}

          <a
            href="https://github.com/AAbdullahRajput"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 font-mono text-sm text-[#6b7280] hover:text-[#0b0e13] dark:text-gray-400 dark:hover:text-white"
          >
            GitHub
          </a>

          <a
            href="mailto:ahmadabdullah4972@gmail.com"
            className="py-3 font-mono text-sm text-[#6b7280] hover:text-[#0b0e13] dark:text-gray-400 dark:hover:text-white"
          >
            Email
          </a>

          <button
            type="button"
            onClick={() => setDark((prev) => !prev)}
            className="flex items-center gap-2 py-3 font-mono text-sm text-[#6b7280] hover:text-[#0b0e13] dark:text-gray-400 dark:hover:text-white"
          >
            {dark ? <FiSun size={14} /> : <FiMoon size={14} />}
            {dark ? "Light mode" : "Dark mode"}
          </button>
        </motion.div>
      )}
    </motion.header>
  );
}
