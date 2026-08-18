"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DOCK_DELAY = 3000;
const AUDIO_DELAY = 1500;

export default function GramophonePlayer({ active }: { active: boolean }) {
  const [phase, setPhase] = useState<"hidden" | "paused" | "center" | "docking" | "docked" | "gone">("hidden");
  const [muted, setMuted] = useState(false);
  const [showGif, setShowGif] = useState(false);
const [gifSrc, setGifSrc] = useState("/gifs/gramophone.gif");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!active || phase !== "hidden") return;
    const t = setTimeout(() => setPhase("paused"), 300);
    return () => clearTimeout(t);
  }, [active, phase]);

  function handlePlay() {
    setShowGif(true);
    setGifSrc(`/gifs/gramophone.gif?t=${Date.now()}`);
    setPhase("center");
    setTimeout(() => {
      audioRef.current?.play().catch((err) => {
        console.warn("Audio play failed:", err);
      });
    }, AUDIO_DELAY);
    dockTimerRef.current = setTimeout(() => {
      setPhase("docking");
      setTimeout(() => setPhase("docked"), 1000);
    }, DOCK_DELAY);
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

  const isPaused = phase === "paused";
  const isDocking = phase === "docking";
  const isDocked = phase === "docked";
  const overlayVisible = isPaused || phase === "center" || isDocking;

  return (
    <>
      <audio ref={audioRef} src="/song/sunflower.mp3" onEnded={handleAudioEnded} />

      <AnimatePresence>
        {overlayVisible && (
          <motion.div
            key="overlay"
            className="fixed inset-0 z-[9990] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
              backgroundColor: "rgb(5,5,5)",
              backgroundImage:
                "radial-gradient(ellipse at 50% 50%, rgba(80,5,5,0.9) 0%, rgba(11,14,19,0.98) 50%, rgba(5,5,5,1) 100%)",
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase !== "gone" && (
          <>
            {!isDocked && (
              <motion.div
                key="gramo-center"
                className="fixed z-[9991] pointer-events-none"
                style={{
                  top: "50%",
                  left: "50%",
                  marginTop: -110,
                  marginLeft: -150,
                  width: 300,
                }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{
                  opacity: isDocking ? 0 : 1,
                  scale: isDocking ? 0.7 : 1,
                  y: isDocking ? 60 : 0,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
              >
                <div
                  className="pointer-events-none absolute inset-0 -z-10"
                  style={{
                    background:
                      "radial-gradient(circle at center, rgba(138,3,3,0.55) 0%, rgba(138,3,3,0.18) 45%, transparent 70%)",
                    transform: "scale(2)",
                    filter: "blur(20px)",
                    borderRadius: "50%",
                  }}
                />

                                <motion.img
                  src={showGif ? gifSrc : "/gifs/gramophone-poster.png"}
                  alt=""
                  className="pointer-events-none w-full drop-shadow-2xl"
                  animate={
                    showGif
                      ? { filter: "grayscale(0) brightness(1) blur(0px)" }
                      : { filter: "grayscale(0.95) brightness(0.45) blur(3px)" }
                  }
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                />

                <AnimatePresence>
                  {isPaused && (
                    <motion.button
                      key="play-btn"
                      onClick={handlePlay}
                      className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-auto"
                      aria-label="Play music"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.15 }}
                      transition={{ duration: 0.4, delay: 0.25 }}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                    >
                      <div className="relative flex items-center justify-center">
                        <motion.div
                          className="absolute rounded-full border-2 border-[#8a0303]"
                          animate={{ scale: [1, 1.7], opacity: [0.8, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                          style={{ width: 82, height: 82 }}
                        />
                        <motion.div
                          className="absolute rounded-full border border-[#8a0303]/50"
                          animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
                          transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, ease: "easeOut" }}
                          style={{ width: 82, height: 82 }}
                        />
                        <div className="flex h-[82px] w-[82px] items-center justify-center rounded-full border-2 border-[#8a0303] bg-black/60 shadow-2xl backdrop-blur-sm">
                          <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      <span className="text-[10px] tracking-[0.32em] text-white/50 uppercase font-light select-none">
                        click to resume
                      </span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {isDocked && (
              <motion.div
                key="gramo-docked"
                className="fixed z-[9991]"
                style={{ bottom: 24, left: 24, width: 90 }}
                initial={{ opacity: 0, scale: 0.5, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div
                  className="pointer-events-none absolute inset-0 -z-10"
                  style={{
                    background:
                      "radial-gradient(circle at center, rgba(138,3,3,0.35) 0%, transparent 70%)",
                    transform: "scale(2.2)",
                    filter: "blur(10px)",
                    borderRadius: "50%",
                  }}
                />
                <img
                  src="/gifs/gramophone.gif"
                  alt=""
                  className="pointer-events-none w-full drop-shadow-2xl"
                />
                <button
                  onClick={toggleMute}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-[#8a0303]/40 bg-white text-[#8a0303] shadow-sm"
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
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </>
  );
}