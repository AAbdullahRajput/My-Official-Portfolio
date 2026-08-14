"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

/* ---------- corner spiderweb with a resting spider in it ---------- */
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
    <div className={`absolute ${pos} h-24 w-24 sm:h-32 sm:w-32`} style={{ transform: `rotate(${rotate}deg)` }}>
      <svg className="absolute inset-0 h-full w-full opacity-50" viewBox="0 0 100 100" fill="none">
        {[0, 20, 40, 60, 90].map((angle) => (
          <line
            key={angle}
            x1="0"
            y1="0"
            x2={100 * Math.cos((angle * Math.PI) / 180)}
            y2={100 * Math.sin((angle * Math.PI) / 180)}
            stroke="#3a3a3a"
            strokeWidth="0.6"
          />
        ))}
        {[18, 36, 54, 72, 90].map((r) => (
          <path
            key={r}
            d={`M ${r} 0 A ${r} ${r} 0 0 1 0 ${r}`}
            stroke="#3a3a3a"
            strokeWidth="0.5"
            fill="none"
          />
        ))}
      </svg>
      <motion.div
        className="absolute"
        style={{ top: "26%", left: "26%" }}
        animate={{ y: [0, 2, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <SpiderIcon size={14} opacity={0.9} />
      </motion.div>
    </div>
  );
};

const SpiderIcon = ({ size = 20, opacity = 0.7 }: { size?: number; opacity?: number }) => (
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
  { top: "6%", duration: 3.2, delay: 0, reverse: false, size: 16 },
  { top: "16%", duration: 4.4, delay: 0.6, reverse: true, size: 12 },
  { top: "34%", duration: 5.2, delay: 1.4, reverse: false, size: 14 },
  { top: "66%", duration: 4.8, delay: 0.9, reverse: true, size: 13 },
  { top: "82%", duration: 3.8, delay: 0.3, reverse: false, size: 16 },
  { top: "94%", duration: 3.4, delay: 1.8, reverse: true, size: 18 },
];

const WebHit = ({
  fromX,
  toX,
  toY,
  delay,
}: {
  fromX: number;
  toX: number;
  toY: number;
  delay: number;
}) => {
  const cycle = 3.4;
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-30 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <motion.path
        d={`M ${fromX} 0 Q ${(fromX + toX) / 2} ${toY * 0.5}, ${toX} ${toY}`}
        stroke="#2a2a2a"
        strokeWidth="0.35"
        fill="none"
        strokeDasharray="1.2 1"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1, delay, repeat: Infinity, repeatDelay: cycle - 1, ease: "easeOut" }}
      />
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 0], scale: [0.2, 1, 1.1] }}
        transition={{ duration: 0.6, delay: delay + 0.9, repeat: Infinity, repeatDelay: cycle - 0.6, ease: "easeOut" }}
        style={{ transformOrigin: `${toX}px ${toY}px` }}
      >
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <line
            key={a}
            x1={toX}
            y1={toY}
            x2={toX + 3.5 * Math.cos((a * Math.PI) / 180)}
            y2={toY + 3.5 * Math.sin((a * Math.PI) / 180)}
            stroke="#2a2a2a"
            strokeWidth="0.3"
          />
        ))}
      </motion.g>
    </svg>
  );
};

const WebCursor = ({ x, y, visible }: { x: number; y: number; visible: boolean }) => (
  <motion.div
    className="pointer-events-none fixed z-[10000]"
    animate={{ opacity: visible ? 1 : 0, x: x - 14, y: y - 14 }}
    transition={{ type: "tween", duration: 0.03 }}
    style={{ left: 0, top: 0 }}
  >
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="12" stroke="#1a1a1a" strokeWidth="1" opacity="0.7" />
      <line x1="14" y1="1" x2="14" y2="7" stroke="#1a1a1a" strokeWidth="1" />
      <line x1="14" y1="21" x2="14" y2="27" stroke="#1a1a1a" strokeWidth="1" />
      <line x1="1" y1="14" x2="7" y2="14" stroke="#1a1a1a" strokeWidth="1" />
      <line x1="21" y1="14" x2="27" y2="14" stroke="#1a1a1a" strokeWidth="1" />
      <circle cx="14" cy="14" r="2" fill="#a10f0f" />
    </svg>
  </motion.div>
);

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [bgLines, setBgLines] = useState<string[]>([]);
  // position of the reveal "hole" within the frame, in px relative to the frame's
  // own top-left corner — null means not hovering, so the Spider-Man mask stays solid
  const [maskPos, setMaskPos] = useState<{ x: number; y: number } | null>(null);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    hideTimer.current = setTimeout(() => setVisible(false), 4200);
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  useEffect(() => {
    const lines = Array.from({ length: 40 }).map(
      () =>
        `M ${Math.random() * 100} ${Math.random() * 100} L ${Math.random() * 100} ${Math.random() * 100}`
    );
    setBgLines(lines);
  }, []);

  function handleMouseMove(e: React.MouseEvent) {
    setCursorPos({ x: e.clientX, y: e.clientY });
    if (!cursorVisible) setCursorVisible(true);
  }

  function handleFrameMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setMaskPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  function handleFrameMouseLeave() {
    setMaskPos(null);
  }

  // radial-gradient mask applied to the Spider-Man layer: transparent near the
  // cursor (revealing the real photo underneath), solid everywhere else.
  const spidermanMaskStyle = maskPos
    ? {
        WebkitMaskImage: `radial-gradient(circle 85px at ${maskPos.x}px ${maskPos.y}px, transparent 0%, transparent 55%, black 85%)`,
        maskImage: `radial-gradient(circle 85px at ${maskPos.x}px ${maskPos.y}px, transparent 0%, transparent 55%, black 85%)`,
      }
    : undefined;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ x: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setCursorVisible(false)}
          className="fixed inset-0 z-[9999] overflow-hidden bg-white cursor-none"
        >
          <WebCursor x={cursorPos.x} y={cursorPos.y} visible={cursorVisible} />

          <svg className="absolute inset-0 h-full w-full opacity-[0.07]" viewBox="0 0 100 100" preserveAspectRatio="none">
            {bgLines.map((d, i) => (
              <path key={i} d={d} stroke="#000000" strokeWidth="0.15" />
            ))}
          </svg>

          <CornerWeb corner="tl" />
          <CornerWeb corner="tr" />
          <CornerWeb corner="bl" />
          <CornerWeb corner="br" />

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

          <WebHit fromX={2} toX={40} toY={78} delay={0.5} />
          <WebHit fromX={98} toX={60} toY={78} delay={2.1} />

          <div className="relative flex h-full w-full flex-col items-center justify-center">
            {/* face frame: Spider-Man mask on top, real photo underneath, hover to reveal */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              onMouseMove={handleFrameMouseMove}
              onMouseLeave={handleFrameMouseLeave}
              className="relative h-[52vh] w-[52vh] max-h-[380px] max-w-[380px] overflow-hidden rounded-full border-2 border-[#8a0303]"
            >
              {/* real photo, full circle, hidden underneath until revealed on hover */}
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src="/images/Me.jpeg"
                  alt="Ahmad Abdullah"
                  fill
                  className="object-cover object-left grayscale contrast-125"
                />
              </div>

              {/* Spider-Man mask: the source photo mirrored on the left half to complete
                  a symmetric face, original orientation on the right half. A radial hole
                  opens at the cursor to reveal the real photo underneath. */}
              <div className="absolute inset-0 flex" style={spidermanMaskStyle}>
                <div className="relative h-full w-1/2 overflow-hidden">
                  <Image
                    src="/images/spiderman-right.jpeg"
                    alt=""
                    fill
                    className="object-cover object-center scale-x-[-1]"
                  />
                </div>
                <div className="relative h-full w-1/2 overflow-hidden">
                  <Image
                    src="/images/spiderman-right.jpeg"
                    alt="Spider-Man"
                    fill
                    className="object-cover object-center"
                  />
                </div>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              transition={{ duration: 0.4, delay: 0.9 }}
              className="mt-3 font-mono text-[10px] uppercase tracking-widest text-[#0b0e13]"
            >
              Hover to reveal
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="relative mt-2 text-center"
            >
              <h1 className="text-2xl font-black uppercase tracking-widest text-[#0b0e13] sm:text-4xl">
                Ahmad Abdullah
              </h1>
            </motion.div>

            <div className="relative mt-6 flex h-16 w-10 flex-col items-center">
              <div className="h-8 w-px bg-[#0b0e13]/50" />
              <motion.div
                animate={{ y: [0, 22, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <SpiderIcon size={16} opacity={0.95} />
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}