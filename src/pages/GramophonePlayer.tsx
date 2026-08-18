"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DOCK_DELAY = 5000; // ms after playback starts before it shrinks, docks, and the shade clears

export default function GramophonePlayer({ active }: { active: boolean }) {
  const [phase, setPhase] = useState<"hidden" | "center" | "docked" | "gone">("hidden");
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!active || phase !== "hidden") return;
    setPhase("center");
  }, [active, phase]);

  function startPlayback() {
    if (playing) return;
    setPlaying(true);
    audioRef.current?.play().catch((err) => {
      // shouldn't happen — this only fires from a real click, which satisfies
      // every browser's autoplay-with-sound requirement — but logged just in case
      console.warn("Gramophone audio play failed even after a click:", err);
    });
    dockTimerRef.current = setTimeout(() => setPhase("docked"), DOCK_DELAY);
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

      {/* full-screen shaded backdrop, only visible while the gramophone is centered */}
      <AnimatePresence>
        {phase === "center" && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[8999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              background:
                "radial-gradient(circle at center, rgba(11,14,19,0.55) 0%, rgba(11,14,19,0.8) 65%, rgba(11,14,19,0.92) 100%)",
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase !== "gone" && (
          <motion.div
            className="fixed z-[9000]"
            initial={false}
            animate={
              phase === "center"
                ? {
                    top: "50%",
                    left: "50%",
                    x: "-50%",
                    y: "-50%",
                    width: 340,
                    opacity: 1,
                  }
                : {
                    // docked position — bottom-left corner
                    top: "auto",
                    bottom: 24,
                    right: "auto",
                    left: 24,
                    x: 0,
                    y: 0,
                    width: 90,
                    opacity: 1,
                  }
            }
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
            style={{ position: "fixed" }}
          >
            <img src="/gifs/gramophone.gif" alt="" className="pointer-events-none w-full drop-shadow-2xl" />

            {/* play button overlay — only while centered and not yet playing.
                This is the one guaranteed real click, so it's the only reliable
                way to start audible sound; every browser requires this. */}
            {phase === "center" && !playing && (
              <button
                onClick={startPlayback}
                className="absolute inset-0 flex items-center justify-center rounded-full"
                aria-label="Play music"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#8a0303] bg-white/90 shadow-lg transition-transform hover:scale-105">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#8a0303">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </button>
            )}

            {/* mute toggle — visible once playback has started */}
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