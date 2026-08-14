"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
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
      className="fixed top-4 left-1/2 z-50 w-[92%] max-w-3xl -translate-x-1/2"
    >
      <div
        className={`flex items-center justify-between rounded-full border border-line px-4 py-2 transition-colors duration-300 sm:px-6 ${
          scrolled ? "bg-ink/90 backdrop-blur-md shadow-lg shadow-black/20" : "bg-ink-soft/70 backdrop-blur-sm"
        }`}
      >
        <a href="#" data-cursor-hover className="flex items-center gap-2">
          <Image
            src="/images/profile.jpeg"
            alt="Ahmad Abdullah"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full border border-line object-cover"
          />
        </a>

        <nav className="hidden items-center gap-6 sm:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} data-cursor-hover className="font-mono text-xs text-text-muted transition-colors hover:text-text">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <a href="https://github.com/AAbdullahRajput" target="_blank" rel="noopener noreferrer" data-cursor-hover className="text-text-muted transition-colors hover:text-text">
            <FiGithub size={15} />
          </a>
          <a href="mailto:ahmadabdullah4972@gmail.com" data-cursor-hover className="text-text-muted transition-colors hover:text-text">
            <FiMail size={15} />
          </a>
          <a href="https://drive.google.com/file/d/170hCljehQe0QhSGE07ki7hglMUz1rYT3/view?usp=sharing" target="_blank" rel="noopener noreferrer" data-cursor-hover className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 font-mono text-xs text-text transition-colors hover:bg-panel">
            <FiFileText size={12} />
            Resume
          </a>
        </div>

        <button data-cursor-hover onClick={() => setMenuOpen(!menuOpen)} className="text-text sm:hidden">
          {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 flex flex-col gap-1 rounded-2xl border border-line bg-ink px-6 py-4 sm:hidden"
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