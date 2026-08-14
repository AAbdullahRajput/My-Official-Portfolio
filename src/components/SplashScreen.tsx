"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const SpiderIcon = ({ size = 40, opacity = 1 }: { size?: number; opacity?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ opacity }}>
    <ellipse cx="50" cy="58" rx="16" ry="20" fill="#0b0e13" />
    <circle cx="50" cy="32" r="10" fill="#0b0e13" />
    {[
      [30, 45, 5, 30], [30, 55, 2, 65], [30, 65, 8, 85],
      [70, 45, 95, 30], [70, 55, 98, 65], [70, 65, 92, 85],
    ].map(([x1, y1, x2, y2], i) => (
      <path
        key={i}
        d={`M ${x1} ${y1} Q ${x1 > 50 ? x1 + 15 : x1 - 15} ${y1 - 5}, ${x2} ${y2}`}
        stroke="#0b0e13"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    ))}
  </svg>
);

const crawlers = [
  { top: "8%", duration: 3.2, delay: 0, reverse: false, size: 20 },
  { top: "90%", duration: 3.6, delay: 0.4, reverse: true, size: 22 },
];

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [hovered, setHovered] = useState(false);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    hideTimer.current = setTimeout(() => setVisible(false), 3800);
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  function pauseAutoHide() {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setHovered(true);
  }

  function resumeAutoHide() {
    setHovered(false);
    hideTimer.current = setTimeout(() => setVisible(false), 1400);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ x: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] overflow-hidden bg-[#0b0e13]"
        >
          {crawlers.map((c, i) => (
            <motion.div
              key={i}
              className="absolute z-20"
              style={{ top: c.top }}
              initial={{ x: c.reverse ? "110vw" : "-10vw" }}
              animate={{ x: c.reverse ? "-10vw" : "110vw" }}
              transition={{ duration: c.duration, delay: c.delay, repeat: Infinity, ease: "linear" }}
            >
              <div style={{ transform: c.reverse ? "scaleX(-1)" : undefined }}>
                <SpiderIcon size={c.size} opacity={0.5} />
              </div>
            </motion.div>
          ))}

          <div className="relative flex h-full w-full flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={pauseAutoHide}
              onMouseLeave={resumeAutoHide}
              className="relative h-[58vh] w-[58vh] max-h-[400px] max-w-[400px] cursor-none overflow-hidden rounded-full border-2 border-[#8a0303]"
            >
              <Image
  src="/images/profile1.jpeg"
  alt="Ahmad Abdullah"
  fill
  className="object-cover object-top"
  priority
/>

              <motion.div
                animate={{ opacity: hovered ? 1 : 0 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: "#a10f0f", mixBlendMode: "color" }}
                />
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: "#0b0e13", mixBlendMode: "luminosity", opacity: 0.4 }}
                />
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <path
                      key={`c${i}`}
                      d={`M ${50 + (Math.random() * 10 - 5)} ${50 + (Math.random() * 10 - 5)} L ${Math.random() * 100} ${Math.random() * 100}`}
                      stroke="rgba(255,255,255,0.35)"
                      strokeWidth="0.3"
                    />
                  ))}
                </svg>
                <div
                  className="absolute left-[32%] top-[38%] h-6 w-10 rounded-full"
                  style={{
                    background: "radial-gradient(circle, rgba(255,60,60,0.9) 0%, rgba(255,60,60,0) 70%)",
                    filter: "blur(2px)",
                  }}
                />
              </motion.div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: hovered ? 0 : 0.6 }}
              transition={{ duration: 0.3 }}
              className="mt-4 font-mono text-xs tracking-widest text-text-dim"
            >
              HOVER TO REVEAL
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-2 text-center"
            >
              <h1 className="text-2xl font-black uppercase tracking-widest text-white sm:text-4xl">
                Ahmad Abdullah
              </h1>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}