"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// timing constants — tune these against your actual gif if the needle-drop
// doesn't line up with when the music starts
const NEEDLE_DROP_DELAY = 1000; // ms after mount before we start the audio — matches "after 1 second"
const DOCK_DELAY = 5000; // ms after audio starts before it shrinks, docks, and the shade clears

export default function GramophonePlayer({ active }: { active: boolean }) {
  const [phase, setPhase] = useState<"hidden" | "center" | "docked" | "gone">("hidden");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!active || phase !== "hidden") return;
    setPhase("center");
  }, [active, phase]);

  useEffect(() => {
    if (phase !== "center") return;

    const dropTimer = setTimeout(() => {
      audioRef.current?.play().catch((err) => {
        // Autoplay can be blocked by the browser if the page hasn't received any
        // user interaction yet — this is a browser policy, not something we can
        // force past from here. No UI shown per your request; logged for debugging.
        console.warn("Gramophone audio autoplay was blocked:", err);
      });
    }, NEEDLE_DROP_DELAY);

    const dockTimer = setTimeout(() => setPhase("docked"), NEEDLE_DROP_DELAY + DOCK_DELAY);

    return () => {
      clearTimeout(dropTimer);
      clearTimeout(dockTimer);
    };
  }, [phase]);

  function handleAudioEnded() {
    setPhase("gone");
  }

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
            className="pointer-events-none fixed z-[9000]"
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
            <img src="/gifs/gramophone.gif" alt="" className="w-full drop-shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}