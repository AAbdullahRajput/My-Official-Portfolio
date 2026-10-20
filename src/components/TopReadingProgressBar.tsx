"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function TopReadingProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 z-[200] h-1 origin-left bg-gradient-to-r from-[#8a0303] via-[#e53e3e] to-[#f2a93b] shadow-[0_0_12px_rgba(229,62,62,0.5)] pointer-events-none"
    />
  );
}

