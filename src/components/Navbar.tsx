"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiGithub, FiMail, FiFileText, FiMenu, FiX } from "react-icons/fi";

const links = [
  { label: "Work", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
        scrolled ? "border-b border-line bg-ink/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10 lg:px-16">
        <a href="#" data-cursor-hover className="font-display text-sm font-bold text-text">
          AA<span className="text-accent-blue">.</span>
        </a>

        <nav className="hidden items-center gap-8 sm:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} data-cursor-hover className="font-mono text-xs text-text-muted transition-colors hover:text-text">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 sm:flex">
          <a href="https://github.com/AAbdullahRajput" target="_blank" rel="noopener noreferrer" data-cursor-hover className="text-text-muted transition-colors hover:text-text">
            <FiGithub size={16} />
          </a>
          <a href="mailto:ahmadabdullah4972@gmail.com" data-cursor-hover className="text-text-muted transition-colors hover:text-text">
            <FiMail size={16} />
          </a>
          <a href="https://drive.google.com/file/d/170hCljehQe0QhSGE07ki7hglMUz1rYT3/view?usp=sharing" target="_blank" rel="noopener noreferrer" data-cursor-hover className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 font-mono text-xs text-text transition-colors hover:bg-panel">
            <FiFileText size={13} />
            Resume
          </a>
        </div>

        <button data-cursor-hover onClick={() => setMenuOpen(!menuOpen)} className="text-text sm:hidden">
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="flex flex-col gap-1 border-t border-line bg-ink px-6 py-4 sm:hidden"
        >
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="py-3 font-mono text-sm text-text-muted">
              {link.label}
            </a>
          ))}
          <a href="https://github.com/AAbdullahRajput" target="_blank" rel="noopener noreferrer" className="py-3 font-mono text-sm text-text-muted">
            GitHub
          </a>
          <a href="mailto:ahmadabdullah4972@gmail.com" className="py-3 font-mono text-sm text-text-muted">
            Email
          </a>
        </motion.div>
      )}
    </motion.header>
  );
}