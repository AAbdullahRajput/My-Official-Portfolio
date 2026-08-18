"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// timing constants — tune these against your actual gif if the needle-drop
// doesn't line up with when the music starts
const NEEDLE_DROP_DELAY = 1800; // ms after mount before we start the audio
const DOCK_DELAY = 5000; // ms after audio starts before it shrinks and docks

export default function GramophonePlayer({ active }: { active: boolean }) {
  const [phase, setPhase] = useState<"hidden" | "center" | "docked" | "gone">("hidden");
  const [needsTap, setNeedsTap] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!active || phase !== "hidden") return;
    setPhase("center");
  }, [active, phase]);

  useEffect(() => {
    if (phase !== "center") return;

    const dropTimer = setTimeout(() => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.play().catch(() => {
        // autoplay blocked — fall back to a tap-to-play prompt instead of failing silently
        setNeedsTap(true);
      });
    }, NEEDLE_DROP_DELAY);

    const dockTimer = setTimeout(() => setPhase("docked"), NEEDLE_DROP_DELAY + DOCK_DELAY);

    return () => {
      clearTimeout(dropTimer);
      clearTimeout(dockTimer);
    };
  }, [phase]);

  function handleTapToPlay() {
    audioRef.current?.play();
    setNeedsTap(false);
  }

  function handleAudioEnded() {
    setPhase("gone");
  }

  if (phase === "hidden") return null;

  return (
    <>
      <audio ref={audioRef} src="/music/sunflower.mp3" onEnded={handleAudioEnded} />

      <AnimatePresence>
        {phase !== "gone" && (
          <motion.div
            className="pointer-events-none fixed z-[9000]"
            initial={false}
            animate={
              phase === "center"
                ? {
                    top: "50%",
                    left: "50%",
                    x: "-50%",
                    y: "-50%",
                    width: 260,
                    opacity: 1,
                  }
                : {
                    // docked position — placeholder next to where a "Resume" button
                    // typically sits (bottom-right). Adjust to match your actual layout.
                    top: "auto",
                    bottom: 24,
                    right: 24,
                    left: "auto",
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
            <img src="/gifs/gramophone.gif" alt="" className="w-full drop-shadow-lg" />

            {needsTap && phase === "center" && (
              <button
                onClick={handleTapToPlay}
                className="pointer-events-auto absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-xs font-medium text-white"
              >
                Tap to play
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}