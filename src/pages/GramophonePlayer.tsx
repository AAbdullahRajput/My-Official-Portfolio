"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DOCK_DELAY = 5000;

export default function GramophonePlayer({ active }: { active: boolean }) {
  const [phase, setPhase] = useState<"hidden" | "paused" | "resuming" | "center" | "docked" | "gone">("hidden");
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gifRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!active || phase !== "hidden") return;
    // small delay so splash has cleared before the pause overlay appears
    const t = setTimeout(() => setPhase("paused"), 400);
    return () => clearTimeout(t);
  }, [active, phase]);

  function handlePlay() {
    setPhase("resuming");
    // play the audio (user just clicked — browser allows it)
    audioRef.current?.play().catch((err) => {
      console.warn("Gramophone audio play failed:", err);
    });
    setPlaying(true);
    // after the "resume" animation settles, move to centered gramophone
    setTimeout(() => {
      setPhase("center");
      dockTimerRef.current = setTimeout(() => setPhase("docked"), DOCK_DELAY);
    }, 900);
  }

  function toggleMute() {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setMuted(audioRef.current.muted);
    }
  }

  function handleAudioEnded() {
    setPhase("gone");
  }

  useEffect(() => {
    return () => {
      if (dockTimerRef.current) clearTimeout(dockTimerRef.current);
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <>
      <audio ref={audioRef} src="/song/sunflower.mp3" onEnded={handleAudioEnded} />

      {/* ── PAUSED WORLD OVERLAY ── */}
      <AnimatePresence>
        {(phase === "paused" || phase === "resuming") && (
          <motion.div
            className="fixed inset-0 z-[9000] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: phase === "resuming" ? 0.7 : 0.5, ease: "easeInOut" }}
          >
            {/* gradient backdrop — portfolio barely bleeds through */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                background:
                  "radial-gradient(ellipse at 50% 40%, rgba(11,14,19,0.72) 0%, rgba(11,14,19,0.88) 55%, rgba(11,14,19,0.96) 100%)",
                backdropFilter: "blur(18px) saturate(0.4)",
                WebkitBackdropFilter: "blur(18px) saturate(0.4)",
              }}
            />

            {/* frozen gramophone — blurred, desaturated, looks "paused" */}
            <motion.div
              className="absolute"
              style={{ width: 280, filter: "blur(6px) grayscale(0.85) brightness(0.6)" }}
              animate={
                phase === "resuming"
                  ? { filter: "blur(0px) grayscale(0) brightness(1)", scale: 1.06 }
                  : { filter: "blur(6px) grayscale(0.85) brightness(0.6)", scale: 1 }
              }
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <img src="/gifs/gramophone.gif" alt="" className="w-full drop-shadow-2xl" />
            </motion.div>

            {/* play button — only while truly paused */}
            <AnimatePresence>
              {phase === "paused" && (
                <motion.button
                  onClick={handlePlay}
                  className="relative z-10 flex flex-col items-center gap-4"
                  aria-label="Resume and play music"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.15 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* pulsing outer ring */}
                  <div className="relative flex items-center justify-center">
                    <motion.div
                      className="absolute rounded-full border border-[#8a0303]/50"
                      animate={{ scale: [1, 1.55], opacity: [0.6, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                      style={{ width: 88, height: 88 }}
                    />
                    <motion.div
                      className="absolute rounded-full border border-[#8a0303]/30"
                      animate={{ scale: [1, 1.9], opacity: [0.4, 0] }}
                      transition={{ duration: 1.6, delay: 0.4, repeat: Infinity, ease: "easeOut" }}
                      style={{ width: 88, height: 88 }}
                    />
                    {/* main button */}
                    <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full border-2 border-[#8a0303] bg-white/10 shadow-2xl backdrop-blur-sm">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-xs tracking-[0.25em] text-white/60 uppercase font-light">
                    click to resume
                  </span>
                </motion.button>
              )}
            </AnimatePresence>

            {/* "world resumes" flash on click */}
            <AnimatePresence>
              {phase === "resuming" && (
                <motion.div
                  className="pointer-events-none absolute inset-0"
                  initial={{ opacity: 0.35 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  style={{ background: "rgba(138,3,3,0.18)" }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── GRAMOPHONE (centered → docked) ── */}
      <AnimatePresence>
        {(phase === "center" || phase === "docked") && (
          <motion.div
            className="fixed z-[9000]"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={
              phase === "center"
                ? {
                    top: "50%",
                    left: "50%",
                    x: "-50%",
                    y: "-50%",
                    width: 300,
                    opacity: 1,
                    scale: 1,
                    bottom: "auto",
                    right: "auto",
                  }
                : {
                    top: "auto",
                    bottom: 24,
                    left: 24,
                    right: "auto",
                    x: 0,
                    y: 0,
                    width: 90,
                    opacity: 1,
                    scale: 1,
                  }
            }
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: phase === "center" ? 0.5 : 1, ease: [0.65, 0, 0.35, 1] }}
            style={{ position: "fixed" }}
          >
            <img src="/gifs/gramophone.gif" alt="" className="pointer-events-none w-full drop-shadow-2xl" />

            {playing && (
              <button
                onClick={toggleMute}
                className="pointer-events-auto absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-[#8a0303]/40 bg-white text-[#8a0303] shadow-sm"
                aria-label={muted ? "Unmute music" : "Mute music"}
              >
                {muted ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                    <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                    <path d="M18.5 5.5a9 9 0 0 1 0 13" />
                  </svg>
                )}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}