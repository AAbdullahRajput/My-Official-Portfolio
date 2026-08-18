"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// timing constants — tune these against your actual gif if the needle-drop
// doesn't line up with when the music starts
const NEEDLE_DROP_DELAY = 1000; // ms after mount before we start the audio — matches "after 1 second"
const DOCK_DELAY = 5000; // ms after audio starts before it shrinks, docks, and the shade clears

export default function GramophonePlayer({ active }: { active: boolean }) {
  const [phase, setPhase] = useState<"hidden" | "center" | "docked" | "gone">("hidden");
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function toggleMute() {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setMuted(audioRef.current.muted);
    }
  }

    useEffect(() => {
    if (!active || phase !== "hidden") return;
    setPhase("center");
  }, [active, phase]);

  useEffect(() => {
    if (phase !== "center") return;

    let played = false;
    let dockTimer: ReturnType<typeof setTimeout> | null = null;

    function startPlayback() {
      if (played) return;
      played = true;
      audioRef.current?.play().catch((err) => {
        console.warn("Gramophone audio play failed:", err);
      });
      dockTimer = setTimeout(() => setPhase("docked"), DOCK_DELAY);
    }

    // Real, unmuted audio genuinely cannot start before the browser has seen
    // some interaction with the page — that's a hard policy in every browser,
    // not something any code can bypass. So: try immediately (works if the
    // splash screen or anything earlier already counted as interaction), and
    // also listen for the very next click/keypress as a fallback so it starts
    // the moment one happens, rather than failing silently forever.
    const dropTimer = setTimeout(startPlayback, NEEDLE_DROP_DELAY);

    function onInteract() {
      startPlayback();
    }
    window.addEventListener("pointerdown", onInteract);
    window.addEventListener("keydown", onInteract);

    return () => {
      clearTimeout(dropTimer);
      if (dockTimer) clearTimeout(dockTimer);
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("keydown", onInteract);
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
            <img src="/gifs/gramophone.gif" alt="" className="w-full drop-shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}