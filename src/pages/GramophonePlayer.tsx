"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// timing constants — tune these against your actual gif if the needle-drop
// doesn't line up with when the music starts
const NEEDLE_DROP_DELAY = 1000; // ms after mount before we start the audio — matches "after 1 second"
const DOCK_DELAY = 5000; // ms after audio starts before it shrinks, docks, and the shade clears

export default function GramophonePlayer({ active }: { active: boolean }) {
  const [phase, setPhase] = useState<"hidden" | "center" | "docked" | "gone">("hidden");
  const [userMuted, setUserMuted] = useState(false);
  // browsers block autoplay-with-sound until the page has received a real user
  // gesture — so we start muted (always allowed) and flip to audible the instant
  // the user clicks or presses a key anywhere, rather than waiting for the
  // gramophone itself to be clicked
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // set muted imperatively on mount, once — never as a JSX attribute, since React
  // would re-apply that on every render and silently override our later unmute
  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = true;
  }, []);

  useEffect(() => {
    function unlock() {
      setHasInteracted(true);
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    }
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = userMuted || !hasInteracted;
    }
  }, [userMuted, hasInteracted]);

  function toggleMute() {
    setUserMuted((m) => !m);
  }

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
                "radial-gradient(circle at center, rgba(11,14,19,0.78) 0%, rgba(11,14,19,0.93) 55%, rgba(11,14,19,0.98) 100%)",
              backdropFilter: "blur(2px)",
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

            {phase === "docked" && (
              <button
                onClick={toggleMute}
                                className="pointer-events-auto absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-[#8a0303]/40 bg-white text-[#8a0303] shadow-sm"
                aria-label={userMuted ? "Unmute music" : "Mute music"}
              >
                {userMuted ? (
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