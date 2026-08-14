"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

/* ---------- corner spiderweb (decorative, sits in all 4 corners) ---------- */
const CornerWeb = ({ corner }: { corner: "tl" | "tr" | "bl" | "br" }) => {
  const rotate =
    corner === "tl" ? 0 : corner === "tr" ? 90 : corner === "br" ? 180 : 270;
  const pos =
    corner === "tl"
      ? "top-0 left-0"
      : corner === "tr"
      ? "top-0 right-0"
      : corner === "br"
      ? "bottom-0 right-0"
      : "bottom-0 left-0";

  return (
    <svg
      className={`absolute ${pos} h-24 w-24 sm:h-32 sm:w-32 opacity-40`}
      style={{ transform: `rotate(${rotate}deg)` }}
      viewBox="0 0 100 100"
      fill="none"
    >
      {/* radial threads */}
      {[0, 20, 40, 60, 90].map((angle) => (
        <line
          key={angle}
          x1="0"
          y1="0"
          x2={100 * Math.cos((angle * Math.PI) / 180)}
          y2={100 * Math.sin((angle * Math.PI) / 180)}
          stroke="#c9c9c9"
          strokeWidth="0.6"
        />
      ))}
      {/* concentric arcs */}
      {[18, 36, 54, 72, 90].map((r) => (
        <path
          key={r}
          d={`M ${r} 0 A ${r} ${r} 0 0 1 0 ${r}`}
          stroke="#c9c9c9"
          strokeWidth="0.5"
          fill="none"
        />
      ))}
    </svg>
  );
};

/* ---------- roaming spider silhouette ---------- */
const SpiderIcon = ({ size = 20, opacity = 0.5 }: { size?: number; opacity?: number }) => (
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
  { top: "6%", duration: 3.2, delay: 0, reverse: false, size: 18 },
  { top: "18%", duration: 4.1, delay: 0.6, reverse: true, size: 14 },
  { top: "82%", duration: 3.8, delay: 0.3, reverse: false, size: 16 },
  { top: "94%", duration: 3.4, delay: 0.9, reverse: true, size: 20 },
];

/* ---------- web-shooter burst: a strand that "fires" out and retracts ---------- */
const WebShot = ({ side, delay }: { side: "left" | "right"; delay: number }) => (
  <motion.div
    className={`absolute bottom-[6%] ${side === "left" ? "left-[8%]" : "right-[8%]"} z-30`}
    initial={{ opacity: 0 }}
    animate={{ opacity: [0, 1, 1, 0] }}
    transition={{ duration: 1.1, delay, repeat: Infinity, repeatDelay: 2.2 }}
  >
    <svg width="90" height="140" viewBox="0 0 90 140" style={{ transform: side === "right" ? "scaleX(-1)" : undefined }}>
      <motion.path
        d="M10 140 C 20 90, 15 50, 45 5"
        stroke="#e8e8e8"
        strokeWidth="1.4"
        fill="none"
        strokeDasharray="4 3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 1, 0] }}
        transition={{ duration: 1.1, delay, repeat: Infinity, repeatDelay: 2.2, ease: "easeOut" }}
      />
      <motion.circle
        cx="45"
        cy="5"
        r="3"
        fill="#e8e8e8"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.1, delay, repeat: Infinity, repeatDelay: 2.2 }}
      />
    </svg>
  </motion.div>
);

/* ---------- spider-thread loader shown under the name ---------- */
const SpiderLoader = () => (
  <div className="relative mt-6 flex h-16 w-10 flex-col items-center">
    <div className="h-8 w-px bg-[#8a8a8a]/60" />
    <motion.div
      animate={{ y: [0, 22, 0] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="h-px w-px" />
      <SpiderIcon size={16} opacity={0.9} />
    </motion.div>
  </div>
);

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    hideTimer.current = setTimeout(() => setVisible(false), 4200);
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ x: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] overflow-hidden bg-[#0b0e13]"
        >
          {/* sketchy background texture */}
          <svg className="absolute inset-0 h-full w-full opacity-[0.06]" viewBox="0 0 100 100" preserveAspectRatio="none">
            {Array.from({ length: 40 }).map((_, i) => (
              <path
                key={i}
                d={`M ${Math.random() * 100} ${Math.random() * 100} L ${Math.random() * 100} ${Math.random() * 100}`}
                stroke="#ffffff"
                strokeWidth="0.15"
              />
            ))}
          </svg>

          {/* corner webs */}
          <CornerWeb corner="tl" />
          <CornerWeb corner="tr" />
          <CornerWeb corner="bl" />
          <CornerWeb corner="br" />

          {/* roaming spiders */}
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
                <SpiderIcon size={c.size} />
              </div>
            </motion.div>
          ))}

          <div className="relative flex h-full w-full flex-col items-center justify-center">
            {/* web shooters firing from bottom corners of the frame */}
            <WebShot side="left" delay={0.4} />
            <WebShot side="right" delay={1.2} />

            {/* split face / Spiderman frame */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-[52vh] w-[52vh] max-h-[380px] max-w-[380px] overflow-hidden rounded-full border-2 border-[#8a0303]"
            >
              <div className="absolute inset-0 flex">
                <motion.div
                  className="relative h-full w-1/2 overflow-hidden"
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Image
                    src="/images/Me.jpeg"
                    alt="Ahmad Abdullah"
                    fill
                    className="object-cover object-top grayscale contrast-125"
                  />
                </motion.div>
                <motion.div
                  className="relative h-full w-1/2 overflow-hidden"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Image
                    src="/images/spiderman-right.jpeg"
                    alt="Spider-Man"
                    fill
                    className="object-cover object-top"
                  />
                </motion.div>
              </div>

              {/* jagged stitched seam down the middle */}
              <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path
                  d="M50 0 L47 12 L53 24 L46 36 L52 50 L47 64 L53 76 L48 88 L50 100"
                  stroke="#0b0e13"
                  strokeWidth="1.6"
                  fill="none"
                  strokeDasharray="2 2"
                />
              </svg>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-6 text-center"
            >
              <h1 className="text-2xl font-black uppercase tracking-widest text-white sm:text-4xl">
                Ahmad Abdullah
              </h1>
            </motion.div>

            <SpiderLoader />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}