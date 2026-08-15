"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// pulsing glow for the frame border — a plain CSS animation is cheaper here
// than a framer-motion loop since it never needs to read component state
const glowPulseStyle = `
@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 0px rgba(138, 3, 3, 0); }
  50% { box-shadow: 0 0 22px rgba(138, 3, 3, 0.45); }
}
`;

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
    <div className={`absolute ${pos} h-40 w-40 sm:h-56 sm:w-56`} style={{ transform: `rotate(${rotate}deg)` }}>
      <svg className="absolute inset-0 h-full w-full opacity-50" viewBox="0 0 100 100" fill="none">
        {[0, 20, 40, 60, 90].map((angle, i) => (
          <motion.line
            key={angle}
            x1="0"
            y1="0"
            x2={100 * Math.cos((angle * Math.PI) / 180)}
            y2={100 * Math.sin((angle * Math.PI) / 180)}
            stroke="#8a0303"
            strokeWidth="0.6"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
          />
        ))}
        {[18, 36, 54, 72, 90].map((r, i) => (
          <motion.path
            key={r}
            d={`M ${r} 0 A ${r} ${r} 0 0 1 0 ${r}`}
            stroke="#8a0303"
            strokeWidth="0.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.7, delay: 0.3 + i * 0.1, ease: "easeOut" }}
          />
        ))}
      </svg>
      {/* spider thrown into the nest — drops from above with a bounce, then walks/wanders with animated legs */}
      <motion.div
        className="absolute"
        style={{ top: "26%", left: "26%" }}
        initial={{ y: -180, x: 30, rotate: -30, opacity: 0 }}
        animate={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 9, delay: 0.4 }}
      >
        <NestSpider size={28} opacity={0.9} color="#8a0303" />
      </motion.div>
    </div>
  );
};

/* ---------- spider silhouette ---------- */
const SpiderIcon = ({
  size = 20,
  opacity = 0.7,
  color = "#0b0e13",
}: {
  size?: number;
  opacity?: number;
  color?: string;
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ opacity }}>
    <ellipse cx="50" cy="58" rx="16" ry="20" fill={color} />
    <circle cx="50" cy="32" r="10" fill={color} />
    {[
      [30, 45, 5, 30], [30, 55, 2, 65], [30, 65, 8, 85],
      [70, 45, 95, 30], [70, 55, 98, 65], [70, 65, 92, 85],
    ].map(([x1, y1, x2, y2], i) => (
      <path
        key={i}
        d={`M ${x1} ${y1} Q ${x1 > 50 ? x1 + 15 : x1 - 15} ${y1 - 5}, ${x2} ${y2}`}
        stroke={color}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    ))}
  </svg>
);

/* ---------- spider with continuously animated legs (a real walk/climb cycle) — no built-in drift, safe to drop anywhere ---------- */
const AnimatedSpider = ({
  size = 20,
  opacity = 0.9,
  color = "#0b0e13",
}: {
  size?: number;
  opacity?: number;
  color?: string;
}) => {
  // each leg: [x1, y1, x2, y2] — shoulder point to foot point
  const legs: [number, number, number, number][] = [
    [30, 45, 5, 30], [30, 55, 2, 65], [30, 65, 8, 85],
    [70, 45, 95, 30], [70, 55, 98, 65], [70, 65, 92, 85],
  ];

  const legPath = (x1: number, y1: number, x2: number, y2: number, lift: number) => {
    const cx = x1 > 50 ? x1 + 15 : x1 - 15;
    const cy = y1 - 5 - lift;
    const fx = x1 > 50 ? x2 + lift * 0.6 : x2 - lift * 0.6;
    return `M ${x1} ${y1} Q ${cx} ${cy}, ${fx} ${y2}`;
  };

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ opacity }}>
      <ellipse cx="50" cy="58" rx="16" ry="20" fill={color} />
      <circle cx="50" cy="32" r="10" fill={color} />
      {legs.map(([x1, y1, x2, y2], i) => (
        <motion.path
          key={i}
          stroke={color}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          animate={{
            d: [
              legPath(x1, y1, x2, y2, 0),
              legPath(x1, y1, x2, y2, i % 2 === 0 ? 10 : -10),
              legPath(x1, y1, x2, y2, 0),
            ],
          }}
          transition={{
            duration: 0.55,
            repeat: Infinity,
            delay: i * 0.09,
            ease: "easeInOut",
          }}
        />
      ))}
    </svg>
  );
};

/* ---------- nest spider: AnimatedSpider plus a little wandering drift within the web ---------- */
const NestSpider = ({
  size = 28,
  opacity = 0.9,
  color = "#8a0303",
}: {
  size?: number;
  opacity?: number;
  color?: string;
}) => (
  <motion.div
    animate={{ x: [0, 6, -5, 3, 0], y: [0, -3, 2, -2, 0] }}
    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
  >
    <AnimatedSpider size={size} opacity={opacity} color={color} />
  </motion.div>
);

/* more roaming spiders, mixed heights/speeds/directions */
const crawlers = [
  { top: "6%", duration: 3.2, delay: 0, reverse: false, size: 32 },
  { top: "16%", duration: 4.4, delay: 0.6, reverse: true, size: 24 },
  { top: "34%", duration: 5.2, delay: 1.4, reverse: false, size: 28 },
  { top: "66%", duration: 4.8, delay: 0.9, reverse: true, size: 26 },
  { top: "82%", duration: 3.8, delay: 0.3, reverse: false, size: 32 },
  { top: "94%", duration: 3.4, delay: 1.8, reverse: true, size: 36 },
];

/* ---------- web shot: fires from a top corner and lands near the name, then leaves an impact mark ---------- */
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
  const cycle = 3.4; // total loop length, keep in sync with transitions below
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
      {/* impact burst on the name */}
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

/* ---------- custom web-shooter cursor that tracks the mouse ---------- */
const SwingingSpider = ({
  side,
  topPercent,
  length,
  inset = 4,
}: {
  side: "left" | "right";
  topPercent: number;
  length: number;
  inset?: number;
}) => (
  <div
    className="pointer-events-none absolute z-20"
    style={{ top: `${topPercent}%`, [side]: `${inset}%` }}
  >
    {/* drops in from above, bounces, then settles into the pendulum swing */}
    <motion.div
      initial={{ y: -260, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 11, delay: side === "left" ? 0.6 : 0.9 }}
    >
      <motion.div
        className="relative mx-auto"
        style={{ transformOrigin: "top center", height: `${length}px`, width: 1 }}
        animate={{ rotate: [side === "left" ? -14 : 14, side === "left" ? 10 : -10, side === "left" ? -14 : 14] }}
        transition={{ duration: 3.4, delay: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="h-full w-px bg-[#8a0303]/70" />
        {/* spider climbs up and back down the thread, on a loop */}
        <motion.div
          className="absolute left-1/2"
          style={{ marginLeft: -9 }}
          animate={{ top: [length - 18, length * 0.35, length - 18] }}
          transition={{ duration: 4.5, delay: side === "left" ? 1.8 : 2.1, repeat: Infinity, ease: "easeInOut" }}
        >
          <AnimatedSpider size={18} opacity={0.9} color="#8a0303" />
        </motion.div>
      </motion.div>
    </motion.div>
  </div>
);

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
  const [loadProgress, setLoadProgress] = useState(0);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    hideTimer.current = setTimeout(() => setVisible(false), 4200);
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  // Generate the background scribble lines exactly once, on the client,
  // after mount. This avoids a server/client mismatch (Math.random() would
  // differ between the two) and, more importantly, stops the lines from
  // being recalculated (and jumping around) on every re-render — which is
  // what was making the background appear to move with the cursor.
  useEffect(() => {
    const lines = Array.from({ length: 40 }).map(
      () =>
        `M ${Math.random() * 100} ${Math.random() * 100} L ${Math.random() * 100} ${Math.random() * 100}`
    );
    setBgLines(lines);
  }, []);

  // ticks the loader percentage up in lockstep with the progress bar's
  // own animation (same 300ms delay, 3600ms duration)
  useEffect(() => {
    let raf: number;
    const startTimeout = setTimeout(() => {
      const start = performance.now();
      const duration = 3600;
      function tick(now: number) {
        const pct = Math.min(100, Math.round(((now - start) / duration) * 100));
        setLoadProgress(pct);
        if (pct < 100) raf = requestAnimationFrame(tick);
      }
      raf = requestAnimationFrame(tick);
    }, 300);
    return () => {
      clearTimeout(startTimeout);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  function handleMouseMove(e: React.MouseEvent) {
    setCursorPos({ x: e.clientX, y: e.clientY });
    if (!cursorVisible) setCursorVisible(true);
  }

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
          <style>{glowPulseStyle}</style>
          <WebCursor x={cursorPos.x} y={cursorPos.y} visible={cursorVisible} />

          {/* sketchy background texture — generated once on mount, never on re-render */}
          <svg className="absolute inset-0 h-full w-full opacity-[0.07]" viewBox="0 0 100 100" preserveAspectRatio="none">
            {bgLines.map((d, i) => (
              <motion.path
                key={i}
                d={d}
                stroke="#000000"
                strokeWidth="0.15"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.2, delay: i * 0.02, ease: "easeOut" }}
              />
            ))}
          </svg>

          {/* corner webs, each with a resting spider */}
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
              <div style={{ transform: c.reverse ? "rotate(-90deg)" : "rotate(90deg)" }}>
                <AnimatedSpider size={c.size} color="#8a0303" />
              </div>
            </motion.div>
          ))}

          {/* web shots that travel down and hit near the name */}
          <WebHit fromX={2} toX={40} toY={78} delay={0.5} />
          <WebHit fromX={98} toX={60} toY={78} delay={2.1} />

          {/* spiders swinging on a thread down the sides, pendulum motion */}
          <SwingingSpider side="left" topPercent={0} length={220} inset={18} />
          <SwingingSpider side="right" topPercent={0} length={280} inset={18} />

          <div className="relative flex h-full w-full flex-col items-center justify-center">
            {/* split face / Spiderman frame */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-[52vh] w-[52vh] max-h-[380px] max-w-[380px] overflow-hidden rounded-full border-2 border-[#8a0303]"
              style={{ animation: "glowPulse 2.4s ease-in-out infinite" }}
            >
              <div className="absolute inset-0 flex">
                <div className="relative h-full w-1/2 overflow-hidden">
                  <motion.div
                    className="absolute inset-0"
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Image
                      src="/images/spiderman-right.jpeg"
                      alt="Spider-Man"
                      fill
                      className="object-cover object-center"
                    />
                  </motion.div>
                </div>
                <div className="relative h-full w-1/2 overflow-hidden">
                  <motion.div
                    className="absolute inset-0"
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Image
                      src="/images/Me.jpeg"
                      alt="Ahmad Abdullah"
                      fill
                      className="object-cover object-left grayscale contrast-125"
                    />
                  </motion.div>
                </div>
              </div>

              
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="relative mt-6 text-center"
            >
              <h1 className="text-2xl font-black uppercase tracking-widest text-[#8a0303] sm:text-4xl">
  Ahmad Abdullah
</h1>
            </motion.div>

            {/* progress bar loader with a spider marker riding the leading edge, facing its direction of travel */}
            <div className="relative mt-8 w-56">
              <motion.div
                className="absolute -top-5"
                initial={{ left: "0%" }}
                animate={{ left: "100%" }}
                transition={{ duration: 3.6, delay: 0.3, ease: [0.65, 0, 0.35, 1] }}
                style={{ marginLeft: "-9px" }}
              >
                <div style={{ transform: "rotate(90deg)" }}>
                  <AnimatedSpider size={18} opacity={0.95} />
                </div>
              </motion.div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-[#0b0e13]/10">
                <motion.div
                  className="h-full rounded-full bg-[#8a0303]"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3.6, delay: 0.3, ease: [0.65, 0, 0.35, 1] }}
                />
              </div>
              <div className="mt-2 text-center font-mono text-xs tracking-widest text-[#0b0e13]/70">
                {loadProgress}%
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}