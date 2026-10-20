"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ArcadeMusicPlayer from "@/components/ArcadeMusicPlayer";
import {
  FiArrowLeft,
  FiRotateCcw,
  FiVolume2,
  FiVolumeX,
  FiAlertTriangle,
  FiHeart,
  FiAward,
} from "react-icons/fi";

// ── Retro Sound Synthesizer via Web Audio API ──
class RetroAudio {
  private ctx: AudioContext | null = null;
  public enabled = true;

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playPaddle() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(340, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(460, this.ctx.currentTime + 0.07);
    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.07);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.07);
  }

  playBrick(combo = 1) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "square";
    const freq = Math.min(920, 420 + combo * 25);
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.4, this.ctx.currentTime + 0.06);
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  playWall() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playSmiley() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, this.ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  playLose() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(280, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(75, this.ctx.currentTime + 0.35);
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  playWin() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const notes = [261.63, 329.63, 392.0, 523.25, 659.25];
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.09);
      gain.gain.setValueAtTime(0.07, this.ctx.currentTime + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.09 + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + idx * 0.09);
      osc.stop(this.ctx.currentTime + idx * 0.09 + 0.18);
    });
  }
}

// ── Brick Matrix (27 cols x 9 rows forming "404") ──
const MATRIX_404 = [
  [1,1,0,0,0,1,1,0, 0,0, 0,1,1,1,1,1,0, 0,0, 1,1,0,0,0,1,1,0],
  [1,1,0,0,0,1,1,0, 0,0, 1,1,0,0,0,1,1, 0,0, 1,1,0,0,0,1,1,0],
  [1,1,0,0,0,1,1,0, 0,0, 1,1,0,0,0,1,1, 0,0, 1,1,0,0,0,1,1,0],
  [1,1,0,0,0,1,1,0, 0,0, 1,1,0,0,0,1,1, 0,0, 1,1,0,0,0,1,1,0],
  [1,1,1,1,1,1,1,1, 0,0, 1,1,0,0,0,1,1, 0,0, 1,1,1,1,1,1,1,1],
  [0,0,0,0,0,1,1,0, 0,0, 1,1,0,0,0,1,1, 0,0, 0,0,0,0,0,1,1,0],
  [0,0,0,0,0,1,1,0, 0,0, 1,1,0,0,0,1,1, 0,0, 0,0,0,0,0,1,1,0],
  [0,0,0,0,0,1,1,0, 0,0, 1,1,0,0,0,1,1, 0,0, 0,0,0,0,0,1,1,0],
  [0,0,0,0,0,1,1,0, 0,0, 0,1,1,1,1,1,0, 0,0, 0,0,0,0,0,1,1,0],
];

interface Brick {
  x: number;
  y: number;
  w: number;
  h: number;
  alive: boolean;
  isAccent: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameContainerRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<RetroAudio>(new RetroAudio());

  // Set 404 Tab Title
  useEffect(() => {
    document.title = "404 | Ahmad Abdullah Portfolio";
  }, []);

  // Game UI State
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [gameState, setGameState] = useState<"ready" | "playing" | "game_over" | "victory">("ready");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isDark, setIsDark] = useState<boolean>(true);
  const [highScore, setHighScore] = useState<number>(0);

  // Sync theme
  useEffect(() => {
    const checkDark = () => {
      const dark = document.documentElement.classList.contains("dark");
      setIsDark(dark);
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    audioRef.current.enabled = next;
  };

  // Game engine refs
  const engineRef = useRef({
    paddle: { x: 250, y: 440, w: 100, h: 11, targetX: 250 },
    ball: { x: 300, y: 425, vx: 4, vy: -5, radius: 6, stuck: true },
    bricks: [] as Brick[],
    particles: [] as Particle[],
    combo: 0,
    width: 600,
    height: 480,
    deadSmiley: { x: 300, y: 80, r: 30, hits: 0, scale: 1 },
    keys: { left: false, right: false },
  });

  // Re-build bricks
  const initBricks = useCallback((canvasW: number, canvasH: number) => {
    const cols = 27;
    const rows = 9;
    const totalW = Math.min(canvasW * 0.88, 480);
    const brickW = totalW / cols;
    const brickH = Math.max(10, brickW * 0.95);
    const startX = (canvasW - totalW) / 2;
    const startY = 145; // Sits neatly below dead smiley

    const newBricks: Brick[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (MATRIX_404[r][c] === 1) {
          const isAccent = r === 4 || (c >= 10 && c <= 16 && (r === 0 || r === 8));
          newBricks.push({
            x: startX + c * brickW,
            y: startY + r * brickH,
            w: brickW - 1.5,
            h: brickH - 1.5,
            alive: true,
            isAccent,
          });
        }
      }
    }
    return newBricks;
  }, []);

  // Launch ball
  const launchBall = useCallback(() => {
    const eng = engineRef.current;
    if (eng.ball.stuck) {
      eng.ball.stuck = false;
      const angle = (Math.random() * 0.5 - 0.25) * Math.PI;
      const speed = 5.8;
      eng.ball.vx = speed * Math.sin(angle);
      eng.ball.vy = -Math.abs(speed * Math.cos(angle));
      setGameState("playing");
      audioRef.current.playPaddle();
    }
  }, []);

  // Restart game
  const restartGame = useCallback(() => {
    const eng = engineRef.current;
    eng.bricks = initBricks(eng.width, eng.height);
    eng.paddle.x = (eng.width - eng.paddle.w) / 2;
    eng.paddle.targetX = eng.paddle.x;
    eng.ball.stuck = true;
    eng.ball.x = eng.paddle.x + eng.paddle.w / 2;
    eng.ball.y = eng.paddle.y - eng.ball.radius - 2;
    eng.particles = [];
    eng.combo = 0;
    eng.deadSmiley.hits = 0;
    setScore(0);
    setLives(3);
    setGameState("ready");
  }, [initBricks]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft" || e.code === "KeyA") {
        engineRef.current.keys.left = true;
      } else if (e.code === "ArrowRight" || e.code === "KeyD") {
        engineRef.current.keys.right = true;
      } else if (e.code === "Space") {
        e.preventDefault();
        if (gameState === "ready") {
          launchBall();
        } else if (gameState === "game_over" || gameState === "victory") {
          restartGame();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft" || e.code === "KeyA") {
        engineRef.current.keys.left = false;
      } else if (e.code === "ArrowRight" || e.code === "KeyD") {
        engineRef.current.keys.right = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameState, launchBall, restartGame]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      if (!gameContainerRef.current) return;
      const rect = gameContainerRef.current.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height || 490);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);

      const eng = engineRef.current;
      eng.width = w;
      eng.height = h;
      eng.paddle.w = Math.max(80, Math.min(115, w * 0.18));
      eng.paddle.y = h - 38;
      eng.deadSmiley.x = w / 2;
      eng.deadSmiley.y = 75;

      if (eng.bricks.length === 0) {
        eng.bricks = initBricks(w, h);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    // Mouse / Touch paddle tracking
    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const eng = engineRef.current;
      eng.paddle.targetX = Math.max(0, Math.min(eng.width - eng.paddle.w, relativeX - eng.paddle.w / 2));
    };

    const handlePointerDown = () => {
      if (engineRef.current.ball.stuck) {
        launchBall();
      }
    };

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerdown", handlePointerDown);

    // ── GAME LOOP ──
    const loop = () => {
      const eng = engineRef.current;
      const w = eng.width;
      const h = eng.height;

      ctx.clearRect(0, 0, w, h);

      // Smooth paddle movement
      if (eng.keys.left) eng.paddle.targetX -= 7;
      if (eng.keys.right) eng.paddle.targetX += 7;
      eng.paddle.targetX = Math.max(0, Math.min(w - eng.paddle.w, eng.paddle.targetX));
      eng.paddle.x += (eng.paddle.targetX - eng.paddle.x) * 0.35;

      // Ball positioning when stuck
      if (eng.ball.stuck) {
        eng.ball.x = eng.paddle.x + eng.paddle.w / 2;
        eng.ball.y = eng.paddle.y - eng.ball.radius - 3;
      } else {
        eng.ball.x += eng.ball.vx;
        eng.ball.y += eng.ball.vy;

        // Wall collisions
        if (eng.ball.x - eng.ball.radius <= 0) {
          eng.ball.x = eng.ball.radius;
          eng.ball.vx = Math.abs(eng.ball.vx);
          audioRef.current.playWall();
        } else if (eng.ball.x + eng.ball.radius >= w) {
          eng.ball.x = w - eng.ball.radius;
          eng.ball.vx = -Math.abs(eng.ball.vx);
          audioRef.current.playWall();
        }

        if (eng.ball.y - eng.ball.radius <= 0) {
          eng.ball.y = eng.ball.radius;
          eng.ball.vy = Math.abs(eng.ball.vy);
          audioRef.current.playWall();
        }

        // Paddle collision
        const p = eng.paddle;
        if (
          eng.ball.y + eng.ball.radius >= p.y &&
          eng.ball.y - eng.ball.radius <= p.y + p.h &&
          eng.ball.x >= p.x - 4 &&
          eng.ball.x <= p.x + p.w + 4 &&
          eng.ball.vy > 0
        ) {
          eng.combo = 0;
          audioRef.current.playPaddle();

          const hitOffset = (eng.ball.x - (p.x + p.w / 2)) / (p.w / 2);
          const maxAngle = (68 * Math.PI) / 180;
          const currentSpeed = Math.min(9.5, Math.hypot(eng.ball.vx, eng.ball.vy) * 1.01);
          const reflectAngle = hitOffset * maxAngle;

          eng.ball.vx = currentSpeed * Math.sin(reflectAngle);
          eng.ball.vy = -currentSpeed * Math.cos(reflectAngle);
          eng.ball.y = p.y - eng.ball.radius - 1;
        }

        // Dead Smiley Boss collision
        const sm = eng.deadSmiley;
        const dx = eng.ball.x - sm.x;
        const dy = eng.ball.y - sm.y;
        const dist = Math.hypot(dx, dy);
        if (dist <= sm.r + eng.ball.radius) {
          audioRef.current.playSmiley();
          const nx = dx / (dist || 1);
          const ny = dy / (dist || 1);
          const speed = Math.hypot(eng.ball.vx, eng.ball.vy);
          eng.ball.vx = nx * speed;
          eng.ball.vy = ny * speed;
          sm.hits += 1;
          sm.scale = 1.25;
          setScore((s) => s + 50);

          for (let i = 0; i < 7; i++) {
            eng.particles.push({
              x: sm.x + nx * sm.r,
              y: sm.y + ny * sm.r,
              vx: (Math.random() - 0.5) * 6,
              vy: (Math.random() - 0.5) * 6,
              life: 1,
              maxLife: 24,
              color: isDark ? "#f2a93b" : "#8a0303",
              size: Math.random() * 3 + 1.5,
            });
          }
        }
        sm.scale += (1 - sm.scale) * 0.15;

        // Brick collisions
        let aliveCount = 0;
        for (const brick of eng.bricks) {
          if (!brick.alive) continue;
          aliveCount++;

          if (
            eng.ball.x + eng.ball.radius >= brick.x &&
            eng.ball.x - eng.ball.radius <= brick.x + brick.w &&
            eng.ball.y + eng.ball.radius >= brick.y &&
            eng.ball.y - eng.ball.radius <= brick.y + brick.h
          ) {
            brick.alive = false;
            eng.combo++;
            audioRef.current.playBrick(eng.combo);

            setScore((s) => {
              const newScore = s + 10 * eng.combo;
              setHighScore((h) => Math.max(h, newScore));
              return newScore;
            });

            const pColor = brick.isAccent
              ? isDark
                ? "#f2a93b"
                : "#8a0303"
              : isDark
              ? "#94a3b8"
              : "#212938";

            for (let i = 0; i < 5; i++) {
              eng.particles.push({
                x: brick.x + brick.w / 2,
                y: brick.y + brick.h / 2,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6 - 1,
                life: 1,
                maxLife: 25,
                color: pColor,
                size: Math.random() * 2.5 + 1.5,
              });
            }

            const overlapLeft = eng.ball.x + eng.ball.radius - brick.x;
            const overlapRight = brick.x + brick.w - (eng.ball.x - eng.ball.radius);
            const overlapTop = eng.ball.y + eng.ball.radius - brick.y;
            const overlapBottom = brick.y + brick.h - (eng.ball.y - eng.ball.radius);

            const minOverlapX = Math.min(overlapLeft, overlapRight);
            const minOverlapY = Math.min(overlapTop, overlapBottom);

            if (minOverlapX < minOverlapY) {
              eng.ball.vx = -eng.ball.vx;
            } else {
              eng.ball.vy = -eng.ball.vy;
            }
            break;
          }
        }

        // Victory
        if (aliveCount === 0 && eng.bricks.length > 0) {
          setGameState("victory");
          audioRef.current.playWin();
          eng.ball.stuck = true;
        }

        // Ball out of bounds
        if (eng.ball.y - eng.ball.radius > h) {
          audioRef.current.playLose();
          eng.combo = 0;
          setLives((prevLives) => {
            const next = prevLives - 1;
            if (next <= 0) {
              setGameState("game_over");
              eng.ball.stuck = true;
            } else {
              eng.ball.stuck = true;
              eng.ball.x = eng.paddle.x + eng.paddle.w / 2;
              eng.ball.y = eng.paddle.y - eng.ball.radius - 3;
              setGameState("ready");
            }
            return next;
          });
        }
      }

      // ── DRAWING ──

      // 1. Dead Smiley Boss Graphic
      const sm = eng.deadSmiley;
      ctx.save();
      ctx.translate(sm.x, sm.y);
      ctx.scale(sm.scale, sm.scale);

      const strokeCol = isDark ? "#f1f2f4" : "#0b0e13";
      ctx.lineWidth = 2.8;
      ctx.strokeStyle = strokeCol;

      ctx.beginPath();
      ctx.arc(0, 0, sm.r, 0, Math.PI * 2);
      ctx.stroke();

      const eyeOffset = 11;
      const eyeSize = 4.5;
      ctx.beginPath();
      ctx.moveTo(-eyeOffset - eyeSize, -5 - eyeSize);
      ctx.lineTo(-eyeOffset + eyeSize, -5 + eyeSize);
      ctx.moveTo(-eyeOffset + eyeSize, -5 - eyeSize);
      ctx.lineTo(-eyeOffset - eyeSize, -5 + eyeSize);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(eyeOffset - eyeSize, -5 - eyeSize);
      ctx.lineTo(eyeOffset + eyeSize, -5 + eyeSize);
      ctx.moveTo(eyeOffset + eyeSize, -5 - eyeSize);
      ctx.lineTo(eyeOffset - eyeSize, -5 + eyeSize);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 15, 10, Math.PI * 1.15, Math.PI * 1.85, false);
      ctx.stroke();
      ctx.restore();

      // 2. "404" Bricks
      for (const brick of eng.bricks) {
        if (!brick.alive) continue;
        ctx.fillStyle = brick.isAccent
          ? isDark
            ? "#f2a93b"
            : "#8a0303"
          : isDark
          ? "#334155"
          : "#1b212d";
        ctx.fillRect(brick.x, brick.y, brick.w, brick.h);
      }

      // 3. Particles
      for (let i = eng.particles.length - 1; i >= 0; i--) {
        const pt = eng.particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy += 0.16;
        pt.life++;

        const alpha = Math.max(0, 1 - pt.life / pt.maxLife);
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = alpha;
        ctx.fillRect(pt.x, pt.y, pt.size, pt.size);
        ctx.globalAlpha = 1;

        if (pt.life >= pt.maxLife) {
          eng.particles.splice(i, 1);
        }
      }

      // 4. Paddle
      const p = eng.paddle;
      ctx.fillStyle = isDark ? "#f2a93b" : "#8a0303";
      ctx.beginPath();
      ctx.roundRect(p.x, p.y, p.w, p.h, p.h / 2);
      ctx.fill();

      // 5. Ball
      const b = eng.ball;
      ctx.fillStyle = isDark ? "#ffffff" : "#0b0e13";
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fill();

      if (isDark) {
        ctx.fillStyle = "rgba(242, 169, 59, 0.35)";
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius + 3, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [initBricks, isDark, launchBall]);

  return (
    <div className="relative min-h-screen bg-[#F5F7F6] text-[#0b0e13] transition-colors duration-300 dark:bg-[#0b0e13] dark:text-[#f1f2f4]">
      {/* ── Same Floating Portfolio Navbar ── */}
      <Navbar />

      {/* ── Ambient Background Mesh ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[10%] left-[5%] h-96 w-96 rounded-full bg-[#8a0303]/10 blur-3xl dark:bg-[#8a0303]/15" />
        <div className="absolute top-[40%] right-[5%] h-96 w-96 rounded-full bg-[#f2a93b]/10 blur-3xl dark:bg-[#f2a93b]/15" />
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* ── Main Container ── */}
      <div className="relative z-10 pt-28 sm:pt-36 lg:pt-40 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          {/* Header Title & Badges */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-3.5 py-1 font-mono text-[11px] font-semibold text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
              <FiAlertTriangle className="h-3.5 w-3.5" />
              ERROR 404 &middot; PAGE NOT FOUND
            </div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl dark:text-white">
              Lost in the Web?
            </h1>
            <p className="mt-2 max-w-lg text-xs leading-relaxed text-[#6b7280] sm:text-sm dark:text-[#9aa4b5]">
              The page you're searching for moved or doesn't exist. Break the 404 bricks below, groove to your favorite tunes, or head back to the portfolio!
            </p>
          </div>

          {/* ── Interactive Arcade & Music Hub Grid ── */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_360px] items-start">
            {/* Left Column: Brick Breaker Playing Field */}
            <div className="relative flex flex-col overflow-hidden rounded-[32px] border border-gray-200/90 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#12161f]/80">
              {/* Game Top HUD */}
              <div className="flex items-center justify-between border-b border-gray-200/80 px-6 py-3 font-mono text-xs dark:border-white/[0.08]">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#6b7280] dark:text-[#9aa4b5]">SCORE:</span>
                    <span className="font-bold text-[#8a0303] dark:text-[#f2a93b]">
                      {score.toString().padStart(5, "0")}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[#6b7280] dark:text-[#9aa4b5]">LIVES:</span>
                    <span className="text-red-500 font-bold tracking-wider">
                      {"♥ ".repeat(Math.max(0, lives))}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {highScore > 0 && (
                    <div className="hidden sm:flex items-center gap-1 text-[11px] text-[#6b7280] dark:text-[#9aa4b5]">
                      <FiAward className="h-3 w-3 text-[#f2a93b]" />
                      <span>BEST: {highScore}</span>
                    </div>
                  )}

                  {/* Sound Toggle */}
                  <button
                    type="button"
                    onClick={toggleSound}
                    data-cursor-hover
                    aria-label={soundEnabled ? "Mute audio" : "Enable audio"}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-[#6b7280] transition-colors hover:text-[#0b0e13] dark:border-white/10 dark:text-[#9aa4b5] dark:hover:text-white"
                  >
                    {soundEnabled ? <FiVolume2 className="h-3.5 w-3.5" /> : <FiVolumeX className="h-3.5 w-3.5" />}
                  </button>

                  {/* Reset */}
                  <button
                    type="button"
                    onClick={restartGame}
                    data-cursor-hover
                    aria-label="Restart game"
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-[#6b7280] transition-colors hover:text-[#0b0e13] dark:border-white/10 dark:text-[#9aa4b5] dark:hover:text-white"
                  >
                    <FiRotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Game Canvas Area */}
              <div
                ref={gameContainerRef}
                className="relative h-[480px] w-full select-none overflow-hidden touch-none"
              >
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 block cursor-ew-resize"
                />

                {/* Subtitle tag matching reference: ( MIGHT AS WELL PLAY ) */}
                <div className="pointer-events-none absolute top-[270px] left-1/2 -translate-x-1/2 text-center">
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#6b7280] dark:text-[#9aa4b5]">
                    ( MIGHT AS WELL PLAY )
                  </p>
                  {gameState === "ready" && (
                    <p className="mt-2 font-mono text-[11px] text-[#8a0303] animate-pulse dark:text-[#f2a93b]">
                      [ CLICK SCREEN OR PRESS SPACE TO LAUNCH BALL ]
                    </p>
                  )}
                </div>

                {/* Game Over / Victory Modal */}
                <AnimatePresence>
                  {gameState === "game_over" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                    >
                      <div className="w-full max-w-sm rounded-3xl border border-gray-200 bg-white p-6 text-center shadow-2xl dark:border-white/10 dark:bg-[#12161f]">
                        <div className="mb-2 font-mono text-2xl font-black text-rose-600 dark:text-rose-400">
                          GAME OVER
                        </div>
                        <p className="font-mono text-xs text-[#6b7280] dark:text-[#9aa4b5]">
                          You lost all lives, but you can retry anytime!
                        </p>
                        <div className="my-5 rounded-2xl border border-gray-200/80 bg-gray-50 p-4 font-mono dark:border-white/10 dark:bg-white/[0.03]">
                          <span className="text-xs text-[#6b7280] dark:text-[#9aa4b5]">FINAL SCORE</span>
                          <div className="text-3xl font-bold text-[#0b0e13] dark:text-white">
                            {score}
                          </div>
                        </div>

                        <div className="flex items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={restartGame}
                            data-cursor-hover
                            className="inline-flex items-center gap-2 rounded-xl bg-[#8a0303] px-4 py-2.5 font-mono text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#6e0202] dark:bg-[#f2a93b] dark:text-[#0b0e13] dark:hover:bg-[#d8932e]"
                          >
                            <FiRotateCcw className="h-3.5 w-3.5" />
                            Play Again
                          </button>
                          <Link
                            href="/"
                            data-cursor-hover
                            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 font-mono text-xs font-semibold text-[#0b0e13] transition-colors hover:bg-gray-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08]"
                          >
                            Return Home
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {gameState === "victory" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                    >
                      <div className="w-full max-w-sm rounded-3xl border border-emerald-500/30 bg-white p-6 text-center shadow-2xl dark:bg-[#12161f]">
                        <div className="mb-2 font-mono text-2xl font-black text-emerald-600 dark:text-emerald-400">
                          STAGE CLEARED! 🕷️
                        </div>
                        <p className="font-mono text-xs text-[#6b7280] dark:text-[#9aa4b5]">
                          You obliterated all 404 bricks! You found your way back.
                        </p>
                        <div className="my-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] p-4 font-mono">
                          <span className="text-xs text-emerald-700 dark:text-emerald-300">VICTORY SCORE</span>
                          <div className="text-3xl font-bold text-[#0b0e13] dark:text-white">
                            {score}
                          </div>
                        </div>

                        <div className="flex items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={restartGame}
                            data-cursor-hover
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 font-mono text-xs font-semibold text-white shadow-sm transition-all hover:bg-emerald-700"
                          >
                            <FiRotateCcw className="h-3.5 w-3.5" />
                            Play Again
                          </button>
                          <Link
                            href="/"
                            data-cursor-hover
                            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 font-mono text-xs font-semibold text-[#0b0e13] transition-colors hover:bg-gray-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08]"
                          >
                            Return Home
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Controls bar */}
              <div className="flex flex-wrap items-center justify-between border-t border-gray-200/80 px-6 py-3 font-mono text-[11px] text-[#6b7280] dark:border-white/[0.08] dark:text-[#9aa4b5]">
                <div className="flex items-center gap-2">
                  <span className="rounded border border-gray-300 px-1.5 py-0.5 text-[10px] dark:border-white/20">
                    MOUSE / TOUCH
                  </span>
                  <span>or</span>
                  <span className="rounded border border-gray-300 px-1.5 py-0.5 text-[10px] dark:border-white/20">
                    &larr; &rarr; / A D
                  </span>
                  <span>to steer</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded border border-gray-300 px-1.5 py-0.5 text-[10px] dark:border-white/20">
                    SPACE / TAP
                  </span>
                  <span>to launch</span>
                </div>
              </div>
            </div>

            {/* Right Column: Arcade Music Player (Behance / Google Ref Design) */}
            <div className="flex flex-col items-center">
              <ArcadeMusicPlayer />
            </div>
          </div>
        </div>
      </div>

      {/* ── Scroll to Top & Same Portfolio Footer ── */}
      <ScrollToTop />
      <Footer />
    </div>
  );
}
