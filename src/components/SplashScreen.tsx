"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [showName, setShowName] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowName(true), 900);
    const t2 = setTimeout(() => setVisible(false), 2600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const spokes = Array.from({ length: 10 }, (_, i) => (i * 360) / 10);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ clipPath: "circle(150% at 50% 50%)" }}
          exit={{ clipPath: "circle(0% at 50% 50%)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-ink"
        >
          <svg viewBox="0 0 400 400" className="absolute h-[70vmin] w-[70vmin]">
            {spokes.map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x2 = 200 + 190 * Math.cos(rad);
              const y2 = 200 + 190 * Math.sin(rad);
              return (
                <motion.line
                  key={i}
                  x1="200"
                  y1="200"
                  x2={x2}
                  y2={y2}
                  stroke="#3a1414"
                  strokeWidth="1"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: i * 0.04, ease: "easeOut" }}
                />
              );
            })}
            {[60, 110, 160].map((r, ringIndex) => (
              <motion.circle
                key={r}
                cx="200"
                cy="200"
                r={r}
                fill="none"
                stroke="#5c1a1a"
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 + ringIndex * 0.15, ease: "easeOut" }}
              />
            ))}
            <motion.circle
              cx="200"
              cy="200"
              r="5"
              fill="#e0393e"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.4, 1] }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </svg>

          {showName && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, letterSpacing: "0.4em" }}
              animate={{ opacity: 1, scale: 1, letterSpacing: "0.05em" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 text-center"
            >
              <h1
                className="text-3xl font-black uppercase text-text sm:text-5xl"
                style={{
                  fontFamily: "var(--font-display)",
                  textShadow: "0 0 24px rgba(224,57,62,0.5)",
                }}
              >
                Ahmad <span className="text-[#e0393e]">Abdullah</span>
              </h1>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mx-auto mt-3 h-[2px] max-w-[180px] bg-[#e0393e]"
              />
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}