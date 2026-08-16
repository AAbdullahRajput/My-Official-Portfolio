"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import { Unbounded, JetBrains_Mono } from "next/font/google";

const displayFont = Unbounded({ subsets: ["latin"], weight: ["700", "800"] });
const monoFont = JetBrains_Mono({ subsets: ["latin"], weight: ["500"] });

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
        <div style={{ transform: corner === "tl" ? "rotate(90deg)" : "none" }}>
          <NestSpider size={28} opacity={0.9} color="#8a0303" />
        </div>
      </motion.div>
      {corner !== "bl" && corner !== "tr" && <ThoughtBubble message={CORNER_MESSAGES[corner]} corner={corner} delay={CORNER_DELAYS[corner]} />}
    </div>
  );
};

const CORNER_MESSAGES: Record<"tl" | "tr" | "bl" | "br", string> = {
  tl: "Hey!",
  tr: "Hello!",
  bl: "With great power comes great responsibility.",
  br: "Hey, you found the right person.",
};

// starts after the spider's drop-in spring animation has settled (~1.3s), not during the fall
const CORNER_DELAYS: Record<"tl" | "tr" | "bl" | "br", number> = {
  tl: 1.3,
  tr: 1.9,
  bl: 2.5,
  br: 3.1,
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
  legWidth = 3,
  sharp = false,
  variant = "classic",
}: {
  size?: number;
  opacity?: number;
  color?: string;
  legWidth?: number;
  sharp?: boolean;
  variant?: "classic" | "logo";
}) => {
  // each leg: [x1, y1, x2, y2] — shoulder point to foot point
  const legs: [number, number, number, number][] = [
    [30, 45, 5, 30], [30, 55, 2, 65], [30, 65, 8, 85],
    [70, 45, 95, 30], [70, 55, 98, 65], [70, 65, 92, 85],
  ];

  const legPath = (x1: number, y1: number, x2: number, y2: number, lift: number) => {
    if (sharp) {
      // jointed leg: shoulder -> angled knee -> foot, for a sharper, more anatomical silhouette
      const kx = x1 > 50 ? x1 + 24 : x1 - 24;
      const ky = y1 + 8 - lift * 0.7;
      const fx = x1 > 50 ? x2 + lift * 0.6 : x2 - lift * 0.6;
      return `M ${x1} ${y1} L ${kx} ${ky} L ${fx} ${y2}`;
    }
    const cx = x1 > 50 ? x1 + 15 : x1 - 15;
    const cy = y1 - 5 - lift;
    const fx = x1 > 50 ? x2 + lift * 0.6 : x2 - lift * 0.6;
    return `M ${x1} ${y1} Q ${cx} ${cy}, ${fx} ${y2}`;
  };

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ opacity }}>
      {variant === "logo" ? (
        // single tapered, pointed body — no separate head, closer to the Spider-Man emblem shape
        <path
          d="M50 20 C61 20 68 36 68 56 C68 78 59 94 50 106 C41 94 32 78 32 56 C32 36 39 20 50 20 Z"
          fill={color}
        />
      ) : (
        <>
          <ellipse cx="50" cy="58" rx="16" ry="20" fill={color} />
          <circle cx="50" cy="32" r="10" fill={color} />
        </>
      )}
      {legs.map(([x1, y1, x2, y2], i) => (
        <motion.path
          key={i}
          stroke={color}
          strokeWidth={legWidth}
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

/* ---------- thought bubble: 3 small trailing dots then the full message bubble, cycling on a delay ---------- */
const ThoughtBubbleTopLeft = ({
  message,
  delay,
}: {
  message: string;
  delay: number;
}) => {
  const cycle = 6;

  return (
    <div
      className="pointer-events-none absolute z-30"
      style={{
        left: "35%",
        top: "26%",
      }}
    >
      <div className="absolute" style={{ right: "50%", top: "32%", marginLeft: -14, marginTop: -14 }}>
        {[3, 5, 8].map((size, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#8a0303]"
            style={{
              width: size,
              height: size,
              left: i * 12 + 8,
              top: -i * 12 + 14,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0, 1, 1, 0] }}
            transition={{
              duration: cycle,
              delay: delay + i * 0.18,
              repeat: Infinity,
              times: [0, 0.05, 0.35, 0.42],
              ease: "easeOut",
            }}
          />
        ))}

        <motion.div
          className="absolute rounded-2xl border border-[#8a0303]/40 bg-white px-6 py-1 shadow-md origin-bottom-left whitespace-nowrap"
          style={{
            left: 60,
            top: -30,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0, 1, 1, 0.8] }}
          transition={{
            duration: cycle,
            delay: delay + 0.55,
            repeat: Infinity,
            times: [0, 0.08, 0.85, 1],
            ease: [0.34, 1.56, 0.64, 1],
          }}
        >
          <span className={`${monoFont.className} text-xs leading-snug text-[#0b0e13]`}>{message}</span>
        </motion.div>
      </div>
    </div>
  );
};

const ThoughtBubbleBottomLeft = ({
  message,
  delay,
}: {
  message: string;
  delay: number;
}) => {
  const cycle = 6;

  return (
    <div
      className="pointer-events-none fixed z-30"
      style={{
        left: "8%",
        bottom: "13%",
      }}
    >
      <div className="absolute" style={{ right: "50%", bottom: "32%", marginLeft: -14, marginTop: -14 }}>
        {[3, 5, 8].map((size, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#8a0303]"
            style={{
              width: size,
              height: size,
              left: i * 12 + 8,
              top: -i * 12 + 14,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0, 1, 1, 0] }}
            transition={{
              duration: cycle,
              delay: delay + i * 0.18,
              repeat: Infinity,
              times: [0, 0.05, 0.35, 0.42],
              ease: "easeOut",
            }}
          />
        ))}

        <motion.div
          className="absolute rounded-2xl border border-[#8a0303]/40 bg-white px-6 py-1 shadow-md origin-bottom-left whitespace-nowrap"
          style={{
            left: 60,
            top: -30,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0, 1, 1, 0.8] }}
          transition={{
            duration: cycle,
            delay: delay + 0.55,
            repeat: Infinity,
            times: [0, 0.08, 0.85, 1],
            ease: [0.34, 1.56, 0.64, 1],
          }}
        >
          <span className={`${monoFont.className} text-xs leading-none text-[#0b0e13]`}>{message}</span>
        </motion.div>
      </div>
    </div>
  );
};

const ThoughtBubbleTopRight = ({
  message,
  delay,
}: {
  message: string;
  delay: number;
}) => {
  const cycle = 6;

  return (
    <div
      className="pointer-events-none fixed z-30"
      style={{
        right: "4%",
        top: "13%",
      }}
    >
      <div className="absolute" style={{ right: "50%", top: "32%", marginLeft: -14, marginTop: -14 }}>
        {[3, 5, 8].map((size, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#8a0303]"
            style={{
              width: size,
              height: size,
              left: -i * 12 + 8,
              top: i * 12 + 14,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0, 1, 1, 0] }}
            transition={{
              duration: cycle,
              delay: delay + i * 0.18,
              repeat: Infinity,
              times: [0, 0.05, 0.35, 0.42],
              ease: "easeOut",
            }}
          />
        ))}

        <motion.div
          className="absolute rounded-2xl border border-[#8a0303]/40 bg-white px-6 py-1 shadow-md origin-bottom-left whitespace-nowrap"
          style={{
            right: 60,
            top: -30,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0, 1, 1, 0.8] }}
          transition={{
            duration: cycle,
            delay: delay + 0.55,
            repeat: Infinity,
            times: [0, 0.08, 0.85, 1],
            ease: [0.34, 1.56, 0.64, 1],
          }}
        >
          <span className={`${monoFont.className} text-xs leading-snug text-[#0b0e13]`}>{message}</span>
        </motion.div>
      </div>
    </div>
  );
};

const ThoughtBubble = ({
  message,
  corner,
  delay,
}: {
  message: string;
  corner: "tl" | "tr" | "bl" | "br";
  delay: number;
}) => {
  if (corner === "tl") {
    return <ThoughtBubbleTopLeft message={message} delay={delay} />;
  }
  if (corner === "bl") {
    return <ThoughtBubbleBottomLeft message={message} delay={delay} />;
  }
  return null;
};

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
        stroke="#8a0303"
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
            stroke="#8a0303"
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

/* ---------- realistic spider web: spider on left, shoots real web geometry left then wraps around ---------- */
const WebCastingSpider = () => {
  // realistic web: radial strands + concentric circles
  const radialCount = 14;
  const circleCount = 5;
  
  return (
    <motion.div
      className="pointer-events-none absolute left-0 top-1/2 w-full"
      style={{ marginTop: -38, marginLeft: -190 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 1.5 }}
    >
      <svg
        className="absolute h-[70px] w-full"
        viewBox="0 0 100 70"
        preserveAspectRatio="none"
        style={{ pointerEvents: "none" }}
      >
        <g style={{ transformOrigin: "100px 35px" }}>
          {/* radial strands shooting from spider's back TO the name (left-down) */}
          {Array.from({ length: radialCount }).map((_, i) => {
            const angle = (i / radialCount) * Math.PI - Math.PI / 2;
            const x2 = 40 + 50 * Math.cos(angle);
            const y2 = 50 + 40 * Math.sin(angle);
            
            return (
              <motion.line
                key={`radial-${i}`}
                x1="35"
                y1="35"
                x2={x2}
                y2={y2}
                stroke="#810000"
                strokeWidth="0.5"
                opacity="0.95"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 2,
                  delay: 2 + (i % 4) * 0.15,
                  ease: "easeOut",
                }}
              />
            );
          })}

          {/* organic droop threads (vertical strands with curves) */}
          {Array.from({ length: 8 }).map((_, i) => {
            const xOffset = 20 + (i * 12);
            const droopAmount = 8 + Math.sin(i) * 3;
            return (
              <motion.path
                key={`droop-${i}`}
                d={`M ${xOffset} 35 Q ${xOffset + 2} ${35 + droopAmount}, ${xOffset} ${35 + droopAmount * 2}`}
                stroke="white"
                strokeWidth="0.2"
                fill="none"
                opacity="0.7"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 2.4,
                  delay: 2.5 + i * 0.12,
                  ease: "easeOut",
                }}
              />
            );
          })}
        </g>
      </svg>

      {/* spider at Ahmad side, back/hips facing name, face to left */}
      <motion.div
        className="absolute left-0 top-1/2"
        style={{ marginTop: 18, marginLeft: 140 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.2 }}
      >
        <div style={{ transform: "rotate(-90deg)" }}>
          <AnimatedSpider size={34} color="#8a0303" legWidth={4} sharp variant="logo" />
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ---------- isolated loader percentage — ticks 60x/sec but only re-renders this tiny piece ---------- */
const LoadPercent = () => {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    let raf: number;
    const startTimeout = setTimeout(() => {
      const start = performance.now();
      const duration = 3600;
      function tick(now: number) {
        const p = Math.min(100, Math.round(((now - start) / duration) * 100));
        setPct(p);
        if (p < 100) raf = requestAnimationFrame(tick);
      }
      raf = requestAnimationFrame(tick);
    }, 300);
    return () => {
      clearTimeout(startTimeout);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return <>{pct}%</>;
};

/* ---------- cursor is a running spider: legs always cycling, body rotates to face travel direction ---------- */
const SpiderCursor = ({
  x,
  y,
  rotate,
  visible,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  rotate: MotionValue<number>;
  visible: boolean;
}) => (
  <motion.div
    className="pointer-events-none fixed z-[10000]"
    style={{ left: 0, top: 0, x, y, opacity: visible ? 1 : 0 }}
  >
    <motion.div style={{ rotate }}>
      <AnimatedSpider size={30} color="#0b0e13" legWidth={3} />
    </motion.div>
  </motion.div>
);

/* ---------- web capture: strand fires from the spider's face to the click point,
   then a web-net converges around it like it's been wrapped up ---------- */
const CursorWebCapture = ({
  originX,
  originY,
  targetX,
  targetY,
}: {
  originX: number;
  originY: number;
  targetX: number;
  targetY: number;
}) => {
  const netRadius = 34;
  const spokes = 8;
  return (
    <svg className="pointer-events-none fixed inset-0 z-[9998] h-full w-full">
      {/* strand travels from the spider's face to the target */}
      <motion.line
        x1={originX}
        y1={originY}
        x2={targetX}
        y2={targetY}
        stroke="#8a0303"
        strokeWidth="2"
        strokeDasharray="6 4"
        initial={{ pathLength: 0, opacity: 1 }}
        animate={{ pathLength: 1, opacity: [1, 1, 0.6] }}
        transition={{ duration: 0.28, ease: "easeOut" }}
      />

      {/* web-net: spokes shoot outward from the target then a ring cinches around them,
          reading as the target getting wrapped up */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 0.9, delay: 0.22, times: [0, 0.15, 0.7, 1] }}>
        {Array.from({ length: spokes }).map((_, i) => {
          const a = (i / spokes) * Math.PI * 2;
          const ex = targetX + netRadius * Math.cos(a);
          const ey = targetY + netRadius * Math.sin(a);
          return (
            <motion.line
              key={i}
              x1={targetX}
              y1={targetY}
              x2={ex}
              y2={ey}
              stroke="#8a0303"
              strokeWidth="1.4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.22, delay: 0.22 + i * 0.015, ease: "easeOut" }}
            />
          );
        })}
        <motion.circle
          cx={targetX}
          cy={targetY}
          r={netRadius}
          stroke="#8a0303"
          strokeWidth="1.4"
          fill="none"
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ scale: [0.2, 1.15, 1], opacity: [0, 1, 1] }}
          transition={{ duration: 0.32, delay: 0.32, ease: "easeOut" }}
          style={{ transformOrigin: `${targetX}px ${targetY}px` }}
        />
        <motion.circle
          cx={targetX}
          cy={targetY}
          r={netRadius * 0.55}
          stroke="#8a0303"
          strokeWidth="1"
          fill="none"
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ scale: [0.2, 1.15, 1], opacity: [0, 0.8, 0.8] }}
          transition={{ duration: 0.32, delay: 0.4, ease: "easeOut" }}
          style={{ transformOrigin: `${targetX}px ${targetY}px` }}
        />
      </motion.g>
    </svg>
  );
};

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  // motion values instead of React state — the cursor position now updates
  // the DOM directly on every mousemove without re-rendering the component
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorAngle = useMotionValue(0);
  // the spider's default artwork faces "up", so add 90° to align angle-0 (facing right) correctly
  const spiderRotate = useTransform(cursorAngle, (a) => a + 90);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [bgLines, setBgLines] = useState<string[]>([]);
const [webCaptures, setWebCaptures] = useState<
    { id: number; originX: number; originY: number; targetX: number; targetY: number }[]
  >([]);
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

  function handleMouseMove(e: React.MouseEvent) {
    const nx = e.clientX;
    const ny = e.clientY;
    cursorX.set(nx - 15);
    cursorY.set(ny - 15);

    const dx = nx - lastMouseRef.current.x;
    const dy = ny - lastMouseRef.current.y;
    // only update facing direction once there's enough movement to be meaningful —
    // avoids the spider jittering in place on tiny mouse tremors
    if (dx * dx + dy * dy > 4) {
      cursorAngle.set((Math.atan2(dy, dx) * 180) / Math.PI);
      lastMouseRef.current = { x: nx, y: ny };
    }
    if (!cursorVisible) setCursorVisible(true);
  }

  function handleClick(e: React.MouseEvent) {
    // fire from just ahead of the cursor, in the direction the spider is currently facing
    const angleRad = (cursorAngle.get() * Math.PI) / 180;
    const faceOffset = 18;
    const originX = e.clientX + faceOffset * Math.cos(angleRad);
    const originY = e.clientY + faceOffset * Math.sin(angleRad);
    const id = Date.now() + Math.random();
    setWebCaptures((prev) => [
      ...prev,
      { id, originX, originY, targetX: e.clientX, targetY: e.clientY },
    ]);
    setTimeout(() => {
      setWebCaptures((prev) => prev.filter((c) => c.id !== id));
    }, 1150);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ x: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setCursorVisible(false)}
          onClick={handleClick}
          className="fixed inset-0 z-[9999] overflow-hidden bg-white cursor-none"
        >
          <style>{glowPulseStyle}</style>
          <SpiderCursor x={cursorX} y={cursorY} rotate={spiderRotate} visible={cursorVisible} />
          {webCaptures.map((c) => (
            <CursorWebCapture
              key={c.id}
              originX={c.originX}
              originY={c.originY}
              targetX={c.targetX}
              targetY={c.targetY}
            />
          ))}

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
          <ThoughtBubbleTopRight message={CORNER_MESSAGES.tr} delay={CORNER_DELAYS.tr} />
          <CornerWeb corner="bl" />
          <ThoughtBubbleBottomLeft message={CORNER_MESSAGES.bl} delay={CORNER_DELAYS.bl} />
          <CornerWeb corner="br" />

          {/* roaming spiders — fall in at the screen edge, land, THEN crawl across */}
          {crawlers.map((c, i) => {
            const entryX = c.reverse ? "100vw" : "0vw"; // on-screen edge, where it lands
            const exitX = c.reverse ? "-10vw" : "110vw"; // off-screen, where it exits
            const fallDuration = 0.6;
            const totalDuration = fallDuration + c.duration + 0.3;
            const times = [
              0,
              fallDuration / totalDuration,
              (fallDuration + c.duration) / totalDuration,
              1,
            ];

            return (
              <motion.div
                key={i}
                className="absolute z-20"
                style={{ top: c.top }}
                initial={{ x: entryX, y: -120, opacity: 0 }}
                animate={{
                  x: [entryX, entryX, exitX, exitX],
                  y: [-120, 0, 0, 0],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: totalDuration,
                  delay: c.delay,
                  times,
                  repeat: Infinity,
                  ease: ["easeOut", "linear", "easeIn"],
                }}
              >
                <div style={{ transform: c.reverse ? "rotate(-90deg)" : "rotate(90deg)" }}>
                  <AnimatedSpider size={c.size} color="#8a0303" />
                </div>
              </motion.div>
            );
          })}

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
              <h1 className={`${displayFont.className} relative z-10 text-2xl uppercase tracking-widest text-[#8a0303] sm:text-4xl`}>
                Ahmad Abdullah
              </h1>
              <WebCastingSpider />
            </motion.div>

            {/* progress bar loader with a spider marker riding the leading edge, facing its direction of travel */}
            <div className="relative mt-8 w-56">
              <motion.div
                className="absolute -top-6"
                initial={{ left: "0%" }}
                animate={{ left: "100%" }}
                transition={{ duration: 3.6, delay: 0.3, ease: [0.65, 0, 0.35, 1] }}
                style={{ marginLeft: "-15px" }}
              >
                <div style={{ transform: "rotate(90deg)" }}>
                  <AnimatedSpider size={30} opacity={0.95} color="#8a0303" legWidth={5} sharp />
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
              <div className={`${monoFont.className} mt-2 text-center text-xs tracking-widest text-[#8a0303]/70`}>
                <LoadPercent />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}