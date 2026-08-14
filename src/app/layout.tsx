"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  { top: "15%", duration: 3.2, delay: 0, reverse: false, size: 28 },
  { top: "28%", duration: 2.6, delay: 0.3, reverse: true, size: 20 },
  { top: "42%", duration: 3.8, delay: 0.6, reverse: false, size: 34 },
  { top: "58%", duration: 2.9, delay: 0.15, reverse: true, size: 22 },
  { top: "70%", duration: 3.4, delay: 0.5, reverse: false, size: 26 },
  { top: "82%", duration: 2.7, delay: 0.8, reverse: true, size: 18 },
  { top: "10%", duration: 4.0, delay: 1.0, reverse: true, size: 24 },
  { top: "90%", duration: 3.1, delay: 0.2, reverse: false, size: 30 },
];

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [showName, setShowName] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowName(true), 700);
    const t2 = setTimeout(() => setVisible(false), 2400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ x: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] overflow-hidden bg-gradient-to-br from-[#8a0303] via-[#3d0808] to-[#0b0e13]"
        >
          {crawlers.map((c, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ top: c.top }}
              initial={{ x: c.reverse ? "110vw" : "-10vw" }}
              animate={{ x: c.reverse ? "-10vw" : "110vw" }}
              transition={{
                duration: c.duration,
                delay: c.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <div style={{ transform: c.reverse ? "scaleX(-1)" : undefined }}>
                <SpiderIcon size={c.size} opacity={0.5} />
              </div>
            </motion.div>
          ))}

          <div className="relative z-10 flex h-full w-full items-center justify-center">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <SpiderIcon size={90} />
            </motion.div>

            {showName && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute bottom-[20%] text-center"
              >
                <h1 className="text-2xl font-black uppercase tracking-widest text-white sm:text-4xl">
                  Ahmad Abdullah
                </h1>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}