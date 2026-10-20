"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowLeft, FiRotateCcw, FiVolume2, FiVolumeX, FiSun, FiMoon } from "react-icons/fi";

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
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
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
    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
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
    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
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
    gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
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
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
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
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.09 + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + idx * 0.09);
      osc.stop(this.ctx.currentTime + idx * 0.09 + 0.18);
    });
  }
}

// ── Brick Matrix Definition (27 columns x 9 rows for "404") ──
const MATRIX_404 = [
  // Row 0
  [1,1,0,0,0,1,1,0, 0,0, 0,1,1,1,1,1,0, 0,0, 1,1,0,0,0,1,1,0],
  // Row 1
  [1,1,0,0,0,1,1,0, 0,0, 1,1,0,0,0,1,1, 0,0, 1,1,0,0,0,1,1,0],
  // Row 2
  [1,1,0,0,0,1,1,0, 0,0, 1,1,0,0,0,1,1, 0,0, 1,1,0,0,0,1,1,0],
  // Row 3
  [1,1,0,0,0,1,1,0, 0,0, 1,1,0,0,0,1,1, 0,0, 1,1,0,0,0,1,1,0],
  // Row 4 (Crossbar)
  [1,1,1,1,1,1,1,1, 0,0, 1,1,0,0,0,1,1, 0,0, 1,1,1,1,1,1,1,1],
  // Row 5
  [0,0,0,0,0,1,1,0, 0,0, 1,1,0,0,0,1,1, 0,0, 0,0,0,0,0,1,1,0],
  // Row 6
  [0,0,0,0,0,1,1,0, 0,0, 1,1,0,0,0,1,1, 0,0, 0,0,0,0,0,1,1,0],
  // Row 7
  [0,0,0,0,0,1,1,0, 0,0, 1,1,0,0,0,1,1, 0,0, 0,0,0,0,0,1,1,0],
  // Row 8
  [0,0,0,0,0,1,1,0, 0,0, 0,1,1,1,1,1,0, 0,0, 0,0,0,0,0,1,1,0],
];

interface Brick {
  x: number;
  y: number;
  w: number;
  h: number;
  alive: boolean;
  isAccent: boolean;
  row: number;
  col: number;
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<RetroAudio>(new RetroAudio());

  // Game UI State
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [gameState, setGameState] = useState<"ready" | "playing" | "game_over" | "victory">("ready");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isDark, setIsDark] = useState<boolean>(true);
  const [highScore, setHighScore] = useState<number>(0);

  // Sync theme with document class
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

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    audioRef.current.enabled = next;
  };

  // Game engine refs (to avoid stale closures in requestAnimationFrame)
  const engineRef = useRef({
    paddle: { x: 350, y: 520, w: 110, h: 12, targetX: 350 },
    ball: { x: 400, y: 505, vx: 4, vy: -5, radius: 6, stuck: true },
    bricks: [] as Brick[],
    particles: [] as Particle[],
    combo: 0,
    width: 800,
    height: 580,
    deadSmiley: { x: 400, y: 115, r: 36, hits: 0, scale: 1 },
    keys: { left: false, right: false },
    active: true,
  });

  // Re-build brick grid
  const initBricks = useCallback((canvasW: number, canvasH: number) => {
    const cols = 27;
    const rows = 9;
    const totalW = Math.min(canvasW * 0.72, 540);
    const brickW = totalW / cols;
    const brickH = Math.max(12, brickW * 0.95);
    const startX = (canvasW - totalW) / 2;
    const startY = 185; // Below the dead smiley face

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
            row: r,
            col: c,
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
      const angle = (Math.random() * 0.5 - 0.25) * Math.PI; // -45 deg to +45 deg
      const speed = 6;
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

  // Handle keyboard inputs
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

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.min(Math.floor(rect.height), 680);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);

      const eng = engineRef.current;
      eng.width = w;
      eng.height = h;
      eng.paddle.w = Math.max(85, Math.min(125, w * 0.16));
      eng.paddle.y = h - 45;
      eng.deadSmiley.x = w / 2;
      eng.deadSmiley.y = 105;

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

      // Clear canvas
      ctx.clearRect(0, 0, w, h);

      // Smooth paddle movement
      if (eng.keys.left) eng.paddle.targetX -= 8;
      if (eng.keys.right) eng.paddle.targetX += 8;
      eng.paddle.targetX = Math.max(0, Math.min(w - eng.paddle.w, eng.paddle.targetX));
      eng.paddle.x += (eng.paddle.targetX - eng.paddle.x) * 0.35;

      // Ball positioning when stuck on paddle
      if (eng.ball.stuck) {
        eng.ball.x = eng.paddle.x + eng.paddle.w / 2;
        eng.ball.y = eng.paddle.y - eng.ball.radius - 3;
      } else {
        // Move ball
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

          // Calculate reflection angle based on hit position
          const hitOffset = (eng.ball.x - (p.x + p.w / 2)) / (p.w / 2); // -1 to +1
          const maxAngle = (68 * Math.PI) / 180;
          const currentSpeed = Math.min(10, Math.hypot(eng.ball.vx, eng.ball.vy) * 1.01);
          const reflectAngle = hitOffset * maxAngle;

          eng.ball.vx = currentSpeed * Math.sin(reflectAngle);
          eng.ball.vy = -currentSpeed * Math.cos(reflectAngle);
          eng.ball.y = p.y - eng.ball.radius - 1;

          // Paddle bounce squeeze animation
          p.h = 9;
        }

        // Return paddle height to normal
        p.h += (12 - p.h) * 0.2;

        // Dead Smiley Face collision (Bonus target!)
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

          // Particles from smiley
          for (let i = 0; i < 8; i++) {
            eng.particles.push({
              x: sm.x + nx * sm.r,
              y: sm.y + ny * sm.r,
              vx: (Math.random() - 0.5) * 6,
              vy: (Math.random() - 0.5) * 6,
              life: 1,
              maxLife: 25,
              color: isDark ? "#f2a93b" : "#8a0303",
              size: Math.random() * 3 + 2,
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

            // Particles on brick shatter
            const pColor = brick.isAccent
              ? isDark
                ? "#f2a93b"
                : "#8a0303"
              : isDark
              ? "#94a3b8"
              : "#212938";

            for (let i = 0; i < 6; i++) {
              eng.particles.push({
                x: brick.x + brick.w / 2,
                y: brick.y + brick.h / 2,
                vx: (Math.random() - 0.5) * 7,
                vy: (Math.random() - 0.5) * 7 - 1,
                life: 1,
                maxLife: 28,
                color: pColor,
                size: Math.random() * 3 + 2,
              });
            }

            // Determine collision edge to reflect ball
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

        // Check victory
        if (aliveCount === 0 && eng.bricks.length > 0) {
          setGameState("victory");
          audioRef.current.playWin();
          eng.ball.stuck = true;
        }

        // Ball falls off screen
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

      // 1. Draw Dead Smiley Face Boss Graphic
      const sm = eng.deadSmiley;
      ctx.save();
      ctx.translate(sm.x, sm.y);
      ctx.scale(sm.scale, sm.scale);

      const strokeCol = isDark ? "#f1f2f4" : "#0b0e13";
      ctx.lineWidth = 3;
      ctx.strokeStyle = strokeCol;

      // Outer circle
      ctx.beginPath();
      ctx.arc(0, 0, sm.r, 0, Math.PI * 2);
      ctx.stroke();

      // Left eye 'X'
      const eyeOffset = 13;
      const eyeSize = 5;
      ctx.beginPath();
      ctx.moveTo(-eyeOffset - eyeSize, -6 - eyeSize);
      ctx.lineTo(-eyeOffset + eyeSize, -6 + eyeSize);
      ctx.moveTo(-eyeOffset + eyeSize, -6 - eyeSize);
      ctx.lineTo(-eyeOffset - eyeSize, -6 + eyeSize);
      ctx.stroke();

      // Right eye 'X'
      ctx.beginPath();
      ctx.moveTo(eyeOffset - eyeSize, -6 - eyeSize);
      ctx.lineTo(eyeOffset + eyeSize, -6 + eyeSize);
      ctx.moveTo(eyeOffset + eyeSize, -6 - eyeSize);
      ctx.lineTo(eyeOffset - eyeSize, -6 + eyeSize);
      ctx.stroke();

      // Frown mouth
      ctx.beginPath();
      ctx.arc(0, 18, 12, Math.PI * 1.15, Math.PI * 1.85, false);
      ctx.stroke();
      ctx.restore();

      // 2. Draw "404" Bricks
      for (const brick of eng.bricks) {
        if (!brick.alive) continue;

        if (brick.isAccent) {
          ctx.fillStyle = isDark ? "#f2a93b" : "#8a0303";
        } else {
          ctx.fillStyle = isDark ? "#334155" : "#1b212d";
        }

        ctx.fillRect(brick.x, brick.y, brick.w, brick.h);
      }

      // 3. Draw Particles
      for (let i = eng.particles.length - 1; i >= 0; i--) {
        const pt = eng.particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy += 0.18; // gravity
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

      // 4. Draw Paddle
      const p = eng.paddle;
      ctx.fillStyle = isDark ? "#f2a93b" : "#8a0303";
      ctx.beginPath();
      const radius = p.h / 2;
      ctx.roundRect(p.x, p.y, p.w, p.h, radius);
      ctx.fill();

      // 5. Draw Ball
      const b = eng.ball;
      ctx.fillStyle = isDark ? "#ffffff" : "#0b0e13";
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fill();

      // Ball subtle glow in dark mode
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
    <div className="relative flex min-h-screen flex-col bg-[#F5F7F6] text-[#0b0e13] transition-colors duration-300 dark:bg-[#0b0e13] dark:text-[#f1f2f4]">
      {/* ── Top Bar ── */}
      <header className="relative z-20 flex items-center justify-between border-b border-gray-200/80 px-6 py-4 backdrop-blur-md dark:border-white/[0.08]">
        {/* Brand signature */}
        <Link
          href="/"
          data-cursor-hover
          className="group flex items-center gap-2"
          aria-label="Return to portfolio home"
        >
          <img
            src="/images/signature.svg"
            alt="Ahmad Abdullah"
            className="h-8 w-32 object-contain select-none transition-transform group-hover:scale-105 dark:invert"
          />
        </Link>

        {/* Center Live HUD */}
        <div className="hidden sm:flex items-center gap-6 font-mono text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-[#6b7280] dark:text-[#9aa4b5]">SCORE:</span>
            <span className="font-bold text-[#8a0303] dark:text-[#f2a93b]">
              {score.toString().padStart(5, "0")}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#6b7280] dark:text-[#9aa4b5]">LIVES:</span>
            <span className="text-red-500 font-bold tracking-widest">
              {"♥ ".repeat(Math.max(0, lives))}
            </span>
          </div>

          {highScore > 0 && (
            <div className="flex items-center gap-1.5 text-[11px] text-[#6b7280] dark:text-[#9aa4b5]">
              <span>BEST:</span>
              <span className="font-semibold text-[#0b0e13] dark:text-white">{highScore}</span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            data-cursor-hover
            aria-label={soundEnabled ? "Mute audio" : "Enable audio"}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-[#6b7280] transition-colors hover:text-[#0b0e13] dark:border-white/10 dark:text-[#9aa4b5] dark:hover:text-white"
          >
            {soundEnabled ? <FiVolume2 className="h-4 w-4" /> : <FiVolumeX className="h-4 w-4" />}
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            data-cursor-hover
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-[#6b7280] transition-colors hover:text-[#0b0e13] dark:border-white/10 dark:text-[#9aa4b5] dark:hover:text-white"
          >
            {isDark ? <FiSun className="h-4 w-4 text-[#f2a93b]" /> : <FiMoon className="h-4 w-4 text-[#8a0303]" />}
          </button>

          {/* Home Link */}
          <Link
            href="/"
            data-cursor-hover
            className="inline-flex items-center gap-1.5 rounded-full bg-[#0b0e13] px-3.5 py-1.5 font-mono text-xs font-medium text-white transition-all hover:bg-[#8a0303] dark:bg-white/10 dark:text-white dark:hover:bg-[#f2a93b] dark:hover:text-[#0b0e13]"
          >
            <FiArrowLeft className="h-3.5 w-3.5" />
            Home
          </Link>
        </div>
      </header>

      {/* ── Mobile HUD ── */}
      <div className="flex sm:hidden items-center justify-between border-b border-gray-200/60 px-6 py-2 font-mono text-xs dark:border-white/[0.06]">
        <div>
          <span className="text-[#6b7280] dark:text-[#9aa4b5]">SCORE: </span>
          <span className="font-bold text-[#8a0303] dark:text-[#f2a93b]">
            {score.toString().padStart(4, "0")}
          </span>
        </div>
        <div>
          <span className="text-[#6b7280] dark:text-[#9aa4b5]">LIVES: </span>
          <span className="text-red-500 font-bold">{"♥ ".repeat(Math.max(0, lives))}</span>
        </div>
      </div>

      {/* ── Main Playing Field ── */}
      <main
        ref={containerRef}
        className="relative flex-1 select-none overflow-hidden touch-none"
      >
        {/* Breakout Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block cursor-ew-resize"
        />

        {/* Subtitle tag matching reference: ( MIGHT AS WELL PLAY ) */}
        <div className="pointer-events-none absolute top-[335px] left-1/2 -translate-x-1/2 text-center">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#6b7280] dark:text-[#9aa4b5]">
            ( MIGHT AS WELL PLAY )
          </p>
          {gameState === "ready" && (
            <p className="mt-2 font-mono text-[11px] text-[#8a0303] animate-pulse dark:text-[#f2a93b]">
              [ CLICK SCREEN OR PRESS SPACE TO LAUNCH BALL ]
            </p>
          )}
        </div>

        {/* Modals & Game Over / Victory Overlay */}
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
                  You lost all your lives, but the web goes on.
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
                  You destroyed all 404 bricks! You found the way out.
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
      </main>

      {/* ── Footer Controls Bar ── */}
      <footer className="relative z-20 border-t border-gray-200/80 py-3 px-6 font-mono text-[11px] text-[#6b7280] backdrop-blur-md dark:border-white/[0.08] dark:text-[#9aa4b5]">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded border border-gray-300 px-1.5 py-0.5 text-[10px] dark:border-white/20">
              MOUSE / TOUCH
            </span>
            <span>or</span>
            <span className="rounded border border-gray-300 px-1.5 py-0.5 text-[10px] dark:border-white/20">
              &larr; &rarr; / A D
            </span>
            <span>to steer paddle</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={restartGame}
              data-cursor-hover
              className="inline-flex items-center gap-1 text-[#0b0e13] transition-colors hover:text-[#8a0303] dark:text-white dark:hover:text-[#f2a93b]"
            >
              <FiRotateCcw className="h-3 w-3" />
              Reset Game
            </button>
            <span className="opacity-40">&middot;</span>
            <Link
              href="/"
              data-cursor-hover
              className="text-[#8a0303] transition-colors hover:underline dark:text-[#f2a93b]"
            >
              Exit to Portfolio Home &rarr;
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
