"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

const AnimatedSpider = ({
  size = 30,
  opacity = 1,
  color = "#0b0e13",
  legWidth = 3,
}: {
  size?: number;
  opacity?: number;
  color?: string;
  legWidth?: number;
}) => {
  const legs: [number, number, number, number][] = [
    [30, 45, 5, 30],
    [30, 55, 2, 65],
    [30, 65, 8, 85],
    [70, 45, 95, 30],
    [70, 55, 98, 65],
    [70, 65, 92, 85],
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
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 0.9, delay: 0.22, times: [0, 0.15, 0.7, 1] }}
      >
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

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorAngle = useMotionValue(0);
  const spiderRotate = useTransform(cursorAngle, (a) => a + 90);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  type WebCapture = { id: number; originX: number; originY: number; targetX: number; targetY: number };
  const [webCaptures, setWebCaptures] = useState<WebCapture[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const nx = e.clientX;
      const ny = e.clientY;
      cursorX.set(nx - 15);
      cursorY.set(ny - 15);

      const dx = nx - lastMouseRef.current.x;
      const dy = ny - lastMouseRef.current.y;
      if (dx * dx + dy * dy > 4) {
        cursorAngle.set((Math.atan2(dy, dx) * 180) / Math.PI);
        lastMouseRef.current = { x: nx, y: ny };
      }
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    const handleClick = (e: MouseEvent) => {
      const angleRad = (cursorAngle.get() * Math.PI) / 180;
      const faceOffset = 18;
      const originX = e.clientX + faceOffset * Math.cos(angleRad);
      const originY = e.clientY + faceOffset * Math.sin(angleRad);
      const id = Date.now() + Math.random();
      setWebCaptures((prev: WebCapture[]) => [
        ...prev,
        { id, originX, originY, targetX: e.clientX, targetY: e.clientY },
      ]);
      setTimeout(() => {
        setWebCaptures((prev: WebCapture[]) => prev.filter((c: WebCapture) => c.id !== id));
      }, 1150);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [visible, cursorX, cursorY, cursorAngle]);

  return (
    <>
      {webCaptures.map((c) => (
        <CursorWebCapture
          key={c.id}
          originX={c.originX}
          originY={c.originY}
          targetX={c.targetX}
          targetY={c.targetY}
        />
      ))}
      <motion.div
        className="pointer-events-none fixed z-[10000]"
        style={{
          left: 0,
          top: 0,
          x: cursorX,
          y: cursorY,
          opacity: visible ? 1 : 0,
        }}
      >
        <motion.div style={{ rotate: spiderRotate }}>
          <AnimatedSpider size={50} color="#8a0303" legWidth={3} />
        </motion.div>
      </motion.div>
    </>
  );
}