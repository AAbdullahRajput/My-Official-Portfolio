"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Reveal button after user scrolls past top hero section (> 350px)
      setVisible(scrollY > 350);

      if (docHeight > 0) {
        setProgress(Math.min(1, Math.max(0, scrollY / docHeight)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-to-top"
          onClick={scrollToTop}
          data-cursor-hover
          initial={{ opacity: 0, scale: 0.6, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="group fixed bottom-6 right-6 z-40 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-gray-200/90 bg-white/90 shadow-lg shadow-black/5 backdrop-blur-md transition-colors duration-200 hover:border-[#8a0303] hover:bg-white hover:shadow-xl hover:shadow-[#8a0303]/15 dark:border-white/15 dark:bg-[#131a26]/90 dark:hover:border-accent-green dark:hover:bg-[#1b212d] dark:hover:shadow-accent-green/15 focus:outline-none"
          aria-label="Scroll to top"
        >
          {/* Circular progress ring indicating page scroll depth */}
          <svg className="pointer-events-none absolute inset-0 -rotate-90 h-full w-full p-0.5" viewBox="0 0 44 44">
            <circle
              cx="22"
              cy="22"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-200/70 dark:text-white/10"
            />
            <circle
              cx="22"
              cy="22"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-[#8a0303] dark:text-accent-green transition-[stroke-dashoffset] duration-150"
            />
          </svg>

          {/* Up arrow icon */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="relative z-10 h-4 w-4 sm:h-5 sm:w-5 -translate-y-0.5 text-[#0b0e13] transition-transform duration-200 group-hover:-translate-y-1 group-hover:text-[#8a0303] dark:text-text dark:group-hover:text-accent-green"
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>

          {/* Hover tooltip */}
          <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-[#0b0e13] px-2 py-0.5 font-mono text-[10px] font-medium text-white opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100 dark:bg-white dark:text-[#0b0e13] whitespace-nowrap">
            Back to top
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

